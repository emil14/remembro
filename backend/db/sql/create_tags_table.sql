DROP TABLE IF EXISTS tags CASCADE;
CREATE TABLE tags (
    id SERIAL,
    name VARCHAR(32) NOT NULL,
    parent_id INT,
    description VARCHAR(255) DEFAULT '',
    PRIMARY KEY (id),
    FOREIGN KEY (parent_id) REFERENCES tags(id)
);
INSERT INTO tags (id, name, parent_id, description)
VALUES (
        1,
        'life',
        NULL,
        'some tag desc'
    ),
    (
        2,
        'death',
        1,
        'some tag desc'
    );