import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../constants/colors.dart';
import '../models/user.dart';
import '../services/auth_service.dart';

class ProfileScreen extends StatelessWidget {
  final StudentProfileModel? profile;
  const ProfileScreen({super.key, this.profile});

  @override
  Widget build(BuildContext context) {
    final user = context.watch<AuthService>().user;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 220,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: const BoxDecoration(gradient: AppColors.maroonGradient),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    CircleAvatar(
                      radius: 40,
                      backgroundColor: Colors.white.withOpacity(0.2),
                      child: Text(
                        profile != null ? profile!.firstName[0].toUpperCase() : (user?.email[0].toUpperCase() ?? 'U'),
                        style: const TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.w700),
                      ),
                    ),
                    const SizedBox(height: 10),
                    Text(
                      profile?.fullName ?? user?.email ?? 'Student',
                      style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 18),
                    ),
                    if (profile != null)
                      Text(
                        '${profile!.rollNumber} • ${profile!.department} ${profile!.batch}',
                        style: const TextStyle(color: Colors.white70, fontSize: 12),
                      ),
                    const SizedBox(height: 16),
                  ],
                ),
              ),
            ),
            actions: [
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
                if (profile == null)
                  const Center(
                    child: Padding(
                      padding: EdgeInsets.all(40),
                      child: Column(
                        children: [
                          CircularProgressIndicator(),
                          SizedBox(height: 12),
                          Text('Loading profile...'),
                        ],
                      ),
                    ),
                  )
                else ...[
                  // Placement Status
                  _PlacementStatusCard(profile: profile!),
                  const SizedBox(height: 16),

                  // Academic Info
                  _SectionCard(
                    title: 'Academic Details',
                    icon: Icons.school_outlined,
                    children: [
                      _InfoRow('CGPA', profile!.cgpa.toStringAsFixed(2)),
                      _InfoRow('Backlogs', '${profile!.backlogs}'),
                      _InfoRow('Department', profile!.department),
                      _InfoRow('Batch', profile!.batch),
                      _InfoRow('Course', 'B.Tech'),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // Skills
                  if (profile!.skills.isNotEmpty) ...[
                    _SectionCard(
                      title: 'Skills (${profile!.skills.length})',
                      icon: Icons.code_rounded,
                      children: [
                        Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          children: profile!.skills.map((s) {
                            return Container(
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                              decoration: BoxDecoration(
                                color: s.levelColor.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(20),
                                border: Border.all(color: s.levelColor.withOpacity(0.3)),
                              ),
                              child: Text(
                                s.name,
                                style: TextStyle(color: s.levelColor, fontSize: 12, fontWeight: FontWeight.w600),
                              ),
                            );
                          }).toList(),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                  ],

                  // Certifications
                  if (profile!.certifications.isNotEmpty) ...[
                    _SectionCard(
                      title: 'Certifications',
                      icon: Icons.verified_outlined,
                      children: profile!.certifications
                          .map((c) => Padding(
                                padding: const EdgeInsets.symmetric(vertical: 4),
                                child: Row(
                                  children: [
                                    const Icon(Icons.check_circle_outline, size: 16, color: AppColors.success),
                                    const SizedBox(width: 8),
                                    Expanded(child: Text(c, style: const TextStyle(fontSize: 13))),
                                  ],
                                ),
                              ))
                          .toList(),
                    ),
                    const SizedBox(height: 16),
                  ],

                  // Links
                  if (profile!.linkedIn != null || profile!.github != null) ...[
                    _SectionCard(
                      title: 'Links',
                      icon: Icons.link_rounded,
                      children: [
                        if (profile!.linkedIn != null)
                          _LinkRow(
                            icon: Icons.work_outline,
                            label: 'LinkedIn',
                            url: profile!.linkedIn!,
                          ),
                        if (profile!.github != null)
                          _LinkRow(
                            icon: Icons.code,
                            label: 'GitHub',
                            url: profile!.github!,
                          ),
                        if (profile!.resumeUrl != null)
                          _LinkRow(
                            icon: Icons.description_outlined,
                            label: 'Resume',
                            url: profile!.resumeUrl!,
                          ),
                      ],
                    ),
                  ],

                  const SizedBox(height: 24),
                ],
              ]),
            ),
          ),
        ],
      ),
    );
  }
}

class _PlacementStatusCard extends StatelessWidget {
  final StudentProfileModel profile;
  const _PlacementStatusCard({required this.profile});

  @override
  Widget build(BuildContext context) {
    final isPlaced = profile.placementStatus == 'placed';
    final statusColors = {
      'placed': AppColors.success,
      'in_process': AppColors.info,
      'not_placed': AppColors.textSecondary,
      'opted_out': AppColors.warning,
    };
    final color = statusColors[profile.placementStatus] ?? AppColors.textSecondary;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(colors: [color.withOpacity(0.1), color.withOpacity(0.05)]),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Row(
        children: [
          Icon(isPlaced ? Icons.emoji_events_rounded : Icons.trending_up_rounded, color: color, size: 32),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                isPlaced ? 'Placed' : profile.placementStatus.replaceAll('_', ' ').toUpperCase(),
                style: TextStyle(fontWeight: FontWeight.w700, color: color, fontSize: 15),
              ),
              if (isPlaced && profile.offeredCompany != null)
                Text(
                  '${profile.offeredCompany} • ${profile.offeredRole ?? ''}'
                  '${profile.offeredCTC != null ? ' • ₹${(profile.offeredCTC! / 100000).toStringAsFixed(1)} LPA' : ''}',
                  style: const TextStyle(color: AppColors.textSecondary, fontSize: 12),
                ),
            ],
          ),
        ],
      ),
    );
  }
}

class _SectionCard extends StatelessWidget {
  final String title;
  final IconData icon;
  final List<Widget> children;

  const _SectionCard({required this.title, required this.icon, required this.children});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 8)],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 14, 16, 8),
            child: Row(
              children: [
                Icon(icon, size: 18, color: AppColors.maroon),
                const SizedBox(width: 8),
                Text(title, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14, color: AppColors.textPrimary)),
              ],
            ),
          ),
          const Divider(height: 1),
          Padding(
            padding: const EdgeInsets.all(14),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: children),
          ),
        ],
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  final String label;
  final String value;
  const _InfoRow(this.label, this.value);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 5),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: AppColors.textSecondary, fontSize: 13)),
          Text(value, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
        ],
      ),
    );
  }
}

class _LinkRow extends StatelessWidget {
  final IconData icon;
  final String label;
  final String url;
  const _LinkRow({required this.icon, required this.label, required this.url});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () async {
        final uri = Uri.tryParse(url);
        if (uri != null) await launchUrl(uri, mode: LaunchMode.externalApplication);
      },
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 8),
        child: Row(
          children: [
            Icon(icon, size: 18, color: AppColors.maroon),
            const SizedBox(width: 10),
            Text(label, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.maroon)),
            const Spacer(),
            const Icon(Icons.open_in_new, size: 14, color: AppColors.textSecondary),
          ],
        ),
      ),
    );
  }
}
