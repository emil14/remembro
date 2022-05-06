package db

import (
	"fmt"
)

// User ...
type User struct {
	ID       int    `json:"id"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

// GetUser retrieves a user from database by email
func GetUser(email string) (*User, error) {
	rows, err := db.Query("SELECT user_id, email, password FROM user WHERE email = $1", email)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	user := User{}
	user_found := false
	for rows.Next() {
		user_found = true
		if err := rows.Scan(&user.ID, &user.Email, &user.Password); err != nil {
			return nil, err
		}
	}
	if !user_found {
		return nil, fmt.Errorf("No user with email - %v", email)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}

	return &user, nil
}

// CreateUser ...
func CreateUser(email, password string) error {
	_, err := db.Exec("INSERT INTO user(email, password) VALUES ($1, $2)", email, password)
	return err
}
