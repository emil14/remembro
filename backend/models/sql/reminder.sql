DROP TABLE IF EXISTS reminder CASCADE;
CREATE TABLE reminder (
    reminder_id SERIAL PRIMARY KEY,
    record_id INT NOT NULL REFERENCES record(record_id),
    time TIMESTAMPTZ
);
SET timezone = 'Europe/Moscow';
-- INSERT INTO reminder()
-- VALUES (0, 1, '2016-06-22 19:10:25-07')