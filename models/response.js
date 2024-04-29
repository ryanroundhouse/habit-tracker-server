const db = require('../db/database');

class Response {
    static async add(questionId, userId, response, responseDate = new Date().toISOString()) {
        const responseId = Date.now().toString();
        await db.query(`INSERT INTO responses (response_id, question_id, user_id, response, response_date) VALUES (?, ?, ?, ?, ?)`, [responseId, questionId, userId, response, responseDate]);
        return { responseId, questionId, userId, response, responseDate };
    }

    static async findByQuestionAndDateRange(questionId, startDate, endDate) {
        return db.query(`SELECT * FROM responses WHERE question_id = ? AND response_date >= ? AND response_date <= ?`, [questionId, startDate, endDate]);
    }
}

module.exports = Response;
