import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../models/user.dart';
import 'api_service.dart';

class AuthService extends ChangeNotifier {
  static const _tokenKey = 'auth_token';
  static const _userKey = 'user_email';
  static const _roleKey = 'user_role';
  static const _nameKey = 'user_name';
  static const _userIdKey = 'user_id';

  final _storage = const FlutterSecureStorage();
  final _api = ApiService();

  UserModel? _user;
  bool _isLoading = true;

  UserModel? get user => _user;
  bool get isLoggedIn => _user != null;
  bool get isLoading => _isLoading;

  AuthService() {
    _restoreSession();
  }

  Future<void> _restoreSession() async {
    try {
      final token = await _storage.read(key: _tokenKey);
      if (token != null) {
        final email = await _storage.read(key: _userKey) ?? '';
        final role = await _storage.read(key: _roleKey) ?? 'student';
        final name = await _storage.read(key: _nameKey);
        final id = await _storage.read(key: _userIdKey) ?? '';
        _api.setToken(token);
        _user = UserModel(id: id, email: email, role: role, name: name);
      }
    } catch (_) {
      // Session restore failed — user needs to log in again
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<String?> login(String email, String password) async {
    try {
      final data = await _api.login(email, password);
      final token = data['token'] as String?;
      final userJson = data['user'] as Map<String, dynamic>?;

      if (token == null || userJson == null) {
        return 'Invalid response from server';
      }

      _user = UserModel.fromJson(userJson);
      _api.setToken(token);

      await _storage.write(key: _tokenKey, value: token);
      await _storage.write(key: _userKey, value: _user!.email);
      await _storage.write(key: _roleKey, value: _user!.role);
      await _storage.write(key: _userIdKey, value: _user!.id);
      if (_user!.name != null) {
        await _storage.write(key: _nameKey, value: _user!.name!);
      }

      notifyListeners();
      return null; // null = success
    } catch (e) {
      final msg = e.toString();
      if (msg.contains('401') || msg.contains('Invalid')) {
        return 'Invalid email or password';
      } else if (msg.contains('SocketException') || msg.contains('connection')) {
        return 'Cannot connect to server. Check your network.';
      }
      return 'Login failed. Please try again.';
    }
  }

  Future<void> logout() async {
    _user = null;
    _api.clearToken();
    await _storage.deleteAll();
    notifyListeners();
  }
}
