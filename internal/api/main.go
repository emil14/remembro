package api

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"

	"github.com/emil14/remembro/internal/config"
	"github.com/emil14/remembro/internal/db"
)

func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Println(r.RequestURI, r.Method)
		next.ServeHTTP(w, r)
	})
}

func jwtMiddlware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ok, claims := checkJWTCookie(w, r)
		if !ok {
			return
		}
		type ctxClaimsKey string
		ctx := context.WithValue(r.Context(), ctxClaimsKey("props"), claims)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func handleError(err error, w http.ResponseWriter, statusCode int) {
	log.Println(err)
	w.WriteHeader(statusCode)
}

// Run starts the application
func Run() {
	closeDB := db.InitDB()
	defer closeDB()

	router := mux.NewRouter()
	router.Use(loggingMiddleware)
	router.Use(mux.CORSMethodMiddleware(router))
	router.HandleFunc("/login", login).Methods("POST")
	router.HandleFunc("/refresh-jwt", refreshJWT).Methods("POST")
	router.HandleFunc("/register", registerUser).Methods("POST")
	
	protectedRouter := mux.NewRouter().PathPrefix("/api/").Subrouter()
	protectedRouter.Use(jwtMiddlware)
	protectedRouter.HandleFunc("/records", getRecords).Methods("GET")
	protectedRouter.HandleFunc("/records", createRecord).Methods("POST")
	protectedRouter.HandleFunc("/records", updateRecord).Methods("PATCH", "OPTIONS")
	protectedRouter.HandleFunc("/tags", getTags).Methods("GET")
	protectedRouter.HandleFunc("/tags", createTag).Methods("POST")

	// router.PathPrefix("/").Handler(&spaHandler{staticPath: "web/dist", indexPath: "index.html"})

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
