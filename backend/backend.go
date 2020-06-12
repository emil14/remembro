package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/emil14/remembro/conf"
	"github.com/emil14/remembro/store"
)

func recordsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		http.Error(w, http.StatusText(405), 405)
		return
	}
	json, err := json.Marshal(store.GetRecords())
	if err != nil {
		log.Fatal(err)
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(json)
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
