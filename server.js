/* Reference: Server setup with 'student' user credentials. */
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;

// --- CONNECTION STRING ---
// Using the NEW user 'student' and password 'student123'
const uri = process.env.MONGODB_URI; // Look for the secret key named MONGODB_URI; 

mongoose.connect(uri)
    .then(() => console.log("✅ SUCCESS: Connected to MongoDB Atlas"))
    .catch(err => console.error("❌ ERROR: Could not connect to MongoDB:", err));

const clickSchema = new mongoose.Schema({
    soundId: String,
    count: Number
});
const Click = mongoose.model('Click', clickSchema);

app.use(express.static('public'));
app.use(express.json());

// --- ROUTES ---

app.get('/api/stats', async (req, res) => {
    try {
        const data = await Click.find();
        const stats = {};
        data.forEach(item => stats[item.soundId] = item.count);
        res.json(stats);
    } catch (err) {
        console.error("❌ Error fetching stats:", err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/click', async (req, res) => {
    try {
        console.log("🖱️ CLICK RECEIVED for:", req.body.id);
        
        const soundId = req.body.id;
        let clickEntry = await Click.findOne({ soundId: soundId });
        
        if (!clickEntry) {
            clickEntry = new Click({ soundId: soundId, count: 1 });
        } else {
            clickEntry.count++;
        }
        
        await clickEntry.save();
        console.log("✅ Saved to DB!");
        res.json({ success: true, newCount: clickEntry.count });
        
    } catch (err) {
        console.error("❌ Error saving click:", err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
