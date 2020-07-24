DROP TABLE IF EXISTS record CASCADE;
CREATE TABLE record (
    record_id SERIAL PRIMARY KEY,
    content VARCHAR(255) NOT NULL,
    created_at DATE NOT NULL,
    reminders timestamp []
);
-- INSERT INTO record (content, created_at, reminders)
-- VALUES (
--         'xxx',
--         timestamp '2015-01-10 00:51:14',
--         array [timestamp '2015-01-10 00:51:14', timestamp '2015-01-11 00:51:14']
--     );