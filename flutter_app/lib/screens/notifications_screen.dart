import 'package:flutter/material.dart';
import '../constants/colors.dart';
import '../services/api_service.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  final _api = ApiService();
  List<dynamic> _all = [];
  bool _loading = true;
  String _filter = 'all'; // all | unread

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final data = await _api.getAppNotifications();
      setState(() { _all = data; _loading = false; });
    } catch (_) {
      setState(() => _loading = false);
    }
  }

  List<dynamic> get _filtered =>
      _filter == 'unread' ? _all.where((n) => n['isRead'] == false).toList() : _all;

  int get _unreadCount => _all.where((n) => n['isRead'] == false).length;

  Future<void> _markRead(String id, int index) async {
    try {
      await _api.markNotificationRead(id);
      setState(() => _all[index]['isRead'] = true);
    } catch (_) {}
  }

  Future<void> _markAllRead() async {
    try {
      await _api.markAllNotificationsRead();
      setState(() {
        for (final n in _all) {
          n['isRead'] = true;
        }
      });
    } catch (_) {}
  }

  Future<void> _delete(String id, int originalIndex) async {
    try {
      await _api.deleteNotification(id);
      setState(() => _all.removeAt(originalIndex));
    } catch (_) {}
  }

  IconData _iconForType(String? type) {
    switch (type) {
      case 'drive': return Icons.business_rounded;
      case 'announcement': return Icons.campaign_rounded;
      case 'application': return Icons.work_rounded;
      case 'alert': return Icons.warning_amber_rounded;
      case 'success': return Icons.check_circle_rounded;
      default: return Icons.notifications_rounded;
    }
  }

  Color _colorForType(String? type) {
    switch (type) {
      case 'drive': return AppColors.info;
      case 'announcement': return AppColors.maroon;
      case 'application': return Colors.purple;
      case 'alert': return Colors.orange;
      case 'success': return AppColors.success;
      default: return AppColors.maroon;
    }
  }

  String _timeAgo(String? dateStr) {
    if (dateStr == null) return '';
    try {
      final dt = DateTime.parse(dateStr).toLocal();
      final diff = DateTime.now().difference(dt);
      if (diff.inMinutes < 1) return 'just now';
      if (diff.inMinutes < 60) return '${diff.inMinutes}m ago';
      if (diff.inHours < 24) return '${diff.inHours}h ago';
      if (diff.inDays < 7) return '${diff.inDays}d ago';
      return '${dt.day}/${dt.month}/${dt.year}';
    } catch (_) {
      return '';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Row(
          children: [
            const Text('Notifications', style: TextStyle(fontWeight: FontWeight.w700)),
            if (_unreadCount > 0) ...[
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: AppColors.gold,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text('$_unreadCount', style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w700)),
              ),
            ],
          ],
        ),
        actions: [
          if (_unreadCount > 0)
            TextButton(
              onPressed: _markAllRead,
              child: const Text('Mark all read', style: TextStyle(color: AppColors.gold, fontSize: 12)),
            ),
        ],
      ),
      body: Column(
        children: [
          // Filter tabs
          Container(
            color: Colors.white,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Row(
              children: [
                _FilterChip(label: 'All', selected: _filter == 'all', onTap: () => setState(() => _filter = 'all')),
                const SizedBox(width: 8),
                _FilterChip(
                  label: 'Unread${_unreadCount > 0 ? ' ($_unreadCount)' : ''}',
                  selected: _filter == 'unread',
                  onTap: () => setState(() => _filter = 'unread'),
                ),
              ],
            ),
          ),
          Expanded(
            child: _loading
                ? const Center(child: CircularProgressIndicator())
                : _filtered.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.notifications_none_rounded, size: 56, color: Colors.grey.shade300),
                            const SizedBox(height: 12),
                            Text(
                              _filter == 'unread' ? 'All caught up!' : 'No notifications yet',
                              style: TextStyle(color: Colors.grey.shade500, fontSize: 15),
                            ),
                          ],
                        ),
                      )
                    : RefreshIndicator(
                        onRefresh: _load,
                        child: ListView.builder(
                          padding: const EdgeInsets.all(12),
                          itemCount: _filtered.length,
                          itemBuilder: (ctx, i) {
                            final n = _filtered[i];
                            final originalIndex = _all.indexOf(n);
                            final isRead = n['isRead'] == true;
                            final type = n['type'] as String?;
                            final color = _colorForType(type);

                            return Dismissible(
                              key: Key(n['_id']?.toString() ?? i.toString()),
                              direction: DismissDirection.endToStart,
                              background: Container(
                                alignment: Alignment.centerRight,
                                padding: const EdgeInsets.only(right: 16),
                                decoration: BoxDecoration(
                                  color: AppColors.error,
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: const Icon(Icons.delete_rounded, color: Colors.white),
                              ),
                              onDismissed: (_) => _delete(n['_id']?.toString() ?? '', originalIndex),
                              child: GestureDetector(
                                onTap: () {
                                  if (!isRead) _markRead(n['_id']?.toString() ?? '', originalIndex);
                                },
                                child: Container(
                                  margin: const EdgeInsets.only(bottom: 8),
                                  padding: const EdgeInsets.all(14),
                                  decoration: BoxDecoration(
                                    color: isRead ? Colors.white : color.withOpacity(0.05),
                                    borderRadius: BorderRadius.circular(12),
                                    border: Border.all(
                                      color: isRead ? Colors.grey.shade100 : color.withOpacity(0.25),
                                    ),
                                    boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 4)],
                                  ),
                                  child: Row(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Container(
                                        width: 40,
                                        height: 40,
                                        decoration: BoxDecoration(
                                          color: color.withOpacity(0.12),
                                          borderRadius: BorderRadius.circular(10),
                                        ),
                                        child: Icon(_iconForType(type), color: color, size: 20),
                                      ),
                                      const SizedBox(width: 12),
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Row(
                                              children: [
                                                Expanded(
                                                  child: Text(
                                                    n['title'] ?? 'Notification',
                                                    style: TextStyle(
                                                      fontWeight: isRead ? FontWeight.w500 : FontWeight.w700,
                                                      fontSize: 13,
                                                      color: AppColors.textPrimary,
                                                    ),
                                                  ),
                                                ),
                                                if (!isRead)
                                                  Container(
                                                    width: 8,
                                                    height: 8,
                                                    decoration: BoxDecoration(color: color, shape: BoxShape.circle),
                                                  ),
                                              ],
                                            ),
                                            if (n['message'] != null) ...[
                                              const SizedBox(height: 4),
                                              Text(
                                                n['message'] as String,
                                                style: const TextStyle(color: AppColors.textSecondary, fontSize: 12),
                                                maxLines: 2,
                                                overflow: TextOverflow.ellipsis,
                                              ),
                                            ],
                                            const SizedBox(height: 4),
                                            Text(
                                              _timeAgo(n['createdAt'] as String?),
                                              style: TextStyle(color: Colors.grey.shade400, fontSize: 11),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            );
                          },
                        ),
                      ),
          ),
        ],
      ),
    );
  }
}

class _FilterChip extends StatelessWidget {
  final String label;
  final bool selected;
  final VoidCallback onTap;

  const _FilterChip({required this.label, required this.selected, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
        decoration: BoxDecoration(
          color: selected ? AppColors.maroon : Colors.grey.shade100,
          borderRadius: BorderRadius.circular(20),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: selected ? Colors.white : AppColors.textSecondary,
            fontSize: 12,
            fontWeight: selected ? FontWeight.w600 : FontWeight.normal,
          ),
        ),
      ),
    );
  }
}
