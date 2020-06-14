package db

import "time"

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

func CreateRecord(content string, createdAt time.Time) error {
	_, err := db.Exec("INSERT INTO records(content, created_at) VALUES ($1, $2)", content, createdAt)
	return err
}
