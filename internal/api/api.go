package api

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

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
		fmt.Println(err.Error())
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
	w.Write([]byte("Tag created")) // TODO return created
}

// Run starts the application
func Run() {
	closeDB := models.InitDB()
	defer closeDB()

	r := mux.NewRouter()
	r.Use(loggingMiddleware)
	r.Use(mux.CORSMethodMiddleware(r))
	r.HandleFunc("/api/records", getRecords).Methods("GET")
	r.HandleFunc("/api/records", createRecord).Methods("POST")
	r.HandleFunc("/api/records", updateRecord).Methods("PATCH", "OPTIONS")
	r.HandleFunc("/api/tags", getTags).Methods("GET")
	r.HandleFunc("/api/tags", createTag).Methods("POST")

	fmt.Println("---\nServer running on port: " + config.PORT + "\n---")
	if err := http.ListenAndServe(":"+config.PORT, r); err != nil {
		defer log.Fatal(err)
	}
}
