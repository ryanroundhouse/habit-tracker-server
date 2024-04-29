const express = require('express');
const Question = require('../models/question');
const router = express.Router();

router.post('/questions', async (req, res) => {
    try {
        const { userId, questionText, options } = req.body;
        const question = await Question.create(userId, questionText, options);
        res.status(201).send(question);
    } catch (error) {
        res.status(400).send({ error: 'Failed to create question' });
    }
});

router.get('/questions/:questionId', async (req, res) => {
    try {
        const question = await Question.findById(req.params.questionId);
        if (!question) {
            return res.status(404).send('Question not found');
        }
        res.send(question);
    } catch (error) {
        res.status(500).send({ error: 'Failed to retrieve question' });
    }
});

router.put('/questions/:questionId', async (req, res) => {
    try {
        const { questionText, options } = req.body;
        await Question.update(req.params.questionId, questionText, options);
        res.send({ message: 'Question updated' });
    } catch (error) {
        res.status(500).send({ error: 'Failed to update question' });
    }
});

module.exports = router;
