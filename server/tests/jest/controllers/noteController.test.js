const noteController = require('../../../controllers/noteController');
const Note = require('../../../models/Note');

// Mock Note model
jest.mock('../../../models/Note');

const mockRequest = (user, body, params) => ({
    user,
    body,
    params
});

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
};

describe('Note Controller Test', () => {
    let req, res;

    beforeEach(() => {
        res = mockResponse();
        jest.clearAllMocks();
    });

    describe('getNotes', () => {
        it('should return notes for user', async () => {
            req = mockRequest({ _id: 'userId' });
            const mockNotes = [{ title: 'Note 1' }];
            const sortMock = jest.fn().mockResolvedValue(mockNotes);

            Note.find.mockReturnValue({
                sort: sortMock
            });

            await noteController.getNotes(req, res);

            expect(Note.find).toHaveBeenCalledWith({ user: 'userId' });
            expect(sortMock).toHaveBeenCalledWith({ createdAt: -1 });
            expect(res.send).toHaveBeenCalledWith(mockNotes);
        });

        it('should handle errors', async () => {
            req = mockRequest({ _id: 'userId' });
            Note.find.mockImplementation(() => { throw new Error('DB Error'); });

            await noteController.getNotes(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('addNote', () => {
        it('should add a note successfully', async () => {
            req = mockRequest({ _id: 'userId' }, { title: 'New Note' });

            const saveMock = jest.fn().mockResolvedValue(true);
            const mockNoteInstance = { title: 'New Note', user: 'userId', save: saveMock };

            // Mock constructor logic by using mockImplementation on the model (if it's a class/function)
            // or just ensure Note() returns an object.
            Note.mockImplementation((data) => {
                return { ...data, save: saveMock };
            });

            await noteController.addNote(req, res);

            expect(saveMock).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ title: 'New Note', user: 'userId' }));
        });

        it('should handle validation errors', async () => {
            req = mockRequest({ _id: 'userId' }, {});

            Note.mockImplementation(() => ({
                save: jest.fn().mockRejectedValue(new Error('Validation Error'))
            }));

            await noteController.addNote(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('updateNote', () => {
        it('should update note successfully', async () => {
            req = mockRequest({ _id: 'userId' }, { title: 'Updated' }, { id: 'noteId' });
            const mockNote = { _id: 'noteId', title: 'Updated' };

            Note.findOneAndUpdate.mockResolvedValue(mockNote);

            await noteController.updateNote(req, res);

            expect(Note.findOneAndUpdate).toHaveBeenCalledWith(
                { _id: 'noteId', user: 'userId' },
                { title: 'Updated' },
                { new: true }
            );
            expect(res.send).toHaveBeenCalledWith(mockNote);
        });

        it('should return 404 if note not found', async () => {
            req = mockRequest({ _id: 'userId' }, {}, { id: 'noteId' });
            Note.findOneAndUpdate.mockResolvedValue(null);

            await noteController.updateNote(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe('deleteNote', () => {
        it('should delete note successfully', async () => {
            req = mockRequest({ _id: 'userId' }, {}, { id: 'noteId' });
            const mockNote = { _id: 'noteId' };

            Note.findOneAndDelete.mockResolvedValue(mockNote);

            await noteController.deleteNote(req, res);

            expect(Note.findOneAndDelete).toHaveBeenCalledWith({ _id: 'noteId', user: 'userId' });
            expect(res.send).toHaveBeenCalledWith(mockNote);
        });

        it('should return 404 if note not found', async () => {
            req = mockRequest({ _id: 'userId' }, {}, { id: 'noteId' });
            Note.findOneAndDelete.mockResolvedValue(null);

            await noteController.deleteNote(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });
});
