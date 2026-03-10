import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../constants/colors.dart';
import '../services/auth_service.dart';
import '../services/api_service.dart';
import '../models/user.dart';
import 'chatbot_screen.dart';
import 'drives_screen.dart';
import 'profile_screen.dart';
import 'calendar_screen.dart';
import 'announcements_screen.dart';
import 'applications_screen.dart';
import 'experiences_screen.dart';
import 'alumni_insights_screen.dart';
import 'notifications_screen.dart';
import 'prep_hub_screen.dart';
import 'ai_mock_interview_screen.dart';
import 'ai_resume_analyzer_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;
  StudentProfileModel? _profile;
  bool _profileLoading = true;

  final _api = ApiService();

  @override
  void initState() {
    super.initState();
    _loadProfile();
  }

  Future<void> _loadProfile() async {
    try {
      final userId = context.read<AuthService>().user?.id ?? '';
      if (userId.isEmpty) { setState(() => _profileLoading = false); return; }
      final data = await _api.getStudentProfile(userId);
      setState(() {
        _profile = StudentProfileModel.fromJson(data);
        _profileLoading = false;
      });
    } catch (_) {
      setState(() => _profileLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final user = context.watch<AuthService>().user;

    final screens = [
      _DashboardTab(profile: _profile, profileLoading: _profileLoading),
      const DrivesScreen(),
      const ChatbotScreen(),
      const CalendarScreen(),
      const _MoreTab(),
      const ProfileScreen(),
    ];

    return Scaffold(
      body: screens[_currentIndex],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (i) => setState(() => _currentIndex = i),
        backgroundColor: Colors.white,
        indicatorColor: AppColors.maroon.withOpacity(0.12),
        labelBehavior: NavigationDestinationLabelBehavior.alwaysShow,
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.home_outlined),
            selectedIcon: Icon(Icons.home_rounded, color: AppColors.maroon),
            label: 'Home',
          ),
          NavigationDestination(
            icon: Icon(Icons.business_outlined),
            selectedIcon: Icon(Icons.business_rounded, color: AppColors.maroon),
            label: 'Drives',
          ),
          NavigationDestination(
            icon: Icon(Icons.smart_toy_outlined),
            selectedIcon: Icon(Icons.smart_toy_rounded, color: AppColors.maroon),
            label: 'PrepHub AI',
          ),
          NavigationDestination(
            icon: Icon(Icons.calendar_month_outlined),
            selectedIcon: Icon(Icons.calendar_month_rounded, color: AppColors.maroon),
            label: 'Calendar',
          ),
          NavigationDestination(
            icon: Icon(Icons.grid_view_outlined),
            selectedIcon: Icon(Icons.grid_view_rounded, color: AppColors.maroon),
            label: 'More',
          ),
          NavigationDestination(
            icon: Icon(Icons.person_outline_rounded),
            selectedIcon: Icon(Icons.person_rounded, color: AppColors.maroon),
            label: 'Profile',
          ),
        ],
      ),
    );
  }
}

// ─── Dashboard Tab ────────────────────────────────────────────────────────────
class _DashboardTab extends StatefulWidget {
  final StudentProfileModel? profile;
  final bool profileLoading;

  const _DashboardTab({this.profile, required this.profileLoading});

  @override
  State<_DashboardTab> createState() => _DashboardTabState();
}

class _DashboardTabState extends State<_DashboardTab> {
  List<dynamic> _announcements = [];
  bool _announcementsLoading = true;
  List<dynamic> _ticker = [];
  List<dynamic> _notifications = [];
  int _unreadCount = 0;
  final _api = ApiService();
  final int _tickerIndex = 0;

  @override
  void initState() {
    super.initState();
    _loadAnnouncements();
    _loadTicker();
    _loadNotifications();
  }

  Future<void> _loadAnnouncements() async {
    try {
      final data = await _api.getAnnouncements();
      setState(() {
        _announcements = data.take(5).toList();
        _announcementsLoading = false;
      });
    } catch (_) {
      setState(() => _announcementsLoading = false);
    }
  }

  Future<void> _loadTicker() async {
    try {
      final data = await _api.getTicker();
      setState(() => _ticker = data);
    } catch (_) {}
  }

  Future<void> _loadNotifications() async {
    try {
      final data = await _api.getAppNotifications();
      setState(() {
        _notifications = data;
        _unreadCount = data.where((n) => n['isRead'] == false).length;
      });
    } catch (_) {}
  }

  @override
  Widget build(BuildContext context) {
    final user = context.read<AuthService>().user;
    return Scaffold(
      backgroundColor: AppColors.background,
      body: CustomScrollView(
        slivers: [
          // App bar
          SliverAppBar(
            expandedHeight: 160,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: const BoxDecoration(gradient: AppColors.maroonGradient),
                padding: const EdgeInsets.fromLTRB(20, 60, 20, 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    Text(
                      widget.profileLoading
                          ? 'Welcome back!'
                          : 'Hello, ${widget.profile?.firstName ?? user?.email.split('@')[0] ?? 'Student'}!',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 22,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const Text(
                      'Your placement journey continues.',
                      style: TextStyle(color: Colors.white60, fontSize: 13),
                    ),
                  ],
                ),
              ),
            ),
            actions: [
              Stack(
                children: [
                  IconButton(
                    icon: const Icon(Icons.notifications_outlined, color: Colors.white),
                    onPressed: () => Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const NotificationsScreen()),
                    ).then((_) => _loadNotifications()),
                  ),
                  if (_unreadCount > 0)
                    Positioned(
                      right: 8,
                      top: 8,
                      child: Container(
                        padding: const EdgeInsets.all(3),
                        decoration: const BoxDecoration(color: AppColors.gold, shape: BoxShape.circle),
                        child: Text('$_unreadCount', style: const TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.w700)),
                      ),
                    ),
                ],
              ),
              IconButton(
                icon: const Icon(Icons.logout_rounded, color: Colors.white),
                onPressed: () async {
                  final confirm = await showDialog<bool>(
                    context: context,
                    builder: (_) => AlertDialog(
                      title: const Text('Sign Out'),
                      content: const Text('Are you sure you want to sign out?'),
                      actions: [
                        TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancel')),
                        ElevatedButton(onPressed: () => Navigator.pop(context, true), child: const Text('Sign Out')),
                      ],
                    ),
                  );
                  if (confirm == true && context.mounted) {
                    context.read<AuthService>().logout();
                  }
                },
              )
            ],
          ),

          SliverPadding(
            padding: const EdgeInsets.all(16),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                // Ticker
                if (_ticker.isNotEmpty) ...[
                  _TickerBanner(messages: _ticker),
                  const SizedBox(height: 12),
                ],

                // Stats cards
                if (!widget.profileLoading && widget.profile != null) ...[
                  _StatsRow(profile: widget.profile!),
                  const SizedBox(height: 20),
                ],

                // Placement status banner
                if (widget.profile != null) _PlacementBanner(profile: widget.profile!),
                const SizedBox(height: 20),

                // Announcements
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Recent Announcements',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                    ),
                    TextButton(
                      onPressed: () => Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const AnnouncementsScreen()),
                      ),
                      child: const Text('View All', style: TextStyle(color: AppColors.maroon, fontSize: 12)),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                if (_announcementsLoading)
                  const Center(child: CircularProgressIndicator())
                else if (_announcements.isEmpty)
                  const _EmptyCard(icon: Icons.campaign_outlined, label: 'No announcements yet')
                else
                  ..._announcements.map((a) => _AnnouncementCard(announcement: a)),
              ]),
            ),
          ),
        ],
      ),
    );
  }
}

class _StatsRow extends StatelessWidget {
  final StudentProfileModel profile;
  const _StatsRow({required this.profile});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        _StatCard(label: 'CGPA', value: profile.cgpa.toStringAsFixed(2), icon: Icons.star_rounded, color: AppColors.gold),
        const SizedBox(width: 10),
        _StatCard(label: 'Skills', value: '${profile.skills.length}', icon: Icons.code_rounded, color: AppColors.info),
        const SizedBox(width: 10),
        _StatCard(label: 'Backlogs', value: '${profile.backlogs}', icon: Icons.warning_amber_rounded,
            color: profile.backlogs == 0 ? AppColors.success : AppColors.error),
      ],
    );
  }
}

class _StatCard extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;
  final Color color;

  const _StatCard({required this.label, required this.value, required this.icon, required this.color});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 10),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.06), blurRadius: 8, offset: const Offset(0, 2))],
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 22),
            const SizedBox(height: 6),
            Text(value, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
            Text(label, style: const TextStyle(fontSize: 10, color: AppColors.textSecondary)),
          ],
        ),
      ),
    );
  }
}

class _PlacementBanner extends StatelessWidget {
  final StudentProfileModel profile;
  const _PlacementBanner({required this.profile});

  @override
  Widget build(BuildContext context) {
    final isPlaced = profile.placementStatus == 'placed';
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isPlaced ? AppColors.success.withOpacity(0.1) : AppColors.maroon.withOpacity(0.07),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: isPlaced ? AppColors.success.withOpacity(0.3) : AppColors.maroon.withOpacity(0.2)),
      ),
      child: Row(
        children: [
          Icon(isPlaced ? Icons.check_circle_rounded : Icons.trending_up_rounded,
              color: isPlaced ? AppColors.success : AppColors.maroon, size: 28),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  isPlaced ? 'Placed at ${profile.offeredCompany}!' : 'Keep pushing!',
                  style: TextStyle(
                    fontWeight: FontWeight.w700,
                    color: isPlaced ? AppColors.success : AppColors.maroon,
                    fontSize: 14,
                  ),
                ),
                Text(
                  isPlaced
                      ? '${profile.offeredRole} • ${profile.offeredCTC != null ? '₹${(profile.offeredCTC! / 100000).toStringAsFixed(1)} LPA' : ''}'
                      : 'Check upcoming drives and use PrepHub AI to prepare.',
                  style: const TextStyle(color: AppColors.textSecondary, fontSize: 12),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _MoreTab extends StatelessWidget {
  const _MoreTab();

  @override
  Widget build(BuildContext context) {
    final items = [
      _MoreItem(
        icon: Icons.campaign_rounded,
        color: AppColors.maroon,
        title: 'Announcements',
        subtitle: 'Latest updates & notices',
        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const AnnouncementsScreen())),
      ),
      _MoreItem(
        icon: Icons.work_rounded,
        color: AppColors.info,
        title: 'My Applications',
        subtitle: 'Track your drive applications',
        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const ApplicationsScreen())),
      ),
      _MoreItem(
        icon: Icons.rate_review_rounded,
        color: AppColors.success,
        title: 'Interview Experiences',
        subtitle: 'Real campus placement stories',
        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const ExperiencesScreen())),
      ),
      _MoreItem(
        icon: Icons.people_rounded,
        color: AppColors.gold,
        title: 'Alumni Insights',
        subtitle: 'Directory & strategy reports',
        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const AlumniInsightsScreen())),
      ),
      _MoreItem(
        icon: Icons.menu_book_rounded,
        color: Colors.teal,
        title: 'PrepHub',
        subtitle: 'Resources, notes & AI prep',
        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const PrepHubScreen())),
      ),
      _MoreItem(
        icon: Icons.psychology_rounded,
        color: Colors.indigo,
        title: 'AI Mock Interview',
        subtitle: 'Practice interviews with AI',
        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const AiMockInterviewScreen())),
      ),
      _MoreItem(
        icon: Icons.description_rounded,
        color: Colors.deepOrange,
        title: 'AI Resume Analyzer',
        subtitle: 'Get AI feedback on your resume',
        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const AiResumeAnalyzerScreen())),
      ),
      _MoreItem(
        icon: Icons.notifications_rounded,
        color: Colors.deepPurple,
        title: 'Notifications',
        subtitle: 'Stay updated on new activity',
        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const NotificationsScreen())),
      ),
    ];

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Explore', style: TextStyle(fontWeight: FontWeight.w700)),
        automaticallyImplyLeading: false,
      ),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: items.length,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (_, i) => items[i],
      ),
    );
  }
}

class _MoreItem extends StatelessWidget {
  final IconData icon;
  final Color color;
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  const _MoreItem({
    required this.icon,
    required this.color,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      child: InkWell(
        borderRadius: BorderRadius.circular(14),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(children: [
            Container(
              width: 48, height: 48,
              decoration: BoxDecoration(
                color: color.withOpacity(0.12),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: color, size: 24),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 15, color: AppColors.textPrimary)),
                  Text(subtitle, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                ],
              ),
            ),
            const Icon(Icons.chevron_right_rounded, color: AppColors.textSecondary),
          ]),
        ),
      ),
    );
  }
}

class _AnnouncementCard extends StatelessWidget {
  final dynamic announcement;
  const _AnnouncementCard({required this.announcement});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 6)],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 8,
            height: 8,
            margin: const EdgeInsets.only(top: 6, right: 10),
            decoration: const BoxDecoration(color: AppColors.maroon, shape: BoxShape.circle),
          ),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  announcement['title'] ?? 'Announcement',
                  style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                if (announcement['content'] != null)
                  Padding(
                    padding: const EdgeInsets.only(top: 4),
                    child: Text(
                      announcement['content'],
                      style: const TextStyle(color: AppColors.textSecondary, fontSize: 12),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
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

class _EmptyCard extends StatelessWidget {
  final IconData icon;  final String label;
  const _EmptyCard({required this.icon, required this.label});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: [
          Icon(icon, size: 36, color: Colors.grey.shade400),
          const SizedBox(height: 8),
          Text(label, style: TextStyle(color: Colors.grey.shade500, fontSize: 13)),
        ],
      ),
    );
  }
}

// ─── Ticker Banner ────────────────────────────────────────────────────────────
class _TickerBanner extends StatefulWidget {
  final List<dynamic> messages;
  const _TickerBanner({required this.messages});

  @override
  State<_TickerBanner> createState() => _TickerBannerState();
}

class _TickerBannerState extends State<_TickerBanner> {
  int _index = 0;

  @override
  void initState() {
    super.initState();
    _startCycle();
  }

  void _startCycle() {
    Future.doWhile(() async {
      await Future.delayed(const Duration(seconds: 4));
      if (!mounted || widget.messages.isEmpty) return false;
      setState(() => _index = (_index + 1) % widget.messages.length);
      return true;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (widget.messages.isEmpty) return const SizedBox.shrink();
    final msg = widget.messages[_index];
    final text = (msg is String) ? msg : (msg['message'] ?? msg['content'] ?? '').toString();

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [AppColors.maroon.withOpacity(0.85), AppColors.gold.withOpacity(0.85)],
          begin: Alignment.centerLeft,
          end: Alignment.centerRight,
        ),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          const Icon(Icons.campaign_rounded, color: Colors.white, size: 18),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              text,
              style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w600),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ),
          if (widget.messages.length > 1) ...[
            const SizedBox(width: 8),
            Text('${_index + 1}/${widget.messages.length}',
                style: const TextStyle(color: Colors.white70, fontSize: 10)),
          ],
        ],
      ),
    );
  }
}

