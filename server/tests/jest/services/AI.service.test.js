const aiService = require('../../../services/AI.service');
const PlacementDrive = require('../../../models/PlacementDrive');

// Mock PlacementDrive
jest.mock('../../../models/PlacementDrive');

describe('AI Service Test', () => {

    describe('calculateReadinessScore', () => {
        it('should calculate score correctly', () => {
            const profile = {
                cgpa: 9.0, // 36 points
                skills: new Array(5).fill({ name: 'Skill' }), // 40 points (capped)
                backlogs: 0
            };

            const score = aiService.calculateReadinessScore(profile);
            // 36 + 40 = 76
            expect(score).toBe(76);
        });

        it('should penalize backlogs', () => {
            const profile = {
                cgpa: 8.0, // 32 points
                skills: [], // 0
                backlogs: 1 // -20
            };
            const score = aiService.calculateReadinessScore(profile);
            // 32 - 20 = 12
            expect(score).toBe(12);
        });
    });

    describe('getRecommendations', () => {
        it('should return matched drives', async () => {
            const profile = { cgpa: 8.5, backlogs: 0, skills: [{ name: 'React' }] };
            const mockDrives = [
                {
                    companyName: 'TechCorp',
                    eligibility: { minCgpa: 7.0 },
                    requirements: ['React']
                }
            ];

            PlacementDrive.find.mockResolvedValue(mockDrives);

            const recs = await aiService.getRecommendations(profile);

            expect(recs).toHaveLength(1);
            expect(recs[0].company).toBe('TechCorp');
            expect(recs[0].matchProbability).toBeGreaterThan(60); // 60 base + 20 skill + 10 cgpa
        });
    });
});
