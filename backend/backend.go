package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/emil14/remembro/conf"
	"github.com/emil14/remembro/store"
)

func recordsHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		records, err := store.GetRecords()
		if err != nil {
			http.Error(w, http.StatusText(500), 500)
			return
		}
		data, err := json.Marshal(records)
		if err != nil {
			http.Error(w, http.StatusText(500), 500)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Write(data)
	case "POST":
		buf := new(bytes.Buffer)
		buf.ReadFrom(r.Body)
		newStr := buf.String()
		store.CreateRecord(newStr)
	default:
		http.Error(w, http.StatusText(405), 405)
	}
}

func main() {
	closeDB := store.InitDB()
	defer func() {
		if err := closeDB(); err != nil {
			log.Fatal(err)
		}
	}()

	http.HandleFunc("/api/records", recordsHandler)
	fmt.Println("Server is running on port: " + conf.ServerPort)
	log.Fatal(http.ListenAndServe(":"+conf.ServerPort, nil))
}
