package models

import (
	"time"

	"github.com/lib/pq"
)

// Record describes record row with aggregated tags ids
type Record struct {
	ID        int           `json:"id"`
	Content   string        `json:"content"`
	CreatedAt time.Time     `json:"createdAt"`
	Tags      pq.Int64Array `json:"tags"`
	Reminders pq.Int64Array `json:"reminders"`
}

var selectRecordsQuery = `
SELECT r.record_id,
	r.content,
	r.created_at,
	t.tags,
	rm.reminders
FROM record r
	LEFT JOIN (
		SELECT record_id,
			JSON_AGG(
				JSON_BUILD_OBJECT('id', t.tag_id, 'name', t.name)
			) as tags
		FROM tag t
			INNER JOIN tag_record tr ON tr.tag_id = t.tag_id
		GROUP BY tr.record_id
	) as t ON t.record_id = r.record_id
	LEFT JOIN (
		SELECT record_id,
			JSON_AGG(
				JSON_BUILD_OBJECT('id', rm.reminder_id, 'time', rm.time)
			) AS reminders
		FROM reminder rm
		GROUP BY record_id
	) as rm ON rm.record_id = r.record_id`

// GetRecords joins record, tag, tag_record and reminder tables to return records with related information
func GetRecords() ([]Record, error) {
	rows, err := db.Query(selectRecordsQuery)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	records := []Record{}
	for rows.Next() {
		r := Record{}
		if err := rows.Scan(&r.ID, &r.Content, &r.CreatedAt, &r.Tags, &r.Reminders); err != nil {
			return nil, err
		}
		records = append(records, r)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}

	return records, nil
}

// CreateRecord adds rows to record and tag_record tables
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

// UpdateRecord updates record and tag_record tables
func UpdateRecord(id int, content string, tags []int) error {
	_, err := db.Exec("UPDATE record SET content = $1 WHERE record_id = $2", content, id)
	if err != nil {
		return err
	}
	_, err = db.Exec("DELETE FROM tag_record WHERE record_id = $1", id)
	if err != nil {
		return err
	}
	for _, t := range tags {
		_, err := db.Exec("INSERT INTO tag_record(tag_id, record_id) VALUES ($1, $2)", t, id)
		if err != nil {
			return err
		}
	}
	return err
}
