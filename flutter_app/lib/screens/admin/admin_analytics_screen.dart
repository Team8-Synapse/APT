import 'package:flutter/material.dart';
import '../../constants/colors.dart';
import '../../services/api_service.dart';

class AdminAnalyticsScreen extends StatefulWidget {
  const AdminAnalyticsScreen({super.key});

  @override
  State<AdminAnalyticsScreen> createState() => _AdminAnalyticsScreenState();
}

class _AdminAnalyticsScreenState extends State<AdminAnalyticsScreen> {
  final _api = ApiService();
  Map<String, dynamic> _stats = {};
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final data = await _api.getAdminStats();
      setState(() { _stats = data; _loading = false; });
    } catch (_) {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final placed = _stats['placedStudents'] as int? ?? 0;
    final total = _stats['studentCount'] as int? ?? 0;
    final percentage = total > 0 ? (placed / total * 100) : 0.0;
    final ctcStats = _stats['ctcStats'] as Map<String, dynamic>? ?? {};
    final deptStats = (_stats['departmentStats'] as List<dynamic>?) ?? [];

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Placement Analytics', style: TextStyle(fontWeight: FontWeight.w700)),
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
                    // Placement gauge
                    const _SectionTitle('Placement Overview'),
                    const SizedBox(height: 12),
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 6)],
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text('Placement Rate', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 15)),
                              Text('${percentage.toStringAsFixed(1)}%',
                                  style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 18, color: AppColors.maroon)),
                            ],
                          ),
                          const SizedBox(height: 10),
                          LinearProgressIndicator(
                            value: percentage / 100,
                            backgroundColor: Colors.grey.shade100,
                            valueColor: const AlwaysStoppedAnimation(AppColors.maroon),
                            borderRadius: BorderRadius.circular(6),
                            minHeight: 10,
                          ),
                          const SizedBox(height: 10),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              _MiniStat('Total', '$total', Colors.grey),
                              _MiniStat('Placed', '$placed', AppColors.success),
                              _MiniStat('Active', '${total - placed}', Colors.orange),
                            ],
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),

                    // Key stats
                    const _SectionTitle('Key Metrics'),
                    const SizedBox(height: 12),
                    _buildMetricsGrid(ctcStats),
                    const SizedBox(height: 20),

                    // Department stats
                    if (deptStats.isNotEmpty) ...[
                      const _SectionTitle('Department Breakdown'),
                      const SizedBox(height: 12),
                      ...deptStats.map((d) => _DeptRow(stat: d)),
                    ],
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildMetricsGrid(Map<String, dynamic> ctcStats) {
    final metrics = [
      _MetricItem('Drives', _stats['driveCount']?.toString() ?? '0', Icons.business_rounded, AppColors.info),
      _MetricItem('Alumni', _stats['alumniCount']?.toString() ?? '0', Icons.school_rounded, AppColors.gold),
      _MetricItem('Avg CTC', ctcStats['avg'] != null ? '${(ctcStats['avg'] / 100000).toStringAsFixed(1)} L' : 'N/A', Icons.currency_rupee_rounded, AppColors.success),
      _MetricItem('Max CTC', ctcStats['max'] != null ? '${(ctcStats['max'] / 100000).toStringAsFixed(1)} L' : 'N/A', Icons.trending_up_rounded, AppColors.maroon),
    ];
    return GridView.count(
      crossAxisCount: 2,
      crossAxisSpacing: 12,
      mainAxisSpacing: 12,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      childAspectRatio: 1.8,
      children: metrics.map((m) => Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 6)],
        ),
        child: Row(
          children: [
            Icon(m.icon, color: m.color, size: 24),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(m.value, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.textPrimary)),
                  Text(m.label, style: const TextStyle(fontSize: 10, color: AppColors.textSecondary)),
                ],
              ),
            ),
          ],
        ),
      )).toList(),
    );
  }
}

class _MetricItem {
  final String label, value;
  final IconData icon;
  final Color color;
  const _MetricItem(this.label, this.value, this.icon, this.color);
}

class _MiniStat extends StatelessWidget {
  final String label, value;
  final Color color;
  const _MiniStat(this.label, this.value, this.color);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(value, style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: color)),
        Text(label, style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
      ],
    );
  }
}

class _DeptRow extends StatelessWidget {
  final dynamic stat;
  const _DeptRow({required this.stat});

  @override
  Widget build(BuildContext context) {
    final dept = stat['department'] ?? stat['_id'] ?? 'Unknown';
    final placed2 = (stat['placed'] ?? stat['placedCount'] ?? 0) as int;
    final total = (stat['total'] ?? stat['totalCount'] ?? 1) as int;
    final pct = total > 0 ? placed2 / total : 0.0;

    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 4)],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(child: Text(dept.toString(), style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13), overflow: TextOverflow.ellipsis)),
              Text('$placed2 / $total', style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
            ],
          ),
          const SizedBox(height: 6),
          LinearProgressIndicator(
            value: pct,
            backgroundColor: Colors.grey.shade100,
            valueColor: const AlwaysStoppedAnimation(AppColors.maroon),
            borderRadius: BorderRadius.circular(4),
            minHeight: 6,
          ),
        ],
      ),
    );
  }
}

class _SectionTitle extends StatelessWidget {
  final String text;
  const _SectionTitle(this.text);

  @override
  Widget build(BuildContext context) {
    return Text(text, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.textPrimary));
  }
}
