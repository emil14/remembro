DROP TABLE IF EXISTS tag_record;
CREATE TABLE tag_record (
    tag_id INT,
    record_id INT,
    PRIMARY KEY (tag_id, record_id),
    FOREIGN KEY (tag_id) REFERENCES tag(tag_id) ON UPDATE CASCADE,
    FOREIGN KEY (record_id) REFERENCES record(record_id) ON UPDATE CASCADE
);