package api

import (
	"bytes"
	"encoding/json"
	"net/http"

	"github.com/emil14/remembro/internal/db"
)

func getTags(w http.ResponseWriter, r *http.Request) {
	tt, err := db.GetTags()
	if err != nil {
		handleError(err, w, 500)
		return
	}
	resp, err := json.Marshal(tt)
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

func createTag(w http.ResponseWriter, r *http.Request) {
	buf := new(bytes.Buffer)
	if _, err := buf.ReadFrom(r.Body); err != nil {
		handleError(err, w, 500)
		return
	}
	if err := db.CreateTag(buf.String()); err != nil {
		handleError(err, w, 500)
		return
	}
	w.Header().Set("Access-Control-Allow-Origin", "*")
	if _, err := w.Write([]byte("Tag created")); err != nil {
		handleError(err, w, 500)
	}

}
