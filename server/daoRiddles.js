'use strict';

const db = require('./db');

/**
 * 
 * @param {filter} to filter the list of riddles (open, close, myRiddles, all)
 * @param {userId} id of the user loggedIn (to check if has already responded)
 * @returns list of riddles
 */
exports.getlistRiddles = (filter, userId) => {
    return new Promise((resolve, reject) => {
        // Select all the info from the riddles table, joined with the riddleAnswers. If there is an answer for the riddle, 
        // it is in the table, otherwise the value is null. Used to tell if the user has already answered to a riddle.
        const sql = 'SELECT R.id, R.text, R.answer, R.hint1, R.hint2, R.difficulty, R.duration, R.user, R.rstatus, R.winner, R.timestart, RA.answer AS useranswer \
                        FROM riddles AS R \
                        LEFT OUTER JOIN (SELECT * FROM riddleAnswers WHERE riddleAnswers.userid = ?) AS RA \
                        ON RA.riddleid = R.id';
        db.all(sql, [userId], (err, rows) => {
            if (err) { reject(err); }
            else {
                // Check if the riddle has already been answered (there is a value in timestart), if so, check 
                // if the time passed since that answer is somehow greater than the duration. If so, close the 
                // riddle.
                const riddles = rows.map((e) => {
                    let status = e.rstatus;
                    if (e.timestart !== 0 && e.duration - (Date.now() - e.timestart)/1000 <= 0)
                        status = 0;
                        
                    const riddle = Object.assign({}, e, { rstatus: status });
                    return riddle;
                });

                // Filter the riddles returned to the user
                if (filter === 'openRiddles') 
                    resolve(riddles.filter((riddle) => riddle.rstatus === 1 && riddle.user !== userId));
                else if (filter === 'closedRiddles')
                    resolve(riddles.filter((riddle) => riddle.rstatus === 0 && riddle.user !== userId))
                else if (filter === 'myRiddles')
                    resolve(riddles.filter((riddle) => riddle.user === userId))
                else
                    resolve(riddles.filter((riddle) => riddle.user !== userId));
            }
        });
    });
};
/**
 * 
 * @param {id} id of the riddle to fetch
 * @returns single riddle
 */
exports.getRiddle = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM riddles WHERE id=?';
        db.get(sql, [id], (err, row) => {
            if (err) { reject(err); }
            else if (row === undefined) {
                resolve({ error: 'Riddle not present in the DB'});
            } else {
                resolve(row);
            }
        });
    });
};

/**
 * 
 * @param {riddle} riddle information to be inserted in the db
 * @returns the last riddle inserted
 */
exports.createRiddle = (riddle) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO riddles (text, answer, hint1, hint2, difficulty, duration, user) VALUES (?, ?, ?, ?, ?, ?, ?)';
        db.run(sql, [riddle.text, riddle.answer, riddle.hint1, riddle.hint2, riddle.difficulty, riddle.duration, riddle.user], function (err) {
            if (err) { reject(err); }
            else {
                resolve(exports.getRiddle(this.lastID));
            }
        });
    });
};

/**
 * 
 * @param {id} id of the riddle to be closed
 * @param {userId} id of the user that won the riddle (if any)
 * @returns the riddle closed
 */
exports.setRiddleClosed = (id, userId) => {
    return new Promise((resolve, reject) => {
        // Closing a riddle set its status to 0, timestart to 0 (we don't need it anymore), the winner
        // to the id of the winner, if any, or to 0 if no one won
        const sql = 'UPDATE riddles SET rstatus=0, timestart=0, winner=? WHERE id=?';
        db.run(sql, [userId, id], function (err) {
            if (err) { reject(err); }
            else {
                resolve(exports.getRiddle(id));
            }
        });
    });
};

/**
 * 
 * @param {id} id of the riddle we want the answers
 * @returns list of answers
 */
exports.getlistAnswers = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM riddleAnswers WHERE riddleid=?';
        db.all(sql, [id], (err, rows) => {
            if (err) { reject(err); }
            else {
                resolve(rows);
            }
        });
    });
};

/**
 * 
 * @param {id} id of the riddle we want the answer
 * @param {user} username of the user we want the answer
 * @returns an answer (if there is one)
 */
exports.getAnswer = (id, user) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM riddleAnswers WHERE riddleid=? AND user=?';
        db.get(sql, [id, user], (err, row) => {
            if (err) { reject(err); }
            else if (row === undefined) {
                resolve({ error: 'Answer not present in the DB'});
            } else {
                resolve(row);
            }
        });
    });
};

/**
 * 
 * @param {answer} answer info to be inserted in the db
 * @returns the answer just inserted
 */
exports.addAnswer = (answer) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO riddleAnswers (riddleid, userid, user, answer, correct) VALUES (?, ?, ?, ?, ?)';
        db.run(sql, [answer.riddleid, answer.userid, answer.user, answer.answer, answer.correct], function (err) {
            if (err) { reject(err); }
            else {
                resolve(exports.getAnswer(answer.riddleid, answer.user));
            }
        });
    });
};

/**
 * 
 * @param {id} id of the riddle we want to test an answer for
 * @param {text} text of the answer we have to check
 * @returns 1 or 0 if the answer is correct or wrong
 */
exports.checkAnswer = (id, text) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT answer, timestart FROM riddles WHERE id=?';
        db.get(sql, [id], function (err, row) {
            if (err) { reject(err); }
            else if (row === undefined) {
                resolve({ error: 'Riddle not present in the DB'});
            } else {
                // If the riddle has no answers (timestart = 0), we have to update its entry
                if (row.timestart == 0) {
                    const time = Date.now();
                    const sql = 'UPDATE riddles SET timestart=? WHERE id=?';
                    db.run(sql, [time, id], function (err) {
                        if (err) { reject(err); }
                    });
                }

                // Check if the answer is correct (equals to the one set by the creator 
                // of the riddle)
                const answer = row.answer;
                if (answer == text)
                    resolve(1);
                else
                    resolve(0);
            }
        });
    });
};