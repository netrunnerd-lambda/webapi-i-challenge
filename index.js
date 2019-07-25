const cors = require('cors');
const express = require('express');

const db = require('./data/db');
const server = express();
const port = 4040;

server.use(cors());
server.use(express.json());

server.get('/api', (req, res) => res.status(200).json({ success: true, message: "hello from the other side" }));

// users

server.get('/api/users', (req, res) => {
  db
    .find()
    .then(users => res.status(200).json({ success: true, users }))
    .catch(err => res.status(500).json({ success: false, err }));
});

server.get('/api/users/:id', (req, res) => {
  const { id } = req.params;

  db
    .findById(id)
    .then(user => {
      if (user) res.status(200).json({ success: true, user });
      else res.status(404).json({ success: false, message: `User does not exist.`});
    })
    .catch(err => res.status(500).json({ success: false, err }));
});

server.listen(port, _ => console.log(`now listening on port ${port}`));