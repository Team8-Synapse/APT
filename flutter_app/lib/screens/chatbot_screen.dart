import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import '../constants/colors.dart';
import '../services/api_service.dart';

class ChatMessage {
  final String content;
  final bool isUser;
  final DateTime time;

  ChatMessage({required this.content, required this.isUser}) : time = DateTime.now();
}

class ChatbotScreen extends StatefulWidget {
  const ChatbotScreen({super.key});

  @override
  State<ChatbotScreen> createState() => _ChatbotScreenState();
}

class _ChatbotScreenState extends State<ChatbotScreen> with TickerProviderStateMixin {
  final _api = ApiService();
  final _inputCtrl = TextEditingController();
  final _scrollCtrl = ScrollController();
  final _focusNode = FocusNode();
  bool _isLoading = false;

  final List<ChatMessage> _messages = [
    ChatMessage(
      content: 'Hi! I\'m your **PrepHub AI** — powered by real campus placement data.\n\n'
          'Try asking me:\n'
          '• *"What skills do students placed in Google have?"*\n'
          '• *"Which companies visited campus this year?"*\n'
          '• *"How do I prepare for a FAANG interview?"*',
      isUser: false,
    ),
  ];

  // Quick suggestion chips
  final List<String> _suggestions = [
    'Skills for Google placements',
    'Top placed companies',
    'How to improve CGPA impact',
    'DSA preparation tips',
    'Resume tips for CSE students',
  ];

  @override
  void dispose() {
    _inputCtrl.dispose();
    _scrollCtrl.dispose();
    _focusNode.dispose();
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

  Future<void> _sendMessage(String text) async {
    final message = text.trim();
    if (message.isEmpty || _isLoading) return;

    _inputCtrl.clear();
    setState(() {
      _messages.add(ChatMessage(content: message, isUser: true));
      _isLoading = true;
    });
    _scrollToBottom();

    try {
      final response = await _api.sendChatMessage(message);
      setState(() {
        _messages.add(ChatMessage(content: response, isUser: false));
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _messages.add(ChatMessage(
          content: 'Connection error. Please check your network and try again.',
          isUser: false,
        ));
        _isLoading = false;
      });
    }
    _scrollToBottom();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.smart_toy_rounded, color: AppColors.gold, size: 20),
            SizedBox(width: 8),
            Text('PrepHub AI', style: TextStyle(fontWeight: FontWeight.w700)),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded),
            tooltip: 'Clear chat',
            onPressed: () {
              setState(() {
                _messages.clear();
                _messages.add(ChatMessage(
                  content: 'Chat cleared. What would you like to know?',
                  isUser: false,
                ));
              });
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // AI status bar
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 16),
            color: AppColors.maroon.withOpacity(0.05),
            child: Row(
              children: [
                Container(
                  width: 7,
                  height: 7,
                  decoration: const BoxDecoration(color: AppColors.success, shape: BoxShape.circle),
                ),
                const SizedBox(width: 6),
                const Text(
                  'POWERED BY AMRITA AI (GEMINI) • LIVE DATABASE',
                  style: TextStyle(fontSize: 9, color: AppColors.textSecondary, letterSpacing: 0.8),
                ),
              ],
            ),
          ),

          // Messages list
          Expanded(
            child: ListView.builder(
              controller: _scrollCtrl,
              padding: const EdgeInsets.all(16),
              itemCount: _messages.length + (_isLoading ? 1 : 0),
              itemBuilder: (context, index) {
                if (index == _messages.length) {
                  return const _TypingIndicator();
                }
                final msg = _messages[index];
                return _ChatBubble(message: msg);
              },
            ),
          ),

          // Suggestion chips (shown only when idle and few messages)
          if (!_isLoading && _messages.length <= 2)
            SizedBox(
              height: 44,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: _suggestions.length,
                separatorBuilder: (_, __) => const SizedBox(width: 8),
                itemBuilder: (_, i) => ActionChip(
                  label: Text(_suggestions[i], style: const TextStyle(fontSize: 11)),
                  onPressed: () => _sendMessage(_suggestions[i]),
                  backgroundColor: AppColors.maroon.withOpacity(0.08),
                  side: BorderSide(color: AppColors.maroon.withOpacity(0.2)),
                  padding: const EdgeInsets.symmetric(horizontal: 4),
                ),
              ),
            ),

          if (!_isLoading && _messages.length <= 2) const SizedBox(height: 8),

          // Input bar
          Container(
            padding: const EdgeInsets.fromLTRB(12, 8, 12, 16),
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.06), blurRadius: 10, offset: const Offset(0, -2))],
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _inputCtrl,
                    focusNode: _focusNode,
                    textInputAction: TextInputAction.send,
                    onSubmitted: _sendMessage,
                    maxLines: 4,
                    minLines: 1,
                    decoration: InputDecoration(
                      hintText: 'Ask about companies, skills, prep tips...',
                      hintStyle: const TextStyle(color: AppColors.textSecondary, fontSize: 13),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(24),
                        borderSide: BorderSide(color: Colors.grey.shade200),
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(24),
                        borderSide: BorderSide(color: Colors.grey.shade200),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(24),
                        borderSide: const BorderSide(color: AppColors.maroon),
                      ),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                      filled: true,
                      fillColor: Colors.grey.shade50,
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  child: Material(
                    color: _isLoading ? Colors.grey.shade300 : AppColors.maroon,
                    borderRadius: BorderRadius.circular(24),
                    child: InkWell(
                      borderRadius: BorderRadius.circular(24),
                      onTap: _isLoading ? null : () => _sendMessage(_inputCtrl.text),
                      child: const Padding(
                        padding: EdgeInsets.all(12),
                        child: Icon(Icons.send_rounded, color: Colors.white, size: 20),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ─── Chat Bubble ──────────────────────────────────────────────────────────────
class _ChatBubble extends StatelessWidget {
  final ChatMessage message;
  const _ChatBubble({required this.message});

  @override
  Widget build(BuildContext context) {
    final isUser = message.isUser;
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: isUser ? MainAxisAlignment.end : MainAxisAlignment.start,
        children: [
          if (!isUser) ...[
            Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                gradient: AppColors.maroonGradient,
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.smart_toy_rounded, color: AppColors.gold, size: 16),
            ),
            const SizedBox(width: 8),
          ],
          Flexible(
            child: GestureDetector(
              onLongPress: () {
                Clipboard.setData(ClipboardData(text: message.content));
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Copied to clipboard'), duration: Duration(seconds: 1)),
                );
              },
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                decoration: BoxDecoration(
                  color: isUser ? AppColors.maroon : Colors.white,
                  borderRadius: BorderRadius.only(
                    topLeft: const Radius.circular(16),
                    topRight: const Radius.circular(16),
                    bottomLeft: Radius.circular(isUser ? 16 : 4),
                    bottomRight: Radius.circular(isUser ? 4 : 16),
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.06),
                      blurRadius: 6,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: isUser
                    ? Text(
                        message.content,
                        style: const TextStyle(color: Colors.white, fontSize: 13, height: 1.5),
                      )
                    : MarkdownBody(
                        data: message.content,
                        styleSheet: MarkdownStyleSheet(
                          p: const TextStyle(fontSize: 13, color: AppColors.textPrimary, height: 1.6),
                          strong: const TextStyle(fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                          em: const TextStyle(color: AppColors.maroon),
                          code: TextStyle(
                            fontFamily: 'monospace',
                            backgroundColor: Colors.grey.shade100,
                            fontSize: 12,
                          ),
                          listBullet: const TextStyle(fontSize: 13, color: AppColors.maroon),
                          h3: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                        ),
                      ),
              ),
            ),
          ),
          if (isUser) ...[
            const SizedBox(width: 8),
            CircleAvatar(
              radius: 16,
              backgroundColor: AppColors.gold.withOpacity(0.2),
              child: const Icon(Icons.person_rounded, size: 16, color: AppColors.maroon),
            ),
          ],
        ],
      ),
    );
  }
}

// ─── Typing indicator ─────────────────────────────────────────────────────────
class _TypingIndicator extends StatefulWidget {
  const _TypingIndicator();

  @override
  State<_TypingIndicator> createState() => _TypingIndicatorState();
}

class _TypingIndicatorState extends State<_TypingIndicator> with TickerProviderStateMixin {
  late List<AnimationController> _controllers;

  @override
  void initState() {
    super.initState();
    _controllers = List.generate(3, (i) {
      final c = AnimationController(vsync: this, duration: const Duration(milliseconds: 600));
      Future.delayed(Duration(milliseconds: i * 200), () {
        if (mounted) c.repeat(reverse: true);
      });
      return c;
    });
  }

  @override
  void dispose() {
    for (final c in _controllers) c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          Container(
            width: 32, height: 32,
            decoration: BoxDecoration(gradient: AppColors.maroonGradient, shape: BoxShape.circle),
            child: const Icon(Icons.smart_toy_rounded, color: AppColors.gold, size: 16),
          ),
          const SizedBox(width: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(16),
                topRight: Radius.circular(16),
                bottomRight: Radius.circular(16),
                bottomLeft: Radius.circular(4),
              ),
              boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.06), blurRadius: 6)],
            ),
            child: Row(
              children: List.generate(3, (i) {
                return AnimatedBuilder(
                  animation: _controllers[i],
                  builder: (_, __) => Container(
                    margin: const EdgeInsets.symmetric(horizontal: 2),
                    width: 7,
                    height: 7,
                    decoration: BoxDecoration(
                      color: AppColors.maroon.withOpacity(0.3 + _controllers[i].value * 0.6),
                      shape: BoxShape.circle,
                    ),
                  ),
                );
              }),
            ),
          ),
        ],
      ),
    );
  }
}
