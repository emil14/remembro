package models

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq" // register driver

	"github.com/emil14/remembro/conf"
)

var db *sql.DB
var connStr = fmt.Sprintf("user=%s password=%s dbname=%s port=%s", conf.DBUser, conf.DBPassword, conf.DBName, conf.DBPort)

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
