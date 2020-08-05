package db

import "database/sql"

// Tag represents tag
type Tag struct {
	ID          int           `json:"id"`
	Name        string        `json:"name"`
	Description string        `json:"description"`
	ParentID    sql.NullInt64 `json:"parentId"`
}

// GetTags returns rows from tag table
func GetTags() ([]Tag, error) {
	rows, err := db.Query("SELECT tag_id, name, description, parent_id FROM tag")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	tags := []Tag{}
	for rows.Next() {
		tag := Tag{}
		if err := rows.Scan(&tag.ID, &tag.Name, &tag.Description, &tag.ParentID); err != nil {
			return nil, err
		}
		tags = append(tags, tag)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}

	return tags, nil
}

// CreateTag inserts values into tag table
func CreateTag(name string) error {
	_, err := db.Exec("INSERT INTO tag(name) VALUES ($1)", name)
	return err
}
