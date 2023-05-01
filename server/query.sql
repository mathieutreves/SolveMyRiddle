-- SQLite
DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (
    id          INTEGER NOT NULL,
    email       TEXT NOT NULL,
    username    TEXT NOT NULL,
    points      INTEGER NOT NULL DEFAULT (0),
    hash        TEXT NOT NULL,
    salt        TEXT NOT NULL,
    PRIMARY KEY (id AUTOINCREMENT)
);

DROP TABLE IF EXISTS riddles;
CREATE TABLE IF NOT EXISTS riddles (
    id          INTEGER NOT NULL,
    text        TEXT NOT NULL,
    answer    TEXT NOT NULL,
    hint1       TEXT NOT NULL,
    hint2       TEXT NOT NULL,
    difficulty  INTEGER NOT NULL,
    duration    INTEGER NOT NULL,
    user        INTEGER NOT NULL,
    rstatus     INTEGER NOT NULL DEFAULT(1),
    winner      INTEGER NOT NULL DEFAULT(0),
    timestart   INTEGER NOT NULL DEFAULT(0),
    PRIMARY KEY (id AUTOINCREMENT),
    FOREIGN KEY (user) REFERENCES users(id)
    FOREIGN KEY (winner) REFERENCES users(id)
);

DROP TABLE IF EXISTS riddleAnswers;
CREATE TABLE IF NOT EXISTS riddleAnswers (
    riddleid    INTEGER NOT NULL,
    userid      INTEGER NOT NULL,
    user        TEXT NOT NULL,
    answer      TEXT NOT NULL,
    correct     INTEGER NOT NULL,
    PRIMARY KEY (riddleid, userid)
    FOREIGN KEY (riddleid) REFERENCES riddles(id),
    FOREIGN KEY (userid) REFERENCES users(id)
);

-- Insert some users in users table
INSERT INTO users (email, username, points, hash, salt) 
    VALUES ("admin@polito.it", "admin", 7, "b9d4eaf67d9b3b1b92940232f4de705d3d773e98f6a19adb690495be00c09e8e", "s11661a8vYF2640l");             -- admin
INSERT INTO users (email, username, points, hash, salt) 
    VALUES ("paolo.verdi@polito.it", "Paolo", 1, "dd948284b87215185a90b12ca3944afbaf3d5c1709096f42253a2b356e764a2f", "z60329v3MpD04S30");       -- password
INSERT INTO users (email, username, points, hash, salt) 
    VALUES ("sara@polito.it", "Sara", 2, "fc9fe9293c68bb620b2773c4f44bc64c74d705b2932b0ad9dc8fd7e3dfde3f3d", "5S63y4U6Y81y13p5");               -- pw
INSERT INTO users (email, username, points, hash, salt) 
    VALUES ("john.travolta@polito.it", "John", 2, "ab6bfc85a1d50f9f9c18b01f4985194967b6907f3cc3edb67230375cfc73df62", "86u5986WmWR8P111");      -- 1234
INSERT INTO users (email, username, points, hash, salt) 
    VALUES ("gianna.nannini@polito.it", "Gianna", 3, "93e9f2c3281e2f9b9653e4743c55f5e81f7452e50588a2c7aff069d5b23ace53", "9PWL8e5w652G4J91");   -- 1234
INSERT INTO users (email, username, points, hash, salt) 
    VALUES ("mathieu.treves@polito.it", "Mathieu", 0, "111bef12e8506d203098977f710b921c052378b05edb136ea5b406219ac507dd", "Kv7pcrK8233Z4672");  -- 123456

-- Insert some riddles in riddles table

-- User 1
INSERT INTO riddles (text, answer, hint1, hint2, difficulty, duration, user, rstatus, winner)
    VALUES ("What is at the end of the rainbow?",
            "The letter W",
            "Think different",
            "Read the word rainbow",
            1, 30, 1, 0, 2);
INSERT INTO riddles (text, answer, hint1, hint2, difficulty, duration, user, rstatus, winner)
    VALUES ("What has to be broken before you can use it?",
            "An egg",
            "It is not an abstract concept",
            "It is a food",
            2, 300, 1, 0, 4);
INSERT INTO riddles (text, answer, hint1, hint2, difficulty, duration, user, rstatus, winner)
    VALUES ("I’m tall when I’m young, and I’m short when I’m old. What am I?",
            "A candle",
            "It is a common object",
            "It is usually white",
            1, 60, 1, 1, 0);

-- User 2
INSERT INTO riddles (text, answer, hint1, hint2, difficulty, duration, user, rstatus, winner)
    VALUES ("What month of the year has 28 days?",
            "All of them",
            "Not only February",
            "More than one month",
            1, 150, 2, 0, 3);
INSERT INTO riddles (text, answer, hint1, hint2, difficulty, duration, user, rstatus, winner)
    VALUES ("What is full of holes but still holds water?",
            "A sponge",
            "Think about small holes",
            "It lives in the sea",
            2, 245, 2, 0, 0);
INSERT INTO riddles (text, answer, hint1, hint2, difficulty, duration, user, rstatus, winner)
    VALUES ("What question can you never answer yes to?",
            "Are you asleep?",
            "Why you can't answer a question?",
            "You are not dead",
            1, 120, 2, 1, 0);

-- User 3
INSERT INTO riddles (text, answer, hint1, hint2, difficulty, duration, user, rstatus, winner)
    VALUES ("What is always in front of you but can’t be seen?",
            "The future",
            "It is not an object",
            "Comes after the present",
            3, 500, 3, 0, 1);
INSERT INTO riddles (text, answer, hint1, hint2, difficulty, duration, user, rstatus, winner)
    VALUES ("What can you break, even if you never pick it up or touch it?",
            "A promise",
            "It is not an object",
            "You make it to someone",
            3, 560, 3, 0, 5);
INSERT INTO riddles (text, answer, hint1, hint2, difficulty, duration, user, rstatus, winner)
    VALUES ("What goes up but never comes down?",
            "Your age",
            "Think about yourself",
            "It has an end",
            2, 270, 3, 1, 0);

-- User 4
INSERT INTO riddles (text, answer, hint1, hint2, difficulty, duration, user, rstatus, winner)
    VALUES ("A man who was outside in the rain without an umbrella or hat didn’t get a single hair on his head wet. Why?",
            "He was bald",
            "He was under the rain",
            "The hairs were not dry",
            3, 325, 4, 0, 1);
INSERT INTO riddles (text, answer, hint1, hint2, difficulty, duration, user, rstatus, winner)
    VALUES ("What gets wet while drying?",
            "A towel",
            "You can find it in a bathroom",
            "You use it to dry yourself",
            3, 415, 4, 0, 0);
INSERT INTO riddles (text, answer, hint1, hint2, difficulty, duration, user, rstatus, winner)
    VALUES ("What can you keep after giving to someone?",
            "Your word",
            "It is not an object",
            "You give it with your mouth",
            1, 30, 4, 1, 0);

-- User 5
INSERT INTO riddles (text, answer, hint1, hint2, difficulty, duration, user, rstatus, winner)
    VALUES ("I shave every day, but my beard stays the same. What am I?",
            "A barber",
            "I don't shave myself",
            "I do it for work",
            3, 410, 5, 0, 3);
INSERT INTO riddles (text, answer, hint1, hint2, difficulty, duration, user, rstatus, winner)
    VALUES ("You see a boat filled with people, yet there isn’t a single person on board. How is that possible?",
            "All the people on the boat are married",
            "There were people on the boat",
            "There was no SINGLE person on the boat",
            1, 40, 5, 0, 1);
INSERT INTO riddles (text, answer, hint1, hint2, difficulty, duration, user, rstatus, winner)
    VALUES ("I have branches, but no fruit, trunk or leaves. What am I?",
            "A bank",
            "I am not a tree",
            "People work for me",
            1, 50, 5, 1, 0);

-- User 6
INSERT INTO riddles (text, answer, hint1, hint2, difficulty, duration, user, rstatus, winner)
    VALUES ("What can’t talk but will reply when spoken to?",
            "An echo",
            "It is not a person",
            "YOu can find it in the mountains",
            1, 30, 6, 0, 0);
INSERT INTO riddles (text, answer, hint1, hint2, difficulty, duration, user, rstatus, winner)
    VALUES ("The more of this there is, the less you see. What is it?",
            "Darkness",
            "You have your eyes open",
            "The contrary of light",
            1, 100, 6, 0, 0);
INSERT INTO riddles (text, answer, hint1, hint2, difficulty, duration, user, rstatus, winner)
    VALUES ("What has many keys but can’t open a single lock?",
            "A piano",
            "It is an object",
            "You play it",
            2, 180, 6, 1, 0);

-- Insert some answer for some riddles in riddleAnswers table

-- Riddle 1 (The letter W)
INSERT INTO riddleAnswers (riddleid, userid, user, answer, correct)
    VALUES (1, 5, "Gianna", "The color blue", 0);
INSERT INTO riddleAnswers (riddleid, userid, user, answer, correct)
    VALUES (1, 2, "Paolo", "The letter W", 1);

 -- Riddle 2 (An egg)
INSERT INTO riddleAnswers (riddleid, userid, user, answer, correct)
    VALUES (2, 6, "Mathieu", "A promise", 0);
INSERT INTO riddleAnswers (riddleid, userid, user, answer, correct)
    VALUES (2, 3, "Sara", "Dont't know", 0);
INSERT INTO riddleAnswers (riddleid, userid, user, answer, correct)
    VALUES (2, 4, "John", "An egg", 1);

-- Riddle 3 (A candle) is Open

-- Riddle 4 (All of them)
INSERT INTO riddleAnswers (riddleid, userid, user, answer, correct)
    VALUES (4, 3, "Sara", "All of them", 1);

-- Riddle 5 (A sponge)
INSERT INTO riddleAnswers (riddleid, userid, user, answer, correct)
    VALUES (5, 1, "admin", "A bucket", 0);
INSERT INTO riddleAnswers (riddleid, userid, user, answer, correct)
    VALUES (5, 5, "Gianna", "A blue bucket", 0);

-- Riddle 6 (Are you asleep?) is Open

-- Riddle 7 (The future)
INSERT INTO riddleAnswers (riddleid, userid, user, answer, correct)
    VALUES (7, 1, "admin", "The future", 1);

-- Riddle 8 (A promise)
INSERT INTO riddleAnswers (riddleid, userid, user, answer, correct)
    VALUES (8, 1, "admin", "Glass", 0);
INSERT INTO riddleAnswers (riddleid, userid, user, answer, correct)
    VALUES (8, 5, "Gianna", "A promise", 1);

-- Riddle 9 () is Open

-- Riddle 10 (He was bald)
INSERT INTO riddleAnswers (riddleid, userid, user, answer, correct)
    VALUES (10, 2, "Paolo", "He had a coat", 0);
INSERT INTO riddleAnswers (riddleid, userid, user, answer, correct)
    VALUES (10, 1, "admin", "He was bald", 1);

-- Riddle 11 (A towel)
INSERT INTO riddleAnswers (riddleid, userid, user, answer, correct)
    VALUES (11, 1, "admin", "Glass", 0);
INSERT INTO riddleAnswers (riddleid, userid, user, answer, correct)
    VALUES (11, 5, "Gianna", "Grass", 0);
INSERT INTO riddleAnswers (riddleid, userid, user, answer, correct)
    VALUES (11, 6, "Mathieu", "The sun", 0);

-- Riddle 12 () is Open

-- Riddle 13 (A barber)
INSERT INTO riddleAnswers (riddleid, userid, user, answer, correct)
    VALUES (13, 3, "Sara", "A barber", 1);

-- Riddle 14 (All the people on the boat are married)
INSERT INTO riddleAnswers (riddleid, userid, user, answer, correct)
    VALUES (14, 3, "Sara", "They were dead", 0);
INSERT INTO riddleAnswers (riddleid, userid, user, answer, correct)
    VALUES (14, 4, "John", "I don't know", 0);
INSERT INTO riddleAnswers (riddleid, userid, user, answer, correct)
    VALUES (14, 1, "admin", "All the people on the boat are married", 1);

-- Riddle 15 () is Open

-- Riddle 16 (An echo)
INSERT INTO riddleAnswers (riddleid, userid, user, answer, correct)
    VALUES (16, 3, "Sara", "A deaf person", 0);
INSERT INTO riddleAnswers (riddleid, userid, user, answer, correct)
    VALUES (16, 1, "admin", "A child", 0);

-- Riddle 17 (Darkness)
INSERT INTO riddleAnswers (riddleid, userid, user, answer, correct)
    VALUES (17, 3, "Sara", "The absence of light", 0);
INSERT INTO riddleAnswers (riddleid, userid, user, answer, correct)
    VALUES (17, 2, "Paolo", "Joe mama", 0);

-- Riddle 18 () is Open