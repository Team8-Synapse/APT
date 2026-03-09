import 'package:flutter/material.dart';
import '../constants/colors.dart';
import '../services/api_service.dart';

class AlumniInsightsScreen extends StatefulWidget {
  const AlumniInsightsScreen({super.key});

  @override
  State<AlumniInsightsScreen> createState() => _AlumniInsightsScreenState();
}

class _AlumniInsightsScreenState extends State<AlumniInsightsScreen> {
  final _api = ApiService();
  List<dynamic> _insights = [];
  List<dynamic> _filtered = [];
  bool _isLoading = true;
  String _searchQuery = '';
  String _selectedDifficulty = 'All';

  final _difficulties = ['All', 'Easy', 'Medium', 'Hard', 'Very Hard'];

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _isLoading = true);
    try {
      final data = await _api.getAlumniInsights();
      setState(() {
        _insights = data;
        _applyFilters();
        _isLoading = false;
      });
    } catch (_) {
      setState(() => _isLoading = false);
    }
  }

  void _applyFilters() {
    setState(() {
      _filtered = _insights.where((ins) {
        final matchSearch = _searchQuery.isEmpty ||
            (ins['company'] ?? '').toLowerCase().contains(_searchQuery.toLowerCase()) ||
            (ins['alumniName'] ?? '').toLowerCase().contains(_searchQuery.toLowerCase()) ||
            (ins['currentRole'] ?? '').toLowerCase().contains(_searchQuery.toLowerCase());
        final matchDiff = _selectedDifficulty == 'All' ||
            (ins['difficultyLevel'] ?? '') == _selectedDifficulty;
        return matchSearch && matchDiff;
      }).toList();
    });
  }

  Color _difficultyColor(String? d) {
    switch (d) {
      case 'Easy': return AppColors.success;
      case 'Medium': return AppColors.warning;
      case 'Hard': return AppColors.error;
      case 'Very Hard': return const Color(0xFF7C3AED);
      default: return AppColors.textSecondary;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Alumni Insights', style: TextStyle(fontWeight: FontWeight.w700)),
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
                    hintText: 'Search company, alumni or role...',
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
                  itemCount: _difficulties.length,
                  separatorBuilder: (_, __) => const SizedBox(width: 8),
                  itemBuilder: (_, i) {
                    final d = _difficulties[i];
                    final sel = _selectedDifficulty == d;
                    return ChoiceChip(
                      label: Text(d),
                      selected: sel,
                      onSelected: (_) {
                        _selectedDifficulty = d;
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
                      Icon(Icons.people_outline_rounded, size: 64, color: AppColors.textSecondary.withOpacity(0.4)),
                      const SizedBox(height: 16),
                      const Text('No insights found', style: TextStyle(color: AppColors.textSecondary, fontSize: 15)),
                    ],
                  ),
                )
              : RefreshIndicator(
                  onRefresh: _load,
                  child: ListView.separated(
                    padding: const EdgeInsets.all(16),
                    itemCount: _filtered.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 12),
                    itemBuilder: (_, i) => _InsightCard(
                      insight: _filtered[i],
                      difficultyColor: _difficultyColor(_filtered[i]['difficultyLevel']),
                    ),
                  ),
                ),
    );
  }
}

class _InsightCard extends StatelessWidget {
  final dynamic insight;
  final Color difficultyColor;

  const _InsightCard({required this.insight, required this.difficultyColor});

  @override
  Widget build(BuildContext context) {
    final rounds = (insight['rounds'] as List<dynamic>?) ?? [];
    final tips = (insight['preparationTips'] as List<dynamic>?) ?? [];
    final offer = insight['offerDetails'] as Map<String, dynamic>?;
    final rating = (insight['overallRating'] ?? 0) as int;
    final verified = insight['verified'] == true;

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
              // Company + verified
              Row(
                children: [
                  CircleAvatar(
                    radius: 22,
                    backgroundColor: AppColors.maroon.withOpacity(0.1),
                    child: Text(
                      (insight['company'] ?? 'A')[0].toUpperCase(),
                      style: const TextStyle(color: AppColors.maroon, fontWeight: FontWeight.w700, fontSize: 18),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Text(insight['company'] ?? '',
                                style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 15, color: AppColors.textPrimary)),
                            if (verified) ...[
                              const SizedBox(width: 6),
                              const Icon(Icons.verified_rounded, size: 14, color: AppColors.info),
                            ],
                          ],
                        ),
                        Text(
                          '${insight['alumniName'] ?? ''} • ${insight['batch'] ?? ''} • ${insight['department'] ?? ''}',
                          style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),

              // Role + Difficulty + Rating
              Row(
                children: [
                  if (insight['currentRole'] != null)
                    Expanded(
                      child: Row(
                        children: [
                          const Icon(Icons.work_outline_rounded, size: 13, color: AppColors.textSecondary),
                          const SizedBox(width: 4),
                          Expanded(
                            child: Text(
                              insight['currentRole'] ?? '',
                              style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                    ),
                  if (insight['difficultyLevel'] != null)
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: difficultyColor.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        insight['difficultyLevel'],
                        style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: difficultyColor),
                      ),
                    ),
                ],
              ),

              // Stars
              if (rating > 0) ...[
                const SizedBox(height: 8),
                Row(
                  children: [
                    ...List.generate(5, (i) => Icon(
                      i < rating ? Icons.star_rounded : Icons.star_outline_rounded,
                      size: 14,
                      color: AppColors.gold,
                    )),
                    const SizedBox(width: 6),
                    Text('$rating / 5', style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
                  ],
                ),
              ],

              // Offer details
              if (offer != null && offer['ctc'] != null) ...[
                const SizedBox(height: 8),
                Row(
                  children: [
                    const Icon(Icons.currency_rupee_rounded, size: 13, color: AppColors.success),
                    Text(
                      '${offer['ctc']} LPA${offer['role'] != null ? ' — ${offer['role']}' : ''}',
                      style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.success),
                    ),
                  ],
                ),
              ],

              const SizedBox(height: 10),
              Row(
                children: [
                  Icon(Icons.format_list_bulleted_rounded, size: 13, color: AppColors.textSecondary),
                  const SizedBox(width: 4),
                  Text('${rounds.length} round${rounds.length == 1 ? '' : 's'}',
                      style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                  const Spacer(),
                  const Text('Read full insight', style: TextStyle(fontSize: 12, color: AppColors.info)),
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
    final rounds = (insight['rounds'] as List<dynamic>?) ?? [];
    final tips = (insight['preparationTips'] as List<dynamic>?) ?? [];
    final resources = (insight['resourcesUsed'] as List<dynamic>?) ?? [];

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => DraggableScrollableSheet(
        initialChildSize: 0.9,
        minChildSize: 0.5,
        maxChildSize: 0.95,
        builder: (_, ctrl) => Container(
          decoration: const BoxDecoration(
            color: AppColors.background,
            borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
          ),
          child: Column(
            children: [
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
                    // Header
                    Text(
                      insight['company'] ?? '',
                      style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                    ),
                    Text(
                      'by ${insight['alumniName'] ?? ''} (${insight['batch'] ?? ''}, ${insight['department'] ?? ''})',
                      style: const TextStyle(fontSize: 13, color: AppColors.textSecondary),
                    ),
                    const SizedBox(height: 16),

                    // Experience overview
                    if (insight['experience'] != null && (insight['experience'] as String).isNotEmpty) ...[
                      const Text('Overview', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: AppColors.maroon)),
                      const SizedBox(height: 8),
                      Text(insight['experience'],
                          style: const TextStyle(fontSize: 13, color: AppColors.textPrimary, height: 1.6)),
                      const SizedBox(height: 16),
                    ],

                    // Rounds
                    if (rounds.isNotEmpty) ...[
                      const Text('Interview Rounds',
                          style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: AppColors.maroon)),
                      const SizedBox(height: 10),
                      ...rounds.map((r) => _AlumniRoundCard(round: r)),
                    ],

                    // Prep tips
                    if (tips.isNotEmpty) ...[
                      const SizedBox(height: 16),
                      const Text('Preparation Tips',
                          style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: AppColors.maroon)),
                      const SizedBox(height: 8),
                      Container(
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: AppColors.gold.withOpacity(0.08),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: AppColors.gold.withOpacity(0.2)),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: tips.map((t) => Padding(
                            padding: const EdgeInsets.only(bottom: 6),
                            child: Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text('✓ ', style: TextStyle(color: AppColors.gold, fontWeight: FontWeight.w700)),
                                Expanded(child: Text(t.toString(), style: const TextStyle(fontSize: 13, color: AppColors.textPrimary))),
                              ],
                            ),
                          )).toList(),
                        ),
                      ),
                    ],

                    // Resources
                    if (resources.isNotEmpty) ...[
                      const SizedBox(height: 16),
                      const Text('Resources Used',
                          style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: AppColors.maroon)),
                      const SizedBox(height: 8),
                      Wrap(
                        spacing: 8,
                        runSpacing: 6,
                        children: resources.map((r) => Chip(
                          label: Text(r.toString(), style: const TextStyle(fontSize: 12)),
                          backgroundColor: AppColors.info.withOpacity(0.08),
                          side: const BorderSide(color: AppColors.info, width: 0.5),
                        )).toList(),
                      ),
                    ],
                    const SizedBox(height: 20),
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

class _AlumniRoundCard extends StatelessWidget {
  final dynamic round;
  const _AlumniRoundCard({required this.round});

  @override
  Widget build(BuildContext context) {
    final questions = (round['questions'] as List<dynamic>?) ?? [];
    final topics = (round['topics'] as List<dynamic>?) ?? [];

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 6, offset: const Offset(0, 2))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Text(round['name'] ?? 'Round',
                    style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13, color: AppColors.textPrimary)),
              ),
              if (round['type'] != null)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(
                    color: AppColors.maroon.withOpacity(0.08),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(round['type'],
                      style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: AppColors.maroon)),
                ),
            ],
          ),
          if (round['duration'] != null) ...[
            const SizedBox(height: 4),
            Text('Duration: ${round['duration']}',
                style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
          ],
          if (topics.isNotEmpty) ...[
            const SizedBox(height: 8),
            Wrap(
              spacing: 6, runSpacing: 4,
              children: topics.map((t) => Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: AppColors.info.withOpacity(0.08),
                  borderRadius: BorderRadius.circular(4),
                ),
                child: Text(t.toString(), style: const TextStyle(fontSize: 10, color: AppColors.info)),
              )).toList(),
            ),
          ],
          if (questions.isNotEmpty) ...[
            const SizedBox(height: 8),
            const Text('Questions:', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.maroon)),
            const SizedBox(height: 4),
            ...questions.map((q) => Padding(
              padding: const EdgeInsets.only(bottom: 3),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('• ', style: TextStyle(color: AppColors.maroon)),
                  Expanded(child: Text(q.toString(), style: const TextStyle(fontSize: 12, color: AppColors.textPrimary))),
                ],
              ),
            )),
          ],
          if (round['tips'] != null && (round['tips'] as String).isNotEmpty) ...[
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(color: AppColors.gold.withOpacity(0.07), borderRadius: BorderRadius.circular(8)),
              child: Text('💡 ${round['tips']}',
                  style: const TextStyle(fontSize: 12, color: AppColors.textPrimary, fontStyle: FontStyle.italic)),
            ),
          ],
        ],
      ),
    );
  }
}
