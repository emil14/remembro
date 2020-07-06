DROP TABLE IF EXISTS reminder CASCADE;
CREATE TABLE reminder (
    reminder_id SERIAL PRIMARY KEY,
    record_id INT NOT NULL REFERENCES record(record_id)
)