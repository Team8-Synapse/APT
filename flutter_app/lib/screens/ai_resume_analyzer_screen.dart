import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import '../constants/colors.dart';
import '../services/api_service.dart';

class AiResumeAnalyzerScreen extends StatefulWidget {
  const AiResumeAnalyzerScreen({super.key});

  @override
  State<AiResumeAnalyzerScreen> createState() => _AiResumeAnalyzerScreenState();
}

class _AiResumeAnalyzerScreenState extends State<AiResumeAnalyzerScreen> {
  final _api = ApiService();
  final _roleCtrl = TextEditingController();

  PlatformFile? _pickedFile;
  bool _loading = false;
  Map<String, dynamic>? _analysis;

  @override
  void dispose() {
    _roleCtrl.dispose();
    super.dispose();
  }

  Future<void> _pickFile() async {
    final result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['pdf'],
      withData: true,
    );
    if (result != null && result.files.isNotEmpty) {
      setState(() => _pickedFile = result.files.first);
    }
  }

  Future<void> _analyze() async {
    if (_pickedFile == null || _roleCtrl.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please pick a PDF resume and enter a target role')),
      );
      return;
    }
    final bytes = _pickedFile!.bytes;
    if (bytes == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Could not read file. Please try again.')),
      );
      return;
    }
    setState(() { _loading = true; _analysis = null; });
    try {
      final res = await _api.analyzeResume(
        pdfBytes: bytes,
        fileName: _pickedFile!.name,
        targetRole: _roleCtrl.text.trim(),
      );
      setState(() { _analysis = res; _loading = false; });
    } catch (e) {
      setState(() => _loading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Analysis failed: ${e.toString()}')),
        );
      }
    }
  }

  void _reset() {
    setState(() {
      _pickedFile = null;
      _analysis = null;
      _roleCtrl.clear();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('AI Resume Analyzer', style: TextStyle(fontWeight: FontWeight.w700)),
        actions: [
          if (_analysis != null)
            TextButton(
              onPressed: _reset,
              child: const Text('Reset', style: TextStyle(color: AppColors.maroon)),
            ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header banner
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [AppColors.maroon, Color(0xFF6E0B30)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.description_rounded, color: Colors.white, size: 28),
                  ),
                  const SizedBox(width: 16),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('AI Resume Analyzer', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 18)),
                        SizedBox(height: 4),
                        Text('Get AI feedback tailored to your target role', style: TextStyle(color: Colors.white70, fontSize: 12)),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Upload section
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 8)],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Upload Resume & Set Target', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 15)),
                  const SizedBox(height: 16),

                  // PDF picker
                  GestureDetector(
                    onTap: _analysis == null ? _pickFile : null,
                    child: Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        border: Border.all(
                          color: _pickedFile != null ? AppColors.success : AppColors.maroon.withOpacity(0.4),
                          width: 1.5,
                        ),
                        borderRadius: BorderRadius.circular(12),
                        color: _pickedFile != null
                            ? AppColors.success.withOpacity(0.05)
                            : AppColors.maroon.withOpacity(0.03),
                      ),
                      child: Column(
                        children: [
                          Icon(
                            _pickedFile != null ? Icons.check_circle_rounded : Icons.upload_file_rounded,
                            size: 36,
                            color: _pickedFile != null ? AppColors.success : AppColors.maroon,
                          ),
                          const SizedBox(height: 8),
                          Text(
                            _pickedFile != null ? _pickedFile!.name : 'Tap to upload PDF resume',
                            style: TextStyle(
                              fontWeight: FontWeight.w600,
                              fontSize: 13,
                              color: _pickedFile != null ? AppColors.success : AppColors.maroon,
                            ),
                            textAlign: TextAlign.center,
                          ),
                          if (_pickedFile != null) ...[
                            const SizedBox(height: 4),
                            Text(
                              '${(_pickedFile!.size / 1024).toStringAsFixed(1)} KB',
                              style: const TextStyle(fontSize: 11, color: AppColors.textSecondary),
                            ),
                          ],
                          if (_pickedFile == null)
                            const Text('PDF files only', style: TextStyle(fontSize: 11, color: AppColors.textSecondary)),
                        ],
                      ),
                    ),
                  ),

                  if (_pickedFile != null) ...[
                    const SizedBox(height: 8),
                    TextButton.icon(
                      onPressed: _pickFile,
                      icon: const Icon(Icons.swap_horiz_rounded, size: 16),
                      label: const Text('Change file'),
                      style: TextButton.styleFrom(foregroundColor: AppColors.textSecondary),
                    ),
                  ],

                  const SizedBox(height: 16),
                  TextField(
                    controller: _roleCtrl,
                    decoration: InputDecoration(
                      labelText: 'Target Role',
                      hintText: 'e.g. Software Engineer, Data Scientist',
                      prefixIcon: const Icon(Icons.work_rounded, color: AppColors.maroon),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                  const SizedBox(height: 20),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      onPressed: _loading ? null : _analyze,
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      icon: _loading
                          ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                          : const Icon(Icons.auto_awesome_rounded),
                      label: Text(
                        _loading ? 'Analyzing...' : 'Analyze Resume',
                        style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 15),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // Results
            if (_analysis != null) ...[
              const SizedBox(height: 24),
              _buildResults(_analysis!),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildResults(Map<String, dynamic> data) {
    final score = data['score'] ?? data['overallScore'];
    final summary = data['summary'] as String? ?? data['feedback'] as String? ?? '';
    final strengths = (data['strengths'] as List<dynamic>?) ?? [];
    final weaknesses = (data['weaknesses'] as List<dynamic>?) ?? (data['improvements'] as List<dynamic>?) ?? [];
    final missingSkills = (data['missingSkills'] as List<dynamic>?) ?? [];
    final suggestions = (data['suggestions'] as List<dynamic>?) ?? [];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Score card
        if (score != null)
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: score is num && score >= 7
                    ? [AppColors.success, const Color(0xFF1B8A5A)]
                    : score is num && score >= 5
                        ? [const Color(0xFFE67E22), const Color(0xFFCA6F1E)]
                        : [AppColors.maroon, const Color(0xFF6E0B30)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Resume Score', style: TextStyle(color: Colors.white70, fontSize: 13)),
                    SizedBox(height: 4),
                    Text('AI Evaluation', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 15)),
                  ],
                ),
                Text(
                  '$score / 10',
                  style: const TextStyle(color: Colors.white, fontSize: 36, fontWeight: FontWeight.w900),
                ),
              ],
            ),
          ),

        // Summary
        if (summary.isNotEmpty) ...[
          const SizedBox(height: 16),
          _ResultCard(
            icon: Icons.summarize_rounded,
            title: 'Summary',
            child: Text(summary, style: const TextStyle(fontSize: 14, height: 1.6, color: AppColors.textPrimary)),
          ),
        ],

        // Strengths
        if (strengths.isNotEmpty) ...[
          const SizedBox(height: 16),
          _ResultCard(
            icon: Icons.star_rounded,
            title: 'Strengths',
            iconColor: AppColors.success,
            child: _BulletList(items: strengths, color: AppColors.success, icon: Icons.check_circle_rounded),
          ),
        ],

        // Weaknesses
        if (weaknesses.isNotEmpty) ...[
          const SizedBox(height: 16),
          _ResultCard(
            icon: Icons.warning_amber_rounded,
            title: 'Weaknesses',
            iconColor: AppColors.error,
            child: _BulletList(items: weaknesses, color: AppColors.error, icon: Icons.cancel_rounded),
          ),
        ],

        // Missing skills
        if (missingSkills.isNotEmpty) ...[
          const SizedBox(height: 16),
          _ResultCard(
            icon: Icons.psychology_rounded,
            title: 'Missing Skills for Role',
            iconColor: AppColors.warning,
            child: Wrap(
              spacing: 8,
              runSpacing: 8,
              children: missingSkills.map((s) => Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                decoration: BoxDecoration(
                  color: AppColors.warning.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppColors.warning.withOpacity(0.4)),
                ),
                child: Text(s.toString(), style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.warning)),
              )).toList(),
            ),
          ),
        ],

        // Suggestions
        if (suggestions.isNotEmpty) ...[
          const SizedBox(height: 16),
          _ResultCard(
            icon: Icons.lightbulb_rounded,
            title: 'Improvement Suggestions',
            iconColor: AppColors.info,
            child: _BulletList(items: suggestions, color: AppColors.info, icon: Icons.arrow_right_rounded),
          ),
        ],
      ],
    );
  }
}

class _ResultCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final Widget child;
  final Color? iconColor;

  const _ResultCard({required this.icon, required this.title, required this.child, this.iconColor});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 6)],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 18, color: iconColor ?? AppColors.maroon),
              const SizedBox(width: 8),
              Text(title, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
            ],
          ),
          const SizedBox(height: 12),
          child,
        ],
      ),
    );
  }
}

class _BulletList extends StatelessWidget {
  final List<dynamic> items;
  final Color color;
  final IconData icon;

  const _BulletList({required this.items, required this.color, required this.icon});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: items.map((item) => Padding(
        padding: const EdgeInsets.only(bottom: 6),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, size: 16, color: color),
            const SizedBox(width: 8),
            Expanded(child: Text(item.toString(), style: const TextStyle(fontSize: 13, height: 1.5))),
          ],
        ),
      )).toList(),
    );
  }
}
