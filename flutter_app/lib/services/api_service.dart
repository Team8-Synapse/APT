import 'package:dio/dio.dart';
import '../constants/api.dart';

class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;

  late final Dio _dio;
  String? _token;

  ApiService._internal() {
    _dio = Dio(BaseOptions(
      baseUrl: kApiBaseUrl,
      connectTimeout: const Duration(seconds: 15),
      receiveTimeout: const Duration(seconds: 30),
      headers: {'Content-Type': 'application/json'},
    ));

    // Request interceptor — attach JWT
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) {
        if (_token != null) {
          options.headers['Authorization'] = 'Bearer $_token';
        }
        handler.next(options);
      },
      onError: (DioException e, handler) {
        handler.next(e);
      },
    ));
  }

  void setToken(String token) {
    _token = token;
  }

  void clearToken() {
    _token = null;
  }

  // ---------- Auth ----------
  Future<Map<String, dynamic>> login(String email, String password) async {
    final res = await _dio.post(kLoginEndpoint, data: {
      'email': email,
      'password': password,
    });
    return res.data as Map<String, dynamic>;
  }

  // ---------- Student ----------
  Future<Map<String, dynamic>> getStudentProfile(String userId) async {
    final res = await _dio.get('$kStudentProfileEndpoint/$userId');
    return res.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> upsertStudentProfile(String userId, Map<String, dynamic> data) async {
    final res = await _dio.put('$kStudentProfileEndpoint/$userId', data: data);
    return res.data as Map<String, dynamic>;
  }

  Future<List<dynamic>> getStudentDrives() async {
    final res = await _dio.get(kStudentDrivesEndpoint);
    return res.data as List<dynamic>;
  }

  Future<List<dynamic>> getNotifications() async {
    final res = await _dio.get(kStudentNotificationsEndpoint);
    return res.data as List<dynamic>;
  }

  // ---------- AI Chat ----------
  Future<String> sendChatMessage(String message, {String? context, String? sourceName}) async {
    final res = await _dio.post(kAiChatEndpoint, data: {
      'message': message,
      if (context != null) 'context': context,
      if (sourceName != null) 'sourceName': sourceName,
    });
    return (res.data as Map<String, dynamic>)['response'] as String;
  }

  Future<Map<String, dynamic>> getAiInsights() async {
    final res = await _dio.get(kAiInsightsEndpoint);
    return res.data as Map<String, dynamic>;
  }

  // ---------- Resources ----------
  Future<List<dynamic>> getResources() async {
    final res = await _dio.get(kResourcesEndpoint);
    return res.data as List<dynamic>;
  }

  // ---------- Announcements ----------
  Future<List<dynamic>> getAnnouncements() async {
    final res = await _dio.get(kAnnouncementsEndpoint);
    return res.data as List<dynamic>;
  }

  // ---------- Applications ----------
  Future<List<dynamic>> getMyApplications() async {
    final res = await _dio.get('/student/my-applications');
    return res.data as List<dynamic>;
  }

  Future<Map<String, dynamic>> applyToDrive(String driveId) async {
    final res = await _dio.post('/applications/$driveId/apply');
    return res.data as Map<String, dynamic>;
  }

  // ---------- Experiences ----------
  Future<List<dynamic>> getExperiences({String? company}) async {
    final res = await _dio.get(
      kExperiencesEndpoint,
      queryParameters: company != null ? {'company': company} : null,
    );
    return res.data as List<dynamic>;
  }

  Future<Map<String, dynamic>> likeExperience(String id) async {
    final res = await _dio.put('$kExperiencesEndpoint/$id/like');
    return res.data as Map<String, dynamic>;
  }

  // ---------- Alumni Insights ----------
  Future<List<dynamic>> getAlumniInsights({String? company}) async {
    final res = await _dio.get(
      kAlumniInsightsEndpoint,
      queryParameters: company != null ? {'company': company} : null,
    );
    return res.data as List<dynamic>;
  }

  Future<List<dynamic>> getAlumniDirectory({String? company}) async {
    final res = await _dio.get(
      kAlumniDirectoryEndpoint,
      queryParameters: company != null && company.isNotEmpty ? {'company': company} : null,
    );
    return res.data as List<dynamic>;
  }

  // ---------- Notifications ----------
  Future<List<dynamic>> getAppNotifications() async {
    final res = await _dio.get(kNotificationsEndpoint);
    return res.data as List<dynamic>;
  }

  Future<void> markNotificationRead(String id) async {
    await _dio.put('$kNotificationsEndpoint/$id');
  }

  Future<void> markAllNotificationsRead() async {
    await _dio.put('$kNotificationsEndpoint/read-all');
  }

  Future<void> deleteNotification(String id) async {
    await _dio.delete('$kNotificationsEndpoint/$id');
  }

  // ---------- Ticker ----------
  Future<List<dynamic>> getTicker() async {
    final res = await _dio.get(kTickerEndpoint);
    return res.data as List<dynamic>;
  }

  // ---------- Notes ----------
  Future<List<dynamic>> getNotes() async {
    final res = await _dio.get(kNotesEndpoint);
    return res.data as List<dynamic>;
  }

  Future<Map<String, dynamic>> createNote(String name, String text) async {
    final res = await _dio.post(kNotesEndpoint, data: {'name': name, 'text': text});
    return res.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> updateNote(String id, String name, String text) async {
    final res = await _dio.put('$kNotesEndpoint/$id', data: {'name': name, 'text': text});
    return res.data as Map<String, dynamic>;
  }

  Future<void> deleteNote(String id) async {
    await _dio.delete('$kNotesEndpoint/$id');
  }

  // ---------- Resources by category ----------
  Future<List<dynamic>> getResourcesByCategory({String? category}) async {
    final res = await _dio.get(
      kResourcesEndpoint,
      queryParameters: category != null && category != 'All' ? {'category': category} : null,
    );
    return res.data as List<dynamic>;
  }

  // ---------- Registration / OTP ----------
  Future<void> sendOtp(String email) async {
    await _dio.post(kOtpSendEndpoint, data: {'email': email});
  }

  Future<bool> verifyOtp(String email, String otp) async {
    try {
      await _dio.post(kOtpVerifyEndpoint, data: {'email': email, 'otp': otp});
      return true;
    } catch (_) {
      return false;
    }
  }

  Future<Map<String, dynamic>> register(String email, String password, String username) async {
    final res = await _dio.post(kRegisterEndpoint, data: {
      'email': email,
      'password': password,
      'username': username,
    });
    return res.data as Map<String, dynamic>;
  }

  // ---------- Admin ----------
  Future<Map<String, dynamic>> getAdminStats() async {
    final res = await _dio.get(kAdminStatsEndpoint);
    return res.data as Map<String, dynamic>;
  }

  Future<List<dynamic>> getAdminStudents() async {
    final res = await _dio.get(kAdminStudentsEndpoint);
    return res.data as List<dynamic>;
  }

  Future<List<dynamic>> getAdminReports() async {
    final res = await _dio.get(kAdminReportsEndpoint);
    return res.data as List<dynamic>;
  }

  Future<Map<String, dynamic>> createAnnouncement(Map<String, dynamic> data) async {
    final res = await _dio.post(kAnnouncementsEndpoint, data: data);
    return res.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> updateAnnouncement(String id, Map<String, dynamic> data) async {
    final res = await _dio.put('$kAnnouncementsEndpoint/$id', data: data);
    return res.data as Map<String, dynamic>;
  }

  Future<void> deleteAnnouncement(String id) async {
    await _dio.delete('$kAnnouncementsEndpoint/$id');
  }

  Future<List<dynamic>> getAdminTicker() async {
    final res = await _dio.get(kTickerEndpoint);
    return res.data as List<dynamic>;
  }

  Future<Map<String, dynamic>> createTickerMessage(String message) async {
    final res = await _dio.post(kTickerEndpoint, data: {'message': message});
    return res.data as Map<String, dynamic>;
  }

  Future<void> deleteTickerMessage(String id) async {
    await _dio.delete('$kTickerEndpoint/$id');
  }

  Future<Map<String, dynamic>> createResource(Map<String, dynamic> data) async {
    final res = await _dio.post(kResourcesEndpoint, data: data);
    return res.data as Map<String, dynamic>;
  }

  Future<void> deleteResource(String id) async {
    await _dio.delete('$kResourcesEndpoint/$id');
  }
}
