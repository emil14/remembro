package models

import (
	"database/sql"
	"fmt"
	"log"

	"github.com/emil14/remembro/config"
	_ "github.com/lib/pq" // register driver
)

var db *sql.DB
var connStr = fmt.Sprintf("user=%s password=%s dbname=%s port=%s", config.DBUser, config.DBPassword, config.DBName, config.DBPort)

// InitDB opens a connection to pg with creds from env vars and returns a callback to close it
func InitDB() func() {
	var err error
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
	return func() {
		if err := db.Close(); err != nil {
			log.Fatal(err)
		}
	}
}
