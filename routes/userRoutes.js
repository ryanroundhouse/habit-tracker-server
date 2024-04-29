const express = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authenticate = require('../authenticate');  // Ensure the path is correct
const config = require('../config');  // Configuration file containing the secret key

const router = express.Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(400).send({ error: 'Authentication failed: user does not exist.' });
        }

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(400).send({ error: 'Authentication failed: incorrect password.' });
        }

        const token = jwt.sign({ userId: user.user_id, email: user.email }, config.secret, { expiresIn: '1h' });
        res.send({ token });
    } catch (error) {
        res.status(500).send({ error: 'Server error during authentication process.' });
    }
});

router.post('/users', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.create(email, password);
        res.status(201).send({ userId: user.userId, email: user.email });
    } catch (error) {
        if (error.code === 'SQLITE_CONSTRAINT') {
            res.status(409).send({ error: 'User already exists with the provided email.' });
        } else {
            res.status(400).send({ error: 'Failed to create user due to invalid input or server error.' });
        }
    }
});

router.get('/users/:userId', authenticate, async (req, res) => {
    if (req.params.userId !== req.user.userId) {
        return res.status(403).send({ error: 'Access denied. You can only access your own data.' });
    }

    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).send({ error: 'User not found.' });
        }
        res.send({ userId: user.user_id, email: user.email });
    } catch (error) {
        res.status(500).send({ error: 'Server error while retrieving user.' });
    }
});

router.put('/users/:userId', authenticate, async (req, res) => {
    if (req.params.userId !== req.user.userId) {
        return res.status(403).send({ error: 'Access denied. You can only update your own data.' });
    }

    try {
        const { email, password } = req.body;
        await User.update(req.params.userId, email, password);
        res.send({ message: 'User successfully updated.' });
    } catch (error) {
        if (error.code === 'SQLITE_CONSTRAINT') {
            res.status(409).send({ error: 'Email already in use.' });
        } else {
            res.status(500).send({ error: 'Failed to update user due to server error.' });
        }
    }
});

module.exports = router;
