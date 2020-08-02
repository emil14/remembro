-- it's called users baceuse user in pg is a keyword
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(32) NOT NULL,
    password VARCHAR(32) NOT NULL
);