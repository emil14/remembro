-- it's called users baceuse user in pg is a keyword
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(32) NOT NULL,
    password VARCHAR(32) NOT NULL
);