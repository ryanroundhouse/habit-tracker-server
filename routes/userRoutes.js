const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.post('/users', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.create(email, password);
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send({ error: 'Failed to create user' });
    }
});

router.get('/users/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.send(user);
    } catch (error) {
        res.status(500).send({ error: 'Failed to retrieve user' });
    }
});

router.put('/users/:userId', async (req, res) => {
    try {
        const { email, password } = req.body;
        await User.update(req.params.userId, email, password);
        res.send({ message: 'User updated' });
    } catch (error) {
        res.status(500).send({ error: 'Failed to update user' });
    }
});

module.exports = router;
