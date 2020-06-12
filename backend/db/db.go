package db

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq" // register driver

	"github.com/emil14/remembro/conf"
)

var db *sql.DB

// InitDb initialize database
func InitDb() {
	connStr := fmt.Sprintf("user=%s password=%s dbname=%s port=%s", conf.DBUser, conf.DBPassword, conf.DBName, conf.DBPort)
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
