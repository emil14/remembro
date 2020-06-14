DROP TABLE IF EXISTS tags;
CREATE TABLE tags (
    id SERIAL,
    name VARCHAR(32),
    parent_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (parent_id) REFERENCES tags(id)
)