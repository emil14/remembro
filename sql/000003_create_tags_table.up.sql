CREATE TABLE tag (
    tag_id SERIAL PRIMARY KEY,
    name VARCHAR(32) NOT NULL,
    parent_id INT REFERENCES tag(tag_id),
    description VARCHAR(255) DEFAULT ''
);