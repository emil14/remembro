package db

import (
	"fmt"
	"time"
)

type Record struct {
	ID        int       `json:"id"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"createdAt"`
}

func GetRecords() ([]Record, error) {
	rows, err := db.Query("SELECT id, content, created_at FROM records")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	records := []Record{}
	for rows.Next() {
		r := Record{}
		if err := rows.Scan(&r.ID, &r.Content, &r.CreatedAt); err != nil {
			return nil, err
		}
		records = append(records, r)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}

	return records, nil
}

func CreateRecord(content string, createdAt time.Time, tags []int) error {
	var lastInsertID int
	res := db.QueryRow("INSERT INTO records(content, created_at) VALUES ($1, $2) RETURNING id", content, createdAt).Scan(&lastInsertID)
	fmt.Println(res)
	for i := range tags {
		db.Exec("INSERT INTO tags_records(tag_id, record_id) VALUES ($1, $2)", tags[i], lastInsertID)
	}
	return nil
}
