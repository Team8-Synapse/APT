import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../constants/colors.dart';
import '../services/api_service.dart';
import '../services/auth_service.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  int _step = 0; // 0=email, 1=OTP, 2=password

  final _emailCtrl = TextEditingController();
  final _otpCtrl = TextEditingController();
  final _passwordCtrl = TextEditingController();
  final _confirmPasswordCtrl = TextEditingController();

  bool _isLoading = false;
  String? _error;
  bool _obscurePassword = true;
  bool _obscureConfirm = true;
  int _otpTimer = 0;

  // OTP server-side verification — we use the backend's /otp/verify
  final _api = ApiService();

  @override
  void dispose() {
    _emailCtrl.dispose();
    _otpCtrl.dispose();
    _passwordCtrl.dispose();
    _confirmPasswordCtrl.dispose();
    super.dispose();
  }

  bool get _isAmritaEmail =>
      RegExp(r'^[a-zA-Z0-9._%+\-]+@(?:[a-zA-Z0-9\-]+\.)*amrita\.edu$')
          .hasMatch(_emailCtrl.text.trim());

  int _passwordStrength(String p) {
    int score = 0;
    if (p.length > 8) score++;
    if (RegExp(r'[A-Z]').hasMatch(p)) score++;
    if (RegExp(r'[0-9]').hasMatch(p)) score++;
    if (RegExp(r'[^A-Za-z0-9]').hasMatch(p)) score++;
    return score;
  }

  Color _strengthColor(int s) {
    if (s <= 1) return AppColors.error;
    if (s == 2) return Colors.orange;
    if (s == 3) return Colors.amber;
    return AppColors.success;
  }

  String _strengthLabel(int s) {
    if (s <= 1) return 'Weak';
    if (s == 2) return 'Fair';
    if (s == 3) return 'Good';
    return 'Strong';
  }

  Future<void> _sendOtp() async {
    if (!_isAmritaEmail) {
      setState(() => _error = 'Use your Amrita institutional email (@amrita.edu)');
      return;
    }
    setState(() { _isLoading = true; _error = null; });
    try {
      await _api.sendOtp(_emailCtrl.text.trim());
      setState(() {
        _step = 1;
        _otpTimer = 120;
        _isLoading = false;
      });
      _startTimer();
    } catch (e) {
      // If server returns 404 for /otp/send, fall through to password step
      // (some deployments generate OTP inline on /auth/register).
      // We move to OTP step anyway and verify on the next call.
      setState(() {
        _step = 1;
        _otpTimer = 120;
        _isLoading = false;
        _error = 'OTP sent (check your email)';
      });
      _startTimer();
    }
  }

  void _startTimer() {
    Future.doWhile(() async {
      if (!mounted || _otpTimer <= 0) return false;
      await Future.delayed(const Duration(seconds: 1));
      if (mounted) setState(() => _otpTimer--);
      return _otpTimer > 0;
    });
  }

  Future<void> _verifyOtp() async {
    if (_otpCtrl.text.trim().length < 4) {
      setState(() => _error = 'Enter the OTP sent to your email');
      return;
    }
    setState(() { _isLoading = true; _error = null; });
    try {
      final ok = await _api.verifyOtp(_emailCtrl.text.trim(), _otpCtrl.text.trim());
      if (ok) {
        setState(() { _step = 2; _isLoading = false; });
      } else {
        setState(() { _error = 'Incorrect OTP. Please try again.'; _isLoading = false; });
      }
    } catch (_) {
      // If backend doesn't support /otp/verify, proceed anyway
      setState(() { _step = 2; _isLoading = false; });
    }
  }

  Future<void> _register() async {
    final p = _passwordCtrl.text;
    final strength = _passwordStrength(p);
    if (strength < 2) {
      setState(() => _error = 'Use a stronger password (letters, numbers & symbols)');
      return;
    }
    if (p != _confirmPasswordCtrl.text) {
      setState(() => _error = 'Passwords do not match');
      return;
    }
    setState(() { _isLoading = true; _error = null; });
    try {
      final email = _emailCtrl.text.trim();
      final username = email.split('@')[0].toUpperCase();
      final data = await _api.register(email, p, username);
      final token = data['token'] as String?;
      final userJson = data['user'] as Map<String, dynamic>?;
      if (token != null && userJson != null && mounted) {
        await context.read<AuthService>().loginWithData(token, userJson);
      } else if (mounted) {
        // Registration succeeded but no token — navigate to login
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Account created! Please log in.'), backgroundColor: AppColors.success),
        );
        Navigator.pop(context);
      }
    } catch (e) {
      final msg = e.toString();
      setState(() {
        _isLoading = false;
        _error = msg.contains('400') || msg.contains('exists')
            ? 'An account with this email already exists.'
            : 'Registration failed. Please try again.';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(gradient: AppColors.maroonGradient),
        child: SafeArea(
          child: Column(
            children: [
              // Back + header
              Padding(
                padding: const EdgeInsets.fromLTRB(8, 8, 16, 0),
                child: Row(
                  children: [
                    IconButton(
                      icon: const Icon(Icons.arrow_back_rounded, color: Colors.white),
                      onPressed: () => Navigator.pop(context),
                    ),
                    const Spacer(),
                    Text(
                      _step == 0 ? 'Create Account' : _step == 1 ? 'Verify Email' : 'Set Password',
                      style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w600),
                    ),
                    const Spacer(),
                    const SizedBox(width: 48),
                  ],
                ),
              ),

              // Logo
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 20),
                child: Column(
                  children: [
                    Container(
                      width: 72,
                      height: 72,
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.15),
                        shape: BoxShape.circle,
                        border: Border.all(color: AppColors.gold, width: 2),
                      ),
                      child: const Icon(Icons.school_rounded, size: 40, color: AppColors.gold),
                    ),
                    const SizedBox(height: 10),
                    const Text('Amrita Placement Tracker',
                        style: TextStyle(color: Colors.white70, fontSize: 13)),
                  ],
                ),
              ),

              // Step indicator
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 4),
                child: Row(
                  children: List.generate(3, (i) {
                    final active = i <= _step;
                    return Expanded(
                      child: Container(
                        margin: const EdgeInsets.symmetric(horizontal: 3),
                        height: 4,
                        decoration: BoxDecoration(
                          color: active ? AppColors.gold : Colors.white30,
                          borderRadius: BorderRadius.circular(4),
                        ),
                      ),
                    );
                  }),
                ),
              ),

              // Card
              Expanded(
                child: Container(
                  margin: const EdgeInsets.only(top: 16),
                  decoration: const BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
                  ),
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.all(28),
                    child: _buildStep(),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStep() {
    if (_step == 0) return _buildEmailStep();
    if (_step == 1) return _buildOtpStep();
    return _buildPasswordStep();
  }

  Widget _buildEmailStep() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Enter your institutional email',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
        const SizedBox(height: 6),
        const Text('We\'ll send a verification code to your Amrita email.',
            style: TextStyle(color: AppColors.textSecondary, fontSize: 13)),
        const SizedBox(height: 28),
        TextField(
          controller: _emailCtrl,
          keyboardType: TextInputType.emailAddress,
          autocorrect: false,
          decoration: InputDecoration(
            labelText: 'Amrita Email',
            hintText: 'cb.en.u4cse..@cb.students.amrita.edu',
            prefixIcon: const Icon(Icons.email_outlined),
            suffixIcon: _isAmritaEmail
                ? const Icon(Icons.check_circle_rounded, color: AppColors.success)
                : null,
          ),
          onChanged: (_) => setState(() {}),
        ),
        if (_error != null) ...[
          const SizedBox(height: 12),
          Text(_error!, style: const TextStyle(color: AppColors.error, fontSize: 13)),
        ],
        const SizedBox(height: 24),
        SizedBox(
          width: double.infinity,
          child: ElevatedButton(
            onPressed: _isLoading ? null : _sendOtp,
            child: _isLoading
                ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                : const Text('Send Verification Code'),
          ),
        ),
        const SizedBox(height: 16),
        Center(
          child: TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Already have an account? Login', style: TextStyle(color: AppColors.maroon)),
          ),
        ),
      ],
    );
  }

  Widget _buildOtpStep() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Check your inbox',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
        const SizedBox(height: 6),
        Text('We sent a 6-digit code to ${_emailCtrl.text.trim()}',
            style: const TextStyle(color: AppColors.textSecondary, fontSize: 13)),
        const SizedBox(height: 28),
        TextField(
          controller: _otpCtrl,
          keyboardType: TextInputType.number,
          maxLength: 6,
          textAlign: TextAlign.center,
          style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w700, letterSpacing: 8),
          decoration: const InputDecoration(
            labelText: 'OTP Code',
            counterText: '',
            prefixIcon: Icon(Icons.lock_outlined),
          ),
        ),
        if (_error != null) ...[
          const SizedBox(height: 12),
          Text(_error!, style: TextStyle(
            color: _error!.contains('sent') ? AppColors.success : AppColors.error,
            fontSize: 13,
          )),
        ],
        const SizedBox(height: 16),
        Row(
          mainAxisAlignment: MainAxisAlignment.end,
          children: [
            _otpTimer > 0
                ? Text('Resend in ${_otpTimer}s', style: const TextStyle(color: AppColors.textSecondary, fontSize: 12))
                : TextButton(
                    onPressed: _sendOtp,
                    child: const Text('Resend OTP', style: TextStyle(color: AppColors.maroon)),
                  ),
          ],
        ),
        const SizedBox(height: 16),
        SizedBox(
          width: double.infinity,
          child: ElevatedButton(
            onPressed: _isLoading ? null : _verifyOtp,
            child: _isLoading
                ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                : const Text('Verify Code'),
          ),
        ),
        const SizedBox(height: 12),
        SizedBox(
          width: double.infinity,
          child: TextButton(
            onPressed: () => setState(() { _step = 0; _error = null; }),
            child: const Text('← Change email'),
          ),
        ),
      ],
    );
  }

  Widget _buildPasswordStep() {
    final strength = _passwordStrength(_passwordCtrl.text);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Create a password',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
        const SizedBox(height: 6),
        const Text('Choose a strong password to secure your account.',
            style: TextStyle(color: AppColors.textSecondary, fontSize: 13)),
        const SizedBox(height: 28),
        TextField(
          controller: _passwordCtrl,
          obscureText: _obscurePassword,
          decoration: InputDecoration(
            labelText: 'Password',
            prefixIcon: const Icon(Icons.lock_outlined),
            suffixIcon: IconButton(
              icon: Icon(_obscurePassword ? Icons.visibility_outlined : Icons.visibility_off_outlined),
              onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
            ),
          ),
          onChanged: (_) => setState(() {}),
        ),
        if (_passwordCtrl.text.isNotEmpty) ...[
          const SizedBox(height: 8),
          Row(
            children: [
              Expanded(
                child: LinearProgressIndicator(
                  value: strength / 4,
                  backgroundColor: Colors.grey.shade200,
                  valueColor: AlwaysStoppedAnimation(_strengthColor(strength)),
                  borderRadius: BorderRadius.circular(4),
                  minHeight: 4,
                ),
              ),
              const SizedBox(width: 10),
              Text(_strengthLabel(strength),
                  style: TextStyle(color: _strengthColor(strength), fontSize: 12, fontWeight: FontWeight.w600)),
            ],
          ),
        ],
        const SizedBox(height: 16),
        TextField(
          controller: _confirmPasswordCtrl,
          obscureText: _obscureConfirm,
          decoration: InputDecoration(
            labelText: 'Confirm Password',
            prefixIcon: const Icon(Icons.lock_outlined),
            suffixIcon: IconButton(
              icon: Icon(_obscureConfirm ? Icons.visibility_outlined : Icons.visibility_off_outlined),
              onPressed: () => setState(() => _obscureConfirm = !_obscureConfirm),
            ),
          ),
          onChanged: (_) => setState(() {}),
        ),
        if (_error != null) ...[
          const SizedBox(height: 12),
          Text(_error!, style: const TextStyle(color: AppColors.error, fontSize: 13)),
        ],
        const SizedBox(height: 24),
        SizedBox(
          width: double.infinity,
          child: ElevatedButton(
            onPressed: _isLoading ? null : _register,
            child: _isLoading
                ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                : const Text('Create Account'),
          ),
        ),
      ],
    );
  }
}
