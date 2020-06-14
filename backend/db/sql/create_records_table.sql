DROP TABLE IF EXISTS records CASCADE;
CREATE TABLE records (
    id SERIAL,
    content VARCHAR(255) NOT NULL,
    created_at DATE NOT NULL,
    PRIMARY KEY (id)
)