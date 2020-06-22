package models

import (
	"time"

	"github.com/lib/pq"
)

type Record struct {
	ID        int           `json:"id"`
	Content   string        `json:"content"`
	CreatedAt time.Time     `json:"createdAt"`
	TagsIDs   pq.Int64Array `json:"tagsIds"`
}

var selectRecordsQuery = `
	SELECT record.record_id, record.content, record.created_at, ARRAY_AGG(tag.tag_id) AS tags_ids
	FROM tag
    INNER JOIN tag_record ON tag.tag_id = tag_record.tag_id
    INNER JOIN record ON tag_record.record_id = record.record_id
	GROUP BY record.record_id, record.content, record.created_at`

func GetRecords() ([]Record, error) {
	rows, err := db.Query(selectRecordsQuery)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	records := []Record{}
	for rows.Next() {
		r := Record{}
		if err := rows.Scan(&r.ID, &r.Content, &r.CreatedAt, &r.TagsIDs); err != nil {
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
	row := db.QueryRow("INSERT INTO record(content, created_at) VALUES ($1, $2) RETURNING record_id", content, createdAt)
	if err := row.Scan(&lastInsertID); err != nil {
		return err
	}
	for i := range tags {
		_, err := db.Exec("INSERT INTO tag_record(tag_id, record_id) VALUES ($1, $2)", tags[i], lastInsertID)
		if err != nil {
			return err
		}
	}
	return nil
}
