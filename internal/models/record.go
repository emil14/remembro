package models

import (
	"encoding/json"
	"time"

	"github.com/lib/pq"
)

type recordTag struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

// Record represents a record entity
type Record struct {
	ID        int         `json:"id"`
	Content   string      `json:"content"`
	CreatedAt time.Time   `json:"createdAt"`
	Tags      []recordTag `json:"tags"`
	Reminders []time.Time `json:"reminders"`
}

var getRecordsQuery = `
SELECT r.record_id,
	r.content,
	r.created_at,
	r.reminders,
	CASE
		WHEN t.tags IS NULL THEN '[]'::json
		ELSE t.tags
	END AS tags
FROM record r
	LEFT JOIN (
		SELECT record_id,
			JSON_AGG(
				JSON_BUILD_OBJECT('id', t.tag_id, 'name', t.name)
			) as tags
		FROM tag t
			INNER JOIN tag_record tr ON tr.tag_id = t.tag_id
		GROUP BY tr.record_id
	) as t ON t.record_id = r.record_id`

// GetRecords joins record, tag and tag_record tables
func GetRecords() ([]Record, error) {
	rows, err := db.Query(getRecordsQuery)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	records := []Record{}
	for rows.Next() {
		r := Record{}
		var (
			tagsJSON     []byte
			rawReminders []string
		)
		if err := rows.Scan(&r.ID, &r.Content, &r.CreatedAt, pq.Array(&rawReminders), &tagsJSON); err != nil {
			return nil, err
		}
		json.Unmarshal(tagsJSON, &r.Tags)
		for _, v := range rawReminders {
			time, err := pq.ParseTimestamp(nil, string(v))
			if err != nil {
				return nil, err
			}
			r.Reminders = append(r.Reminders, time)
		}
		records = append(records, r)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}

	return records, nil
}

// CreateRecordPayload represents a payload for adding rows to database
type CreateRecordPayload struct {
	Content   string      `json:"content"`
	TagsIds   []int       `json:"tagsIds"`
	Reminders []time.Time `json:"reminders"`
}

// CreateRecord adds rows to record and tag_record tables
func CreateRecord(payload CreateRecordPayload) error {
	var lastInsertID int
	var times []string
	for _, v := range payload.Reminders {
		times = append(times, v.String())
	}
	row := db.QueryRow("INSERT INTO record(content, created_at, reminders) VALUES ($1, $2, $3) RETURNING record_id", payload.Content, time.Now(), pq.Array(times))
	if err := row.Scan(&lastInsertID); err != nil {
		return err
	}
	for i := range payload.TagsIds {
		_, err := db.Exec("INSERT INTO tag_record(tag_id, record_id) VALUES ($1, $2)", payload.TagsIds[i], lastInsertID)
		if err != nil {
			return err
		}
	}
	return nil
}

// UpdateRecord updates record and tag_record tables
func UpdateRecord(id int, content string, tags []int, reminders []time.Time) error {
	_, err := db.Exec("UPDATE record SET content = $1, reminders = $2 WHERE record_id = $3", content, reminders, id)
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

// DeleteRecord deletes record by id
func DeleteRecord(id int) error {
	if _, err := db.Exec("DELETE record WHERE record_id = $1", id); err != nil {
		return err
	}
	if _, err := db.Exec("DELETE tar_record WHERE /* id */ = $1", id); err != nil {
		return err
	}
	return nil
}
