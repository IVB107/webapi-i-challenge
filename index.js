// implement your API here
const express = require('express');

const server = express();

const db = require('./data/db');

server.use(express.json());

server.get('/api', (req, res) => {
    res.send('Welcome to the Users API!');
})

server.post('/api/users', (req, res) => {
    const userInfo = req.body;

    (!userInfo.name || !userInfo.bio)
    ? res.status(404).json({ errorMessage: 'Please provide name and bio for the user.' })
    : db
        .insert(userInfo)
        .then(user => {
            res.status(201).json(user);
        })
        .catch(err => {
            res.status(500).json({ message: 'There was an error while saving the user to the database' });
        })
})

server.get('/api/users', (req, res) => {
    db.find()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            res.status(500).json({ error: 'The users information could not be retrieved.' });
        })
})

// server.get()

// server.delete()

// server.put()

server.listen(4000, () => {
    console.log('Listening on Port 4000...');
})