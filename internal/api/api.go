package api

import (
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

func handleError(err error, w http.ResponseWriter, statusCode int) {
	log.Println(err)
	http.Error(w, http.StatusText(500), 500)
	w.WriteHeader(statusCode)
}

// Run starts the application
func Run() {
	closeDB := db.InitDB()
	defer closeDB()

	router := mux.NewRouter()
	router.Use(loggingMiddleware)
	router.Use(mux.CORSMethodMiddleware(router))

	router.HandleFunc("/api/records", getRecords).Methods("GET")
	router.HandleFunc("/api/records", createRecord).Methods("POST")
	router.HandleFunc("/api/records", updateRecord).Methods("PATCH", "OPTIONS")
	router.HandleFunc("/api/tags", getTags).Methods("GET")
	router.HandleFunc("/api/tags", createTag).Methods("POST")
	router.HandleFunc("/api/signin", SignIn).Methods("POST")
	router.HandleFunc("/api/welcome", Welcome).Methods("GET")
	router.HandleFunc("/api/refresh", RefreshJWT).Methods("POST")

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
