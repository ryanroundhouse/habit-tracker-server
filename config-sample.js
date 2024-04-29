const config = {
    dbPath: './data.db',
    secret: 'your_secret_key',  // Used for JWT or other security mechanisms
    saltRounds: 10,             // For bcrypt password hashing
};

module.exports = config;
