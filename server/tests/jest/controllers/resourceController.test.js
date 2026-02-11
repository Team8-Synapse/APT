const resourceController = require('../../../controllers/resourceController');
const Resource = require('../../../models/Resource');
const supabaseService = require('../../../services/supabaseService');

// Mock dependencies
jest.mock('../../../models/Resource');
jest.mock('../../../services/supabaseService');

const mockRequest = (user, body, params, query, file) => ({
    user,
    body,
    params,
    query,
    file
});

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
};

describe('Resource Controller Test', () => {
    let req, res;

    beforeEach(() => {
        res = mockResponse();
        jest.clearAllMocks();
    });

    describe('getResources', () => {
        it('should return resources with filters', async () => {
            req = mockRequest(null, {}, {}, { category: 'Coding', company: 'Google' });
            const mockResources = [{ title: 'Resource' }];
            const populateMock = jest.fn().mockResolvedValue(mockResources);
            Resource.find.mockReturnValue({ populate: populateMock });

            await resourceController.getResources(req, res);

            expect(Resource.find).toHaveBeenCalledWith({
                category: 'Coding',
                company: { $regex: 'Google', $options: 'i' }
            });
            expect(res.send).toHaveBeenCalledWith(mockResources);
        });
    });

    describe('addResource', () => {
        it('should add resource with file upload', async () => {
            const file = { buffer: Buffer.from('test'), originalname: 'test.pdf', mimetype: 'application/pdf' };
            req = mockRequest({ _id: 'userId' }, { title: 'New Resource', tags: '["JS", "React"]' }, {}, {}, file);

            supabaseService.uploadFile.mockResolvedValue({ url: 'http://supabase.co/file.pdf' });

            const saveMock = jest.fn().mockResolvedValue(true);
            Resource.mockImplementation((data) => ({
                ...data,
                save: saveMock
            }));

            await resourceController.addResource(req, res);

            expect(supabaseService.uploadFile).toHaveBeenCalled();
            expect(saveMock).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            // Verify content of the created resource
            const createdResource = Resource.mock.calls[0][0];
            expect(createdResource.links).toContain('http://supabase.co/file.pdf');
            expect(createdResource.tags).toEqual(['JS', 'React']);
        });

        it('should handle upload error', async () => {
            const file = { buffer: Buffer.from('test'), originalname: 'test.pdf', mimetype: 'application/pdf' };
            req = mockRequest({ _id: 'userId' }, {}, {}, {}, file);

            supabaseService.uploadFile.mockResolvedValue({ error: new Error('Upload Failed') });

            await resourceController.addResource(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('deleteResource', () => {
        it('should delete resource and associated file', async () => {
            req = mockRequest({}, {}, { id: 'resId' });
            const mockResource = {
                _id: 'resId',
                links: ['http://supabase.co/file.pdf']
            };

            Resource.findByIdAndDelete.mockResolvedValue(mockResource);

            await resourceController.deleteResource(req, res);

            expect(Resource.findByIdAndDelete).toHaveBeenCalledWith('resId');
            expect(supabaseService.deleteFile).toHaveBeenCalledWith('http://supabase.co/file.pdf');
            expect(res.send).toHaveBeenCalledWith(mockResource);
        });
    });
});
