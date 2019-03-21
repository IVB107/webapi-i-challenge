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

server.get('/api/users/:id', (req, res) => {
    const { id } = req.params;

    // Not getting 404 from postman/invalid ID
    if (!db.findById(id)){
        res.status(404).json({ message: 'The user with the specified ID does not exist.' });
    } else {
        db.findById(id)
        .then(user => {
            res.status(200).json(user);
        })
        .catch(err => {
            res.status(500).json({ error: 'The user information could not be retrieved.' });
        })
    }
})

server.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;

    // Need conditional statement for finding user by ID (true/false)
    db.remove(id)
        .then(deleted => {
            res.status(200).end();
        })
        .catch(err => {
            res.status(500).json({ message: 'The user could not be removed' });
        })
})

server.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const user = req.body;

    if (!user.name || !user.bio) {
        return res.status(400).json({ message: 'Please provide name and bio for the user.' });
    }

    db.update(id, user)
        .then(updated => {
            if (updated) {
                res.status(200).json(updated);
            } else {
                res.status(404).json({ message: 'The user with the specified ID does not exist. '});
            }
        })
        .catch(err => {
            res.status(500).json({ error: 'The user information could not be modified.' });
        })
})

server.listen(4000, () => {
    console.log('Listening on Port 4000...');
})