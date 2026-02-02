const mockDB = require('./mockDB');
const bcrypt = require('bcryptjs');

class MockSchema {
    constructor(definition, options) {
        this.definition = definition;
        this.options = options;
        this.preHooks = {};
        this.methods = {};
    }

    pre(hook, fn) {
        this.preHooks[hook] = fn;
    }

    // Stub for index - needed for compound indexes
    index(fields, options) {
        // Mock implementation - just store for reference
        this.indexes = this.indexes || [];
        this.indexes.push({ fields, options });
    }
}

MockSchema.Types = {
    ObjectId: 'ObjectId'
};

class QueryChain {
    constructor(collection, query, modelClass, schema) {
        this.collection = collection;
        this.query = query;
        this.modelClass = modelClass;
        this.schema = schema;
        this._populateFields = [];
        this._sortField = null;
        this._limitVal = null;
        this._skipVal = null;
        this._selectFields = null;
    }

    populate(field) {
        this._populateFields.push(field);
        return this;
    }

    sort(sortField) {
        this._sortField = sortField;
        return this;
    }

    limit(n) {
        this._limitVal = n;
        return this;
    }

    skip(n) {
        this._skipVal = n;
        return this;
    }

    select(fields) {
        this._selectFields = fields;
        return this;
    }

    lean() {
        this._lean = true;
        return this;
    }

    async then(resolve, reject) {
        try {
            const result = await this.exec();
            resolve(result);
        } catch (e) {
            reject(e);
        }
    }

    async exec() {
        let results = await mockDB.find(this.collection, this.query);

        // Apply sort
        if (this._sortField) {
            const sortKey = typeof this._sortField === 'object' ? Object.keys(this._sortField)[0] : this._sortField;
            const sortDir = typeof this._sortField === 'object' ? this._sortField[sortKey] : -1;
            results.sort((a, b) => {
                if (a[sortKey] < b[sortKey]) return sortDir === -1 ? 1 : -1;
                if (a[sortKey] > b[sortKey]) return sortDir === -1 ? -1 : 1;
                return 0;
            });
        }

        // Apply skip
        if (this._skipVal) {
            results = results.slice(this._skipVal);
        }

        // Apply limit
        if (this._limitVal) {
            results = results.slice(0, this._limitVal);
        }

        // Return raw objects if lean
        if (this._lean) {
            return results;
        }

        return results.map(r => {
            const m = new this.modelClass(r);
            Object.assign(m, this.schema.methods);
            return m;
        });
    }
}

function model(modelName, schema) {
    const collectionName = modelName.toLowerCase() + 's';

    class MockModel {
        constructor(obj) {
            Object.assign(this, obj);
            this._isNew = !obj._id;
        }

        isModified(field) {
            return this._isNew;
        }

        toObject() {
            const obj = { ...this };
            delete obj._isNew;
            return obj;
        }

        async save() {
            if (schema.preHooks['save']) {
                await schema.preHooks['save'].call(this);
            }
            const saved = await mockDB.insert(collectionName, this);
            Object.assign(this, saved);
            return this;
        }

        static find(query = {}) {
            return new QueryChain(collectionName, query, MockModel, schema);
        }

        static async findOne(query) {
            const result = await mockDB.findOne(collectionName, query);
            if (!result) return null;
            const m = new MockModel(result);
            Object.assign(m, schema.methods);
            return m;
        }

        static async findById(id) {
            const result = await mockDB.findById(collectionName, id);
            if (!result) return null;
            const m = new MockModel(result);
            Object.assign(m, schema.methods);
            return m;
        }

        static async findByIdAndUpdate(id, updates, options = {}) {
            const result = await mockDB.findByIdAndUpdate(collectionName, id, updates);
            if (!result) return null;
            if (options.new) {
                const m = new MockModel(result);
                Object.assign(m, schema.methods);
                return m;
            }
            return result;
        }

        static async findOneAndUpdate(query, updates, options = {}) {
            const doc = await mockDB.findOne(collectionName, query);
            if (!doc) return null;
            const result = await mockDB.findByIdAndUpdate(collectionName, doc._id, updates);
            if (options.new) {
                const m = new MockModel(result);
                Object.assign(m, schema.methods);
                return m;
            }
            return result;
        }

        static async findByIdAndDelete(id) {
            return await mockDB.findByIdAndDelete(collectionName, id);
        }

        static async deleteMany(query) {
            return await mockDB.deleteMany(collectionName, query);
        }

        static async insertMany(docs) {
            const savedDocs = [];
            for (const doc of docs) {
                savedDocs.push(await mockDB.insert(collectionName, doc));
            }
            return savedDocs;
        }

        static async create(docData) {
            const doc = new MockModel(docData);
            return await doc.save();
        }

        static async countDocuments(query = {}) {
            const results = await mockDB.find(collectionName, query);
            return results.length;
        }

        static async aggregate(pipeline) {
            // Simplified aggregate - handle common operations
            let results = await mockDB.find(collectionName, {});

            for (const stage of pipeline) {
                if (stage.$match) {
                    results = results.filter(doc => {
                        return Object.keys(stage.$match).every(key => {
                            const condition = stage.$match[key];
                            if (condition && typeof condition === 'object') {
                                if (condition.$exists !== undefined) {
                                    return condition.$exists ? doc[key] !== undefined : doc[key] === undefined;
                                }
                                if (condition.$gte !== undefined && doc[key] < condition.$gte) return false;
                                if (condition.$lte !== undefined && doc[key] > condition.$lte) return false;
                                if (condition.$in && !condition.$in.includes(doc[key])) return false;
                            } else {
                                return doc[key] === condition;
                            }
                            return true;
                        });
                    });
                }

                if (stage.$group) {
                    const groups = {};
                    for (const doc of results) {
                        const groupKey = stage.$group._id === null ? 'null' : String(doc[stage.$group._id.replace('$', '')]);
                        if (!groups[groupKey]) {
                            groups[groupKey] = { _id: stage.$group._id === null ? null : groupKey, count: 0, sum: 0, docs: [] };
                        }
                        groups[groupKey].docs.push(doc);
                    }

                    results = Object.values(groups).map(group => {
                        const result = { _id: group._id };
                        for (const [key, op] of Object.entries(stage.$group)) {
                            if (key === '_id') continue;
                            if (op.$sum !== undefined) {
                                result[key] = op.$sum === 1 ? group.docs.length : group.docs.reduce((s, d) => s + (d[op.$sum.replace('$', '')] || 0), 0);
                            }
                            if (op.$avg) {
                                const field = op.$avg.replace('$', '');
                                const vals = group.docs.filter(d => d[field] !== undefined).map(d => d[field]);
                                result[key] = vals.length > 0 ? vals.reduce((s, v) => s + v, 0) / vals.length : 0;
                            }
                            if (op.$max) {
                                const field = op.$max.replace('$', '');
                                const vals = group.docs.filter(d => d[field] !== undefined).map(d => d[field]);
                                result[key] = vals.length > 0 ? Math.max(...vals) : 0;
                            }
                            if (op.$min) {
                                const field = op.$min.replace('$', '');
                                const vals = group.docs.filter(d => d[field] !== undefined).map(d => d[field]);
                                result[key] = vals.length > 0 ? Math.min(...vals) : 0;
                            }
                            if (op.$addToSet) {
                                const field = op.$addToSet.replace('$', '');
                                result[key] = [...new Set(group.docs.map(d => d[field]).filter(v => v !== undefined))];
                            }
                        }
                        return result;
                    });
                }

                if (stage.$sort) {
                    const sortKey = Object.keys(stage.$sort)[0];
                    const sortDir = stage.$sort[sortKey];
                    results.sort((a, b) => {
                        if (a[sortKey] < b[sortKey]) return sortDir === -1 ? 1 : -1;
                        if (a[sortKey] > b[sortKey]) return sortDir === -1 ? -1 : 1;
                        return 0;
                    });
                }
            }

            return results;
        }
    }

    Object.assign(MockModel.prototype, schema.methods);

    return MockModel;
}

module.exports = {
    Schema: MockSchema,
    model: model,
    connect: async () => console.log('Connected to Mock Database'),
};
