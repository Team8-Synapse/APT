import 'package:flutter/material.dart';
import '../constants/colors.dart';
import '../services/api_service.dart';

class AiMockInterviewScreen extends StatefulWidget {
  const AiMockInterviewScreen({super.key});

  @override
  State<AiMockInterviewScreen> createState() => _AiMockInterviewScreenState();
}

class _AiMockInterviewScreenState extends State<AiMockInterviewScreen> {
  final _api = ApiService();

  // Setup
  String _company = '';
  String _role = '';
  String _type = 'Technical';
  final _companyCtrl = TextEditingController();
  final _roleCtrl = TextEditingController();

  // Interview
  String _phase = 'setup'; // setup | interview | summary
  List<Map<String, dynamic>> _history = [];
  final _answerCtrl = TextEditingController();
  bool _loading = false;
  Map<String, dynamic>? _finalReview;

  final _scrollCtrl = ScrollController();

  final _types = ['Technical', 'HR', 'Managerial', 'Mixed'];

  @override
  void dispose() {
    _companyCtrl.dispose();
    _roleCtrl.dispose();
    _answerCtrl.dispose();
    _scrollCtrl.dispose();
    super.dispose();
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollCtrl.hasClients) {
        _scrollCtrl.animateTo(
          _scrollCtrl.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  Future<void> _startInterview() async {
    if (_companyCtrl.text.trim().isEmpty || _roleCtrl.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter company and role')),
      );
      return;
    }
    _company = _companyCtrl.text.trim();
    _role = _roleCtrl.text.trim();
    setState(() { _loading = true; });
    try {
      final res = await _api.startMockInterview(
        company: _company,
        role: _role,
        type: _type,
      );
      setState(() {
        _history = [
          {'role': 'assistant', 'content': res['question'] ?? res['message'] ?? 'Welcome! Let\'s begin your mock interview.'}
        ];
        _phase = 'interview';
        _loading = false;
      });
      _scrollToBottom();
    } catch (e) {
      setState(() => _loading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to start interview: ${e.toString()}')),
        );
      }
    }
  }

  Future<void> _sendAnswer() async {
    final answer = _answerCtrl.text.trim();
    if (answer.isEmpty) return;
    _answerCtrl.clear();

    setState(() {
      _history.add({'role': 'user', 'content': answer});
      _loading = true;
    });
    _scrollToBottom();

    try {
      final res = await _api.sendMockInterviewMessage(
        history: _history,
        message: answer,
        company: _company,
        role: _role,
      );

      final isComplete = res['isComplete'] == true;
      setState(() {
        _history.add({'role': 'assistant', 'content': res['question'] ?? res['message'] ?? ''});
        _loading = false;
      });

      if (isComplete) {
        await _finishInterview();
      } else {
        _scrollToBottom();
      }
    } catch (e) {
      setState(() {
        _history.add({'role': 'assistant', 'content': 'Sorry, I encountered an error. Please try again.'});
        _loading = false;
      });
      _scrollToBottom();
    }
  }

  Future<void> _finishInterview() async {
    setState(() => _loading = true);
    try {
      final review = await _api.finishMockInterview(_history);
      setState(() {
        _finalReview = review;
        _phase = 'summary';
        _loading = false;
      });
    } catch (e) {
      setState(() => _loading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to generate review. Please try again.')),
        );
      }
    }
  }

  void _resetInterview() {
    setState(() {
      _phase = 'setup';
      _history = [];
      _finalReview = null;
      _company = '';
      _role = '';
      _companyCtrl.clear();
      _roleCtrl.clear();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('AI Mock Interview', style: TextStyle(fontWeight: FontWeight.w700)),
        actions: [
          if (_phase != 'setup')
            TextButton(
              onPressed: _resetInterview,
              child: const Text('Reset', style: TextStyle(color: AppColors.maroon)),
            ),
        ],
      ),
      body: AnimatedSwitcher(
        duration: const Duration(milliseconds: 300),
        child: _phase == 'setup'
            ? _buildSetup()
            : _phase == 'interview'
                ? _buildInterview()
                : _buildSummary(),
      ),
    );
  }

  Widget _buildSetup() {
    return SingleChildScrollView(
      key: const ValueKey('setup'),
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
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
                  child: const Icon(Icons.psychology_rounded, color: Colors.white, size: 28),
                ),
                const SizedBox(width: 16),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('AI Mock Interview', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 18)),
                      SizedBox(height: 4),
                      Text('Practice & prepare with AI-powered interviews', style: TextStyle(color: Colors.white70, fontSize: 12)),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Setup Form
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
                const Text('Configure Your Interview', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 15)),
                const SizedBox(height: 16),
                TextField(
                  controller: _companyCtrl,
                  decoration: InputDecoration(
                    labelText: 'Target Company',
                    hintText: 'e.g. Google, TCS, Infosys',
                    prefixIcon: const Icon(Icons.business_rounded, color: AppColors.maroon),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: _roleCtrl,
                  decoration: InputDecoration(
                    labelText: 'Role / Position',
                    hintText: 'e.g. Software Engineer, Data Analyst',
                    prefixIcon: const Icon(Icons.work_rounded, color: AppColors.maroon),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                ),
                const SizedBox(height: 16),
                const Text('Interview Type', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 8,
                  children: _types.map((t) {
                    final sel = _type == t;
                    return ChoiceChip(
                      label: Text(t),
                      selected: sel,
                      selectedColor: AppColors.maroon,
                      labelStyle: TextStyle(color: sel ? Colors.white : AppColors.textPrimary, fontWeight: FontWeight.w600),
                      onSelected: (_) => setState(() => _type = t),
                    );
                  }).toList(),
                ),
                const SizedBox(height: 20),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: _loading ? null : _startInterview,
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    icon: _loading
                        ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                        : const Icon(Icons.play_arrow_rounded),
                    label: const Text('Start Interview', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 15)),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInterview() {
    return Column(
      key: const ValueKey('interview'),
      children: [
        // Info bar
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
          color: AppColors.maroon.withOpacity(0.08),
          child: Row(
            children: [
              const Icon(Icons.business_rounded, size: 14, color: AppColors.maroon),
              const SizedBox(width: 6),
              Text(_company, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.maroon)),
              const SizedBox(width: 12),
              const Icon(Icons.work_rounded, size: 14, color: AppColors.textSecondary),
              const SizedBox(width: 6),
              Text(_role, style: const TextStyle(fontSize: 13, color: AppColors.textSecondary)),
              const Spacer(),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: AppColors.maroon.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(_type, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: AppColors.maroon)),
              ),
            ],
          ),
        ),

        // Chat messages
        Expanded(
          child: ListView.builder(
            controller: _scrollCtrl,
            padding: const EdgeInsets.all(16),
            itemCount: _history.length + (_loading ? 1 : 0),
            itemBuilder: (_, i) {
              if (i == _history.length) {
                return _TypingIndicator();
              }
              final msg = _history[i];
              final isUser = msg['role'] == 'user';
              return Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: Row(
                  mainAxisAlignment: isUser ? MainAxisAlignment.end : MainAxisAlignment.start,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    if (!isUser) ...[
                      CircleAvatar(
                        radius: 16,
                        backgroundColor: AppColors.maroon.withOpacity(0.1),
                        child: const Icon(Icons.psychology_rounded, size: 16, color: AppColors.maroon),
                      ),
                      const SizedBox(width: 8),
                    ],
                    Flexible(
                      child: Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: isUser ? AppColors.maroon : Colors.white,
                          borderRadius: BorderRadius.only(
                            topLeft: const Radius.circular(16),
                            topRight: const Radius.circular(16),
                            bottomLeft: Radius.circular(isUser ? 16 : 4),
                            bottomRight: Radius.circular(isUser ? 4 : 16),
                          ),
                          boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.06), blurRadius: 4)],
                        ),
                        child: Text(
                          msg['content'] ?? '',
                          style: TextStyle(
                            color: isUser ? Colors.white : AppColors.textPrimary,
                            fontSize: 14,
                            height: 1.5,
                          ),
                        ),
                      ),
                    ),
                    if (isUser) ...[
                      const SizedBox(width: 8),
                      CircleAvatar(
                        radius: 16,
                        backgroundColor: AppColors.gold.withOpacity(0.2),
                        child: const Icon(Icons.person_rounded, size: 16, color: AppColors.gold),
                      ),
                    ],
                  ],
                ),
              );
            },
          ),
        ),

        // Input bar
        Container(
          padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
          decoration: BoxDecoration(
            color: Colors.white,
            boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.08), blurRadius: 8, offset: const Offset(0, -2))],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _answerCtrl,
                      maxLines: 3,
                      minLines: 1,
                      decoration: InputDecoration(
                        hintText: 'Type your answer...',
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                      ),
                      textInputAction: TextInputAction.newline,
                    ),
                  ),
                  const SizedBox(width: 10),
                  FloatingActionButton(
                    mini: true,
                    backgroundColor: AppColors.maroon,
                    onPressed: _loading ? null : _sendAnswer,
                    child: const Icon(Icons.send_rounded, color: Colors.white, size: 18),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              TextButton(
                onPressed: _loading ? null : _finishInterview,
                child: const Text('End interview & get review', style: TextStyle(color: AppColors.textSecondary, fontSize: 12)),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildSummary() {
    final review = _finalReview ?? {};
    final overallScore = review['overallScore'] ?? review['score'];
    final feedback = review['feedback'] as String? ?? review['summary'] as String? ?? 'Interview completed!';
    final strengths = (review['strengths'] as List<dynamic>?) ?? [];
    final improvements = (review['improvements'] as List<dynamic>?) ?? [];

    return SingleChildScrollView(
      key: const ValueKey('summary'),
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Score card
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: overallScore != null && (overallScore is num ? overallScore >= 7 : false)
                    ? [AppColors.success, const Color(0xFF1B8A5A)]
                    : [AppColors.maroon, const Color(0xFF6E0B30)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              children: [
                const Text('Interview Complete!', style: TextStyle(color: Colors.white70, fontSize: 14)),
                const SizedBox(height: 8),
                if (overallScore != null)
                  Text(
                    '$overallScore / 10',
                    style: const TextStyle(color: Colors.white, fontSize: 40, fontWeight: FontWeight.w900),
                  ),
                const SizedBox(height: 4),
                const Text('Overall Score', style: TextStyle(color: Colors.white70, fontSize: 13)),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Feedback
          _SummarySection(
            icon: Icons.chat_bubble_outline_rounded,
            title: 'Overall Feedback',
            child: Text(feedback, style: const TextStyle(fontSize: 14, height: 1.6, color: AppColors.textPrimary)),
          ),

          // Strengths
          if (strengths.isNotEmpty) ...[
            const SizedBox(height: 16),
            _SummarySection(
              icon: Icons.thumb_up_outlined,
              title: 'Strengths',
              iconColor: AppColors.success,
              child: Column(
                children: strengths.map((s) => Padding(
                  padding: const EdgeInsets.only(bottom: 6),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Icon(Icons.check_circle_rounded, size: 16, color: AppColors.success),
                      const SizedBox(width: 8),
                      Expanded(child: Text(s.toString(), style: const TextStyle(fontSize: 13, height: 1.5))),
                    ],
                  ),
                )).toList(),
              ),
            ),
          ],

          // Improvements
          if (improvements.isNotEmpty) ...[
            const SizedBox(height: 16),
            _SummarySection(
              icon: Icons.trending_up_rounded,
              title: 'Areas to Improve',
              iconColor: AppColors.warning,
              child: Column(
                children: improvements.map((s) => Padding(
                  padding: const EdgeInsets.only(bottom: 6),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Icon(Icons.arrow_forward_ios_rounded, size: 12, color: AppColors.warning),
                      const SizedBox(width: 8),
                      Expanded(child: Text(s.toString(), style: const TextStyle(fontSize: 13, height: 1.5))),
                    ],
                  ),
                )).toList(),
              ),
            ),
          ],

          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: _resetInterview,
              icon: const Icon(Icons.refresh_rounded),
              label: const Text('Start New Interview', style: TextStyle(fontWeight: FontWeight.w700)),
              style: ElevatedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 14)),
            ),
          ),
        ],
      ),
    );
  }
}

class _TypingIndicator extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          CircleAvatar(
            radius: 16,
            backgroundColor: AppColors.maroon.withOpacity(0.1),
            child: const Icon(Icons.psychology_rounded, size: 16, color: AppColors.maroon),
          ),
          const SizedBox(width: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(16),
                topRight: Radius.circular(16),
                bottomRight: Radius.circular(16),
                bottomLeft: Radius.circular(4),
              ),
              boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.06), blurRadius: 4)],
            ),
            child: const SizedBox(
              width: 40,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  _Dot(delay: 0),
                  _Dot(delay: 200),
                  _Dot(delay: 400),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _Dot extends StatefulWidget {
  final int delay;
  const _Dot({required this.delay});

  @override
  State<_Dot> createState() => _DotState();
}

class _DotState extends State<_Dot> with SingleTickerProviderStateMixin {
  late final AnimationController _ctrl;
  late final Animation<double> _anim;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 600));
    _anim = Tween<double>(begin: 0, end: 1).animate(CurvedAnimation(parent: _ctrl, curve: Curves.easeInOut));
    Future.delayed(Duration(milliseconds: widget.delay), () {
      if (mounted) _ctrl.repeat(reverse: true);
    });
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _anim,
      builder: (_, __) => Container(
        width: 6,
        height: 6 + _anim.value * 4,
        decoration: BoxDecoration(
          color: AppColors.maroon.withOpacity(0.5 + _anim.value * 0.5),
          borderRadius: BorderRadius.circular(4),
        ),
      ),
    );
  }
}

class _SummarySection extends StatelessWidget {
  final IconData icon;
  final String title;
  final Widget child;
  final Color? iconColor;

  const _SummarySection({required this.icon, required this.title, required this.child, this.iconColor});

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
