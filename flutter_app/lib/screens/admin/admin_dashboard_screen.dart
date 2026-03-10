import 'package:flutter/material.dart';
import '../../constants/colors.dart';
import '../../services/api_service.dart';
import '../../services/auth_service.dart';
import 'package:provider/provider.dart';
import 'admin_announcements_screen.dart';
import 'admin_ticker_screen.dart';
import 'admin_prep_hub_screen.dart';
import 'admin_reports_screen.dart';
import 'admin_analytics_screen.dart';

class AdminDashboardScreen extends StatefulWidget {
  const AdminDashboardScreen({super.key});

  @override
  State<AdminDashboardScreen> createState() => _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends State<AdminDashboardScreen> {
  final _api = ApiService();
  Map<String, dynamic> _stats = {};
  List<dynamic> _students = [];
  bool _loading = true;
  String _search = '';

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final stats = await _api.getAdminStats();
      final students = await _api.getAdminStudents();
      setState(() {
        _stats = stats;
        _students = students;
        _loading = false;
      });
    } catch (_) {
      setState(() => _loading = false);
    }
  }

  List<dynamic> get _filteredStudents {
    if (_search.isEmpty) return _students.take(50).toList();
    final q = _search.toLowerCase();
    return _students.where((s) {
      return (s['name'] ?? '').toString().toLowerCase().contains(q) ||
          (s['email'] ?? '').toString().toLowerCase().contains(q) ||
          (s['department'] ?? '').toString().toLowerCase().contains(q);
    }).take(50).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Admin Dashboard', style: TextStyle(fontWeight: FontWeight.w700)),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout_rounded),
            onPressed: () async {
              final confirm = await showDialog<bool>(
                context: context,
                builder: (_) => AlertDialog(
                  title: const Text('Sign Out'),
                  content: const Text('Sign out of admin?'),
                  actions: [
                    TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancel')),
                    ElevatedButton(onPressed: () => Navigator.pop(context, true), child: const Text('Sign Out')),
                  ],
                ),
              );
              if (confirm == true && context.mounted) {
                context.read<AuthService>().logout();
              }
            },
          ),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _load,
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Stats grid
                    _buildStatsGrid(),
                    const SizedBox(height: 20),

                    // Admin Quick Actions
                    const Text('Quick Actions', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
                    const SizedBox(height: 12),
                    _buildQuickActions(context),
                    const SizedBox(height: 20),

                    // Students list
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Students', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
                        Text('${_students.length} total', style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                      ],
                    ),
                    const SizedBox(height: 10),
                    TextField(
                      onChanged: (v) => setState(() => _search = v),
                      decoration: const InputDecoration(
                        hintText: 'Search students...',
                        prefixIcon: Icon(Icons.search_rounded),
                        isDense: true,
                      ),
                    ),
                    const SizedBox(height: 12),
                    ..._filteredStudents.map((s) => _StudentTile(student: s)),
                    if (_filteredStudents.isEmpty)
                      const Center(child: Padding(
                        padding: EdgeInsets.symmetric(vertical: 24),
                        child: Text('No students found', style: TextStyle(color: AppColors.textSecondary)),
                      )),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildStatsGrid() {
    final cards = [
      _StatItem('Students', _stats['studentCount']?.toString() ?? '0', Icons.people_rounded, AppColors.info),
      _StatItem('Drives', _stats['driveCount']?.toString() ?? '0', Icons.business_rounded, AppColors.maroon),
      _StatItem('Placed', _stats['placedStudents']?.toString() ?? '0', Icons.check_circle_rounded, AppColors.success),
      _StatItem('Alumni', _stats['alumniCount']?.toString() ?? '0', Icons.school_rounded, AppColors.gold),
    ];
    return GridView.count(
      crossAxisCount: 2,
      crossAxisSpacing: 12,
      mainAxisSpacing: 12,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      childAspectRatio: 1.6,
      children: cards.map((c) => _AdminStatCard(item: c)).toList(),
    );
  }

  Widget _buildQuickActions(BuildContext context) {
    final actions = [
      _ActionItem('Announcements', Icons.campaign_rounded, AppColors.maroon, () =>
          Navigator.push(context, MaterialPageRoute(builder: (_) => const AdminAnnouncementsScreen()))),
      _ActionItem('Analytics', Icons.bar_chart_rounded, AppColors.info, () =>
          Navigator.push(context, MaterialPageRoute(builder: (_) => const AdminAnalyticsScreen()))),
      _ActionItem('Reports', Icons.description_rounded, AppColors.success, () =>
          Navigator.push(context, MaterialPageRoute(builder: (_) => const AdminReportsScreen()))),
      _ActionItem('Ticker', Icons.info_rounded, AppColors.gold, () =>
          Navigator.push(context, MaterialPageRoute(builder: (_) => const AdminTickerScreen()))),
      _ActionItem('PrepHub', Icons.menu_book_rounded, Colors.teal, () =>
          Navigator.push(context, MaterialPageRoute(builder: (_) => const AdminPrepHubScreen()))),
    ];
    return SizedBox(
      height: 90,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: actions.length,
        separatorBuilder: (_, __) => const SizedBox(width: 10),
        itemBuilder: (_, i) {
          final a = actions[i];
          return GestureDetector(
            onTap: a.onTap,
            child: Container(
              width: 80,
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: a.color.withOpacity(0.1),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: a.color.withOpacity(0.25)),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(a.icon, color: a.color, size: 26),
                  const SizedBox(height: 6),
                  Text(a.label, style: TextStyle(fontSize: 10, color: a.color, fontWeight: FontWeight.w600), textAlign: TextAlign.center),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}

class _StatItem {
  final String label;
  final String value;
  final IconData icon;
  final Color color;
  const _StatItem(this.label, this.value, this.icon, this.color);
}

class _ActionItem {
  final String label;
  final IconData icon;
  final Color color;
  final VoidCallback onTap;
  const _ActionItem(this.label, this.icon, this.color, this.onTap);
}

class _AdminStatCard extends StatelessWidget {
  final _StatItem item;
  const _AdminStatCard({required this.item});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 6)],
      ),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(color: item.color.withOpacity(0.1), borderRadius: BorderRadius.circular(10)),
            child: Icon(item.icon, color: item.color, size: 22),
          ),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(item.value, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.textPrimary)),
              Text(item.label, style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
            ],
          ),
        ],
      ),
    );
  }
}

class _StudentTile extends StatelessWidget {
  final dynamic student;
  const _StudentTile({required this.student});

  @override
  Widget build(BuildContext context) {
    final name = student['name'] ?? student['firstName'] ?? 'Student';
    final email = student['email'] ?? '';
    final dept = student['department'] ?? '';
    final status = student['placementStatus'] ?? 'unplaced';
    final isPlaced = status == 'placed';
    final avatar = (name as String).isNotEmpty ? name[0].toUpperCase() : 'S';

    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 4)],
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 20,
            backgroundColor: AppColors.maroon.withOpacity(0.1),
            child: Text(avatar, style: const TextStyle(color: AppColors.maroon, fontWeight: FontWeight.w700)),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(name, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                Text(email, style: const TextStyle(fontSize: 11, color: AppColors.textSecondary), overflow: TextOverflow.ellipsis),
                if (dept.isNotEmpty)
                  Text(dept, style: const TextStyle(fontSize: 10, color: AppColors.textSecondary)),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
            decoration: BoxDecoration(
              color: (isPlaced ? AppColors.success : Colors.orange).withOpacity(0.1),
              borderRadius: BorderRadius.circular(6),
            ),
            child: Text(
              isPlaced ? 'Placed' : 'Active',
              style: TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: isPlaced ? AppColors.success : Colors.orange),
            ),
          ),
        ],
      ),
    );
  }
}
