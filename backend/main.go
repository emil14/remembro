package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/emil14/remembro/conf"
	"github.com/emil14/remembro/models"
)

func recordsHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
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
	case "POST":
		type createdRecord struct {
			Content string `json:"content"`
			TagsIds []int  `json:"tagsIds"`
		}
		var c createdRecord
		if err := json.NewDecoder(r.Body).Decode(&c); err != nil {
			fmt.Println(err)
			http.Error(w, http.StatusText(500), 500)
			return
		}
		if err := models.CreateRecord(c.Content, time.Now(), c.TagsIds); err != nil {
			fmt.Println(err)
			http.Error(w, http.StatusText(500), 500)
			return
		}
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Write([]byte("Record created")) // TODO return created record
	default:
		http.Error(w, http.StatusText(405), 405)
	}
}

func tagsHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
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
	case "POST":
		buf := new(bytes.Buffer)
		buf.ReadFrom(r.Body)
		if err := models.CreateTag(buf.String()); err != nil {
			fmt.Println(err)
			http.Error(w, http.StatusText(500), 500)
			return
		}
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Write([]byte("Tag created")) // TODO return created record
	default:
		http.Error(w, http.StatusText(405), 405)
	}
}

func clientErrorsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, http.StatusText(405), 405)
	}
	// TODO save error to log
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Write([]byte("Error saved"))
}

func main() {
	closeDB := models.InitDB()
	defer func() {
		if err := closeDB(); err != nil {
			log.Fatal(err)
		}
	}()

	http.HandleFunc("/api/records", recordsHandler)
	http.HandleFunc("/api/tags", tagsHandler)
	http.HandleFunc("/api/clienterrors", clientErrorsHandler)

	fmt.Println("Server is running on port: " + conf.ServerPort)
	log.Fatal(http.ListenAndServe(":"+conf.ServerPort, nil))
}
