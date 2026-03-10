import 'package:flutter/material.dart';
import '../../constants/colors.dart';
import '../../services/api_service.dart';

class AdminTickerScreen extends StatefulWidget {
  const AdminTickerScreen({super.key});

  @override
  State<AdminTickerScreen> createState() => _AdminTickerScreenState();
}

class _AdminTickerScreenState extends State<AdminTickerScreen> {
  final _api = ApiService();
  List<dynamic> _messages = [];
  bool _loading = true;
  final _msgCtrl = TextEditingController();
  bool _saving = false;

  @override
  void initState() {
    super.initState();
    _load();
  }

  @override
  void dispose() {
    _msgCtrl.dispose();
    super.dispose();
  }

  Future<void> _load() async {
    try {
      final data = await _api.getAdminTicker();
      setState(() { _messages = data; _loading = false; });
    } catch (_) {
      setState(() => _loading = false);
    }
  }

  Future<void> _add() async {
    if (_msgCtrl.text.trim().isEmpty) return;
    setState(() => _saving = true);
    try {
      final created = await _api.createTickerMessage(_msgCtrl.text.trim());
      setState(() {
        _messages.insert(0, created);
        _msgCtrl.clear();
        _saving = false;
      });
    } catch (_) {
      setState(() => _saving = false);
    }
  }

  Future<void> _delete(String id) async {
    try {
      await _api.deleteTickerMessage(id);
      setState(() => _messages.removeWhere((m) => m['_id'] == id));
    } catch (_) {}
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Ticker Manager', style: TextStyle(fontWeight: FontWeight.w700)),
      ),
      body: Column(
        children: [
          // Add new ticker
          Container(
            color: Colors.white,
            padding: const EdgeInsets.all(14),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _msgCtrl,
                    decoration: const InputDecoration(
                      hintText: 'New ticker message...',
                      prefixIcon: Icon(Icons.campaign_rounded),
                      isDense: true,
                    ),
                    onSubmitted: (_) => _add(),
                  ),
                ),
                const SizedBox(width: 10),
                ElevatedButton(
                  onPressed: _saving ? null : _add,
                  child: _saving
                      ? const SizedBox(height: 18, width: 18, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                      : const Icon(Icons.send_rounded),
                ),
              ],
            ),
          ),
          Expanded(
            child: _loading
                ? const Center(child: CircularProgressIndicator())
                : _messages.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.info_outline_rounded, size: 56, color: Colors.grey.shade300),
                            const SizedBox(height: 12),
                            const Text('No ticker messages yet', style: TextStyle(color: AppColors.textSecondary)),
                          ],
                        ),
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.all(14),
                        itemCount: _messages.length,
                        itemBuilder: (_, i) {
                          final m = _messages[i];
                          final text = (m is String) ? m : (m['message'] ?? m['content'] ?? '').toString();
                          return Container(
                            margin: const EdgeInsets.only(bottom: 8),
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: AppColors.maroon.withOpacity(0.15)),
                              boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 4)],
                            ),
                            child: Row(
                              children: [
                                const Icon(Icons.campaign_rounded, color: AppColors.maroon, size: 18),
                                const SizedBox(width: 10),
                                Expanded(
                                  child: Text(text, style: const TextStyle(fontSize: 13, color: AppColors.textPrimary)),
                                ),
                                IconButton(
                                  icon: const Icon(Icons.delete_outline, color: AppColors.error, size: 18),
                                  onPressed: () => _delete(m['_id']?.toString() ?? ''),
                                  constraints: const BoxConstraints(),
                                  padding: EdgeInsets.zero,
                                ),
                              ],
                            ),
                          );
                        },
                      ),
          ),
        ],
      ),
    );
  }
}
