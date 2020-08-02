DROP TABLE IF EXISTS users_record;
CREATE TABLE users_record (
    record_id INT,
    user_id INT,
    PRIMARY KEY (record_id, user_id),
    FOREIGN KEY (record_id) REFERENCES record(record_id) ON UPDATE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON UPDATE CASCADE
);