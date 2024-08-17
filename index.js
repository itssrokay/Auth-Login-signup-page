const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const JWT_SECRET = '12345'; // Replace with a secure secret key

// Mock database of users
const ALL_USERS = [
    { username: 'harkirat@gmail.com', password: '123', name: 'Harkirat Singh' },
    { username: 'raman@gmail.com', password: '123321', name: 'Raman Singh' },
    { username: 'priya@gmail.com', password: '123321', name: 'Priya Kumari' },
];

// Function to check if the user exists in the database
function userExists(username, password) {
    return ALL_USERS.some(user => user.username === username && user.password === password);
}

// POST /signin endpoint
app.post('/signin', (req, res) => {
    const { username, password } = req.body;

    if (!userExists(username, password)) {
        return res.status(403).json({ msg: "User doesn't exist in our in-memory database" });
    }

    const token = jwt.sign({ username }, JWT_SECRET);
    return res.json({ token });
});

// GET /users endpoint
app.get('/users', (req, res) => {   
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ msg: 'Authorization token is required' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return res.json({ users: ALL_USERS });
    } catch (err) {
        return res.status(403).json({ msg: 'Invalid token' });
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
