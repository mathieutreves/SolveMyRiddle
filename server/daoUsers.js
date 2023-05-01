"use strict";

const db = require("./db");
const crypto = require("crypto");

exports.getUser = (email, password) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * from users WHERE email = ?";
        db.get(sql, [email], (err, row) => {
            if (err) { reject(err); }
            else if (row === undefined) { resolve(false); }
            else {
                const user = {id: row.id, email: row.email, username: row.username};

                const salt = row.salt;
                crypto.scrypt(password, salt, 32, (err, hashedPassword) => {
                    if (err) { reject(err); }
                    if (!crypto.timingSafeEqual(Buffer.from(row.hash, "hex"), hashedPassword)) {
                        resolve(false);
                    } else {
                        resolve(user);
                    }
                });
            }
        });
    })
};

exports.getUserById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT username FROM users WHERE id=?";
        db.get(sql, [id], (err, row) => {
            if (err) { reject(err); }
            else if (row === undefined) { resolve(false); }
            else {
                resolve(row);
            }
        });
    })
};

exports.addPoints = (points, id) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE users SET points=points+? WHERE id=?';
        db.run(sql, [points, id], (err) => {
            if (err) { reject(err); }
            else {
                resolve(true);
            }
        });
    });
};

exports.getRankings = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM (SELECT email, username, points, DENSE_RANK() OVER (ORDER BY points DESC) rank FROM users) WHERE rank <= 3';
        db.all(sql, (err, rows) => {
            if (err) { 
                reject(err); 
            } else {
                resolve(rows);
            }
        });
    });
};