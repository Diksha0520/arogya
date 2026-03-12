const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// MongoDB connection
const dbURI = 'your_mongodb_connection_string';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// User model
const User = mongoose.model('User', new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
}));

// Register endpoint
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).send('User registered');
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (user) {
        res.send('Login successful');
    } else {
        res.status(401).send('Invalid credentials');
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
