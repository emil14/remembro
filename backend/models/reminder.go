package models

// Reminder represents a row in reminder table
type Reminder struct {
	ID       int `json:"id"`
	RecordID int `json:"recordId"`
}

func getReminders() ([]Reminder, error) {
	rows, err := db.Query("SELECT reminder_id, record_id FROM reminder")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	reminders := []Reminder{}
	for rows.Next() {
		r := Reminder{}
		if err := rows.Scan(&r.ID, &r.RecordID); err != nil {
			return nil, err
		}
		reminders = append(reminders, r)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}

	return reminders, nil
}
