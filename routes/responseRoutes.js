const express = require('express');
const Response = require('../models/response');
const Question = require('../models/question'); // You might need to import Question to check question ownership
const authenticate = require('../authenticate');
const router = express.Router();

router.post('/responses', authenticate, async (req, res) => {
    const { questionId, response } = req.body;
    const userId = req.user.userId;  // Assuming userId is included in the JWT

    try {
        // First, verify that the question belongs to the authenticated user
        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).send({ error: 'Question not found.' });
        }
        if (question.userId !== userId) {
            return res.status(403).send({ error: 'Unauthorized to respond to this question.' });
        }

        // If authorized, add the response
        const responseEntry = await Response.add(questionId, userId, response);
        res.status(201).send(responseEntry);
    } catch (error) {
        res.status(500).send({ error: 'Server error while adding response.' });
    }
});

router.get('/responses/:questionId', authenticate, async (req, res) => {
    const { startDate, endDate } = req.query;

    try {
        // First, verify that the question belongs to the authenticated user
        const question = await Question.findById(req.params.questionId);
        if (!question) {
            return res.status(404).send({ error: 'Question not found.' });
        }
        if (question.userId !== req.user.userId) {
            return res.status(403).send({ error: 'Unauthorized to access these responses.' });
        }

        // If authorized, retrieve the responses
        const responses = await Response.findByQuestionAndDateRange(req.params.questionId, startDate, endDate);
        if (responses.length === 0) {
            res.status(404).send({ error: 'No responses found for this question within the specified date range.' });
        } else {
            res.send(responses);
        }
    } catch (error) {
        res.status(500).send({ error: 'Server error while retrieving responses.' });
    }
});

module.exports = router;
