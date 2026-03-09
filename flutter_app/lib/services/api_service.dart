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
  Future<Map<String, dynamic>> getStudentProfile() async {
    final res = await _dio.get(kStudentProfileEndpoint);
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
}
