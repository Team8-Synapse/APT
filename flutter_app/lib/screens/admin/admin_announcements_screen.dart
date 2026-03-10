import 'package:flutter/material.dart';
import '../../constants/colors.dart';
import '../../services/api_service.dart';

class AdminAnnouncementsScreen extends StatefulWidget {
  const AdminAnnouncementsScreen({super.key});

  @override
  State<AdminAnnouncementsScreen> createState() => _AdminAnnouncementsScreenState();
}

class _AdminAnnouncementsScreenState extends State<AdminAnnouncementsScreen> {
  final _api = ApiService();
  List<dynamic> _announcements = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final data = await _api.getAnnouncements();
      setState(() { _announcements = data; _loading = false; });
    } catch (_) {
      setState(() => _loading = false);
    }
  }

  Future<void> _showForm({Map<String, dynamic>? existing}) async {
    final contentCtrl = TextEditingController(text: existing?['content'] ?? '');
    String priority = existing?['priority'] ?? 'normal';
    String category = existing?['category'] ?? 'general';
    bool displayInTicker = existing?['displayInTicker'] ?? false;
    bool saving = false;

    final priorities = ['normal', 'high', 'urgent', 'low'];
    final categories = ['general', 'placement', 'workshop', 'deadline', 'achievement', 'event'];

    await showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setModalState) => Padding(
          padding: EdgeInsets.only(bottom: MediaQuery.of(ctx).viewInsets.bottom),
          child: Container(
            padding: const EdgeInsets.fromLTRB(20, 16, 20, 32),
            decoration: const BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(existing == null ? 'New Announcement' : 'Edit Announcement',
                        style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w700)),
                    IconButton(icon: const Icon(Icons.close), onPressed: () => Navigator.pop(ctx)),
                  ],
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: contentCtrl,
                  decoration: const InputDecoration(labelText: 'Content', alignLabelWithHint: true),
                  maxLines: 4,
                ),
                const SizedBox(height: 12),
                // Priority dropdown
                DropdownButtonFormField<String>(
                  initialValue: priority,
                  items: priorities.map((p) => DropdownMenuItem(value: p, child: Text(p.toUpperCase()))).toList(),
                  onChanged: (v) => setModalState(() => priority = v!),
                  decoration: const InputDecoration(labelText: 'Priority'),
                ),
                const SizedBox(height: 12),
                // Category dropdown
                DropdownButtonFormField<String>(
                  initialValue: category,
                  items: categories.map((c) => DropdownMenuItem(value: c, child: Text(c.toUpperCase()))).toList(),
                  onChanged: (v) => setModalState(() => category = v!),
                  decoration: const InputDecoration(labelText: 'Category'),
                ),
                const SizedBox(height: 12),
                // Display in ticker toggle
                SwitchListTile.adaptive(
                  contentPadding: EdgeInsets.zero,
                  title: const Text('Display in Ticker', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
                  subtitle: const Text('Show as scrolling ticker on home screen', style: TextStyle(fontSize: 12)),
                  value: displayInTicker,
                  activeColor: AppColors.maroon,
                  onChanged: (v) => setModalState(() => displayInTicker = v),
                ),
                const SizedBox(height: 20),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: saving || contentCtrl.text.trim().isEmpty
                        ? null
                        : () async {
                            setModalState(() => saving = true);
                            try {
                              final payload = {
                                'content': contentCtrl.text.trim(),
                                'priority': priority,
                                'category': category,
                                'displayInTicker': displayInTicker,
                              };
                              if (existing == null) {
                                final created = await _api.createAnnouncement(payload);
                                setState(() => _announcements.insert(0, created));
                              } else {
                                final updated = await _api.updateAnnouncement(existing['_id'], payload);
                                final idx = _announcements.indexWhere((a) => a['_id'] == existing['_id']);
                                if (idx >= 0) setState(() => _announcements[idx] = updated);
                              }
                              if (ctx.mounted) Navigator.pop(ctx);
                            } catch (_) {
                              setModalState(() => saving = false);
                            }
                          },
                    child: saving
                        ? const SizedBox(height: 18, width: 18, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                        : Text(existing == null ? 'Post Announcement' : 'Update'),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
    contentCtrl.dispose();
  }

  Future<void> _delete(String id) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Delete Announcement'),
        content: const Text('Delete this announcement permanently?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancel')),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, true),
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.error),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
    if (confirm != true) return;
    try {
      await _api.deleteAnnouncement(id);
      setState(() => _announcements.removeWhere((a) => a['_id'] == id));
    } catch (_) {}
  }

  Color _priorityColor(String? p) {
    switch (p) {
      case 'urgent': return AppColors.error;
      case 'high': return Colors.orange;
      case 'low': return AppColors.textSecondary;
      default: return AppColors.info;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Announcements', style: TextStyle(fontWeight: FontWeight.w700)),
        actions: [
          IconButton(
            icon: const Icon(Icons.add_rounded),
            onPressed: () => _showForm(),
          ),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _announcements.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.campaign_outlined, size: 56, color: Colors.grey.shade300),
                      const SizedBox(height: 12),
                      const Text('No announcements yet', style: TextStyle(color: AppColors.textSecondary)),
                      const SizedBox(height: 16),
                      ElevatedButton.icon(
                        onPressed: () => _showForm(),
                        icon: const Icon(Icons.add),
                        label: const Text('Create Announcement'),
                      ),
                    ],
                  ),
                )
              : RefreshIndicator(
                  onRefresh: _load,
                  child: ListView.builder(
                    padding: const EdgeInsets.all(14),
                    itemCount: _announcements.length,
                    itemBuilder: (_, i) {
                      final a = _announcements[i];
                      final color = _priorityColor(a['priority']);
                      return Container(
                        margin: const EdgeInsets.only(bottom: 10),
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(12),
                          border: Border(left: BorderSide(color: color, width: 3)),
                          boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 6)],
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                                  decoration: BoxDecoration(
                                    color: color.withOpacity(0.1),
                                    borderRadius: BorderRadius.circular(5),
                                  ),
                                  child: Text(
                                    (a['priority'] ?? 'normal').toUpperCase(),
                                    style: TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: color),
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                                  decoration: BoxDecoration(
                                    color: Colors.grey.shade100,
                                    borderRadius: BorderRadius.circular(5),
                                  ),
                                  child: Text(
                                    (a['category'] ?? 'general').toUpperCase(),
                                    style: const TextStyle(fontSize: 10, color: AppColors.textSecondary),
                                  ),
                                ),
                                if (a['displayInTicker'] == true) ...[
                                  const SizedBox(width: 8),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                                    decoration: BoxDecoration(
                                      color: AppColors.gold.withOpacity(0.15),
                                      borderRadius: BorderRadius.circular(5),
                                    ),
                                    child: const Text(
                                      'TICKER',
                                      style: TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: AppColors.gold),
                                    ),
                                  ),
                                ],
                                const Spacer(),
                                IconButton(
                                  icon: const Icon(Icons.edit_outlined, size: 17),
                                  onPressed: () => _showForm(existing: Map<String, dynamic>.from(a)),
                                  padding: EdgeInsets.zero,
                                  constraints: const BoxConstraints(),
                                ),
                                const SizedBox(width: 12),
                                IconButton(
                                  icon: const Icon(Icons.delete_outline, size: 17, color: AppColors.error),
                                  onPressed: () => _delete(a['_id']),
                                  padding: EdgeInsets.zero,
                                  constraints: const BoxConstraints(),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Text(
                              a['content'] ?? '',
                              style: const TextStyle(fontSize: 13, color: AppColors.textPrimary),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                ),
    );
  }
}
