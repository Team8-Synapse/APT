const Note = require('../models/Note');

exports.getNotes = async (req, res) => {
    try {
<<<<<<< Updated upstream
        const notes = await Note.find({ studentId: req.user._id }).sort({ createdAt: -1 });
=======
        const notes = await Note.find({ user: req.user._id }).sort({ createdAt: -1 });
>>>>>>> Stashed changes
        res.send(notes);
    } catch (e) {
        res.status(500).send(e);
    }
};

exports.addNote = async (req, res) => {
    try {
        const note = new Note({
            ...req.body,
<<<<<<< Updated upstream
            studentId: req.user._id
=======
            user: req.user._id
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
            { _id: req.params.id, studentId: req.user._id },
=======
            { _id: req.params.id, user: req.user._id },
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
        const note = await Note.findOneAndDelete({ _id: req.params.id, studentId: req.user._id });
=======
        const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });
>>>>>>> Stashed changes
        if (!note) return res.status(404).send();
        res.send(note);
    } catch (e) {
        res.status(500).send(e);
    }
};
