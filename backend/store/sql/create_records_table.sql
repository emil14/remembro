DROP TABLE IF EXISTS records;
CREATE TABLE records (
    id SERIAL,
    content VARCHAR(255),
    PRIMARY KEY (id)
)