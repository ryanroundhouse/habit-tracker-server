const express = require('express');
const Response = require('../models/response');
const router = express.Router();

router.post('/responses', async (req, res) => {
    try {
        const { questionId, userId, response } = req.body;
        const responseEntry = await Response.add(questionId, userId, response);
        res.status(201).send(responseEntry);
    } catch (error) {
        res.status(400).send({ error: 'Failed to add response' });
    }
});

router.get('/responses/:questionId', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const responses = await Response.findByQuestionAndDateRange(req.params.questionId, startDate, endDate);
        res.send(responses);
    } catch (error) {
        res.status(500).send({ error: 'Failed to retrieve responses' });
    }
});

module.exports = router;
