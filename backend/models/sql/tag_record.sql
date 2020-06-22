DROP TABLE IF EXISTS tag_record;
CREATE TABLE tag_record (
    tag_id INT,
    record_id INT,
    PRIMARY KEY (tag_id, record_id),
    FOREIGN KEY (tag_id) REFERENCES tag(tag_id) ON UPDATE CASCADE,
    FOREIGN KEY (record_id) REFERENCES record(record_id) ON UPDATE CASCADE
);
SELECT record.record_id,
    ARRAY_AGG(tag.tag_id) AS tags_ids
FROM tag
    INNER JOIN tag_record ON tag.tag_id = tag_record.tag_id
    INNER JOIN record ON tag_record.record_id = record.record_id
GROUP BY record.record_id;