const notificationController = require('../../../controllers/notificationController');
const Notification = require('../../../models/Notification');

// Mock Notification
jest.mock('../../../models/Notification');

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

describe('Notification Controller Test', () => {
    let req, res;

    beforeEach(() => {
        res = mockResponse();
        jest.clearAllMocks();
    });

    describe('getNotifications', () => {
        it('should return notifications', async () => {
            req = mockRequest({ _id: 'userId', role: 'student' });
            const mockNotifs = [{ title: 'Alert' }];
            const limitMock = jest.fn().mockResolvedValue(mockNotifs);
            const sortMock = jest.fn().mockReturnValue({ limit: limitMock });
            Notification.find.mockReturnValue({ sort: sortMock });

            await notificationController.getNotifications(req, res);

            expect(Notification.find).toHaveBeenCalled();
            expect(res.send).toHaveBeenCalledWith(mockNotifs);
        });
    });

    describe('markAsRead', () => {
        it('should mark notification as read', async () => {
            req = mockRequest({ _id: 'userId' }, {}, { id: 'notifId' });
            const mockNotif = { _id: 'notifId', isRead: true };

            Notification.findOneAndUpdate.mockResolvedValue(mockNotif);

            await notificationController.markAsRead(req, res);

            expect(Notification.findOneAndUpdate).toHaveBeenCalledWith(
                { _id: 'notifId', userId: 'userId' },
                { isRead: true },
                { new: true }
            );
            expect(res.send).toHaveBeenCalledWith(mockNotif);
        });
    });

    describe('createNotification', () => {
        it('should create notification', async () => {
            req = mockRequest(null, { title: 'New Alert' });
            const saveMock = jest.fn().mockResolvedValue(true);

            Notification.mockImplementation((data) => ({
                ...data,
                save: saveMock
            }));

            await notificationController.createNotification(req, res);

            expect(saveMock).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
        });
    });
});
