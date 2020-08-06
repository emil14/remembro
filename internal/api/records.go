package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/emil14/remembro/internal/db"
)

func getRecords(w http.ResponseWriter, r *http.Request) {
	ctxUserID := r.Context().Value("userid")
	if ctxUserID == nil {
		handleError(fmt.Errorf("No userid provided!"), w, 500)
		return
	}
	
	rr, err := db.GetRecords(ctxUserID.(int))
	if err != nil {
		handleError(err, w, 500)
		return
	}
	resp, err := json.Marshal(rr)
	if err != nil {
		handleError(err, w, 500)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	if _, err := w.Write(resp); err != nil {
		handleError(err, w, 500)
	}
}

func createRecord(w http.ResponseWriter, r *http.Request) {
	payload := db.CreateRecordPayload{}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		handleError(err, w, 500)
		return
	}
	payload.CreatedAt = time.Now()
	if err := db.CreateRecord(payload); err != nil {
		handleError(err, w, 500)
		return
	}
	if _, err := w.Write([]byte("Record created")); err != nil {
		handleError(err, w, 500)
	}
}

func updateRecord(w http.ResponseWriter, r *http.Request) {
	if r.Method == "PATCH" {
		var record db.UpdateRecordPayload
		if err := json.NewDecoder(r.Body).Decode(&record); err != nil {
			handleError(err, w, 500)
			return
		}
		if err := db.UpdateRecord(record); err != nil {
			handleError(err, w, 500)
			return
		}
	}
	w.Header().Set("Access-Control-Allow-Origin", "*")
	if _, err := w.Write([]byte("Record updated")); err != nil {
		handleError(err, w, 500)
	}
}
