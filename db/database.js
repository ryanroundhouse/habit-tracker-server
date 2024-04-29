const sqlite3 = require('sqlite3').verbose();

class Database {
    constructor() {
        this.db = new sqlite3.Database('./data.db', (err) => {
            if (err) {
                console.error('Error opening database', err.message);
            } else {
                console.log('Database connected.');
                this.setup();
            }
        });
    }

    setup() {
        this.db.run(`CREATE TABLE IF NOT EXISTS users (
            user_id TEXT PRIMARY KEY,
            email TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL
        )`);

        this.db.run(`CREATE TABLE IF NOT EXISTS questions (
            question_id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            question_text TEXT NOT NULL,
            FOREIGN KEY(user_id) REFERENCES users(user_id)
        )`);

        this.db.run(`CREATE TABLE IF NOT EXISTS responses (
            response_id TEXT PRIMARY KEY,
            question_id TEXT NOT NULL,
            user_id TEXT NOT NULL,
            response TEXT NOT NULL,
            response_date TEXT NOT NULL,
            FOREIGN KEY(question_id) REFERENCES questions(question_id),
            FOREIGN KEY(user_id) REFERENCES users(user_id)
        )`);
    }

    query(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            this.db.close((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}

module.exports = new Database();
