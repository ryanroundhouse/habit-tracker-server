const db = require('../db/database');

class Question {
    static async create(userId, questionText, options) {
        const questionId = Date.now().toString();
        await db.query(`INSERT INTO questions (question_id, user_id, question_text) VALUES (?, ?, ?)`, [questionId, userId, questionText]);
        for (const option of options) {
            await db.query(`INSERT INTO question_options (option_id, question_id, option_text) VALUES (?, ?, ?)`, [Date.now().toString(), questionId, option]);
        }
        return { questionId, userId, questionText, options };
    }

    static async findById(questionId) {
        const questions = await db.query(`SELECT * FROM questions WHERE question_id = ?`, [questionId]);
        const options = await db.query(`SELECT option_text FROM question_options WHERE question_id = ?`, [questionId]);
        return questions.length > 0 ? { ...questions[0], options: options.map(opt => opt.option_text) } : null;
    }

    static async update(questionId, questionText, options) {
        await db.query(`UPDATE questions SET question_text = ? WHERE question_id = ?`, [questionText, questionId]);
        await db.query(`DELETE FROM question_options WHERE question_id = ?`, [questionId]);
        for (const option of options) {
            await db.query(`INSERT INTO question_options (option_id, question_id, option_text) VALUES (?, ?, ?)`, [Date.now().toString(), questionId, option]);
        }
    }
}

module.exports = Question;
