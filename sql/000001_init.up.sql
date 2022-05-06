CREATE TABLE user (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(32) UNIQUE NOT NULL,
    password VARCHAR(32) NOT NULL
);
CREATE TABLE record (
    record_id SERIAL PRIMARY KEY,
    content VARCHAR(255) NOT NULL,
    created_at DATE NOT NULL,
    reminders timestamp []
);
CREATE TABLE tag (
    tag_id SERIAL PRIMARY KEY,
    name VARCHAR(32) NOT NULL,
    parent_id INT REFERENCES tag(tag_id) ON UPDATE CASCADE,
    description VARCHAR(255) DEFAULT ''
);
CREATE TABLE tag_record (
    tag_id INT REFERENCES tag(tag_id) ON UPDATE CASCADE,
    record_id INT REFERENCES record(record_id) ON UPDATE CASCADE,
    PRIMARY KEY (tag_id, record_id)
);
CREATE TABLE user_record (
    record_id INT REFERENCES record(record_id) ON UPDATE CASCADE,
    user_id INT REFERENCES user(user_id) ON UPDATE CASCADE,
    PRIMARY KEY (record_id, user_id)
);