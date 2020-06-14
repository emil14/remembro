DROP TABLE IF EXISTS tags_records;
CREATE TABLE tags_records (
    tag_id INT,
    record_id INT,
    PRIMARY KEY (tag_id, record_id),
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON UPDATE CASCADE,
    FOREIGN KEY (record_id) REFERENCES records(id) ON UPDATE CASCADE
)