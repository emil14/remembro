package api

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/gorilla/mux"

	"github.com/emil14/remembro/internal/config"
	"github.com/emil14/remembro/internal/models"
)

func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Println(r.RequestURI, r.Method)
		next.ServeHTTP(w, r)
	})
}

func getRecords(w http.ResponseWriter, r *http.Request) {
	rr, err := models.GetRecords()
	if err != nil {
		http.Error(w, http.StatusText(500), 500)
		fmt.Println(err)
		return
	}
	resp, err := json.Marshal(rr)
	if err != nil {
		fmt.Println(err)
		http.Error(w, http.StatusText(500), 500)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Write(resp)
}

func createRecord(w http.ResponseWriter, r *http.Request) {
	payload := models.CreateRecordPayload{}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		fmt.Println(err)
		http.Error(w, http.StatusText(500), 500)
		return
	}
	payload.CreatedAt = time.Now()
	if err := models.CreateRecord(payload); err != nil {
		fmt.Println(err)
		http.Error(w, http.StatusText(500), 500)
		return
	}
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Write([]byte("Record created"))
}

func updateRecord(w http.ResponseWriter, r *http.Request) {
	if r.Method == "PATCH" {
		var record models.UpdateRecordPayload
		if err := json.NewDecoder(r.Body).Decode(&record); err != nil {
			fmt.Println(err.Error())
			http.Error(w, http.StatusText(500), 500)
			return
		}
		if err := models.UpdateRecord(record); err != nil {
			fmt.Println(err.Error())
			http.Error(w, http.StatusText(500), 500)
			return
		}
	}
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Write([]byte("Record updated")) // TODO return created record
}

func getTags(w http.ResponseWriter, r *http.Request) {
	tt, err := models.GetTags()
	if err != nil {
		http.Error(w, http.StatusText(500), 500)
		fmt.Println(err)
		return
	}
	resp, err := json.Marshal(tt)
	if err != nil {
		fmt.Println(err)
		http.Error(w, http.StatusText(500), 500)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Write(resp)
}

func createTag(w http.ResponseWriter, r *http.Request) {
	buf := new(bytes.Buffer)
	buf.ReadFrom(r.Body)
	if err := models.CreateTag(buf.String()); err != nil {
		fmt.Println(err)
		http.Error(w, http.StatusText(500), 500)
		return
	}
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Write([]byte("Tag created"))
}

type spaHandler struct {
	staticPath string
	indexPath  string
}

func (h *spaHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	path, err := filepath.Abs(r.URL.Path)
	if err != nil {
		fmt.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	path = filepath.Join(h.staticPath, path)
	_, err = os.Stat(path)
	if os.IsNotExist(err) {
		fmt.Println(err)
		http.ServeFile(w, r, filepath.Join(h.staticPath, h.indexPath))
		return
	} else if err != nil {
		fmt.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	http.FileServer(http.Dir(h.staticPath)).ServeHTTP(w, r)
}

var users = map[string]string{
	"emil":  "fuckoff",
	"alice": "pleace",
}

var jwtKey = []byte("my_secret_key")

// Credentials is used read username and password from the request
type Credentials struct {
	Password string `json:"password"`
	Username string `json:"username"`
}

// Claims is a struct that will be encoded to a JWT.
// We add jwt.StandardClaims as an embedded type, to provide fields like expiry time
type Claims struct {
	Username string `json:"username"`
	jwt.StandardClaims
}

// SignIn ...
func SignIn(w http.ResponseWriter, r *http.Request) {
	var creds Credentials
	if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
		fmt.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	expectedPassword, ok := users[creds.Username]
	if !ok || expectedPassword != creds.Password {
		fmt.Println("StatusUnauthorized, creds: ", creds)
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	expirationTime := time.Now().Add(5 * time.Minute)
	claims := &Claims{
		Username:       creds.Username,
		StandardClaims: jwt.StandardClaims{ExpiresAt: expirationTime.Unix()},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenStr, err := token.SignedString(jwtKey)
	if err != nil {
		fmt.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:    "token",
		Value:   tokenStr,
		Expires: expirationTime,
	})
}

// Welcome ...
func Welcome(w http.ResponseWriter, r *http.Request) {
	c, err := r.Cookie("token")
	if err != nil {
		if err == http.ErrNoCookie {
			fmt.Println(err)
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		fmt.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	tokenStr := c.Value
	claims := &Claims{}

	token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})
	if err != nil {
		if err == jwt.ErrSignatureInvalid {
			fmt.Println(err)
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		fmt.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	if !token.Valid {
		fmt.Println(err)
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	w.Write([]byte(fmt.Sprintf("Welcome %s!", claims.Username)))
}

// Refresh ...
func Refresh(w http.ResponseWriter, r *http.Request) {
	// (BEGIN) The code uptil this point is the same as the first part of the `Welcome` route
	c, err := r.Cookie("token")
	if err != nil {
		if err == http.ErrNoCookie {
			fmt.Println(err)
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		fmt.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	tknStr := c.Value
	claims := &Claims{}
	tkn, err := jwt.ParseWithClaims(tknStr, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})
	if err != nil {
		if err == jwt.ErrSignatureInvalid {
			fmt.Println(err)
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		fmt.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	if !tkn.Valid {
		fmt.Println("invalid token", tkn)
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	// (END) The code up-till this point is the same as the first part of the `Welcome` route

	// ensure if the old token is within 30 seconds of expiry
	if time.Unix(claims.ExpiresAt, 0).Sub(time.Now()) > 30*time.Second {
		fmt.Printf("%v' token is too fresh", claims.Username)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	// Now, create a new token for the current use, with a renewed expiration time
	expirationTime := time.Now().Add(5 * time.Minute)
	claims.ExpiresAt = expirationTime.Unix()
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		fmt.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:    "token",
		Value:   tokenString,
		Expires: expirationTime,
	})
}

// Run starts the application
func Run() {
	closeDB := models.InitDB()
	defer closeDB()

	router := mux.NewRouter()
	router.Use(loggingMiddleware)
	router.Use(mux.CORSMethodMiddleware(router))
	router.HandleFunc("/api/records", getRecords).Methods("GET")
	router.HandleFunc("/api/records", createRecord).Methods("POST")
	router.HandleFunc("/api/records", updateRecord).Methods("PATCH", "OPTIONS")
	router.HandleFunc("/api/tags", getTags).Methods("GET")
	router.HandleFunc("/api/tags", createTag).Methods("POST")

	// auth stuff
	router.HandleFunc("/api/signin", SignIn).Methods("POST")
	router.HandleFunc("/api/welcome", Welcome).Methods("GET")
	router.HandleFunc("/api/refresh", Refresh).Methods("POST")

	spa := &spaHandler{staticPath: "web/dist", indexPath: "index.html"}
	router.PathPrefix("/").Handler(spa)

	srv := &http.Server{
		Handler:      router,
		Addr:         "127.0.0.1:" + config.PORT,
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	fmt.Println("---\nServer running on " + srv.Addr + "\n---")

	if err := http.ListenAndServe(":"+config.PORT, router); err != nil {
		defer log.Fatal(err)
	}
}
