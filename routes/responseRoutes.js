const express = require('express');
const Response = require('../models/response');
const authenticate = require('../authenticate');
const router = express.Router();

router.post('/responses', authenticate, async (req, res) => {
    const { questionId, userId, response } = req.body;
    try {
        const responseEntry = await Response.add(questionId, userId, response);
        res.status(201).send(responseEntry);
    } catch (error) {
        res.status(500).send({ error: 'Server error while adding response.' });
    }
});

router.get('/responses/:questionId', authenticate, async (req, res) => {
    const { startDate, endDate } = req.query;
    try {
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
