package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/emil14/remembro/internal/db"
)

var jwtKey = []byte("my_secret_key")

// Credentials is used read username and password from the request
type Credentials struct {
	Email    string `json:"username"`
	Password string `json:"password"`
}

// Claims is a struct that will be encoded to a JWT.
// We add jwt.StandardClaims as an embedded type, to provide fields like expiry time
type Claims struct {
	Username string `json:"username"`
	jwt.StandardClaims
}

// SignIn ...
func SignIn(w http.ResponseWriter, r *http.Request) {
	creds := Credentials{}
	if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
		handleError(err, w, 500)
		return
	}

	user, err := db.GetUser(creds.Email)
	if err != nil {
		handleError(err, w, 500)
	} else if creds.Password != user.Password {
		handleError(fmt.Errorf("Unauthorized - %v : %v", creds.Password, creds.Email), w, http.StatusUnauthorized)
		return
	}

	expirationTime := time.Now().Add(5 * time.Minute)
	claims := &Claims{
		Username:       creds.Email,
		StandardClaims: jwt.StandardClaims{ExpiresAt: expirationTime.Unix()},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenStr, err := token.SignedString(jwtKey)
	if err != nil {
		handleError(err, w, 500)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:    "token",
		Value:   tokenStr,
		Expires: expirationTime,
	})
}

func checkJWTCookie(w http.ResponseWriter, r *http.Request) (bool, *Claims) {
	c, err := r.Cookie("token")
	if err != nil {
		if err == http.ErrNoCookie {
			handleError(err, w, http.StatusUnauthorized)
			return false, nil
		}
		handleError(err, w, http.StatusBadRequest)
		return false, nil
	}
	tknStr := c.Value
	claims := &Claims{}
	tkn, err := jwt.ParseWithClaims(tknStr, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})
	if err != nil {
		if err == jwt.ErrSignatureInvalid {
			handleError(err, w, http.StatusUnauthorized)
			return false, nil
		}
		handleError(err, w, http.StatusBadRequest)
		return false, nil
	}
	if !tkn.Valid {
		handleError(err, w, http.StatusUnauthorized)
		return false, nil
	}
	return true, claims
}

// Welcome ...
func Welcome(w http.ResponseWriter, r *http.Request) {
	ok, claims := checkJWTCookie(w, r)
	if !ok {
		return
	}
	_, err := w.Write([]byte(fmt.Sprintf("Welcome %s!", claims.Username)))
	if err != nil {
		handleError(err, w, 500)
	}
}

// RefreshJWT ...
func RefreshJWT(w http.ResponseWriter, r *http.Request) {
	ok, claims := checkJWTCookie(w, r)
	if !ok {
		return
	}

	if time.Until(time.Unix(claims.ExpiresAt, 0)) > 30*time.Second {
		handleError(fmt.Errorf("%v' token is too fresh", claims.Username), w, http.StatusBadRequest)
		return
	}

	expirationTime := time.Now().Add(5 * time.Minute)
	claims.ExpiresAt = expirationTime.Unix()
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		handleError(err, w, http.StatusInternalServerError)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:    "token",
		Value:   tokenString,
		Expires: expirationTime,
	})
}
