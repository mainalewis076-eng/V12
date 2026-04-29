const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.static('public'));

// File upload setup
const upload = multer({ dest: 'uploads/' });

// Bi's Brain
class BiBrain {
    constructor() {
        this.pipes = {};
        this.fragments = {};
        this.patterns = {};
        this.connections = [];
        this.dataPath = path.join(__dirname, 'brain.json');
        this.load();
    }

    // ── TEACH: Learn from examples ──
    teach(input, output, type = 'text') {
        const normalizedInput = input.toLowerCase().trim();
        
        // Store raw pipe
        if (!this.pipes[normalizedInput]) {
            this.pipes[normalizedInput] = [];
        }
        if (!this.pipes[normalizedInput].includes(output)) {
            this.pipes[normalizedInput].push(output);
        }

        // Extract fragments from input
        const words = normalizedInput.split(/\s+/);
        for (let word of words) {
            if (word.length < 2) continue;
            if (!this.fragments[word]) this.fragments[word] = [];
            if (!this.fragments[word].includes(output)) {
                this.fragments[word].push(output);
            }
        }

        // Detect pattern: if input is "X is Y" or "X means Y"
        if (normalizedInput.includes(' is ') || normalizedInput.includes(' means ')) {
            const parts = normalizedInput.split(/\s+(?:is|means)\s+/);
            if (parts.length >= 2) {
                const concept = parts[0].trim();
                const definition = parts[1].trim();
                this.patterns[concept] = {
                    type: 'definition',
                    value: definition,
                    confidence: 0.5
                };
            }
        }

        // Detect pattern: if input is "if X then Y"
        if (normalizedInput.startsWith('if ') && normalizedInput.includes(' then ')) {
            const condition = normalizedInput.replace('if ', '').split(' then ')[0].trim();
            const result = normalizedInput.split(' then ')[1].trim();
            this.patterns[condition] = {
                type: 'conditional',
                value: result,
                confidence: 0.5
            };
        }

        // Connect words that appear together
        for (let i = 0; i < words.length; i++) {
            for (let j = i + 1; j < words.length; j++) {
                if (words[i].length > 2 && words[j].length > 2) {
                    const exists = this.connections.find(c =>
                        (c.from === words[i] && c.to === words[j]) ||
                        (c.from === words[j] && c.to === words[i])
                    );
                    if (!exists) {
                        this.connections.push({
                            from: words[i],
                            to: words[j],
                            strength: 1
                        });
                    }
                }
            }
        }

        this.save();
        return { learned: true, pipes: Object.keys(this.pipes).length };
    }

    // ── ASK: Generate response from learned patterns ──
    ask(question) {
        const normalized = question.toLowerCase().trim();
        const words = normalized.split(/\s+/);

        // 1. Try exact pipe match
        if (this.pipes[normalized]) {
            const responses = this.pipes[normalized];
            const pick = responses[Math.floor(Math.random() * responses.length)];
            return {
                answer: pick,
                confidence: 0.9,
                source: 'exact_match'
            };
        }

        // 2. Try word-level fragment match
        let bestMatch = null;
        let bestScore = 0;

        for (let word of words) {
            if (word.length < 2) continue;
            
            // Check fragments
            if (this.fragments[word]) {
                const score = this.fragments[word].length;
                if (score > bestScore) {
                    bestScore = score;
                    bestMatch = {
                        answer: this.fragments[word][Math.floor(Math.random() * this.fragments[word].length)],
                        confidence: Math.min(0.7, score / 10),
                        source: 'fragment_match'
                    };
                }
            }

            // Check patterns
            if (this.patterns[word]) {
                const pattern = this.patterns[word];
                bestMatch = {
                    answer: pattern.value,
                    confidence: pattern.confidence,
                    source: 'pattern_match'
                };
            }
        }

        if (bestMatch) return bestMatch;

        // 3. Try connections (related concepts)
        for (let word of words) {
            const related = this.connections.filter(c => c.from === word || c.to === word);
            if (related.length > 0) {
                const relatedWord = related[0].from === word ? related[0].to : related[0].from;
                if (this.fragments[relatedWord]) {
                    return {
                        answer: `I don't know exactly, but it might relate to "${relatedWord}". Can you teach me more?`,
                        confidence: 0.2,
                        source: 'connection_hint'
                    };
                }
            }
        }

        // 4. Nothing found
        return {
            answer: null,
            confidence: 0,
            source: 'no_knowledge',
            message: "I don't know that yet. Teach me with: word -> response"
        };
    }

    // ── FEEDBACK: Adjust confidence ──
    feedback(concept, vote) {
        if (this.patterns[concept]) {
            if (vote === 'up') {
                this.patterns[concept].confidence = Math.min(1, this.patterns[concept].confidence + 0.1);
            } else {
                this.patterns[concept].confidence = Math.max(0, this.patterns[concept].confidence - 0.2);
                if (this.patterns[concept].confidence <= 0.1) {
                    delete this.patterns[concept];
                }
            }
            this.save();
            return { adjusted: true };
        }

        // Adjust pipe weight
        if (this.pipes[concept]) {
            if (vote === 'down') {
                delete this.pipes[concept];
                this.save();
            }
            return { adjusted: true };
        }

        return { adjusted: false };
    }

    // ── STATS ──
    getStats() {
        return {
            totalPipes: Object.keys(this.pipes).length,
            totalFragments: Object.keys(this.fragments).length,
            totalPatterns: Object.keys(this.patterns).length,
            totalConnections: this.connections.length
        };
    }

    // ── STORAGE ──
    save() {
        const data = {
            pipes: this.pipes,
            fragments: this.fragments,
            patterns: this.patterns,
            connections: this.connections,
            lastSaved: new Date().toISOString()
        };
        fs.writeFileSync(this.dataPath, JSON.stringify(data, null, 2));
    }

    load() {
        try {
            if (fs.existsSync(this.dataPath)) {
                const data = JSON.parse(fs.readFileSync(this.dataPath, 'utf8'));
                this.pipes = data.pipes || {};
                this.fragments = data.fragments || {};
                this.patterns = data.patterns || {};
                this.connections = data.connections || [];
            }
        } catch (e) {
            console.log('Fresh brain. Blank slate.');
        }
    }
}

// Initialize Bi
const bi = new BiBrain();
console.log(`🧠 Bi brain ready. Pipes: ${Object.keys(bi.pipes).length}`);

// ── ROUTES ──

// Teach Bi
app.post('/teach', (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Need text to teach' });

    const lines = text.split('\n');
    let lessons = 0;

    for (let line of lines) {
        line = line.trim();
        if (!line) continue;

        if (line.includes('->')) {
            const [input, output] = line.split('->').map(s => s.trim());
            bi.teach(input, output);
            lessons++;
        } else {
            // Treat whole line as a fact; connect words
            const words = line.toLowerCase().split(/\s+/);
            for (let word of words) {
                if (word.length > 2) {
                    bi.teach(word, line);
                }
            }
            lessons++;
        }
    }

    res.json({ lessons, stats: bi.getStats() });
});

// Upload and teach from file
app.post('/teach-file', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const filePath = req.file.path;
    const fileName = req.file.originalname;
    const fileType = req.file.mimetype;

    // For text files, read content
    if (fileType.startsWith('text/') || fileName.endsWith('.txt') || fileName.endsWith('.csv') || fileName.endsWith('.json')) {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');
        let lessons = 0;

        for (let line of lines) {
            line = line.trim();
            if (!line) continue;
            if (line.includes('->')) {
                const [input, output] = line.split('->').map(s => s.trim());
                bi.teach(input, output);
                lessons++;
            }
        }
        fs.unlinkSync(filePath);
        return res.json({ lessons, stats: bi.getStats() });
    }

    // For media files, store reference
    bi.teach(fileName, `file:${fileType}:${fileName}`);
    fs.unlinkSync(filePath);
    res.json({ learned: true, file: fileName, stats: bi.getStats() });
});

// Ask Bi
app.post('/ask', (req, res) => {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: 'Need a question' });

    const result = bi.ask(question);
    res.json({
        ...result,
        stats: bi.getStats()
    });
});

// Feedback
app.post('/feedback', (req, res) => {
    const { concept, vote } = req.body;
    const result = bi.feedback(concept, vote);
    res.json(result);
});

// Get brain stats
app.get('/stats', (req, res) => {
    res.json(bi.getStats());
});

// Reset brain
app.post('/reset', (req, res) => {
    bi.pipes = {};
    bi.fragments = {};
    bi.patterns = {};
    bi.connections = [];
    bi.save();
    res.json({ reset: true, message: 'Bi is blank again.' });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n✨ Bi system running on http://localhost:${PORT}`);
    console.log(`   Teach: POST /teach`);
    console.log(`   Ask:   POST /ask`);
    console.log(`   Stats: GET  /stats\n`);
});
