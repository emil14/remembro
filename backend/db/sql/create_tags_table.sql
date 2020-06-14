DROP TABLE IF EXISTS tags CASCADE;
CREATE TABLE tags (
    id SERIAL,
    name VARCHAR(32) NOT NULL,
    parent_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (parent_id) REFERENCES tags(id)
)