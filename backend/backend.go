package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	_ "github.com/joho/godotenv/autoload"

	"github.com/emil14/remembro/conf"
	"github.com/emil14/remembro/store"
)

func recordsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		http.Error(w, http.StatusText(405), 405)
		return
	}
	data, err := json.Marshal(store.GetRecords())
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(json.MarshalIndent(data, "", "    "))
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Write(data)
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
