const fs = require('fs');
const path = require('path');

class BiBrain {
    constructor() {
        this.pipes = {};
        this.fragments = {};
        this.patterns = {};
        this.connections = [];
        this.context = [];
        this.personality = {
            style: 'manly',
            traits: ['direct', 'confident', 'honest', 'helpful'],
            tone: 'casual but sharp'
        };
        this.dataPath = path.join(__dirname, 'brain.json');
        this.load();
    }

    // ═══════════ TEACHING ═══════════

    teachBulk(text) {
        const lines = text.split('\n');
        let lessons = 0;

        for (let line of lines) {
            line = line.trim();
            if (!line) continue;

            if (line.includes('->')) {
                const [input, output] = line.split('->').map(s => s.trim());
                this._teachPair(input, output);
                lessons++;
            } else if (line.includes(' is ') && !line.includes('->')) {
                const parts = line.split(' is ');
                const concept = parts[0].trim().toLowerCase();
                const definition = parts.slice(1).join(' is ').trim();
                this._teachDefinition(concept, definition);
                lessons++;
            } else if (line.toLowerCase().startsWith('if ') && line.includes(' then ')) {
                const condition = line.replace(/^if\s+/i, '').split(' then ')[0].trim();
                const result = line.split(' then ')[1].trim();
                this._teachConditional(condition, result);
                lessons++;
            } else if (line.includes(' means ')) {
                const [word, meaning] = line.split(' means ').map(s => s.trim());
                this._teachDefinition(word.toLowerCase(), meaning);
                lessons++;
            } else {
                this._teachSentence(line);
                lessons++;
            }
        }

        this.save();
        return { lessons, stats: this.getStats() };
    }

    _teachPair(input, output) {
        const key = input.toLowerCase().trim();
        if (!this.pipes[key]) this.pipes[key] = [];
        if (!this.pipes[key].includes(output)) {
            this.pipes[key].push(output);
        }

        const words = key.split(/\s+/);
        for (let word of words) {
            if (word.length < 2) continue;
            if (!this.fragments[word]) this.fragments[word] = [];
            if (!this.fragments[word].includes(output)) {
                this.fragments[word].push(output);
            }
        }

        this._connectWords(words);
        this._detectPatternFromPair(key, output);
    }

    _teachDefinition(concept, definition) {
        if (!this.pipes[concept]) this.pipes[concept] = [];
        if (!this.pipes[concept].includes(definition)) {
            this.pipes[concept].push(definition);
        }

        this.patterns[concept] = {
            type: 'definition',
            value: definition,
            confidence: 0.6,
            examples: 1
        };

        const defWords = definition.split(/\s+/);
        for (let word of defWords) {
            if (word.length < 2) continue;
            if (!this.fragments[word]) this.fragments[word] = [];
            const combined = `${concept} is ${definition}`;
            if (!this.fragments[word].includes(combined)) {
                this.fragments[word].push(combined);
            }
        }
    }

    _teachConditional(condition, result) {
        const key = condition.toLowerCase().trim();
        if (!this.pipes[key]) this.pipes[key] = [];
        if (!this.pipes[key].includes(result)) {
            this.pipes[key].push(result);
        }

        this.patterns[key] = {
            type: 'conditional',
            value: result,
            confidence: 0.6,
            examples: 1
        };
    }

    _teachSentence(sentence) {
        const words = sentence.toLowerCase().split(/\s+/);
        for (let word of words) {
            if (word.length < 3) continue;
            if (!this.fragments[word]) this.fragments[word] = [];
            if (!this.fragments[word].includes(sentence)) {
                this.fragments[word].push(sentence);
            }
        }
        this._connectWords(words);
    }

    _connectWords(words) {
        for (let i = 0; i < words.length; i++) {
            for (let j = i + 1; j < words.length; j++) {
                if (words[i].length < 3 || words[j].length < 3) continue;
                const exists = this.connections.find(c =>
                    (c.from === words[i] && c.to === words[j]) ||
                    (c.from === words[j] && c.to === words[i])
                );
                if (exists) {
                    exists.strength += 1;
                } else {
                    this.connections.push({
                        from: words[i],
                        to: words[j],
                        strength: 1
                    });
                }
            }
        }
    }

    _detectPatternFromPair(input, output) {
        // Detect question patterns
        if (input.startsWith('what is ') || input.startsWith('who is ') || input.startsWith('where is ')) {
            const type = input.split(' ')[0] + ' ' + input.split(' ')[1];
            if (!this.patterns[type]) {
                this.patterns[type] = {
                    type: 'question_pattern',
                    template: input,
                    response: output,
                    confidence: 0.3,
                    examples: 1
                };
            }
        }

        // Detect greeting patterns
        const greetingWords = ['hello', 'hi', 'hey', 'yo', 'sup', 'howdy', 'greetings'];
        if (greetingWords.some(g => input.includes(g)) && input.split(' ').length <= 2) {
            if (!this.patterns['greeting']) {
                this.patterns['greeting'] = {
                    type: 'greeting',
                    responses: [output],
                    confidence: 0.5,
                    examples: 1
                };
            } else if (!this.patterns['greeting'].responses.includes(output)) {
                this.patterns['greeting'].responses.push(output);
                this.patterns['greeting'].examples += 1;
                this.patterns['greeting'].confidence = Math.min(1, this.patterns['greeting'].confidence + 0.1);
            }
        }
    }

    teachFile(fileName, fileType, category) {
        const key = fileName.toLowerCase();
        if (!this.pipes[key]) this.pipes[key] = [];
        const entry = `[${category}: ${fileName}]`;
        if (!this.pipes[key].includes(entry)) {
            this.pipes[key].push(entry);
        }
        this.save();
    }

    // ═══════════ ASKING ═══════════

    ask(question) {
        const normalized = question.toLowerCase().trim();
        const words = normalized.split(/\s+/);

        // Store in context
        this.context.push({ question: normalized, time: Date.now() });
        if (this.context.length > 20) this.context.shift();

        // 1. Exact match
        if (this.pipes[normalized]) {
            const responses = this.pipes[normalized];
            const pick = responses[Math.floor(Math.random() * responses.length)];
            return { answer: pick, confidence: 0.9, source: 'exact_match' };
        }

        // 2. Pattern match
        const patternMatch = this._matchPattern(normalized, words);
        if (patternMatch) return patternMatch;

        // 3. Fragment combination
        const fragmentAnswer = this._generateFromFragments(words);
        if (fragmentAnswer) return fragmentAnswer;

        // 4. Connection hint
        const connectionHint = this._findConnections(words);
        if (connectionHint) return connectionHint;

        // 5. Nothing
        return {
            answer: null,
            confidence: 0,
            source: 'no_knowledge',
            message: this._generateDontKnow()
        };
    }

    _matchPattern(normalized, words) {
        // Check definition patterns
        for (let word of words) {
            if (this.patterns[word] && this.patterns[word].type === 'definition') {
                return {
                    answer: this.patterns[word].value,
                    confidence: this.patterns[word].confidence,
                    source: 'definition_pattern'
                };
            }
            if (this.patterns[word] && this.patterns[word].type === 'conditional') {
                return {
                    answer: this.patterns[word].value,
                    confidence: this.patterns[word].confidence,
                    source: 'conditional_pattern'
                };
            }
        }

        // Check greeting pattern
        const greetingWords = ['hello', 'hi', 'hey', 'yo', 'sup', 'howdy'];
        if (words.some(w => greetingWords.includes(w)) && words.length <= 3) {
            if (this.patterns['greeting'] && this.patterns['greeting'].responses) {
                const pick = this.patterns['greeting'].responses[
                    Math.floor(Math.random() * this.patterns['greeting'].responses.length)
                ];
                return {
                    answer: pick,
                    confidence: this.patterns['greeting'].confidence,
                    source: 'greeting_pattern'
                };
            }
        }

        // Check question patterns
        if (normalized.startsWith('what is ') || normalized.startsWith('who is ')) {
            const subject = normalized.replace(/^(what|who) is\s+/, '').trim();
            if (this.pipes[subject]) {
                return {
                    answer: this.pipes[subject][Math.floor(Math.random() * this.pipes[subject].length)],
                    confidence: 0.7,
                    source: 'question_decomposition'
                };
            }
        }

        return null;
    }

    _generateFromFragments(words) {
        const foundOutputs = [];
        const scoredOutputs = {};

        for (let word of words) {
            if (word.length < 2) continue;
            if (this.fragments[word]) {
                for (let output of this.fragments[word]) {
                    if (!scoredOutputs[output]) scoredOutputs[output] = 0;
                    scoredOutputs[output] += 1;
                }
            }
        }

        const sorted = Object.entries(scoredOutputs).sort((a, b) => b[1] - a[1]);

        if (sorted.length === 0) return null;

        // Pick from top 3
        const top = sorted.slice(0, Math.min(3, sorted.length));
        const pick = top[Math.floor(Math.random() * top.length)];

        return {
            answer: pick[0],
            confidence: Math.min(0.7, pick[1] / 5),
            source: 'fragment_combination'
        };
    }

    _findConnections(words) {
        for (let word of words) {
            if (word.length < 3) continue;
            const related = this.connections.filter(c => c.from === word || c.to === word);
            if (related.length > 0) {
                related.sort((a, b) => b.strength - a.strength);
                const top = related.slice(0, 3).map(r => r.from === word ? r.to : r.from);
                return {
                    answer: `I don't know exactly, but it might connect to: ${top.join(', ')}. Teach me more.`,
                    confidence: 0.15,
                    source: 'connection_hint'
                };
            }
        }
        return null;
    }

    _generateDontKnow() {
        const options = [
            "Don't know that yet. Teach me.",
            "Blank on that. What's the answer?",
            "Haven't learned that. Tell me.",
            "Not in my brain yet. Drop the knowledge.",
            "I'm drawing a blank. Teach me that."
        ];
        return options[Math.floor(Math.random() * options.length)];
    }

    // ═══════════ FEEDBACK ═══════════

    feedback(concept, vote, pipeId) {
        if (!concept) return { adjusted: false };

        const key = concept.toLowerCase().trim();

        if (this.patterns[key]) {
            if (vote === 'up') {
                this.patterns[key].confidence = Math.min(1, this.patterns[key].confidence + 0.1);
            } else {
                this.patterns[key].confidence = Math.max(0, this.patterns[key].confidence - 0.2);
                if (this.patterns[key].confidence <= 0.1) {
                    delete this.patterns[key];
                }
            }
            this.save();
            return { adjusted: true };
        }

        if (this.pipes[key]) {
            if (vote === 'down') {
                delete this.pipes[key];
                this.save();
            }
            return { adjusted: true };
        }

        return { adjusted: false };
    }

    correct(question, correctAnswer) {
        const key = question.toLowerCase().trim();
        this.pipes[key] = [correctAnswer];

        const words = key.split(/\s+/);
        for (let word of words) {
            if (word.length < 2) continue;
            if (!this.fragments[word]) this.fragments[word] = [];
            if (!this.fragments[word].includes(correctAnswer)) {
                this.fragments[word].push(correctAnswer);
            }
        }

        this.save();
    }

    // ═══════════ STORAGE ═══════════

    getStats() {
        return {
            totalPipes: Object.keys(this.pipes).length,
            totalFragments: Object.keys(this.fragments).length,
            totalPatterns: Object.keys(this.patterns).length,
            totalConnections: this.connections.length,
            contextLength: this.context.length,
            brainSize: this._getBrainSize()
        };
    }

    _getBrainSize() {
        const data = JSON.stringify({
            pipes: this.pipes,
            fragments: this.fragments,
            patterns: this.patterns,
            connections: this.connections
        });
        const bytes = Buffer.byteLength(data, 'utf8');
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    export() {
        return {
            pipes: this.pipes,
            fragments: this.fragments,
            patterns: this.patterns,
            connections: this.connections,
            personality: this.personality,
            exported: new Date().toISOString(),
            version: '2.0'
        };
    }

    import(data) {
        if (data.pipes) this.pipes = data.pipes;
        if (data.fragments) this.fragments = data.fragments;
        if (data.patterns) this.patterns = data.patterns;
        if (data.connections) this.connections = data.connections;
        if (data.personality) this.personality = data.personality;
        this.save();
    }

    reset() {
        this.pipes = {};
        this.fragments = {};
        this.patterns = {};
        this.connections = [];
        this.context = [];
        this.save();
    }

    save() {
        const data = {
            pipes: this.pipes,
            fragments: this.fragments,
            patterns: this.patterns,
            connections: this.connections,
            personality: this.personality,
            context: this.context.slice(-10),
            lastSaved: new Date().toISOString(),
            version: '2.0'
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
                this.context = data.context || [];
                this.personality = data.personality || this.personality;
            }
        } catch (e) {
            console.log('Fresh brain. Ready to learn.');
        }
    }
}

module.exports = BiBrain;
