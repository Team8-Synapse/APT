import 'package:flutter/material.dart';
import '../constants/colors.dart';
import '../services/api_service.dart';

class AlumniInsightsScreen extends StatefulWidget {
  const AlumniInsightsScreen({super.key});

  @override
  State<AlumniInsightsScreen> createState() => _AlumniInsightsScreenState();
}

class _AlumniInsightsScreenState extends State<AlumniInsightsScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final _api = ApiService();
  final _searchCtrl = TextEditingController();

  // Insights tab state
  List<dynamic> _insights = [];
  List<dynamic> _filteredInsights = [];
  bool _insightsLoading = true;
  String _selectedDifficulty = 'All';
  final _difficulties = ['All', 'Easy', 'Medium', 'Hard', 'Very Hard'];

  // Directory tab state
  List<dynamic> _directory = [];
  bool _directoryLoading = true;
  String _directorySearch = '';

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _tabController.addListener(() {
      if (!_tabController.indexIsChanging) setState(() {});
    });
    _loadInsights();
    _loadDirectory();
  }

  @override
  void dispose() {
    _tabController.dispose();
    _searchCtrl.dispose();
    super.dispose();
  }

  // ── Insights ──────────────────────────────────────────────────────────────

  Future<void> _loadInsights() async {
    setState(() => _insightsLoading = true);
    try {
      final data = await _api.getAlumniInsights();
      setState(() {
        _insights = data;
        _applyInsightFilters();
        _insightsLoading = false;
      });
    } catch (_) {
      setState(() => _insightsLoading = false);
    }
  }

  void _applyInsightFilters() {
    final q = _searchCtrl.text.toLowerCase();
    setState(() {
      _filteredInsights = _insights.where((ins) {
        final matchSearch = q.isEmpty ||
            (ins['company'] ?? '').toLowerCase().contains(q) ||
            (ins['alumniName'] ?? '').toLowerCase().contains(q) ||
            (ins['currentRole'] ?? '').toLowerCase().contains(q);
        final matchDiff = _selectedDifficulty == 'All' ||
            (ins['difficultyLevel'] ?? '') == _selectedDifficulty;
        return matchSearch && matchDiff;
      }).toList();
    });
  }

  // ── Directory ─────────────────────────────────────────────────────────────

  Future<void> _loadDirectory({String company = ''}) async {
    setState(() => _directoryLoading = true);
    try {
      final data = await _api.getAlumniDirectory(company: company.isEmpty ? null : company);
      setState(() { _directory = data; _directoryLoading = false; });
    } catch (_) {
      setState(() => _directoryLoading = false);
    }
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
        title: const Text('Alumni', style: TextStyle(fontWeight: FontWeight.w700)),
        bottom: TabBar(
          controller: _tabController,
          labelColor: AppColors.gold,
          unselectedLabelColor: Colors.white70,
          indicatorColor: AppColors.gold,
          tabs: const [
            Tab(icon: Icon(Icons.people_alt_rounded), text: 'Directory'),
            Tab(icon: Icon(Icons.insights_rounded), text: 'Insights'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildDirectoryTab(),
          _buildInsightsTab(),
        ],
      ),
    );
  }

  // ── Directory Tab ─────────────────────────────────────────────────────────

  Widget _buildDirectoryTab() {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(14),
          child: TextField(
            decoration: InputDecoration(
              hintText: 'Find mentors by company (e.g. Google)...',
              prefixIcon: const Icon(Icons.search_rounded),
              suffixIcon: _directorySearch.isNotEmpty
                  ? IconButton(
                      icon: const Icon(Icons.clear),
                      onPressed: () {
                        setState(() => _directorySearch = '');
                        _loadDirectory();
                      })
                  : null,
            ),
            onChanged: (v) {
              _directorySearch = v;
              Future.delayed(const Duration(milliseconds: 500), () {
                if (_directorySearch == v) _loadDirectory(company: v);
              });
            },
          ),
        ),
        Expanded(
          child: _directoryLoading
              ? const Center(child: CircularProgressIndicator())
              : _directory.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.people_outline_rounded, size: 56, color: Colors.grey.shade300),
                          const SizedBox(height: 12),
                          Text(
                            _directorySearch.isEmpty
                                ? 'No alumni in the directory yet.'
                                : 'No alumni found for "$_directorySearch".',
                            style: TextStyle(color: Colors.grey.shade500),
                            textAlign: TextAlign.center,
                          ),
                        ],
                      ),
                    )
                  : RefreshIndicator(
                      onRefresh: () => _loadDirectory(company: _directorySearch),
                      child: ListView.separated(
                        padding: const EdgeInsets.fromLTRB(14, 0, 14, 16),
                        itemCount: _directory.length,
                        separatorBuilder: (_, __) => const SizedBox(height: 10),
                        itemBuilder: (_, i) => _DirectoryCard(person: _directory[i]),
                      ),
                    ),
        ),
      ],
    );
  }

  // ── Insights Tab ─────────────────────────────────────────────────────────

  Widget _buildInsightsTab() {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(14, 12, 14, 4),
          child: TextField(
            controller: _searchCtrl,
            onChanged: (_) => _applyInsightFilters(),
            decoration: const InputDecoration(
              hintText: 'Search company, alumni or role...',
              prefixIcon: Icon(Icons.search_rounded),
            ),
          ),
        ),
        SizedBox(
          height: 48,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
            itemCount: _difficulties.length,
            separatorBuilder: (_, __) => const SizedBox(width: 8),
            itemBuilder: (_, i) {
              final d = _difficulties[i];
              final sel = _selectedDifficulty == d;
              return GestureDetector(
                onTap: () {
                  setState(() => _selectedDifficulty = d);
                  _applyInsightFilters();
                },
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                  decoration: BoxDecoration(
                    color: sel ? AppColors.maroon : Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: sel ? AppColors.maroon : Colors.grey.shade200),
                  ),
                  child: Text(d, style: TextStyle(
                    color: sel ? Colors.white : AppColors.textPrimary,
                    fontWeight: FontWeight.w600,
                    fontSize: 12,
                  )),
                ),
              );
            },
          ),
        ),
        Expanded(
          child: _insightsLoading
              ? const Center(child: CircularProgressIndicator())
              : _filteredInsights.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.insights_outlined, size: 56, color: Colors.grey.shade300),
                          const SizedBox(height: 12),
                          Text('No insights found', style: TextStyle(color: Colors.grey.shade500)),
                        ],
                      ),
                    )
                  : RefreshIndicator(
                      onRefresh: _loadInsights,
                      child: ListView.separated(
                        padding: const EdgeInsets.all(14),
                        itemCount: _filteredInsights.length,
                        separatorBuilder: (_, __) => const SizedBox(height: 12),
                        itemBuilder: (_, i) => _InsightCard(
                          insight: _filteredInsights[i],
                          difficultyColor: _difficultyColor(_filteredInsights[i]['difficultyLevel']),
                        ),
                      ),
                    ),
        ),
      ],
    );
  }
}

// ─── Directory Card ───────────────────────────────────────────────────────────
class _DirectoryCard extends StatelessWidget {
  final dynamic person;
  const _DirectoryCard({required this.person});

  @override
  Widget build(BuildContext context) {
    final name = person['name'] ?? person['studentName'] ?? 'Alumni';
    final company = person['company'] ?? person['offeredCompany'] ?? '';
    final role = person['role'] ?? person['offeredRole'] ?? '';
    final batch = person['batch'] ?? person['graduationYear'] ?? '';
    final dept = person['department'] ?? '';
    final avatar = (name as String).isNotEmpty ? name[0].toUpperCase() : 'A';

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 6)],
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 24,
            backgroundColor: AppColors.maroon.withOpacity(0.1),
            child: Text(avatar, style: const TextStyle(color: AppColors.maroon, fontWeight: FontWeight.w700, fontSize: 18)),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(name, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14, color: AppColors.textPrimary)),
                if (company.isNotEmpty) ...[
                  const SizedBox(height: 2),
                  Row(children: [
                    const Icon(Icons.business_rounded, size: 13, color: AppColors.maroon),
                    const SizedBox(width: 4),
                    Text(company, style: const TextStyle(fontSize: 12, color: AppColors.maroon, fontWeight: FontWeight.w600)),
                  ]),
                ],
                if (role.isNotEmpty) ...[
                  const SizedBox(height: 2),
                  Text(role, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                ],
                if (batch.isNotEmpty || dept.isNotEmpty) ...[
                  const SizedBox(height: 2),
                  Text('${dept.isNotEmpty ? dept : ''}${dept.isNotEmpty && batch.isNotEmpty ? ' • ' : ''}${batch.isNotEmpty ? batch : ''}',
                      style: TextStyle(fontSize: 11, color: Colors.grey.shade400)),
                ],
              ],
            ),
          ),
          IconButton(
            icon: const Icon(Icons.message_rounded, color: AppColors.info),
            onPressed: () => _showMessageDialog(context, name, company, role),
          ),
        ],
      ),
    );
  }

  void _showMessageDialog(BuildContext context, String name, String company, String role) {
    final firstName = name.split(' ')[0];
    final msg = 'Hi $firstName, I am a junior at Amrita. I saw you are working as $role at $company. I would love to connect and learn from your experience.\n\nThanks!';
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Message Template', style: TextStyle(fontWeight: FontWeight.w700)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(msg, style: const TextStyle(fontSize: 13, color: AppColors.textPrimary)),
            const SizedBox(height: 12),
            const Text('Copy this message to reach out on LinkedIn or email.',
                style: TextStyle(fontSize: 11, color: AppColors.textSecondary)),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Close')),
          ElevatedButton.icon(
            onPressed: () {
              // Show snack after copy (clipboard API not always available)
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Message template ready to use!'), behavior: SnackBarBehavior.floating),
              );
            },
            icon: const Icon(Icons.copy_rounded, size: 16),
            label: const Text('Copy'),
          ),
        ],
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
                  const Icon(Icons.format_list_bulleted_rounded, size: 13, color: AppColors.textSecondary),
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
