DROP TABLE IF EXISTS tag CASCADE;
CREATE TABLE tag (
    tag_id SERIAL,
    name VARCHAR(32) NOT NULL,
    parent_id INT,
    description VARCHAR(255) DEFAULT '',
    PRIMARY KEY (id),
    FOREIGN KEY (parent_id) REFERENCES tags(tag_id)
);