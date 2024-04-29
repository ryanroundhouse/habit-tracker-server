const express = require('express');
const Question = require('../models/question');
const authenticate = require('../authenticate');
const router = express.Router();

router.post('/questions', authenticate, async (req, res) => {
    // For creating a question, ensure the userId from the token is used
    const userId = req.user.userId;  // Assuming userId is included in the JWT
    const { questionText, options } = req.body;
    try {
        const question = await Question.create(userId, questionText, options);
        res.status(201).send(question);
    } catch (error) {
        res.status(500).send({ error: 'Server error while creating question.' });
    }
});

router.get('/questions', authenticate, async (req, res) => {
    const userId = req.user.userId;  // Assuming userId is included in the JWT
    try {
        // Retrieve all questions by the authenticated user
        const questions = await Question.findAllByUserId(userId);
        if (questions.length === 0) {
            return res.status(404).send({ error: 'No questions found for this user.' });
        }
        res.send({ questions });
    } catch (error) {
        res.status(500).send({ error: 'Server error while retrieving questions.' });
    }
});

router.get('/questions/:questionId', authenticate, async (req, res) => {
    try {
        const question = await Question.findById(req.params.questionId);
        if (!question) {
            return res.status(404).send({ error: 'Question not found.' });
        }
        // Check if the authenticated user is the one associated with the question
        if (question.userId !== req.user.userId) {
            return res.status(403).send({ error: 'Access denied. You can only access your own questions.' });
        }
        res.send(question);
    } catch (error) {
        res.status(500).send({ error: 'Server error while retrieving question.' });
    }
});

router.put('/questions/:questionId', authenticate, async (req, res) => {
    try {
        const { questionText, options } = req.body;
        const question = await Question.findById(req.params.questionId);
        if (!question) {
            return res.status(404).send({ error: 'Question not found.' });
        }
        // Check if the authenticated user is the one associated with the question
        if (question.userId !== req.user.userId) {
            return res.status(403).send({ error: 'Access denied. You can only update your own questions.' });
        }
        await Question.update(req.params.questionId, questionText, options);
        res.send({ message: 'Question successfully updated.' });
    } catch (error) {
        res.status(500).send({ error: 'Server error while updating question.' });
    }
});

module.exports = router;
