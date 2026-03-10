import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../constants/colors.dart';
import '../services/auth_service.dart';
import '../services/api_service.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final _api = ApiService();
  bool _loading = true;
  bool _saving = false;
  String _message = '';
  bool _messageIsError = false;
  int _activeSection = 0;

  // ── Main profile fields ────────────────────────────────────────────────────
  final _firstNameCtrl = TextEditingController();
  final _lastNameCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  final _rollNumberCtrl = TextEditingController();
  String _department = '';
  String _course = 'B.Tech';
  final _sectionCtrl = TextEditingController();
  final _cgpaCtrl = TextEditingController();
  final _batchCtrl = TextEditingController();
  final _backlogsCtrl = TextEditingController(text: '0');
  final _gapCtrl = TextEditingController(text: '0');
  final _tenthCtrl = TextEditingController();
  final _twelfthCtrl = TextEditingController();
  final _diplomaCtrl = TextEditingController();
  final _linkedInCtrl = TextEditingController();
  final _githubCtrl = TextEditingController();
  final _resumeUrlCtrl = TextEditingController();
  final _portfolioCtrl = TextEditingController();
  final _expectedCtcCtrl = TextEditingController();

  // ── List fields ────────────────────────────────────────────────────────────
  List<Map<String, String>> _skills = [];
  List<String> _certifications = [];
  List<String> _achievements = [];
  List<Map<String, String>> _internships = [];
  List<Map<String, dynamic>> _projects = [];
  List<String> _preferredRoles = [];
  List<String> _preferredLocations = [];

  // ── Placement info ─────────────────────────────────────────────────────────
  String _placementStatus = 'not_placed';
  String? _offeredCompany;
  double? _offeredCTC;

  // ── Temporary add controllers ─────────────────────────────────────────────
  final _newSkillNameCtrl = TextEditingController();
  String _newSkillLevel = 'Intermediate';
  final _newCertCtrl = TextEditingController();
  final _newAchievementCtrl = TextEditingController();
  final _newInternCompanyCtrl = TextEditingController();
  final _newInternRoleCtrl = TextEditingController();
  final _newInternDurationCtrl = TextEditingController();
  final _newInternDescCtrl = TextEditingController();
  final _newProjTitleCtrl = TextEditingController();
  final _newProjDescCtrl = TextEditingController();
  final _newProjTechCtrl = TextEditingController();
  final _newProjLinkCtrl = TextEditingController();
  final _newRoleCtrl = TextEditingController();
  final _newLocationCtrl = TextEditingController();

  @override
  void initState() {
    super.initState();
    _loadProfile();
  }

  @override
  void dispose() {
    for (final c in [
      _firstNameCtrl, _lastNameCtrl, _emailCtrl, _phoneCtrl, _rollNumberCtrl,
      _sectionCtrl, _cgpaCtrl, _batchCtrl, _backlogsCtrl, _gapCtrl,
      _tenthCtrl, _twelfthCtrl, _diplomaCtrl, _linkedInCtrl, _githubCtrl,
      _resumeUrlCtrl, _portfolioCtrl, _expectedCtcCtrl,
      _newSkillNameCtrl, _newCertCtrl, _newAchievementCtrl,
      _newInternCompanyCtrl, _newInternRoleCtrl, _newInternDurationCtrl,
      _newInternDescCtrl, _newProjTitleCtrl, _newProjDescCtrl,
      _newProjTechCtrl, _newProjLinkCtrl, _newRoleCtrl, _newLocationCtrl,
    ]) {
      c.dispose();
    }
    super.dispose();
  }

  Future<void> _loadProfile() async {
    final userId = context.read<AuthService>().user?.id ?? '';
    if (userId.isEmpty) {
      setState(() => _loading = false);
      return;
    }
    try {
      final d = await _api.getStudentProfile(userId);
      _fillFromData(d);
    } catch (_) {
      // no profile yet — show blank editable form
    }
    setState(() => _loading = false);
  }

  void _fillFromData(Map<String, dynamic> d) {
    _firstNameCtrl.text = d['firstName'] ?? '';
    _lastNameCtrl.text = d['lastName'] ?? '';
    _emailCtrl.text = d['email'] ?? '';
    _phoneCtrl.text = d['phone'] ?? '';
    _rollNumberCtrl.text = d['rollNumber'] ?? '';
    _department = d['department'] ?? '';
    _course = d['course'] ?? 'B.Tech';
    _sectionCtrl.text = d['section'] ?? '';
    _cgpaCtrl.text = d['cgpa']?.toString() ?? '';
    _batchCtrl.text = d['batch']?.toString() ?? '';
    _backlogsCtrl.text = (d['backlogs'] ?? 0).toString();
    _gapCtrl.text = (d['gap'] ?? 0).toString();
    _tenthCtrl.text = d['tenthPercentage']?.toString() ?? '';
    _twelfthCtrl.text = d['twelfthPercentage']?.toString() ?? '';
    _diplomaCtrl.text = d['diplomaPercentage']?.toString() ?? '';
    _linkedInCtrl.text = d['linkedIn'] ?? '';
    _githubCtrl.text = d['github'] ?? '';
    _resumeUrlCtrl.text = d['resumeUrl'] ?? '';
    _portfolioCtrl.text = d['portfolio'] ?? '';
    _expectedCtcCtrl.text = d['expectedCTC']?.toString() ?? '';

    _skills = (d['skills'] as List<dynamic>? ?? [])
        .map((s) => {
              'name': s['name']?.toString() ?? '',
              'level': s['level']?.toString() ?? 'Intermediate',
            })
        .toList();
    _certifications = List<String>.from(d['certifications'] ?? []);
    _achievements = List<String>.from(d['achievements'] ?? []);
    _internships = (d['internships'] as List<dynamic>? ?? [])
        .map((i) => {
              'company': i['company']?.toString() ?? '',
              'role': i['role']?.toString() ?? '',
              'duration': i['duration']?.toString() ?? '',
              'description': i['description']?.toString() ?? '',
            })
        .toList();
    _projects = (d['projects'] as List<dynamic>? ?? [])
        .map((p) => {
              'title': p['title']?.toString() ?? '',
              'description': p['description']?.toString() ?? '',
              'technologies': List<String>.from(p['technologies'] ?? []),
              'link': p['link']?.toString() ?? '',
            })
        .toList();
    _preferredRoles = List<String>.from(d['preferredRoles'] ?? []);
    _preferredLocations = List<String>.from(d['preferredLocations'] ?? []);
    _placementStatus = d['placementStatus'] ?? 'not_placed';
    _offeredCompany = d['offeredCompany'];
    _offeredCTC = d['offeredCTC'] != null ? (d['offeredCTC'] as num).toDouble() : null;
  }

  int get _completionScore {
    int score = 0;
    final checks = [
      _firstNameCtrl.text.isNotEmpty && _lastNameCtrl.text.isNotEmpty,
      _emailCtrl.text.isNotEmpty,
      _phoneCtrl.text.isNotEmpty,
      _rollNumberCtrl.text.isNotEmpty,
      _department.isNotEmpty,
      _cgpaCtrl.text.isNotEmpty,
      _batchCtrl.text.isNotEmpty,
      _skills.isNotEmpty,
      _skills.length >= 3,
      _certifications.isNotEmpty,
      _internships.isNotEmpty,
      _projects.isNotEmpty,
      _linkedInCtrl.text.isNotEmpty,
      _githubCtrl.text.isNotEmpty,
      _resumeUrlCtrl.text.isNotEmpty,
    ];
    const weights = [10, 5, 5, 5, 5, 10, 5, 15, 5, 5, 10, 10, 5, 5, 5];
    for (int i = 0; i < checks.length; i++) {
      if (checks[i]) score += weights[i];
    }
    return score;
  }

  Future<void> _save() async {
    final userId = context.read<AuthService>().user?.id ?? '';
    if (userId.isEmpty) return;

    if (_firstNameCtrl.text.trim().isEmpty ||
        _lastNameCtrl.text.trim().isEmpty ||
        _rollNumberCtrl.text.trim().isEmpty ||
        _department.trim().isEmpty ||
        _cgpaCtrl.text.trim().isEmpty ||
        _batchCtrl.text.trim().isEmpty) {
      setState(() {
        _message =
            'Please fill required fields: First Name, Last Name, Roll Number, Department, CGPA, Batch';
        _messageIsError = true;
      });
      return;
    }

    setState(() {
      _saving = true;
      _message = '';
    });
    try {
      await _api.upsertStudentProfile(userId, {
        'firstName': _firstNameCtrl.text.trim(),
        'lastName': _lastNameCtrl.text.trim(),
        'email': _emailCtrl.text.trim(),
        'phone': _phoneCtrl.text.trim(),
        'rollNumber': _rollNumberCtrl.text.trim(),
        'department': _department,
        'course': _course,
        'section': _sectionCtrl.text.trim(),
        'cgpa': double.tryParse(_cgpaCtrl.text) ?? 0,
        'batch': _batchCtrl.text.trim(),
        'backlogs': int.tryParse(_backlogsCtrl.text) ?? 0,
        'gap': int.tryParse(_gapCtrl.text) ?? 0,
        if (_tenthCtrl.text.isNotEmpty)
          'tenthPercentage': double.tryParse(_tenthCtrl.text),
        if (_twelfthCtrl.text.isNotEmpty)
          'twelfthPercentage': double.tryParse(_twelfthCtrl.text),
        if (_diplomaCtrl.text.isNotEmpty)
          'diplomaPercentage': double.tryParse(_diplomaCtrl.text),
        'skills': _skills,
        'certifications': _certifications,
        'achievements': _achievements,
        'internships': _internships,
        'projects': _projects,
        'linkedIn': _linkedInCtrl.text.trim(),
        'github': _githubCtrl.text.trim(),
        'resumeUrl': _resumeUrlCtrl.text.trim(),
        'portfolio': _portfolioCtrl.text.trim(),
        if (_expectedCtcCtrl.text.isNotEmpty)
          'expectedCTC': double.tryParse(_expectedCtcCtrl.text),
        'preferredRoles': _preferredRoles,
        'preferredLocations': _preferredLocations,
      });
      setState(() {
        _saving = false;
        _message = 'Profile saved successfully!';
        _messageIsError = false;
      });
      Future.delayed(const Duration(seconds: 4), () {
        if (mounted) setState(() => _message = '');
      });
    } catch (_) {
      setState(() {
        _saving = false;
        _message = 'Failed to save profile';
        _messageIsError = true;
      });
    }
  }

  static const _sections = [
    (Icons.person_outline_rounded, 'Personal'),
    (Icons.school_outlined, 'Academics'),
    (Icons.code_rounded, 'Skills'),
    (Icons.work_outline_rounded, 'Experience'),
    (Icons.star_outline_rounded, 'Projects'),
    (Icons.link_rounded, 'Links'),
    (Icons.location_on_outlined, 'Preferences'),
  ];

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator(color: AppColors.maroon)),
      );
    }

    final user = context.watch<AuthService>().user;
    final score = _completionScore;
    final scoreColor = score >= 80
        ? AppColors.success
        : score >= 50
            ? AppColors.warning
            : AppColors.error;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 180,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration:
                    const BoxDecoration(gradient: AppColors.maroonGradient),
                padding: const EdgeInsets.fromLTRB(20, 60, 20, 16),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    CircleAvatar(
                      radius: 36,
                      backgroundColor: Colors.white.withOpacity(0.2),
                      child: Text(
                        _firstNameCtrl.text.isNotEmpty
                            ? _firstNameCtrl.text[0].toUpperCase()
                            : (user?.email[0].toUpperCase() ?? 'U'),
                        style: const TextStyle(
                            color: Colors.white,
                            fontSize: 28,
                            fontWeight: FontWeight.w800),
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.end,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            _firstNameCtrl.text.isNotEmpty
                                ? '${_firstNameCtrl.text} ${_lastNameCtrl.text}'
                                : (user?.email ?? 'Student'),
                            style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.w700,
                                fontSize: 17),
                          ),
                          if (_rollNumberCtrl.text.isNotEmpty)
                            Text(_rollNumberCtrl.text,
                                style: const TextStyle(
                                    color: Colors.white70, fontSize: 12)),
                          Text(
                            _department.isNotEmpty
                                ? '$_department • ${_batchCtrl.text}'
                                : (user?.email ?? ''),
                            style: const TextStyle(
                                color: Colors.white70, fontSize: 12),
                          ),
                        ],
                      ),
                    ),
                    Column(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        SizedBox(
                          width: 56,
                          height: 56,
                          child: Stack(
                            fit: StackFit.expand,
                            children: [
                              CircularProgressIndicator(
                                value: score / 100,
                                strokeWidth: 5,
                                backgroundColor:
                                    Colors.white.withOpacity(0.2),
                                color: scoreColor,
                              ),
                              Center(
                                child: Text(
                                  '$score%',
                                  style: const TextStyle(
                                      color: Colors.white,
                                      fontWeight: FontWeight.w800,
                                      fontSize: 11),
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          score >= 80
                              ? 'Excellent'
                              : score >= 50
                                  ? 'Good'
                                  : 'Improve',
                          style: TextStyle(
                              color: scoreColor,
                              fontSize: 9,
                              fontWeight: FontWeight.w700),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            actions: [
              IconButton(
                icon: const Icon(Icons.logout_rounded, color: Colors.white),
                onPressed: () async {
                  final ok = await showDialog<bool>(
                    context: context,
                    builder: (_) => AlertDialog(
                      title: const Text('Sign Out'),
                      content: const Text('Are you sure?'),
                      actions: [
                        TextButton(
                            onPressed: () => Navigator.pop(context, false),
                            child: const Text('Cancel')),
                        ElevatedButton(
                            onPressed: () => Navigator.pop(context, true),
                            child: const Text('Sign Out')),
                      ],
                    ),
                  );
                  if (ok == true && context.mounted) {
                    context.read<AuthService>().logout();
                  }
                },
              ),
            ],
          ),

          // Sticky section tabs
          SliverPersistentHeader(
            pinned: true,
            delegate: _StickyTabDelegate(
              child: Container(
                color: Colors.white,
                child: SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(
                      horizontal: 10, vertical: 8),
                  child: Row(
                    children: _sections.asMap().entries.map((e) {
                      final selected = e.key == _activeSection;
                      return GestureDetector(
                        onTap: () =>
                            setState(() => _activeSection = e.key),
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 200),
                          margin: const EdgeInsets.only(right: 6),
                          padding: const EdgeInsets.symmetric(
                              horizontal: 14, vertical: 8),
                          decoration: BoxDecoration(
                            color: selected
                                ? AppColors.maroon
                                : Colors.grey.shade100,
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(e.value.$1,
                                  size: 14,
                                  color: selected
                                      ? Colors.white
                                      : AppColors.textSecondary),
                              const SizedBox(width: 6),
                              Text(
                                e.value.$2,
                                style: TextStyle(
                                  color: selected
                                      ? Colors.white
                                      : AppColors.textSecondary,
                                  fontWeight: FontWeight.w600,
                                  fontSize: 12,
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                ),
              ),
            ),
          ),

          SliverPadding(
            padding: const EdgeInsets.all(16),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                if (_placementStatus == 'placed') ...[
                  _PlacedBanner(
                    firstName: _firstNameCtrl.text,
                    company: _offeredCompany ?? '',
                    ctc: _offeredCTC,
                  ),
                  const SizedBox(height: 16),
                ],
                if (_message.isNotEmpty) ...[
                  _MessageBanner(
                      text: _message, isError: _messageIsError),
                  const SizedBox(height: 16),
                ],
                if (_activeSection == 0) _buildPersonal(),
                if (_activeSection == 1) _buildAcademic(),
                if (_activeSection == 2) _buildSkills(),
                if (_activeSection == 3) _buildExperience(),
                if (_activeSection == 4) _buildProjects(),
                if (_activeSection == 5) _buildLinks(),
                if (_activeSection == 6) _buildPreferences(),
                const SizedBox(height: 20),
                ElevatedButton.icon(
                  onPressed: _saving ? null : _save,
                  icon: _saving
                      ? const SizedBox(
                          width: 18,
                          height: 18,
                          child: CircularProgressIndicator(
                              strokeWidth: 2, color: Colors.white))
                      : const Icon(Icons.save_rounded),
                  label: Text(_saving ? 'Saving...' : 'Save Profile'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.maroon,
                    foregroundColor: Colors.white,
                    minimumSize: const Size(double.infinity, 52),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14)),
                    textStyle: const TextStyle(
                        fontSize: 15, fontWeight: FontWeight.w700),
                  ),
                ),
                const SizedBox(height: 32),
              ]),
            ),
          ),
        ],
      ),
    );
  }

  // ── Sections ────────────────────────────────────────────────────────────────

  Widget _buildPersonal() {
    return _SectionCard(
      title: 'Personal Information',
      icon: Icons.person_outline_rounded,
      children: [
        _rowN([
          _labeled('First Name *', _tf(_firstNameCtrl, 'John')),
          _labeled('Last Name *', _tf(_lastNameCtrl, 'Doe')),
        ]),
        const SizedBox(height: 14),
        _labeled('Roll Number *',
            _tf(_rollNumberCtrl, 'CB.EN.U4CSE21XXX')),
        const SizedBox(height: 14),
        _labeled('Email', _tf(_emailCtrl, 'john@amrita.edu',
            type: TextInputType.emailAddress)),
        const SizedBox(height: 14),
        _labeled('Phone',
            _tf(_phoneCtrl, '+91 9876543210',
                type: TextInputType.phone)),
      ],
    );
  }

  Widget _buildAcademic() {
    return _SectionCard(
      title: 'Academic Details',
      icon: Icons.school_outlined,
      children: [
        _labeled(
          'Department *',
          DropdownButtonFormField<String>(
            initialValue: _department.isEmpty ? '' : _department,
            onChanged: (v) => setState(() => _department = v ?? ''),
            items: const [
              DropdownMenuItem(value: '', child: Text('Select Department', style: TextStyle(fontSize: 13))),
              DropdownMenuItem(value: 'CSE', child: Text('Computer Science', style: TextStyle(fontSize: 13))),
              DropdownMenuItem(value: 'ECE', child: Text('Electronics & Communication', style: TextStyle(fontSize: 13))),
              DropdownMenuItem(value: 'EEE', child: Text('Electrical & Electronics', style: TextStyle(fontSize: 13))),
              DropdownMenuItem(value: 'ME', child: Text('Mechanical', style: TextStyle(fontSize: 13))),
              DropdownMenuItem(value: 'CE', child: Text('Civil', style: TextStyle(fontSize: 13))),
              DropdownMenuItem(value: 'AIE', child: Text('AI & Data Science', style: TextStyle(fontSize: 13))),
            ],
            decoration: _dec(),
          ),
        ),
        const SizedBox(height: 14),
        _rowN([
          _labeled(
            'Course',
            DropdownButtonFormField<String>(
              initialValue: _course,
              onChanged: (v) => setState(() => _course = v ?? 'B.Tech'),
              items: const [
                DropdownMenuItem(value: 'B.Tech', child: Text('B.Tech', style: TextStyle(fontSize: 13))),
                DropdownMenuItem(value: 'M.Tech', child: Text('M.Tech', style: TextStyle(fontSize: 13))),
                DropdownMenuItem(value: 'MCA', child: Text('MCA', style: TextStyle(fontSize: 13))),
              ],
              decoration: _dec(),
            ),
          ),
          _labeled('Section', _tf(_sectionCtrl, 'A')),
        ]),
        const SizedBox(height: 14),
        _rowN([
          _labeled('CGPA *', _tf(_cgpaCtrl, '8.5', type: const TextInputType.numberWithOptions(decimal: true))),
          _labeled('Batch *', _tf(_batchCtrl, '2026')),
          _labeled('Backlogs', _tf(_backlogsCtrl, '0', type: TextInputType.number)),
          _labeled('Gap Yrs', _tf(_gapCtrl, '0', type: TextInputType.number)),
        ]),
        const SizedBox(height: 16),
        const Text('Previous Education',
            style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13)),
        const SizedBox(height: 10),
        _rowN([
          _labeled('10th %', _tf(_tenthCtrl, '92.5', type: const TextInputType.numberWithOptions(decimal: true))),
          _labeled('12th %', _tf(_twelfthCtrl, '89.0', type: const TextInputType.numberWithOptions(decimal: true))),
          _labeled('Diploma %', _tf(_diplomaCtrl, 'N/A', type: const TextInputType.numberWithOptions(decimal: true))),
        ]),
      ],
    );
  }

  Widget _buildSkills() {
    return Column(
      children: [
        _SectionCard(
          title: 'Technical Skills',
          icon: Icons.code_rounded,
          children: [
            Row(
              children: [
                Expanded(
                  flex: 3,
                  child: _tf(_newSkillNameCtrl, 'Skill name (e.g., Python)'),
                ),
                const SizedBox(width: 8),
                Expanded(
                  flex: 2,
                  child: DropdownButtonFormField<String>(
                    initialValue: _newSkillLevel,
                    onChanged: (v) =>
                        setState(() => _newSkillLevel = v ?? 'Intermediate'),
                    items: const [
                      DropdownMenuItem(value: 'Beginner', child: Text('Beginner', style: TextStyle(fontSize: 13))),
                      DropdownMenuItem(value: 'Intermediate', child: Text('Intermediate', style: TextStyle(fontSize: 13))),
                      DropdownMenuItem(value: 'Advanced', child: Text('Advanced', style: TextStyle(fontSize: 13))),
                    ],
                    decoration: _dec(),
                  ),
                ),
                const SizedBox(width: 8),
                _addBtn(() {
                  if (_newSkillNameCtrl.text.trim().isNotEmpty) {
                    setState(() {
                      _skills.add({
                        'name': _newSkillNameCtrl.text.trim(),
                        'level': _newSkillLevel,
                      });
                      _newSkillNameCtrl.clear();
                    });
                  }
                }),
              ],
            ),
            if (_skills.isNotEmpty) ...[
              const SizedBox(height: 12),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: _skills.asMap().entries.map((e) {
                  final color = e.value['level'] == 'Advanced'
                      ? AppColors.success
                      : e.value['level'] == 'Intermediate'
                          ? AppColors.info
                          : AppColors.textSecondary;
                  return Chip(
                    label: Text(
                      '${e.value['name']} (${e.value['level']})',
                      style: TextStyle(
                          color: color,
                          fontSize: 12,
                          fontWeight: FontWeight.w600),
                    ),
                    deleteIcon:
                        Icon(Icons.close, size: 14, color: color),
                    onDeleted: () =>
                        setState(() => _skills.removeAt(e.key)),
                    backgroundColor: color.withOpacity(0.1),
                    side: BorderSide(color: color.withOpacity(0.3)),
                    padding: EdgeInsets.zero,
                  );
                }).toList(),
              ),
            ],
          ],
        ),
        const SizedBox(height: 14),
        _SectionCard(
          title: 'Certifications',
          icon: Icons.verified_outlined,
          children: [
            Row(
              children: [
                Expanded(
                    child: _tf(
                        _newCertCtrl, 'E.g., AWS Certified Developer')),
                const SizedBox(width: 8),
                _addBtn(() {
                  if (_newCertCtrl.text.trim().isNotEmpty) {
                    setState(() {
                      _certifications.add(_newCertCtrl.text.trim());
                      _newCertCtrl.clear();
                    });
                  }
                }),
              ],
            ),
            ..._certifications.asMap().entries.map((e) => _chip(
                e.value,
                () =>
                    setState(() => _certifications.removeAt(e.key)))),
          ],
        ),
        const SizedBox(height: 14),
        _SectionCard(
          title: 'Achievements',
          icon: Icons.emoji_events_outlined,
          children: [
            Row(
              children: [
                Expanded(
                    child: _tf(_newAchievementCtrl,
                        'E.g., Won inter-college hackathon 2024')),
                const SizedBox(width: 8),
                _addBtn(() {
                  if (_newAchievementCtrl.text.trim().isNotEmpty) {
                    setState(() {
                      _achievements
                          .add(_newAchievementCtrl.text.trim());
                      _newAchievementCtrl.clear();
                    });
                  }
                }),
              ],
            ),
            ..._achievements.asMap().entries.map((e) => _chip(
                e.value,
                () =>
                    setState(() => _achievements.removeAt(e.key)))),
          ],
        ),
      ],
    );
  }

  Widget _buildExperience() {
    return _SectionCard(
      title: 'Internship Experience',
      icon: Icons.work_outline_rounded,
      children: [
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
              color: Colors.grey.shade50,
              borderRadius: BorderRadius.circular(12)),
          child: Column(
            children: [
              _rowN([
                _labeled('Company', _tf(_newInternCompanyCtrl, 'Google')),
                _labeled('Role', _tf(_newInternRoleCtrl, 'SWE Intern')),
              ]),
              const SizedBox(height: 10),
              _rowN([
                _labeled('Duration',
                    _tf(_newInternDurationCtrl, 'May – July 2024')),
                _labeled('Description',
                    _tf(_newInternDescCtrl, 'Brief description')),
              ]),
              const SizedBox(height: 10),
              OutlinedButton.icon(
                onPressed: () {
                  if (_newInternCompanyCtrl.text.isNotEmpty &&
                      _newInternRoleCtrl.text.isNotEmpty) {
                    setState(() {
                      _internships.add({
                        'company':
                            _newInternCompanyCtrl.text.trim(),
                        'role': _newInternRoleCtrl.text.trim(),
                        'duration':
                            _newInternDurationCtrl.text.trim(),
                        'description':
                            _newInternDescCtrl.text.trim(),
                      });
                      _newInternCompanyCtrl.clear();
                      _newInternRoleCtrl.clear();
                      _newInternDurationCtrl.clear();
                      _newInternDescCtrl.clear();
                    });
                  }
                },
                icon: const Icon(Icons.add),
                label: const Text('Add Internship'),
                style: OutlinedButton.styleFrom(
                  foregroundColor: AppColors.maroon,
                  side: const BorderSide(color: AppColors.maroon),
                  minimumSize: const Size(double.infinity, 44),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        ..._internships.asMap().entries.map((e) {
          final i = e.value;
          return Container(
            margin: const EdgeInsets.only(bottom: 10),
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.grey.shade200),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(i['role'] ?? '',
                          style: const TextStyle(
                              fontWeight: FontWeight.w700)),
                      Text(i['company'] ?? '',
                          style: const TextStyle(
                              color: AppColors.maroon,
                              fontSize: 13)),
                      if ((i['duration'] ?? '').isNotEmpty)
                        Text(i['duration'] ?? '',
                            style: const TextStyle(
                                color: AppColors.textSecondary,
                                fontSize: 12)),
                      if ((i['description'] ?? '').isNotEmpty)
                        Padding(
                          padding: const EdgeInsets.only(top: 4),
                          child: Text(i['description'] ?? '',
                              style:
                                  const TextStyle(fontSize: 13)),
                        ),
                    ],
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.close,
                      size: 18,
                      color: AppColors.textSecondary),
                  onPressed: () =>
                      setState(() => _internships.removeAt(e.key)),
                ),
              ],
            ),
          );
        }),
      ],
    );
  }

  Widget _buildProjects() {
    return _SectionCard(
      title: 'Projects',
      icon: Icons.star_outline_rounded,
      children: [
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
              color: Colors.grey.shade50,
              borderRadius: BorderRadius.circular(12)),
          child: Column(
            children: [
              _labeled('Project Title',
                  _tf(_newProjTitleCtrl, 'E-commerce Platform')),
              const SizedBox(height: 10),
              _labeled('Technologies (comma-separated)',
                  _tf(_newProjTechCtrl, 'React, Node.js, MongoDB')),
              const SizedBox(height: 10),
              _labeled('Project Link',
                  _tf(_newProjLinkCtrl, 'https://github.com/...')),
              const SizedBox(height: 10),
              _labeled(
                'Description',
                TextField(
                  controller: _newProjDescCtrl,
                  maxLines: 3,
                  decoration: _dec(hint: 'Brief project description...'),
                ),
              ),
              const SizedBox(height: 10),
              OutlinedButton.icon(
                onPressed: () {
                  if (_newProjTitleCtrl.text.isNotEmpty) {
                    setState(() {
                      _projects.add({
                        'title': _newProjTitleCtrl.text.trim(),
                        'description':
                            _newProjDescCtrl.text.trim(),
                        'technologies': _newProjTechCtrl.text
                            .split(',')
                            .map((t) => t.trim())
                            .where((t) => t.isNotEmpty)
                            .toList(),
                        'link': _newProjLinkCtrl.text.trim(),
                      });
                      _newProjTitleCtrl.clear();
                      _newProjDescCtrl.clear();
                      _newProjTechCtrl.clear();
                      _newProjLinkCtrl.clear();
                    });
                  }
                },
                icon: const Icon(Icons.add),
                label: const Text('Add Project'),
                style: OutlinedButton.styleFrom(
                  foregroundColor: AppColors.maroon,
                  side: const BorderSide(color: AppColors.maroon),
                  minimumSize: const Size(double.infinity, 44),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        ..._projects.asMap().entries.map((e) {
          final p = e.value;
          final techs =
              (p['technologies'] as List?)?.cast<String>() ?? [];
          return Container(
            margin: const EdgeInsets.only(bottom: 10),
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.grey.shade200),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: Text(
                                p['title']?.toString() ?? '',
                                style: const TextStyle(
                                    fontWeight: FontWeight.w700)),
                          ),
                          if ((p['link']?.toString() ?? '').isNotEmpty)
                            GestureDetector(
                              onTap: () => launchUrl(Uri.parse(
                                  p['link']!.toString())),
                              child: const Icon(Icons.open_in_new,
                                  size: 14, color: AppColors.maroon),
                            ),
                        ],
                      ),
                      if (techs.isNotEmpty) ...[
                        const SizedBox(height: 6),
                        Wrap(
                          spacing: 6,
                          children: techs
                              .map((t) => Container(
                                    padding:
                                        const EdgeInsets.symmetric(
                                            horizontal: 8,
                                            vertical: 2),
                                    decoration: BoxDecoration(
                                      color: const Color(0xFFE0E7FF),
                                      borderRadius:
                                          BorderRadius.circular(4),
                                    ),
                                    child: Text(t,
                                        style: const TextStyle(
                                            fontSize: 11,
                                            color: Color(0xFF4F46E5))),
                                  ))
                              .toList(),
                        ),
                      ],
                      if ((p['description']?.toString() ?? '')
                          .isNotEmpty)
                        Padding(
                          padding: const EdgeInsets.only(top: 4),
                          child: Text(
                              p['description']!.toString(),
                              style: const TextStyle(fontSize: 13)),
                        ),
                    ],
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.close,
                      size: 18,
                      color: AppColors.textSecondary),
                  onPressed: () =>
                      setState(() => _projects.removeAt(e.key)),
                ),
              ],
            ),
          );
        }),
      ],
    );
  }

  Widget _buildLinks() {
    return _SectionCard(
      title: 'Professional Links',
      icon: Icons.link_rounded,
      children: [
        _labeled('LinkedIn Profile',
            _tf(_linkedInCtrl,
                'https://linkedin.com/in/username')),
        const SizedBox(height: 14),
        _labeled('GitHub Profile',
            _tf(_githubCtrl, 'https://github.com/username')),
        const SizedBox(height: 14),
        _labeled('Resume URL',
            _tf(_resumeUrlCtrl,
                'https://drive.google.com/...')),
        const SizedBox(height: 14),
        _labeled('Portfolio Website',
            _tf(_portfolioCtrl, 'https://yourportfolio.com')),
      ],
    );
  }

  Widget _buildPreferences() {
    return _SectionCard(
      title: 'Job Preferences',
      icon: Icons.location_on_outlined,
      children: [
        _labeled('Expected CTC (LPA)',
            _tf(_expectedCtcCtrl, '6.5',
                type: const TextInputType.numberWithOptions(decimal: true))),
        const SizedBox(height: 14),
        const Text('Preferred Roles',
            style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w600,
                color: AppColors.textSecondary)),
        const SizedBox(height: 6),
        Row(
          children: [
            Expanded(
                child: _tf(_newRoleCtrl,
                    'E.g., Software Developer, Data Analyst')),
            const SizedBox(width: 8),
            _addBtn(() {
              if (_newRoleCtrl.text.trim().isNotEmpty) {
                setState(() {
                  _preferredRoles.add(_newRoleCtrl.text.trim());
                  _newRoleCtrl.clear();
                });
              }
            }),
          ],
        ),
        if (_preferredRoles.isNotEmpty) ...[
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: _preferredRoles.asMap().entries.map((e) => Chip(
              label: Text(e.value,
                  style: const TextStyle(
                      color: Color(0xFF7C3AED), fontSize: 12)),
              deleteIcon: const Icon(Icons.close,
                  size: 14, color: Color(0xFF7C3AED)),
              onDeleted: () =>
                  setState(() => _preferredRoles.removeAt(e.key)),
              backgroundColor: const Color(0xFFF3E8FF),
              side: const BorderSide(color: Color(0xFFDDD6FE)),
              padding: EdgeInsets.zero,
            )).toList(),
          ),
        ],
        const SizedBox(height: 14),
        const Text('Preferred Locations',
            style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w600,
                color: AppColors.textSecondary)),
        const SizedBox(height: 6),
        Row(
          children: [
            Expanded(
                child: _tf(_newLocationCtrl,
                    'E.g., Bangalore, Chennai, Remote')),
            const SizedBox(width: 8),
            _addBtn(() {
              if (_newLocationCtrl.text.trim().isNotEmpty) {
                setState(() {
                  _preferredLocations
                      .add(_newLocationCtrl.text.trim());
                  _newLocationCtrl.clear();
                });
              }
            }),
          ],
        ),
        if (_preferredLocations.isNotEmpty) ...[
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: _preferredLocations.asMap().entries.map((e) => Chip(
              label: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.location_on,
                      size: 12, color: Color(0xFF16A34A)),
                  const SizedBox(width: 4),
                  Text(e.value,
                      style: const TextStyle(
                          color: Color(0xFF16A34A), fontSize: 12)),
                ],
              ),
              deleteIcon: const Icon(Icons.close,
                  size: 14, color: Color(0xFF16A34A)),
              onDeleted: () =>
                  setState(() => _preferredLocations.removeAt(e.key)),
              backgroundColor: const Color(0xFFDCFCE7),
              side: const BorderSide(color: Color(0xFFBBF7D0)),
              padding: EdgeInsets.zero,
            )).toList(),
          ),
        ],
      ],
    );
  }

  // ── Micro helpers ────────────────────────────────────────────────────────────

  InputDecoration _dec({String? hint}) => InputDecoration(
        hintText: hint,
        contentPadding:
            const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: BorderSide(color: Colors.grey.shade300),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: BorderSide(color: Colors.grey.shade300),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide:
              const BorderSide(color: AppColors.maroon, width: 1.5),
        ),
        filled: true,
        fillColor: Colors.grey.shade50,
      );

  Widget _tf(TextEditingController ctrl, String placeholder,
      {TextInputType? type}) {
    return TextField(
      controller: ctrl,
      keyboardType: type,
      decoration: _dec(hint: placeholder),
      style: const TextStyle(fontSize: 13),
    );
  }

  Widget _labeled(String label, Widget child) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label,
            style: const TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w600,
                color: AppColors.textSecondary)),
        const SizedBox(height: 4),
        child,
      ],
    );
  }

  Widget _rowN(List<Widget> children) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: children.asMap().entries.map((e) {
        return Expanded(
          child: Padding(
            padding: EdgeInsets.only(
                right: e.key < children.length - 1 ? 8 : 0),
            child: e.value,
          ),
        );
      }).toList(),
    );
  }

  Widget _addBtn(VoidCallback onPressed) {
    return Container(
      decoration: BoxDecoration(
          color: AppColors.maroon,
          borderRadius: BorderRadius.circular(10)),
      child: IconButton(
          icon: const Icon(Icons.add, color: Colors.white),
          onPressed: onPressed),
    );
  }

  Widget _chip(String text, VoidCallback onRemove) {
    return Container(
      margin: const EdgeInsets.only(top: 8),
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
          color: Colors.grey.shade50,
          borderRadius: BorderRadius.circular(10)),
      child: Row(
        children: [
          Expanded(
              child:
                  Text(text, style: const TextStyle(fontSize: 13))),
          GestureDetector(
              onTap: onRemove,
              child: const Icon(Icons.close,
                  size: 18, color: AppColors.textSecondary)),
        ],
      ),
    );
  }
}

// ── Supporting widgets ───────────────────────────────────────────────────────

class _StickyTabDelegate extends SliverPersistentHeaderDelegate {
  final Widget child;
  const _StickyTabDelegate({required this.child});
  @override
  Widget build(BuildContext context, double shrinkOffset, bool overlapsContent) =>
      child;
  @override
  double get maxExtent => 56;
  @override
  double get minExtent => 56;
  @override
  bool shouldRebuild(_StickyTabDelegate old) => old.child != child;
}

class _PlacedBanner extends StatelessWidget {
  final String firstName;
  final String company;
  final double? ctc;
  const _PlacedBanner(
      {required this.firstName, required this.company, this.ctc});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
            colors: [Color(0xFFf0fdf4), Color(0xFFdcfce7)]),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFbbf7d0)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
                color: Colors.white,
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(
                      color: Colors.green.shade100, blurRadius: 8)
                ]),
            child: const Icon(Icons.emoji_events_rounded,
                color: Color(0xFF16A34A), size: 28),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Congratulations, $firstName! 🎉',
                    style: const TextStyle(
                        fontWeight: FontWeight.w800,
                        color: Color(0xFF14532D),
                        fontSize: 15)),
                Text('Placed at $company',
                    style: const TextStyle(
                        fontWeight: FontWeight.w600,
                        color: Color(0xFF16A34A),
                        fontSize: 13)),
                if (ctc != null)
                  Container(
                    margin: const EdgeInsets.only(top: 4),
                    padding: const EdgeInsets.symmetric(
                        horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                        color:
                            const Color(0xFFBBF7D0).withOpacity(0.5),
                        borderRadius: BorderRadius.circular(8)),
                    child: Text(
                      'Package: ₹${(ctc! / 100000).toStringAsFixed(1)} LPA',
                      style: const TextStyle(
                          color: Color(0xFF15803D),
                          fontWeight: FontWeight.w700,
                          fontSize: 12),
                    ),
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _MessageBanner extends StatelessWidget {
  final String text;
  final bool isError;
  const _MessageBanner({required this.text, required this.isError});

  @override
  Widget build(BuildContext context) {
    final color =
        isError ? const Color(0xFFDC2626) : const Color(0xFF16A34A);
    final bg =
        isError ? const Color(0xFFFEE2E2) : const Color(0xFFDCFCE7);
    return Container(
      padding: const EdgeInsets.all(14),
      decoration:
          BoxDecoration(color: bg, borderRadius: BorderRadius.circular(12)),
      child: Row(
        children: [
          Icon(
              isError ? Icons.error_outline : Icons.check_circle_outline,
              color: color,
              size: 20),
          const SizedBox(width: 8),
          Expanded(
              child: Text(text,
                  style: TextStyle(
                      color: color,
                      fontWeight: FontWeight.w600,
                      fontSize: 13))),
        ],
      ),
    );
  }
}

class _SectionCard extends StatelessWidget {
  final String title;
  final IconData icon;
  final List<Widget> children;
  const _SectionCard(
      {required this.title,
      required this.icon,
      required this.children});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
              color: Colors.black.withOpacity(0.05), blurRadius: 8)
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 14, 16, 10),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(6),
                  decoration: BoxDecoration(
                      color: AppColors.maroon.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(8)),
                  child: Icon(icon, size: 16, color: AppColors.maroon),
                ),
                const SizedBox(width: 10),
                Text(title,
                    style: const TextStyle(
                        fontWeight: FontWeight.w700,
                        fontSize: 15,
                        color: AppColors.textPrimary)),
              ],
            ),
          ),
          const Divider(height: 1),
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: children),
          ),
        ],
      ),
    );
  }
}

