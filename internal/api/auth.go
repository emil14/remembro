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

// to read from json
type credentials struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// to create token
type jwtClaims struct {
	ID    int    `json:"id"`
	jwt.StandardClaims
}

func login(w http.ResponseWriter, r *http.Request) {
	creds := credentials{}
	if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
		handleError(err, w, 500)
		return
	}

	user, err := db.GetUser(creds.Email)
	if err != nil {
		handleError(err, w, 500)
	} else if creds.Password != user.Password {
		handleError(fmt.Errorf("Unauthorized! Expected %v, got %v", user.Password, creds.Password), w, http.StatusUnauthorized)
		return
	}

	expirationTime := time.Now().Add(5 * time.Minute)
	claims := &jwtClaims{
		ID:    user.ID,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
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

func checkJWTCookie(w http.ResponseWriter, r *http.Request) (bool, *jwtClaims) {
	cookie, err := r.Cookie("token")
	if err != nil {
		if err == http.ErrNoCookie {
			handleError(err, w, http.StatusUnauthorized)
			return false, nil
		}
		handleError(err, w, http.StatusBadRequest)
		return false, nil
	}
	tknStr := cookie.Value
	claims := &jwtClaims{}
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

func refreshJWT(w http.ResponseWriter, r *http.Request) {
	ok, claims := checkJWTCookie(w, r) // FIXME not call this here, there is middlware
	if !ok {
		return
	}

	if time.Until(time.Unix(claims.ExpiresAt, 0)) > 30*time.Second {
		handleError(fmt.Errorf("%v' token is too fresh", claims.ID), w, http.StatusBadRequest)
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

func registerUser(w http.ResponseWriter, r *http.Request) {
	creds := credentials{}
	if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
		handleError(err, w, 500)
		return
	}

	if err := db.CreateUser(creds.Email, creds.Password); err != nil {
		handleError(err, w, 500)
	}

	if _, err := w.Write([]byte("User created")); err != nil {
		handleError(err, w, 500)
	}
}
