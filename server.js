/* Reference: Express.js documentation used for server setup.
  (Remember to cite 'Express js' in your final reference list as per brief [cite: 70])
*/

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// 1. Serve Static Content (HTML, CSS, JS) from the 'public' folder
app.use(express.static('public'));
app.use(express.json());

// In-memory database to track button clicks (The "Additional Feature")
let soundStats = {
    'laser': 0,
    'neon-hum': 0,
    'glitch': 0,
    'power-up': 0
};

// 2. API Endpoint to update stats
app.post('/api/click', (req, res) => {
    const soundId = req.body.id;
    if (soundStats[soundId] !== undefined) {
        soundStats[soundId]++;
        res.json({ success: true, newCount: soundStats[soundId] });
    } else {
        res.status(400).json({ error: 'Sound ID not found' });
    }
});

// 3. API Endpoint to get current stats
app.get('/api/stats', (req, res) => {
    res.json(soundStats);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});