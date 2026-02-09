const eventController = require('../../../controllers/eventController');
const Event = require('../../../models/Event');

// Mock Event model
jest.mock('../../../models/Event');

const mockRequest = (user, body, params) => ({
    user,
    body,
    params
});

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('Event Controller Test', () => {
    let req, res;

    beforeEach(() => {
        res = mockResponse();
        jest.clearAllMocks();
    });

    describe('getEvents', () => {
        it('should return all events sorted by date', async () => {
            const mockEvents = [{ title: 'Event 1' }];
            const sortMock = jest.fn().mockResolvedValue(mockEvents);
            Event.find.mockReturnValue({ sort: sortMock });

            await eventController.getEvents(req, res);

            expect(Event.find).toHaveBeenCalled();
            expect(sortMock).toHaveBeenCalledWith({ date: 1 });
            expect(res.json).toHaveBeenCalledWith(mockEvents);
        });

        it('should handle errors', async () => {
            Event.find.mockImplementation(() => { throw new Error('DB Error'); });
            await eventController.getEvents(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('addEvent', () => {
        it('should add event successfully', async () => {
            req = mockRequest({ id: 'userId' }, { title: 'New Event' });
            const saveMock = jest.fn().mockResolvedValue(true);

            Event.mockImplementation((data) => ({
                ...data,
                save: saveMock
            }));

            await eventController.addEvent(req, res);

            expect(saveMock).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ title: 'New Event' }));
        });
    });

    describe('deleteEvent', () => {
        it('should delete event successfully', async () => {
            req = mockRequest({}, {}, { id: 'eventId' });
            Event.findByIdAndDelete.mockResolvedValue({ _id: 'eventId' });

            await eventController.deleteEvent(req, res);

            expect(Event.findByIdAndDelete).toHaveBeenCalledWith('eventId');
            expect(res.json).toHaveBeenCalledWith({ message: 'Event deleted' });
        });
    });
});
