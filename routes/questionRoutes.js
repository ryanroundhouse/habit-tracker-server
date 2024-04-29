const express = require('express');
const Question = require('../models/question');
const authenticate = require('../authenticate');
const router = express.Router();

router.post('/questions', authenticate, async (req, res) => {
    const { userId, questionText, options } = req.body;
    try {
        const question = await Question.create(userId, questionText, options);
        res.status(201).send(question);
    } catch (error) {
        res.status(500).send({ error: 'Server error while creating question.' });
    }
});

router.get('/questions/:questionId', authenticate, async (req, res) => {
    try {
        const question = await Question.findById(req.params.questionId);
        if (!question) {
            res.status(404).send({ error: 'Question not found.' });
        } else {
            res.send(question);
        }
    } catch (error) {
        res.status(500).send({ error: 'Server error while retrieving question.' });
    }
});

router.put('/questions/:questionId', authenticate, async (req, res) => {
    const { questionText, options } = req.body;
    try {
        await Question.update(req.params.questionId, questionText, options);
        res.send({ message: 'Question successfully updated.' });
    } catch (error) {
        res.status(500).send({ error: 'Server error while updating question.' });
    }
});

module.exports = router;
