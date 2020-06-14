package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/emil14/remembro/conf"
	"github.com/emil14/remembro/db"
)

func recordsHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		rr, err := db.GetRecords()
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
		fmt.Println(resp)
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Write(resp)
	case "POST":
		buf := new(bytes.Buffer)
		buf.ReadFrom(r.Body)
		if err := db.CreateRecord(buf.String(), time.Now()); err != nil {
			fmt.Println(err)
			http.Error(w, http.StatusText(500), 500)
			return
		}
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Write([]byte("OK")) // TODO return created record
	default:
		http.Error(w, http.StatusText(405), 405)
	}
}

func main() {
	closeDB := db.InitDB()
	defer func() {
		if err := closeDB(); err != nil {
			log.Fatal(err)
		}
	}()

	http.HandleFunc("/api/records", recordsHandler)
	fmt.Println("Server is running on port: " + conf.ServerPort)
	log.Fatal(http.ListenAndServe(":"+conf.ServerPort, nil))
}
