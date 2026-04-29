const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const BiBrain = require('./biBrain');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.static('public'));

const upload = multer({ dest: 'uploads/' });
const bi = new BiBrain();

console.log(`\n🧠 Bi brain active`);
console.log(`   Pipes: ${bi.getStats().totalPipes}`);
console.log(`   Patterns: ${bi.getStats().totalPatterns}\n`);

// ─── ROUTES ───

// Teach Bi with text
app.post('/teach', (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'No text provided' });

    const result = bi.teachBulk(text);
    res.json(result);
});

// Teach Bi with file upload
app.post('/teach-file', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const fs = require('fs');
    const filePath = req.file.path;
    const fileName = req.file.originalname;
    const fileType = req.file.mimetype;

    let result = { lessons: 0 };

    if (fileType.startsWith('text/') || fileName.match(/\.(txt|csv|json|md)$/)) {
        const content = fs.readFileSync(filePath, 'utf8');
        result = bi.teachBulk(content);
    } else if (fileType.startsWith('image/')) {
        bi.teachFile(fileName, fileType, 'image');
        result = { lessons: 1, file: fileName, type: 'image' };
    } else if (fileType.startsWith('video/')) {
        bi.teachFile(fileName, fileType, 'video');
        result = { lessons: 1, file: fileName, type: 'video' };
    } else if (fileType.startsWith('audio/')) {
        bi.teachFile(fileName, fileType, 'audio');
        result = { lessons: 1, file: fileName, type: 'audio' };
    } else {
        bi.teachFile(fileName, fileType, 'file');
        result = { lessons: 1, file: fileName, type: 'file' };
    }

    fs.unlinkSync(filePath);
    res.json({ ...result, stats: bi.getStats() });
});

// Ask Bi
app.post('/ask', (req, res) => {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: 'No question provided' });

    const result = bi.ask(question);
    res.json({ ...result, stats: bi.getStats() });
});

// Feedback
app.post('/feedback', (req, res) => {
    const { concept, vote, pipeId } = req.body;
    const result = bi.feedback(concept, vote, pipeId);
    res.json(result);
});

// Correction: "No, the answer is X"
app.post('/correct', (req, res) => {
    const { question, correctAnswer } = req.body;
    if (!question || !correctAnswer) return res.status(400).json({ error: 'Need question and correctAnswer' });

    bi.correct(question, correctAnswer);
    res.json({ corrected: true, question, answer: correctAnswer });
});

// Get stats
app.get('/stats', (req, res) => {
    res.json(bi.getStats());
});

// Export brain
app.get('/export', (req, res) => {
    res.json(bi.export());
});

// Import brain
app.post('/import', (req, res) => {
    const { data } = req.body;
    if (!data) return res.status(400).json({ error: 'No brain data provided' });
    bi.import(data);
    res.json({ imported: true, stats: bi.getStats() });
});

// Reset
app.post('/reset', (req, res) => {
    bi.reset();
    res.json({ reset: true, message: 'Bi is blank.' });
});

// Start
app.listen(PORT, () => {
    console.log(`✨ Bi running on http://localhost:${PORT}\n`);
});
