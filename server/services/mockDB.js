const fs = require('fs');
const path = require('path');

class MockDB {
    constructor(dbPath) {
        this.dbPath = dbPath;
        this.data = {};
        this.init();
    }

    init() {
        const dir = path.dirname(this.dbPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        if (fs.existsSync(this.dbPath)) {
            try {
                const content = fs.readFileSync(this.dbPath, 'utf8');
                this.data = JSON.parse(content);
            } catch (err) {
                console.error('Error reading DB:', err);
                this.data = {};
            }
        } else {
            this.save();
        }
    }

    save() {
        try {
            fs.writeFileSync(this.dbPath, JSON.stringify(this.data, null, 2));
        } catch (err) {
            console.error('Error saving DB:', err);
        }
    }

    getCollection(name) {
        if (!this.data[name]) {
            this.data[name] = [];
        }
        return this.data[name];
    }

    async find(collectionName, query = {}) {
        let docs = this.getCollection(collectionName);
        return docs.filter(doc => this.matches(doc, query));
    }

    async findOne(collectionName, query = {}) {
        let docs = this.getCollection(collectionName);
        return docs.find(doc => this.matches(doc, query)) || null;
    }

    async findById(collectionName, id) {
        let docs = this.getCollection(collectionName);
        return docs.find(doc => doc._id === id.toString()) || null;
    }

    async insert(collectionName, doc) {
        let docs = this.getCollection(collectionName);
        const newDoc = {
            ...doc,
            _id: doc._id || Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        docs.push(newDoc);
        this.save();
        return newDoc;
    }

    async update(collectionName, query, update) {
        let docs = this.getCollection(collectionName);
        let updatedCount = 0;
        docs.forEach((doc, index) => {
            if (this.matches(doc, query)) {
                // Simplified update logic (doesn't handle $set, etc., just shallow merge)
                docs[index] = { ...doc, ...update, updatedAt: new Date().toISOString() };
                updatedCount++;
            }
        });
        if (updatedCount > 0) this.save();
        return { modifiedCount: updatedCount };
    }

    async deleteMany(collectionName, query) {
        let docs = this.getCollection(collectionName);
        const initialLength = docs.length;
        this.data[collectionName] = docs.filter(doc => !this.matches(doc, query));
        if (this.data[collectionName].length !== initialLength) this.save();
        return { deletedCount: initialLength - this.data[collectionName].length };
    }

    async findByIdAndUpdate(collectionName, id, updates) {
        let docs = this.getCollection(collectionName);
        const index = docs.findIndex(doc => doc._id === id.toString());
        if (index === -1) return null;

        let doc = docs[index];

        // Handle MongoDB update operators
        if (updates.$set) {
            doc = { ...doc, ...updates.$set, updatedAt: new Date().toISOString() };
        } else if (updates.$addToSet) {
            for (const [key, value] of Object.entries(updates.$addToSet)) {
                if (!doc[key]) doc[key] = [];
                if (!doc[key].includes(value)) doc[key].push(value);
            }
            doc.updatedAt = new Date().toISOString();
        } else if (updates.$pull) {
            for (const [key, value] of Object.entries(updates.$pull)) {
                if (doc[key]) {
                    doc[key] = doc[key].filter(v => v !== value);
                }
            }
            doc.updatedAt = new Date().toISOString();
        } else {
            doc = { ...doc, ...updates, updatedAt: new Date().toISOString() };
        }

        docs[index] = doc;
        this.save();
        return doc;
    }

    async findByIdAndDelete(collectionName, id) {
        let docs = this.getCollection(collectionName);
        const index = docs.findIndex(doc => doc._id === id.toString());
        if (index === -1) return null;

        const deleted = docs.splice(index, 1)[0];
        this.save();
        return deleted;
    }


    matches(doc, query) {
        return Object.keys(query).every(key => {
            if (key === '_id' && typeof query[key] === 'object' && query[key] !== null) {
                return doc[key] === query[key].toString();
            }
            return doc[key] === query[key];
        });
    }
}

const db = new MockDB(path.join(__dirname, '../data/db.json'));
module.exports = db;
