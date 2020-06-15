package db

import "database/sql"

type Tag struct {
	ID          int           `json:"id"`
	Description string        `json:"description"`
	ParentID    sql.NullInt64 `json:"parentId"`
	// TODO children ids?
}

func GetTags() ([]Tag, error) {
	rows, err := db.Query("SELECT id, description, parent_id FROM tags")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	tags := []Tag{}
	for rows.Next() {
		tag := Tag{}
		if err := rows.Scan(&tag.ID, &tag.Description, &tag.ParentID); err != nil {
			return nil, err
		}
		tags = append(tags, tag)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}

	return tags, nil
}

func CreateTag(name string) error {
	_, err := db.Exec("INSERT INTO tags(name) VALUES ($1)", name)
	return err
}
