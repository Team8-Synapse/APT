const otpController = require('../../../controllers/otpController');
const emailService = require('../../../services/emailService');

// Mock emailService
jest.mock('../../../services/emailService');

const mockRequest = (body) => ({
    body
});

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('OTP Controller Test', () => {
    let req, res;

    beforeEach(() => {
        res = mockResponse();
        jest.clearAllMocks();
    });

    describe('sendOTP', () => {
        it('should send OTP successfully for valid email', async () => {
            req = mockRequest({ email: 'student@students.amrita.edu' });

            emailService.sendOTP.mockResolvedValue({
                success: true,
                message: 'OTP sent successfully',
                username: 'STUDENT',
                previewUrl: 'http://url'
            });

            await otpController.sendOTP(req, res);

            expect(emailService.sendOTP).toHaveBeenCalledWith('student@students.amrita.edu');
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: true
            }));
        });

        it('should return 400 for invalid email domain', async () => {
            req = mockRequest({ email: 'hacker@gmail.com' });

            await otpController.sendOTP(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                error: expect.stringContaining('valid Amrita institutional email')
            }));
            expect(emailService.sendOTP).not.toHaveBeenCalled();
        });

        it('should return 400 if email is missing', async () => {
            req = mockRequest({});

            await otpController.sendOTP(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('verifyOTP', () => {
        it('should verify OTP successfully', async () => {
            req = mockRequest({ email: 'student@amrita.edu', otp: '123456' });

            emailService.verifyOTP.mockReturnValue({
                valid: true,
                username: 'STUDENT'
            });

            await otpController.verifyOTP(req, res);

            expect(emailService.verifyOTP).toHaveBeenCalledWith('student@amrita.edu', '123456');
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: true
            }));
        });

        it('should return 400 for invalid OTP', async () => {
            req = mockRequest({ email: 'student@amrita.edu', otp: '000000' });

            emailService.verifyOTP.mockReturnValue({
                valid: false,
                error: 'Invalid OTP'
            });

            await otpController.verifyOTP(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                error: 'Invalid OTP'
            }));
        });
    });
});
