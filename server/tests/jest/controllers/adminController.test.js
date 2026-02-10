const adminController = require('../../../controllers/adminController');
const User = require('../../../models/User');
const StudentProfile = require('../../../models/StudentProfile');
const PlacementDrive = require('../../../models/PlacementDrive');
const AlumniInsight = require('../../../models/AlumniInsight');

// Mock all models
jest.mock('../../../models/User');
jest.mock('../../../models/StudentProfile');
jest.mock('../../../models/PlacementDrive');
jest.mock('../../../models/AlumniInsight');

const mockRequest = (body, params) => ({
    body,
    params
});

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
};

describe('Admin Controller Test', () => {
    let req, res;

    beforeEach(() => {
        res = mockResponse();
        jest.clearAllMocks();
    });

    describe('getDashboardStats', () => {
        it('should return stats successfully', async () => {
            User.countDocuments.mockResolvedValue(100);
            PlacementDrive.countDocuments.mockResolvedValue(5);
            AlumniInsight.countDocuments.mockResolvedValue(20);

            const mockDrives = [{ company: 'Test' }];
            const sortMock = jest.fn().mockReturnValue({ limit: jest.fn().mockResolvedValue(mockDrives) });
            PlacementDrive.find.mockReturnValue({ sort: sortMock });

            await adminController.getDashboardStats(req, res);

            expect(User.countDocuments).toHaveBeenCalledWith({ role: 'student' });
            expect(res.send).toHaveBeenCalledWith({
                studentCount: 100,
                driveCount: 5,
                alumniCount: 20,
                recentDrives: mockDrives
            });
        });

        it('should handle errors', async () => {
            User.countDocuments.mockRejectedValue(new Error('DB Error'));
            await adminController.getDashboardStats(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('shortlistStudents', () => {
        it('should shortlist students based on criteria', async () => {
            req = mockRequest({
                minCgpa: 8.0,
                maxBacklogs: 0,
                allowedBatches: ['2025'],
                requiredSkills: ['React']
            });

            const mockStudents = [{ firstName: 'Test' }];
            const populateMock = jest.fn().mockResolvedValue(mockStudents);
            StudentProfile.find.mockReturnValue({ populate: populateMock });

            await adminController.shortlistStudents(req, res);

            // Verify query structure
            const expectedQuery = {
                cgpa: { $gte: 8.0 },
                backlogs: { $lte: 0 },
                batch: { $in: ['2025'] },
                'skills.name': { $all: [expect.any(RegExp)] }
            };

            expect(StudentProfile.find).toHaveBeenCalledWith(expect.objectContaining(expectedQuery));
            expect(res.send).toHaveBeenCalledWith(mockStudents);
        });
    });

    describe('addPlacementDrive', () => {
        it('should add drive successfully', async () => {
            req = mockRequest({ company: 'Google' });
            const saveMock = jest.fn().mockResolvedValue(true);

            PlacementDrive.mockImplementation((data) => ({
                ...data,
                save: saveMock
            }));

            await adminController.addPlacementDrive(req, res);

            expect(saveMock).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
        });
    });

    describe('deleteDrive', () => {
        it('should delete drive successfully', async () => {
            req = mockRequest({}, { id: 'driveId' });
            const mockDrive = { _id: 'driveId' };
            PlacementDrive.findByIdAndDelete.mockResolvedValue(mockDrive);

            await adminController.deleteDrive(req, res);

            expect(PlacementDrive.findByIdAndDelete).toHaveBeenCalledWith('driveId');
            expect(res.send).toHaveBeenCalledWith(mockDrive);
        });

        it('should return 404 if drive not found', async () => {
            req = mockRequest({}, { id: 'driveId' });
            PlacementDrive.findByIdAndDelete.mockResolvedValue(null);

            await adminController.deleteDrive(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });
});
