CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(32) UNIQUE NOT NULL,
    password VARCHAR(32) NOT NULL
);