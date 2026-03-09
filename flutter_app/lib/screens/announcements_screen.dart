import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../constants/colors.dart';
import '../services/api_service.dart';

class AnnouncementsScreen extends StatefulWidget {
  const AnnouncementsScreen({super.key});

  @override
  State<AnnouncementsScreen> createState() => _AnnouncementsScreenState();
}

class _AnnouncementsScreenState extends State<AnnouncementsScreen> {
  final _api = ApiService();
  List<dynamic> _all = [];
  List<dynamic> _filtered = [];
  bool _isLoading = true;
  String _selectedCategory = 'All';

  final _categories = ['All', 'general', 'placement', 'event', 'urgent'];

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _isLoading = true);
    try {
      final data = await _api.getAnnouncements();
      setState(() {
        _all = data;
        _applyFilter();
        _isLoading = false;
      });
    } catch (_) {
      setState(() => _isLoading = false);
    }
  }

  void _applyFilter() {
    setState(() {
      _filtered = _selectedCategory == 'All'
          ? _all
          : _all.where((a) => (a['category'] ?? 'general') == _selectedCategory).toList();
    });
  }

  Color _priorityColor(String? priority) {
    switch (priority) {
      case 'urgent':
        return AppColors.error;
      case 'high':
        return AppColors.warning;
      case 'low':
        return AppColors.textSecondary;
      default:
        return AppColors.info;
    }
  }

  IconData _priorityIcon(String? priority) {
    switch (priority) {
      case 'urgent':
        return Icons.priority_high_rounded;
      case 'high':
        return Icons.arrow_upward_rounded;
      case 'low':
        return Icons.arrow_downward_rounded;
      default:
        return Icons.campaign_outlined;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Announcements', style: TextStyle(fontWeight: FontWeight.w700)),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(50),
          child: SizedBox(
            height: 48,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
              itemCount: _categories.length,
              separatorBuilder: (_, __) => const SizedBox(width: 8),
              itemBuilder: (_, i) {
                final cat = _categories[i];
                final sel = _selectedCategory == cat;
                return ChoiceChip(
                  label: Text(cat[0].toUpperCase() + cat.substring(1)),
                  selected: sel,
                  onSelected: (_) {
                    _selectedCategory = cat;
                    _applyFilter();
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
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _filtered.isEmpty
              ? _EmptyState()
              : RefreshIndicator(
                  onRefresh: _load,
                  child: ListView.separated(
                    padding: const EdgeInsets.all(16),
                    itemCount: _filtered.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 10),
                    itemBuilder: (_, i) => _AnnouncementCard(
                      announcement: _filtered[i],
                      priorityColor: _priorityColor(_filtered[i]['priority']),
                      priorityIcon: _priorityIcon(_filtered[i]['priority']),
                    ),
                  ),
                ),
    );
  }
}

class _AnnouncementCard extends StatelessWidget {
  final dynamic announcement;
  final Color priorityColor;
  final IconData priorityIcon;

  const _AnnouncementCard({
    required this.announcement,
    required this.priorityColor,
    required this.priorityIcon,
  });

  @override
  Widget build(BuildContext context) {
    final isPinned = announcement['isPinned'] == true;
    final createdAt = announcement['createdAt'] != null
        ? DateTime.tryParse(announcement['createdAt'])
        : null;
    final links = (announcement['links'] as List<dynamic>?) ?? [];

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: isPinned
            ? Border.all(color: AppColors.gold, width: 1.5)
            : Border.all(color: Colors.transparent),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.06),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header row
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(
                  color: priorityColor.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(priorityIcon, color: priorityColor, size: 16),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: priorityColor.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        (announcement['priority'] ?? 'normal').toString().toUpperCase(),
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w700,
                          color: priorityColor,
                        ),
                      ),
                    ),
                    if (isPinned) ...[
                      const SizedBox(width: 6),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: AppColors.gold.withOpacity(0.15),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: const Text(
                          'PINNED',
                          style: TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: AppColors.gold),
                        ),
                      ),
                    ],
                  ],
                ),
              ),
              if (createdAt != null)
                Text(
                  DateFormat('dd MMM').format(createdAt),
                  style: const TextStyle(fontSize: 11, color: AppColors.textSecondary),
                ),
            ],
          ),
          const SizedBox(height: 12),
          // Content
          Text(
            announcement['content'] ?? '',
            style: const TextStyle(fontSize: 14, color: AppColors.textPrimary, height: 1.5),
          ),
          // Category badge
          if (announcement['category'] != null) ...[
            const SizedBox(height: 10),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
              decoration: BoxDecoration(
                color: AppColors.maroon.withOpacity(0.08),
                borderRadius: BorderRadius.circular(6),
              ),
              child: Text(
                (announcement['category'] as String).toUpperCase(),
                style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: AppColors.maroon),
              ),
            ),
          ],
          // Links
          if (links.isNotEmpty) ...[
            const SizedBox(height: 10),
            const Divider(height: 1),
            const SizedBox(height: 8),
            ...links.map((link) => Padding(
                  padding: const EdgeInsets.only(bottom: 4),
                  child: Row(
                    children: [
                      const Icon(Icons.link_rounded, size: 14, color: AppColors.info),
                      const SizedBox(width: 6),
                      Expanded(
                        child: Text(
                          link['title'] ?? link['url'] ?? '',
                          style: const TextStyle(
                            fontSize: 12,
                            color: AppColors.info,
                            decoration: TextDecoration.underline,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                )),
          ],
        ],
      ),
    );
  }
}

class _EmptyState extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.campaign_outlined, size: 64, color: AppColors.textSecondary.withOpacity(0.4)),
          const SizedBox(height: 16),
          const Text('No announcements yet', style: TextStyle(color: AppColors.textSecondary, fontSize: 15)),
        ],
      ),
    );
  }
}
