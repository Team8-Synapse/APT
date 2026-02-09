const alumniController = require('../../../controllers/alumniController');
const Alumni = require('../../../models/Alumni');
const AlumniInsight = require('../../../models/AlumniInsight');

// Mock dependencies
jest.mock('../../../models/Alumni');
jest.mock('../../../models/AlumniInsight');

const mockRequest = (user, body, params, query) => ({
    user,
    body,
    params,
    query
});

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('Alumni Controller Test', () => {
    let req, res;

    beforeEach(() => {
        res = mockResponse();
        jest.clearAllMocks();
    });

    describe('getInsights', () => {
        it('should return insights', async () => {
            req = mockRequest(null, {}, {}, { company: 'Google' });
            const mockInsights = [{ company: 'Google' }];
            AlumniInsight.find.mockResolvedValue(mockInsights);

            await alumniController.getInsights(req, res);

            expect(AlumniInsight.find).toHaveBeenCalledWith({
                company: { $regex: 'Google', $options: 'i' }
            });
            expect(res.send).toHaveBeenCalledWith(mockInsights);
        });
    });

    describe('addInsight', () => {
        it('should add insight successfully', async () => {
            req = mockRequest(null, { company: 'Amazon' });
            const saveMock = jest.fn().mockResolvedValue(true);

            AlumniInsight.mockImplementation((data) => ({
                ...data,
                save: saveMock
            }));

            await alumniController.addInsight(req, res);

            expect(saveMock).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
        });
    });

    describe('getTopics', () => {
        it('should return distinct topics', async () => {
            req = mockRequest();
            const mockTopics = ['DP', 'Graphs'];
            const distinctMock = jest.fn().mockResolvedValue(mockTopics);
            AlumniInsight.find.mockReturnValue({ distinct: distinctMock });

            await alumniController.getTopics(req, res);

            expect(distinctMock).toHaveBeenCalledWith('rounds.topics');
            expect(res.send).toHaveBeenCalledWith(mockTopics);
        });
    });

    describe('getDirectory', () => {
        it('should return alumni list sorted by batch', async () => {
            req = mockRequest(null, {}, {}, {});
            const mockAlumni = [{ name: 'Test' }];
            const sortMock = jest.fn().mockResolvedValue(mockAlumni);
            Alumni.find.mockReturnValue({ sort: sortMock });

            await alumniController.getDirectory(req, res);

            expect(Alumni.find).toHaveBeenCalled();
            expect(sortMock).toHaveBeenCalledWith({ batch: -1 });
            expect(res.json).toHaveBeenCalledWith(mockAlumni);
        });
    });

    describe('addAlumni', () => {
        it('should add alumni successfully', async () => {
            req = mockRequest(null, { name: 'Alumni 1' });
            const saveMock = jest.fn().mockResolvedValue(true);

            Alumni.mockImplementation((data) => ({
                ...data,
                save: saveMock
            }));

            await alumniController.addAlumni(req, res);

            expect(saveMock).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
        });
    });

    describe('deleteAlumni', () => {
        it('should delete alumni successfully', async () => {
            req = mockRequest({}, {}, { id: 'almId' });
            Alumni.findByIdAndDelete.mockResolvedValue({ _id: 'almId' });

            await alumniController.deleteAlumni(req, res);

            expect(Alumni.findByIdAndDelete).toHaveBeenCalledWith('almId');
            expect(res.json).toHaveBeenCalledWith({ message: 'Alumni deleted' });
        });

        it('should return 404 if not found', async () => {
            req = mockRequest({}, {}, { id: 'almId' });
            Alumni.findByIdAndDelete.mockResolvedValue(null);

            await alumniController.deleteAlumni(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });
});
