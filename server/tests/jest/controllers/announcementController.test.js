const announcementController = require('../../../controllers/announcementController');
const Announcement = require('../../../models/Announcement');

// Mock Announcement model
jest.mock('../../../models/Announcement');

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

describe('Announcement Controller Test', () => {
    let req, res;

    beforeEach(() => {
        res = mockResponse();
        jest.clearAllMocks();
    });

    describe('getAnnouncements', () => {
        it('should return announcements sorted by date', async () => {
            const mockAnnouncements = [{ title: 'News' }];
            const sortMock = jest.fn().mockResolvedValue(mockAnnouncements);
            Announcement.find.mockReturnValue({ sort: sortMock });

            await announcementController.getAnnouncements(req, res);

            expect(Announcement.find).toHaveBeenCalled();
            expect(sortMock).toHaveBeenCalledWith({ createdAt: -1 });
            expect(res.send).toHaveBeenCalledWith(mockAnnouncements);
        });
    });

    describe('addAnnouncement', () => {
        it('should add announcement successfully', async () => {
            req = mockRequest({ _id: 'userId' }, { title: 'New News' });
            const saveMock = jest.fn().mockResolvedValue(true);

            Announcement.mockImplementation((data) => ({
                ...data,
                save: saveMock
            }));

            await announcementController.addAnnouncement(req, res);

            expect(saveMock).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
        });
    });

    describe('deleteAnnouncement', () => {
        it('should delete announcement successfully', async () => {
            req = mockRequest({}, {}, { id: 'newsId' });
            Announcement.findByIdAndDelete.mockResolvedValue({ _id: 'newsId' });

            await announcementController.deleteAnnouncement(req, res);

            expect(Announcement.findByIdAndDelete).toHaveBeenCalledWith('newsId');
            expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ _id: 'newsId' }));
        });

        it('should return 404 if not found', async () => {
            req = mockRequest({}, {}, { id: 'newsId' });
            Announcement.findByIdAndDelete.mockResolvedValue(null);

            await announcementController.deleteAnnouncement(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });
});
