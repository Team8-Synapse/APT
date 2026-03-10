import 'package:flutter/material.dart';
import '../constants/colors.dart';
import '../services/api_service.dart';
import 'chatbot_screen.dart';

class PrepHubScreen extends StatefulWidget {
  const PrepHubScreen({super.key});

  @override
  State<PrepHubScreen> createState() => _PrepHubScreenState();
}

class _PrepHubScreenState extends State<PrepHubScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final _api = ApiService();

  // Resources tab
  List<dynamic> _resources = [];
  bool _resourcesLoading = true;
  String _selectedCategory = 'All';
  final List<String> _categories = ['All', 'Coding', 'Aptitude', 'Technical', 'HR'];

  // Notes tab
  List<dynamic> _notes = [];
  bool _notesLoading = true;
  bool _notesSaving = false;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _loadResources();
    _loadNotes();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadResources() async {
    setState(() => _resourcesLoading = true);
    try {
      final data = await _api.getResourcesByCategory(
          category: _selectedCategory == 'All' ? null : _selectedCategory);
      setState(() { _resources = data; _resourcesLoading = false; });
    } catch (_) {
      setState(() => _resourcesLoading = false);
    }
  }

  Future<void> _loadNotes() async {
    try {
      final data = await _api.getNotes();
      setState(() { _notes = data; _notesLoading = false; });
    } catch (_) {
      setState(() => _notesLoading = false);
    }
  }

  Future<void> _showNoteDialog({Map<String, dynamic>? existing}) async {
    final titleCtrl = TextEditingController(text: existing?['name'] ?? '');
    final textCtrl = TextEditingController(text: existing?['text'] ?? '');
    final formKey = GlobalKey<FormState>();
    bool saving = false;

    await showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setModalState) => Padding(
          padding: EdgeInsets.only(bottom: MediaQuery.of(ctx).viewInsets.bottom),
          child: Container(
            padding: const EdgeInsets.fromLTRB(20, 16, 20, 28),
            decoration: const BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
            ),
            child: Form(
              key: formKey,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(existing == null ? 'New Note' : 'Edit Note',
                          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
                      IconButton(icon: const Icon(Icons.close), onPressed: () => Navigator.pop(ctx)),
                    ],
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: titleCtrl,
                    decoration: const InputDecoration(labelText: 'Title'),
                    validator: (v) => v == null || v.trim().isEmpty ? 'Enter a title' : null,
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: textCtrl,
                    decoration: const InputDecoration(labelText: 'Notes', alignLabelWithHint: true),
                    maxLines: 5,
                    validator: (v) => v == null || v.trim().isEmpty ? 'Enter some content' : null,
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: saving
                          ? null
                          : () async {
                              if (!formKey.currentState!.validate()) return;
                              setModalState(() => saving = true);
                              try {
                                if (existing == null) {
                                  final created = await _api.createNote(titleCtrl.text.trim(), textCtrl.text.trim());
                                  setState(() => _notes.insert(0, created));
                                } else {
                                  final updated = await _api.updateNote(
                                      existing['_id'] as String, titleCtrl.text.trim(), textCtrl.text.trim());
                                  final idx = _notes.indexWhere((n) => n['_id'] == existing['_id']);
                                  if (idx >= 0) setState(() => _notes[idx] = updated);
                                }
                                if (ctx.mounted) Navigator.pop(ctx);
                              } catch (_) {
                                setModalState(() => saving = false);
                              }
                            },
                      child: saving
                          ? const SizedBox(height: 18, width: 18, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                          : Text(existing == null ? 'Save Note' : 'Update Note'),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
    titleCtrl.dispose();
    textCtrl.dispose();
  }

  Future<void> _deleteNote(String id) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Delete Note'),
        content: const Text('Delete this note permanently?'),
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
      await _api.deleteNote(id);
      setState(() => _notes.removeWhere((n) => n['_id'] == id));
    } catch (_) {}
  }

  Color _categoryColor(String cat) {
    switch (cat) {
      case 'Coding': return Colors.blue;
      case 'Aptitude': return Colors.purple;
      case 'Technical': return Colors.teal;
      case 'HR': return Colors.orange;
      default: return AppColors.maroon;
    }
  }

  IconData _categoryIcon(String cat) {
    switch (cat) {
      case 'Coding': return Icons.code_rounded;
      case 'Aptitude': return Icons.psychology_rounded;
      case 'Technical': return Icons.computer_rounded;
      case 'HR': return Icons.people_rounded;
      default: return Icons.book_rounded;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('PrepHub', style: TextStyle(fontWeight: FontWeight.w700)),
        bottom: TabBar(
          controller: _tabController,
          labelColor: AppColors.gold,
          unselectedLabelColor: Colors.white70,
          indicatorColor: AppColors.gold,
          tabs: const [
            Tab(icon: Icon(Icons.library_books_rounded), text: 'Resources'),
            Tab(icon: Icon(Icons.note_alt_rounded), text: 'Notes'),
            Tab(icon: Icon(Icons.smart_toy_rounded), text: 'AI Prep'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _ResourcesTab(
            resources: _resources,
            loading: _resourcesLoading,
            categories: _categories,
            selected: _selectedCategory,
            onCategorySelected: (c) {
              setState(() => _selectedCategory = c);
              _loadResources();
            },
            categoryColor: _categoryColor,
            categoryIcon: _categoryIcon,
          ),
          _NotesTab(
            notes: _notes,
            loading: _notesLoading,
            onAdd: () => _showNoteDialog(),
            onEdit: (n) => _showNoteDialog(existing: n),
            onDelete: _deleteNote,
          ),
          const _AIPrepTab(),
        ],
      ),
    );
  }
}

// ─── Resources Tab ────────────────────────────────────────────────────────────
class _ResourcesTab extends StatelessWidget {
  final List<dynamic> resources;
  final bool loading;
  final List<String> categories;
  final String selected;
  final ValueChanged<String> onCategorySelected;
  final Color Function(String) categoryColor;
  final IconData Function(String) categoryIcon;

  const _ResourcesTab({
    required this.resources,
    required this.loading,
    required this.categories,
    required this.selected,
    required this.onCategorySelected,
    required this.categoryColor,
    required this.categoryIcon,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Category filter chips
        SizedBox(
          height: 52,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
            itemCount: categories.length,
            separatorBuilder: (_, __) => const SizedBox(width: 8),
            itemBuilder: (_, i) {
              final cat = categories[i];
              final isSelected = cat == selected;
              final color = categoryColor(cat);
              return GestureDetector(
                onTap: () => onCategorySelected(cat),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                  decoration: BoxDecoration(
                    color: isSelected ? color : Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: isSelected ? color : Colors.grey.shade200),
                    boxShadow: isSelected
                        ? [BoxShadow(color: color.withOpacity(0.3), blurRadius: 6)]
                        : [],
                  ),
                  child: Row(
                    children: [
                      Icon(categoryIcon(cat), size: 14, color: isSelected ? Colors.white : color),
                      const SizedBox(width: 6),
                      Text(cat, style: TextStyle(
                        color: isSelected ? Colors.white : AppColors.textPrimary,
                        fontWeight: FontWeight.w600,
                        fontSize: 12,
                      )),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
        Expanded(
          child: loading
              ? const Center(child: CircularProgressIndicator())
              : resources.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.folder_open_rounded, size: 56, color: Colors.grey.shade300),
                          const SizedBox(height: 12),
                          Text('No resources for "$selected"',
                              style: TextStyle(color: Colors.grey.shade500)),
                        ],
                      ),
                    )
                  : ListView.builder(
                      padding: const EdgeInsets.all(14),
                      itemCount: resources.length,
                      itemBuilder: (_, i) {
                        final r = resources[i];
                        final cat = r['category'] as String? ?? 'All';
                        final color = categoryColor(cat);
                        return Container(
                          margin: const EdgeInsets.only(bottom: 10),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(14),
                            boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 6)],
                          ),
                          child: ListTile(
                            contentPadding: const EdgeInsets.all(14),
                            leading: Container(
                              width: 44,
                              height: 44,
                              decoration: BoxDecoration(
                                color: color.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: Icon(categoryIcon(cat), color: color, size: 22),
                            ),
                            title: Text(
                              r['title'] ?? 'Resource',
                              style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
                            ),
                            subtitle: r['description'] != null
                                ? Text(r['description'] as String,
                                    maxLines: 2, overflow: TextOverflow.ellipsis,
                                    style: const TextStyle(fontSize: 12))
                                : null,
                            trailing: r['link'] != null
                                ? Icon(Icons.open_in_new_rounded, color: color, size: 18)
                                : null,
                            onTap: r['link'] != null
                                ? () {
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      SnackBar(
                                        content: Text('Link: ${r['link']}'),
                                        behavior: SnackBarBehavior.floating,
                                      ),
                                    );
                                  }
                                : null,
                          ),
                        );
                      },
                    ),
        ),
      ],
    );
  }
}

// ─── Notes Tab ────────────────────────────────────────────────────────────────
class _NotesTab extends StatelessWidget {
  final List<dynamic> notes;
  final bool loading;
  final VoidCallback onAdd;
  final void Function(Map<String, dynamic>) onEdit;
  final void Function(String) onDelete;

  const _NotesTab({
    required this.notes,
    required this.loading,
    required this.onAdd,
    required this.onEdit,
    required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      floatingActionButton: FloatingActionButton.extended(
        onPressed: onAdd,
        backgroundColor: AppColors.maroon,
        foregroundColor: Colors.white,
        icon: const Icon(Icons.add),
        label: const Text('New Note', style: TextStyle(fontWeight: FontWeight.w600)),
      ),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : notes.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.note_alt_outlined, size: 56, color: Colors.grey.shade300),
                      const SizedBox(height: 12),
                      Text('No notes yet. Add your first note!',
                          style: TextStyle(color: Colors.grey.shade500)),
                    ],
                  ),
                )
              : ListView.builder(
                  padding: const EdgeInsets.fromLTRB(14, 14, 14, 90),
                  itemCount: notes.length,
                  itemBuilder: (_, i) {
                    final n = notes[i];
                    return Container(
                      margin: const EdgeInsets.only(bottom: 10),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(14),
                        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 6)],
                      ),
                      child: ListTile(
                        contentPadding: const EdgeInsets.fromLTRB(16, 10, 8, 10),
                        leading: Container(
                          width: 40,
                          height: 40,
                          decoration: BoxDecoration(
                            color: AppColors.maroon.withOpacity(0.08),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: const Icon(Icons.note_rounded, color: AppColors.maroon, size: 20),
                        ),
                        title: Text(
                          n['name'] ?? 'Note',
                          style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
                        ),
                        subtitle: n['text'] != null
                            ? Text(n['text'] as String, maxLines: 2, overflow: TextOverflow.ellipsis,
                                style: const TextStyle(fontSize: 12, color: AppColors.textSecondary))
                            : null,
                        trailing: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            IconButton(
                              icon: const Icon(Icons.edit_outlined, size: 18),
                              onPressed: () => onEdit(Map<String, dynamic>.from(n)),
                            ),
                            IconButton(
                              icon: const Icon(Icons.delete_outline, size: 18, color: AppColors.error),
                              onPressed: () => onDelete(n['_id'] as String),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
    );
  }
}

// ─── AI Prep Tab ──────────────────────────────────────────────────────────────
class _AIPrepTab extends StatelessWidget {
  const _AIPrepTab();

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
          margin: const EdgeInsets.all(16),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [AppColors.maroon, AppColors.maroon.withOpacity(0.75)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(16),
          ),
          child: Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(Icons.smart_toy_rounded, color: Colors.white, size: 28),
              ),
              const SizedBox(width: 14),
              const Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('PrepHub AI Assistant', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 15)),
                    SizedBox(height: 2),
                    Text('Ask interview questions, get study plans, practice HR rounds', style: TextStyle(color: Colors.white70, fontSize: 12)),
                  ],
                ),
              ),
            ],
          ),
        ),
        Expanded(
          child: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.smart_toy_outlined, size: 64, color: Colors.grey.shade300),
                const SizedBox(height: 12),
                Text('AI Chat available in full', style: TextStyle(color: Colors.grey.shade500, fontSize: 15, fontWeight: FontWeight.w600)),
                const SizedBox(height: 8),
                Text('Tap below to open AI Chatbot\nfor guided placement prep', textAlign: TextAlign.center, style: TextStyle(color: Colors.grey.shade400, fontSize: 13)),
                const SizedBox(height: 24),
                ElevatedButton.icon(
                  onPressed: () => Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const ChatbotScreen()),
                  ),
                  icon: const Icon(Icons.chat_rounded),
                  label: const Text('Open AI Chatbot'),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
