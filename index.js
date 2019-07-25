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
    .catch(err => res.status(500).json({ success: false, error: "Users information could not be retrieved." }));
});

server.get('/api/users/:id', (req, res) => {
  const { id } = req.params;

  db
    .findById(id)
    .then(user => {
      if (user) res.status(200).json({ success: true, user });
      else res.status(404).json({ success: false, error: "User does not exist." });
    })
    .catch(err => res.status(500).json({ success: false, error: "User information could not be retrieved." }));
});

server.post('/api/users', (req, res) => {
  const newUser = req.body;
  const { name, bio } = newUser;

  if (!name || !bio)
    res.status(400).json({ success: false, error: "Please provide a name and bio for new users." });

  db
    .insert(newUser)
    .then(user => {
      db
        .findById(user.id)
        .then(user => {
          if (!user) res.status(404).json({ success: false, error: "User does not exist." });
          else res.status(201).json({ success: true, user });
        })
    })
    .catch(err => res.status(500).json({ success: false, error: "There was an error while saving user to database." }));
});

server.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const originalUser = db.findById(id);
  const updatedUser = req.body;
  const { name, bio } = updatedUser;

  if (!name || !bio)
    res.status(400).json({ success: false, error: "Please provide a name and bio for the user." });

  if (!originalUser) {
    res.status(404).json({ success: false, error: "User does not exist." });
  } else {
    db
      .update(id, updatedUser)
      .then(_ => {
        db
          .findById(id)
          .then(user => res.status(200).json({ success: true, user }));
      })
      .catch(err => res.status(500).json({ success: false, error: "User information could not be modified." }));
  }
});

server.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const foundUser = db.findById(id);

  if (!foundUser) {
    res.status(404).json({ success: false, error: "User does not exist." });
  } else {
    db
      .remove(id)
      .then(removed => {
        if (!removed) res.status(404).json({ success: false, error: "User does not exist." });
        else res.status(200).json({ success: true, message: `User ${id} removed.` });
      })
      .catch(err => res.status(500).json({ success: false, error: "User could not be removed." }));
  }
});

server.listen(port, _ => console.log(`now listening on port ${port}`));