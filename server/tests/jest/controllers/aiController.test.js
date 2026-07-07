const aiController = require('../../../controllers/aiController');
const StudentProfile = require('../../../models/StudentProfile');
const aiService = require('../../../services/AI.service');

// Mock dependencies
jest.mock('../../../models/StudentProfile');
jest.mock('../../../services/AI.service');
jest.mock('../../../services/Gemini.service');
const geminiService = require('../../../services/Gemini.service');

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

describe('AI Controller Test', () => {
    let req, res;

    beforeEach(() => {
        res = mockResponse();
        jest.clearAllMocks();
    });

    describe('getInsights', () => {
        it('should return insights and recommendations', async () => {
            req = mockRequest({ _id: 'userId' });
            const mockProfile = { firstName: 'Test' };
            StudentProfile.findOne.mockResolvedValue(mockProfile);
            aiService.calculateReadinessScore.mockReturnValue(80);
            aiService.getRecommendations.mockResolvedValue([{ company: 'Google' }]);
            geminiService.generateContent.mockResolvedValue('Here are some insights');

            await aiController.getInsights(req, res);

            expect(StudentProfile.findOne).toHaveBeenCalledWith({ userId: 'userId' });
            expect(aiService.calculateReadinessScore).toHaveBeenCalledWith(mockProfile);
            expect(aiService.getRecommendations).toHaveBeenCalledWith(mockProfile);
            expect(res.send).toHaveBeenCalledWith(expect.objectContaining({
                readinessScore: 80,
                recommendations: [{ company: 'Google' }]
            }));
        });

        it('should return 404 if profile not found', async () => {
            req = mockRequest({ _id: 'userId' });
            StudentProfile.findOne.mockResolvedValue(null);

            await aiController.getInsights(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe('getChatResponse', () => {
        it('should return generic response', async () => {
            req = mockRequest({ _id: 'userId' }, { message: 'How to prepare?' });
            geminiService.generateContent.mockResolvedValue('Based on your query, here is how to prepare');

            await aiController.getChatResponse(req, res);

            expect(res.send).toHaveBeenCalledWith(expect.objectContaining({
                response: expect.stringContaining('Based on your query')
            }));
        });
    });
});
