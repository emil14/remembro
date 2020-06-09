package db

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

var db *sql.DB

func initDb() {
	connStr := "user=test dbname=test sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}

	rows, err := db.Query("SELECT name FROM records")
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(rows)
}
