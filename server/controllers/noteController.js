const Note = require('../models/Note');

exports.getNotes = async (req, res) => {
    try {
        const notes = await Note.find({ studentId: req.user._id }).sort({ createdAt: -1 });
        res.send(notes);
    } catch (e) {
        res.status(500).send(e);
    }
};

exports.addNote = async (req, res) => {
    try {
        const note = new Note({
            ...req.body,
            studentId: req.user._id
        });
        await note.save();
        res.status(201).send(note);
    } catch (e) {
        res.status(400).send(e);
    }
};

exports.updateNote = async (req, res) => {
    try {
        const note = await Note.findOneAndUpdate(
            { _id: req.params.id, studentId: req.user._id },
            req.body,
            { new: true }
        );
        if (!note) return res.status(404).send();
        res.send(note);
    } catch (e) {
        res.status(400).send(e);
    }
};

exports.deleteNote = async (req, res) => {
    try {
        const note = await Note.findOneAndDelete({ _id: req.params.id, studentId: req.user._id });
        if (!note) return res.status(404).send();
        res.send(note);
    } catch (e) {
        res.status(500).send(e);
    }
};
