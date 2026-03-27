const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// --- DATABASE CONNECTION ---
const mongoURI = process.env.MONGO_URI;
if (mongoURI && mongoURI !== 'your_mongodb_connection_string_here') {
    mongoose.connect(mongoURI)
        .then(() => console.log('✅ Quantum DB Online and Secured'))
        .catch(err => console.error('❌ Uplink Failure:', err.message));
} else {
    console.log('⚠️ Warning: Valid MONGO_URI not found. Running in offline mode.');
}

// --- DATABASE SCHEMA ---
const Message = mongoose.model('AnshuMessage', new mongoose.Schema({
    name: String, 
    email: String, 
    message: String, 
    date: { type: Date, default: Date.now }
}));

// --- ROUTES ---
app.post('/api/contact', async (req, res) => {
    try {
        const msg = new Message(req.body);
        await msg.save();
        res.status(201).json({ success: true });
    } catch (err) { 
        res.status(500).send(err); 
    }
});

// Catch-all route for the HTML (Express 5 Compatible)
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// --- START SERVER ---
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`🚀 Anshu Systems Online on port ${PORT}`));