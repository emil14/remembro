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
	w.Write([]byte("Tag created"))
}

type spaHandler struct {
	staticPath string
	indexPath  string
}

func (h *spaHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	path, err := filepath.Abs(r.URL.Path)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	path = filepath.Join(h.staticPath, path)

	_, err = os.Stat(path)
	if os.IsNotExist(err) {
		http.ServeFile(w, r, filepath.Join(h.staticPath, h.indexPath))
		return
	} else if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	http.FileServer(http.Dir(h.staticPath)).ServeHTTP(w, r)
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
