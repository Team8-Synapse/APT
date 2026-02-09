const studentController = require('../../../controllers/studentController');
const StudentProfile = require('../../../models/StudentProfile');

// Mock StudentProfile model
jest.mock('../../../models/StudentProfile');

const mockRequest = (user, body) => ({
    user,
    body
});

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
};

describe('Student Controller Test', () => {
    let req, res;

    beforeEach(() => {
        res = mockResponse();
        jest.clearAllMocks();
    });

    describe('getProfile', () => {
        it('should return profile if found', async () => {
            req = mockRequest({ _id: 'userId' });
            const mockProfile = { firstName: 'Test', rollNumber: '123' };

            StudentProfile.findOne.mockResolvedValue(mockProfile);

            await studentController.getProfile(req, res);

            expect(StudentProfile.findOne).toHaveBeenCalledWith({ userId: 'userId' });
            expect(res.send).toHaveBeenCalledWith(mockProfile);
        });

        it('should return 404 if profile not found', async () => {
            req = mockRequest({ _id: 'userId' });
            StudentProfile.findOne.mockResolvedValue(null);

            await studentController.getProfile(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ error: 'Profile not found' }));
        });

        it('should return 500 on error', async () => {
            req = mockRequest({ _id: 'userId' });
            StudentProfile.findOne.mockRejectedValue(new Error('DB Error'));

            await studentController.getProfile(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('upsertProfile', () => {
        it('should create or update profile successfully', async () => {
            req = mockRequest({ _id: 'userId' }, { firstName: 'Updated' });
            const mockProfile = { firstName: 'Updated', userId: 'userId' };

            StudentProfile.findOneAndUpdate.mockResolvedValue(mockProfile);

            await studentController.upsertProfile(req, res);

            expect(StudentProfile.findOneAndUpdate).toHaveBeenCalledWith(
                { userId: 'userId' },
                expect.objectContaining({ firstName: 'Updated', userId: 'userId' }),
                expect.objectContaining({ new: true, upsert: true })
            );
            expect(res.send).toHaveBeenCalledWith(mockProfile);
        });

        it('should return 400 on error', async () => {
            req = mockRequest({ _id: 'userId' }, {});
            StudentProfile.findOneAndUpdate.mockRejectedValue(new Error('Validation Error'));

            await studentController.upsertProfile(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('getEligibility', () => {
        it('should calculate eligibility correctly (Eligible)', async () => {
            req = mockRequest({ _id: 'userId' });
            const mockProfile = { cgpa: 8.5, backlogs: 0 };
            StudentProfile.findOne.mockResolvedValue(mockProfile);

            await studentController.getEligibility(req, res);

            expect(res.send).toHaveBeenCalledWith({ isEligible: true, cgpa: 8.5, backlogs: 0 });
        });

        it('should calculate eligibility correctly (Not Eligible due to CGPA)', async () => {
            req = mockRequest({ _id: 'userId' });
            const mockProfile = { cgpa: 5.5, backlogs: 0 };
            StudentProfile.findOne.mockResolvedValue(mockProfile);

            await studentController.getEligibility(req, res);

            expect(res.send).toHaveBeenCalledWith({ isEligible: false, cgpa: 5.5, backlogs: 0 });
        });

        it('should calculate eligibility correctly (Not Eligible due to Backlogs)', async () => {
            req = mockRequest({ _id: 'userId' });
            const mockProfile = { cgpa: 8.5, backlogs: 1 };
            StudentProfile.findOne.mockResolvedValue(mockProfile);

            await studentController.getEligibility(req, res);

            expect(res.send).toHaveBeenCalledWith({ isEligible: false, cgpa: 8.5, backlogs: 1 });
        });

        it('should return 404 if profile not found', async () => {
            req = mockRequest({ _id: 'userId' });
            StudentProfile.findOne.mockResolvedValue(null);

            await studentController.getEligibility(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });
});
