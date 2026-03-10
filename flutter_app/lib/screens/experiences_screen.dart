import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../constants/colors.dart';
import '../services/api_service.dart';

class ExperiencesScreen extends StatefulWidget {
  const ExperiencesScreen({super.key});

  @override
  State<ExperiencesScreen> createState() => _ExperiencesScreenState();
}

class _ExperiencesScreenState extends State<ExperiencesScreen> {
  final _api = ApiService();
  List<dynamic> _experiences = [];
  List<dynamic> _filtered = [];
  bool _isLoading = true;
  String _searchQuery = '';
  String _selectedVerdict = 'All';

  final _verdicts = ['All', 'Selected', 'Rejected', 'Pending'];

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _isLoading = true);
    try {
      final data = await _api.getExperiences();
      setState(() {
        _experiences = data;
        _applyFilters();
        _isLoading = false;
      });
    } catch (_) {
      setState(() => _isLoading = false);
    }
  }

  void _applyFilters() {
    setState(() {
      _filtered = _experiences.where((e) {
        final matchSearch = _searchQuery.isEmpty ||
            (e['companyName'] ?? '').toLowerCase().contains(_searchQuery.toLowerCase()) ||
            (e['role'] ?? '').toLowerCase().contains(_searchQuery.toLowerCase());
        final matchVerdict = _selectedVerdict == 'All' || (e['verdict'] ?? '') == _selectedVerdict;
        return matchSearch && matchVerdict;
      }).toList();
    });
  }

  Future<void> _likeExperience(String id, int index) async {
    try {
      final updated = await _api.likeExperience(id);
      setState(() {
        _experiences[index] = updated;
        _applyFilters();
      });
    } catch (_) {}
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Interview Experiences', style: TextStyle(fontWeight: FontWeight.w700)),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(110),
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 0, 16, 8),
                child: TextField(
                  onChanged: (v) {
                    _searchQuery = v;
                    _applyFilters();
                  },
                  style: const TextStyle(color: Colors.white),
                  decoration: InputDecoration(
                    hintText: 'Search company or role...',
                    hintStyle: const TextStyle(color: Colors.white60),
                    prefixIcon: const Icon(Icons.search_rounded, color: Colors.white60),
                    filled: true,
                    fillColor: Colors.white.withOpacity(0.15),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide.none,
                    ),
                    contentPadding: const EdgeInsets.symmetric(vertical: 10),
                  ),
                ),
              ),
              SizedBox(
                height: 40,
                child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: _verdicts.length,
                  separatorBuilder: (_, __) => const SizedBox(width: 8),
                  itemBuilder: (_, i) {
                    final v = _verdicts[i];
                    final sel = _selectedVerdict == v;
                    return ChoiceChip(
                      label: Text(v),
                      selected: sel,
                      onSelected: (_) {
                        _selectedVerdict = v;
                        _applyFilters();
                      },
                      selectedColor: AppColors.gold,
                      labelStyle: TextStyle(
                        color: sel ? AppColors.maroon : Colors.white70,
                        fontWeight: FontWeight.w600,
                        fontSize: 12,
                      ),
                      backgroundColor: Colors.white.withOpacity(0.15),
                    );
                  },
                ),
              ),
              const SizedBox(height: 8),
            ],
          ),
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _filtered.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.rate_review_outlined, size: 64, color: AppColors.textSecondary.withOpacity(0.4)),
                      const SizedBox(height: 16),
                      const Text('No experiences found', style: TextStyle(color: AppColors.textSecondary, fontSize: 15)),
                    ],
                  ),
                )
              : RefreshIndicator(
                  onRefresh: _load,
                  child: ListView.separated(
                    padding: const EdgeInsets.all(16),
                    itemCount: _filtered.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 12),
                    itemBuilder: (_, i) => _ExperienceCard(
                      experience: _filtered[i],
                      onLike: () {
                        final globalIndex = _experiences.indexOf(_filtered[i]);
                        if (globalIndex != -1) {
                          _likeExperience(_filtered[i]['_id'], globalIndex);
                        }
                      },
                    ),
                  ),
                ),
    );
  }
}

class _ExperienceCard extends StatelessWidget {
  final dynamic experience;
  final VoidCallback onLike;

  const _ExperienceCard({required this.experience, required this.onLike});

  Color get _verdictColor {
    switch (experience['verdict']) {
      case 'Selected': return AppColors.success;
      case 'Rejected': return AppColors.error;
      default: return AppColors.warning;
    }
  }

  @override
  Widget build(BuildContext context) {
    final student = experience['studentId'] as Map<String, dynamic>?;
    final rounds = (experience['rounds'] as List<dynamic>?) ?? [];
    final likes = (experience['likes'] as List<dynamic>?) ?? [];
    final difficulty = (experience['difficulty'] ?? 3) as int;

    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      child: InkWell(
        borderRadius: BorderRadius.circular(14),
        onTap: () => _showDetail(context),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Row(
                children: [
                  CircleAvatar(
                    radius: 22,
                    backgroundColor: AppColors.maroon.withOpacity(0.1),
                    child: Text(
                      (experience['companyName'] ?? 'X')[0].toUpperCase(),
                      style: const TextStyle(color: AppColors.maroon, fontWeight: FontWeight.w700, fontSize: 18),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(experience['companyName'] ?? '',
                            style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 15, color: AppColors.textPrimary)),
                        Text(
                          '${experience['role'] ?? ''} • ${experience['type'] ?? 'Full Time'} • ${experience['year'] ?? ''}',
                          style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: _verdictColor.withOpacity(0.12),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      experience['verdict'] ?? 'Unknown',
                      style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: _verdictColor),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),

              // Difficulty + student
              Row(
                children: [
                  const Text('Difficulty: ', style: TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                  ...List.generate(5, (i) => Icon(
                    i < difficulty ? Icons.star_rounded : Icons.star_outline_rounded,
                    size: 14,
                    color: AppColors.gold,
                  )),
                  const Spacer(),
                  if (student != null)
                    Text(
                      '${student['firstName'] ?? ''} ${student['lastName'] ?? ''}'.trim(),
                      style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                    ),
                ],
              ),

              // Rounds summary
              if (rounds.isNotEmpty) ...[
                const SizedBox(height: 10),
                Wrap(
                  spacing: 6,
                  runSpacing: 4,
                  children: rounds.map((r) => Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: AppColors.info.withOpacity(0.08),
                      borderRadius: BorderRadius.circular(6),
                      border: Border.all(color: AppColors.info.withOpacity(0.2)),
                    ),
                    child: Text(
                      r['roundName'] ?? 'Round',
                      style: const TextStyle(fontSize: 11, color: AppColors.info, fontWeight: FontWeight.w600),
                    ),
                  )).toList(),
                ),
              ],

              const SizedBox(height: 12),
              Row(
                children: [
                  const Icon(Icons.thumb_up_outlined, size: 15, color: AppColors.textSecondary),
                  const SizedBox(width: 4),
                  Text('${likes.length}', style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                  const Spacer(),
                  const Text(
                    'Tap to read more',
                    style: TextStyle(fontSize: 12, color: AppColors.info),
                  ),
                  const Icon(Icons.chevron_right_rounded, size: 16, color: AppColors.info),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showDetail(BuildContext context) {
    final rounds = (experience['rounds'] as List<dynamic>?) ?? [];
    final tips = experience['tips'] as String?;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => DraggableScrollableSheet(
        initialChildSize: 0.85,
        minChildSize: 0.5,
        maxChildSize: 0.95,
        builder: (_, ctrl) => Container(
          decoration: const BoxDecoration(
            color: AppColors.background,
            borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
          ),
          child: Column(
            children: [
              // Handle
              Container(
                margin: const EdgeInsets.only(top: 12),
                width: 40, height: 4,
                decoration: BoxDecoration(color: Colors.grey[300], borderRadius: BorderRadius.circular(2)),
              ),
              Expanded(
                child: ListView(
                  controller: ctrl,
                  padding: const EdgeInsets.all(20),
                  children: [
                    Text(
                      '${experience['companyName']} — ${experience['role']}',
                      style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                    ),
                    const SizedBox(height: 16),
                    ...rounds.map((r) => _RoundDetail(round: r)),
                    if (tips != null && tips.isNotEmpty) ...[
                      const SizedBox(height: 16),
                      const Text('Tips', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: AppColors.maroon)),
                      const SizedBox(height: 8),
                      Container(
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: AppColors.gold.withOpacity(0.08),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: AppColors.gold.withOpacity(0.2)),
                        ),
                        child: Text(tips, style: const TextStyle(fontSize: 13, color: AppColors.textPrimary, height: 1.6)),
                      ),
                    ],
                    const SizedBox(height: 20),
                    OutlinedButton.icon(
                      onPressed: onLike,
                      icon: const Icon(Icons.thumb_up_outlined, size: 16),
                      label: const Text('Helpful'),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: AppColors.maroon,
                        side: const BorderSide(color: AppColors.maroon),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _RoundDetail extends StatelessWidget {
  final dynamic round;
  const _RoundDetail({required this.round});

  @override
  Widget build(BuildContext context) {
    final questions = (round['questions'] as List<dynamic>?) ?? [];
    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 6, offset: const Offset(0, 2))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(round['roundName'] ?? 'Round',
              style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14, color: AppColors.textPrimary)),
          if (round['description'] != null && (round['description'] as String).isNotEmpty) ...[
            const SizedBox(height: 6),
            Text(round['description'], style: const TextStyle(fontSize: 13, color: AppColors.textSecondary, height: 1.5)),
          ],
          if (questions.isNotEmpty) ...[
            const SizedBox(height: 10),
            const Text('Questions Asked:', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.maroon)),
            const SizedBox(height: 6),
            ...questions.map((q) => Padding(
              padding: const EdgeInsets.only(bottom: 4),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('• ', style: TextStyle(color: AppColors.maroon, fontWeight: FontWeight.w700)),
                  Expanded(child: Text(q.toString(), style: const TextStyle(fontSize: 12, color: AppColors.textPrimary))),
                ],
              ),
            )),
          ],
        ],
      ),
    );
  }
}
