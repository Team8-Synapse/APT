import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../constants/colors.dart';
import '../services/api_service.dart';

class ApplicationsScreen extends StatefulWidget {
  const ApplicationsScreen({super.key});

  @override
  State<ApplicationsScreen> createState() => _ApplicationsScreenState();
}

class _ApplicationsScreenState extends State<ApplicationsScreen> {
  final _api = ApiService();
  List<dynamic> _applications = [];
  bool _isLoading = true;
  String _selectedStatus = 'All';

  final _statusFilters = [
    'All', 'applied', 'shortlisted', 'offered', 'rejected', 'accepted'
  ];

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _isLoading = true);
    try {
      final data = await _api.getMyApplications();
      setState(() {
        _applications = data;
        _isLoading = false;
      });
    } catch (_) {
      setState(() => _isLoading = false);
    }
  }

  List<dynamic> get _filtered {
    if (_selectedStatus == 'All') return _applications;
    return _applications.where((a) => (a['status'] ?? '') == _selectedStatus).toList();
  }

  Color _statusColor(String? status) {
    switch (status) {
      case 'offered':
      case 'accepted':
        return AppColors.success;
      case 'shortlisted':
      case 'round1':
      case 'round2':
      case 'round3':
      case 'hr_round':
        return AppColors.info;
      case 'rejected':
        return AppColors.error;
      default:
        return AppColors.warning;
    }
  }

  String _statusLabel(String? status) {
    switch (status) {
      case 'hr_round': return 'HR Round';
      case 'round1': return 'Round 1';
      case 'round2': return 'Round 2';
      case 'round3': return 'Round 3';
      default:
        if (status == null || status.isEmpty) return 'Applied';
        return status[0].toUpperCase() + status.substring(1);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('My Applications', style: TextStyle(fontWeight: FontWeight.w700)),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(50),
          child: SizedBox(
            height: 48,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
              itemCount: _statusFilters.length,
              separatorBuilder: (_, __) => const SizedBox(width: 8),
              itemBuilder: (_, i) {
                final f = _statusFilters[i];
                final sel = _selectedStatus == f;
                return ChoiceChip(
                  label: Text(_statusLabel(f)),
                  selected: sel,
                  onSelected: (_) => setState(() => _selectedStatus = f),
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
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _filtered.isEmpty
              ? _EmptyState(status: _selectedStatus)
              : RefreshIndicator(
                  onRefresh: _load,
                  child: ListView.separated(
                    padding: const EdgeInsets.all(16),
                    itemCount: _filtered.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 12),
                    itemBuilder: (_, i) => _ApplicationCard(
                      application: _filtered[i],
                      statusColor: _statusColor(_filtered[i]['status']),
                      statusLabel: _statusLabel(_filtered[i]['status']),
                    ),
                  ),
                ),
    );
  }
}

class _ApplicationCard extends StatefulWidget {
  final dynamic application;
  final Color statusColor;
  final String statusLabel;

  const _ApplicationCard({
    required this.application,
    required this.statusColor,
    required this.statusLabel,
  });

  @override
  State<_ApplicationCard> createState() => _ApplicationCardState();
}

class _ApplicationCardState extends State<_ApplicationCard> {
  late Map<String, dynamic> _app;
  bool _responding = false;
  final _api = ApiService();

  @override
  void initState() {
    super.initState();
    _app = Map<String, dynamic>.from(widget.application as Map);
  }

  Future<void> _respondToOffer(String response) async {
    setState(() => _responding = true);
    try {
      await _api.respondToOffer(_app['_id'], response);
      setState(() {
        _app['status'] = response == 'accept' ? 'accepted' : 'declined';
        _responding = false;
      });
    } catch (_) {
      setState(() => _responding = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to respond. Please try again.')),
        );
      }
    }
  }

  Color _statusColor(String? status) {
    switch (status) {
      case 'offered':
      case 'accepted':
        return AppColors.success;
      case 'shortlisted':
      case 'round1':
      case 'round2':
      case 'round3':
      case 'hr_round':
        return AppColors.info;
      case 'rejected':
      case 'declined':
        return AppColors.error;
      default:
        return AppColors.warning;
    }
  }

  String _statusLabel(String? status) {
    switch (status) {
      case 'hr_round': return 'HR Round';
      case 'round1': return 'Round 1';
      case 'round2': return 'Round 2';
      case 'round3': return 'Round 3';
      case 'declined': return 'Declined';
      default:
        if (status == null || status.isEmpty) return 'Applied';
        return status[0].toUpperCase() + status.substring(1);
    }
  }

  @override
  Widget build(BuildContext context) {
    final drive = _app['driveId'] as Map<String, dynamic>?;
    final companyName = drive?['companyName'] ?? _app['companyName'] ?? 'Unknown Company';
    final jobProfile = drive?['jobProfile'] ?? _app['jobProfile'] ?? '';
    final appliedDate = _app['appliedDate'] != null
        ? DateTime.tryParse(_app['appliedDate'])
        : null;
    final rounds = (_app['rounds'] as List<dynamic>?) ?? [];
    final offeredCTC = _app['offeredCTC'];
    final currentStatus = _app['status'] as String?;
    final statusColor = _statusColor(currentStatus);
    final statusLabel = _statusLabel(currentStatus);

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.06), blurRadius: 8, offset: const Offset(0, 2)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Company + status
          Row(
            children: [
              CircleAvatar(
                radius: 22,
                backgroundColor: AppColors.maroon.withOpacity(0.1),
                child: Text(
                  companyName.isNotEmpty ? companyName[0].toUpperCase() : '?',
                  style: const TextStyle(color: AppColors.maroon, fontWeight: FontWeight.w700, fontSize: 18),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(companyName,
                        style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 15, color: AppColors.textPrimary)),
                    if (jobProfile.isNotEmpty)
                      Text(jobProfile, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: statusColor.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  statusLabel,
                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: statusColor),
                ),
              ),
            ],
          ),

          // Applied date + CTC
          const SizedBox(height: 12),
          Row(
            children: [
              if (appliedDate != null) ...[
                const Icon(Icons.calendar_today_outlined, size: 13, color: AppColors.textSecondary),
                const SizedBox(width: 4),
                Text(
                  'Applied ${DateFormat('dd MMM yyyy').format(appliedDate)}',
                  style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                ),
              ],
              const Spacer(),
              if (offeredCTC != null) ...[
                const Icon(Icons.currency_rupee_rounded, size: 13, color: AppColors.success),
                Text(
                  '$offeredCTC LPA',
                  style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.success),
                ),
              ],
            ],
          ),

          // Round pipeline
          if (rounds.isNotEmpty) ...[
            const SizedBox(height: 14),
            const Text('Round Progress',
                style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textSecondary)),
            const SizedBox(height: 8),
            _RoundPipeline(rounds: rounds),
          ],

          // Accept / Decline offer buttons
          if (currentStatus == 'offered') ...[
            const SizedBox(height: 16),
            const Divider(height: 1),
            const SizedBox(height: 12),
            const Text('You have received an offer!',
                style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.success)),
            const SizedBox(height: 10),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: _responding ? null : () => _respondToOffer('accept'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.success,
                      padding: const EdgeInsets.symmetric(vertical: 10),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                    icon: _responding
                        ? const SizedBox(width: 14, height: 14, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                        : const Icon(Icons.check_rounded, size: 16),
                    label: const Text('Accept', style: TextStyle(fontWeight: FontWeight.w700)),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: _responding ? null : () => _respondToOffer('decline'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppColors.error,
                      side: const BorderSide(color: AppColors.error),
                      padding: const EdgeInsets.symmetric(vertical: 10),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                    icon: const Icon(Icons.close_rounded, size: 16),
                    label: const Text('Decline', style: TextStyle(fontWeight: FontWeight.w700)),
                  ),
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }
}

class _RoundPipeline extends StatelessWidget {
  final List<dynamic> rounds;
  const _RoundPipeline({required this.rounds});

  Color _roundColor(String? status) {
    switch (status) {
      case 'passed': return AppColors.success;
      case 'failed': return AppColors.error;
      case 'scheduled': return AppColors.warning;
      default: return AppColors.textSecondary.withOpacity(0.3);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      children: List.generate(rounds.length * 2 - 1, (i) {
        if (i.isOdd) {
          return Expanded(
            child: Container(height: 2, color: AppColors.textSecondary.withOpacity(0.2)),
          );
        }
        final round = rounds[i ~/ 2];
        final color = _roundColor(round['status']);
        return Tooltip(
          message: round['roundName'] ?? 'Round ${i ~/ 2 + 1}',
          child: Container(
            width: 28,
            height: 28,
            decoration: BoxDecoration(color: color.withOpacity(0.15), shape: BoxShape.circle, border: Border.all(color: color, width: 1.5)),
            child: Center(
              child: Text('${i ~/ 2 + 1}', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: color)),
            ),
          ),
        );
      }),
    );
  }
}

class _EmptyState extends StatelessWidget {
  final String status;
  const _EmptyState({required this.status});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.work_outline_rounded, size: 64, color: AppColors.textSecondary.withOpacity(0.4)),
          const SizedBox(height: 16),
          Text(
            status == 'All' ? 'No applications yet' : 'No "$status" applications',
            style: const TextStyle(color: AppColors.textSecondary, fontSize: 15),
          ),
          const SizedBox(height: 8),
          const Text('Apply to placement drives to get started',
              style: TextStyle(color: AppColors.textSecondary, fontSize: 12)),
        ],
      ),
    );
  }
}
