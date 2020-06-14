package store

type Record struct {
	id      int
	content string
}

func GetRecords() ([]*Record, error) {
	rows, err := db.Query("SELECT id, content FROM records")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	records := []*Record{}
	for rows.Next() {
		var (
			id   int
			name string
		)
		err := rows.Scan(&id, &name)
		if err != nil {
			return nil, err
		}
		records = append(records, &Record{id, name})
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return records, nil
}

func CreateRecord(content string) error {
	_, err := db.Exec("INSERT INTO records(content) VALUES ($1)", content)
	return err
}
