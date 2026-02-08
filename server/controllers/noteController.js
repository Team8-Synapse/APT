const Note = require('../models/Note');

// Get all notes for a student
exports.getNotes = async (req, res) => {
    try {
        const studentId = req.params.studentId || req.user._id;
        const notes = await Note.find({ studentId }).sort({ updatedAt: -1 });
        res.json(notes);
    } catch (error) {
        console.error('Get Notes Error:', error);
        res.status(500).json({ message: 'Error fetching notes', error: error.message });
    }
};

// Create a new note
exports.addNote = async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }

        const note = new Note({
            studentId: req.user._id,
            title,
            content: content || '',
        });

        await note.save();
        res.status(201).json(note);
    } catch (error) {
        console.error('Add Note Error:', error);
        res.status(400).json({ message: 'Error creating note', error: error.message });
    }
};

// Update a note
exports.updateNote = async (req, res) => {
    try {
        const { title, content } = req.body;
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        if (note.studentId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this note' });
        }

        if (title !== undefined) note.title = title;
        if (content !== undefined) note.content = content;

        await note.save();
        res.json(note);
    } catch (error) {
        console.error('Update Note Error:', error);
        res.status(400).json({ message: 'Error updating note', error: error.message });
    }
};

// Delete a note
exports.deleteNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        if (note.studentId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this note' });
        }

        await Note.findByIdAndDelete(note._id);
        res.json({ message: 'Note deleted successfully' });
    } catch (error) {
        console.error('Delete Note Error:', error);
        res.status(500).json({ message: 'Error deleting note', error: error.message });
    }
};
