package store

import (
	"fmt"
	"log"
)

type Record struct {
	id      int
	content string
}

func GetRecords() []*Record {
	rows, err := db.Query("SELECT id, content FROM records")
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	var (
		id      int
		name    string
		records []*Record // records := make([]*Record, 0)
	)
	for rows.Next() {
		err := rows.Scan(&id, &name)
		if err != nil {
			log.Fatal(err)
		}
		records = append(records, &Record{id, name})
	}

	if err = rows.Err(); err != nil {
		log.Fatal(err)
	}

	fmt.Println(records)
	return records
}

func CreateRecord() {
	rows, err := db.Exec("INSERT INTO records(content) VALUES ($1)", "hardcoded content")
	fmt.Println(rows, err)
}
