package models

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq" // register driver

	"github.com/emil14/remembro/conf"
)

var db *sql.DB

func InitDB() func() error {
	connStr := fmt.Sprintf("user=%s password=%s dbname=%s port=%s", conf.DBUser, conf.DBPassword, conf.DBName, conf.DBPort)
	var err error
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
	return db.Close
}
