package db

import (
	"database/sql"
	"log"

	_ "github.com/lib/pq" // register driver

	"github.com/emil14/remembro/internal/config"
)

var (
	db                   *sql.DB
	createRecordTableSQL = `
		CREATE TABLE IF NOT EXISTS record (
			record_id SERIAL PRIMARY KEY,
			content VARCHAR(255) NOT NULL,
			created_at DATE NOT NULL,
			reminders timestamp []
		)`
	createTagTableSQL = `
		CREATE TABLE IF NOT EXISTS tag (
			tag_id SERIAL PRIMARY KEY,
			name VARCHAR(32) NOT NULL,
			parent_id INT REFERENCES tag(tag_id),
			description VARCHAR(255) DEFAULT ''
		)`
	createTagRecordSQL = `
		CREATE TABLE IF NOT EXISTS tag_record (
			tag_id INT,
			record_id INT,
			PRIMARY KEY (tag_id, record_id),
			FOREIGN KEY (tag_id) REFERENCES tag(tag_id) ON UPDATE CASCADE,
			FOREIGN KEY (record_id) REFERENCES record(record_id) ON UPDATE CASCADE
		)`
)

// InitDB opens a connection to postgres and returns a callback to close it
func InitDB() func() {
	var err error
	db, err = sql.Open("postgres", config.DATABASE_URL)
	if err != nil {
		log.Fatal(err)
	}

	// table creation
	if _, err := db.Exec(createRecordTableSQL); err != nil {
		log.Fatal(err)
	}
	if _, err := db.Exec(createTagTableSQL); err != nil {
		log.Fatal(err)
	}
	if _, err := db.Exec(createTagRecordSQL); err != nil {
		log.Fatal(err)
	}

	return func() {
		if err := db.Close(); err != nil {
			log.Fatal(err)
		}
	}
}
