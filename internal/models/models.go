package models

import (
	"database/sql"
	"log"

	_ "github.com/lib/pq" // register driver

	"github.com/emil14/remembro/internal/config"
)

var db *sql.DB

// InitDB opens a connection to postgres and returns a callback to close it
func InitDB() func() {
	var err error
	db, err = sql.Open("postgres", config.DATABASE_URL)
	if err != nil {
		log.Fatal(err)
	}
	return func() {
		if err := db.Close(); err != nil {
			log.Fatal(err)
		}
	}
}
