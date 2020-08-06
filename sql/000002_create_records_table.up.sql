CREATE TABLE record (
    record_id SERIAL PRIMARY KEY,
    content VARCHAR(255) NOT NULL,
    created_at DATE NOT NULL,
    reminders timestamp []
);