package db

// User ...
type User struct {
	ID       int    `json:"id"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

// GetUser ...
func GetUser(email string) (*User, error) {
	rows, err := db.Query("SELECT user_id, email, password FROM user WHERE email = email")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	user := User{}
	if err := rows.Scan(&user.ID, &user.Email, &user.Password); err != nil {
		return nil, err
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}

	return &user, nil
}

// CreateUser ...
func CreateUser(email, password string) error {
	_, err := db.Exec("INSERT INTO users(email, password) VALUES ($1, $2)", email, password)
	return err
}
