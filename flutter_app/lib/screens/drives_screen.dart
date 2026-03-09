import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../constants/colors.dart';
import '../models/placement_drive.dart';
import '../services/api_service.dart';

class DrivesScreen extends StatefulWidget {
  const DrivesScreen({super.key});

  @override
  State<DrivesScreen> createState() => _DrivesScreenState();
}

class _DrivesScreenState extends State<DrivesScreen> with SingleTickerProviderStateMixin {
  final _api = ApiService();
  List<PlacementDriveModel> _drives = [];
  List<PlacementDriveModel> _filtered = [];
  bool _isLoading = true;
  String _searchQuery = '';
  String _selectedStatus = 'All';
  late TabController _tabController;

  final _statusFilters = ['All', 'upcoming', 'ongoing', 'completed'];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _loadDrives();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadDrives() async {
    setState(() => _isLoading = true);
    try {
      final data = await _api.getStudentDrives();
      setState(() {
        _drives = data.map((d) => PlacementDriveModel.fromJson(d)).toList();
        _applyFilters();
        _isLoading = false;
      });
    } catch (_) {
      setState(() => _isLoading = false);
    }
  }

  void _applyFilters() {
    setState(() {
      _filtered = _drives.where((d) {
        final matchesSearch = _searchQuery.isEmpty ||
            d.companyName.toLowerCase().contains(_searchQuery.toLowerCase()) ||
            d.jobProfile.toLowerCase().contains(_searchQuery.toLowerCase());
        final matchesStatus = _selectedStatus == 'All' || d.status == _selectedStatus;
        return matchesSearch && matchesStatus;
      }).toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Placement Drives', style: TextStyle(fontWeight: FontWeight.w700)),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(110),
          child: Column(
            children: [
              // Search bar
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 0, 16, 8),
                child: TextField(
                  onChanged: (v) {
                    _searchQuery = v;
                    _applyFilters();
                  },
                  style: const TextStyle(color: Colors.white),
                  decoration: InputDecoration(
                    hintText: 'Search company or role...',
                    hintStyle: const TextStyle(color: Colors.white60),
                    prefixIcon: const Icon(Icons.search_rounded, color: Colors.white60),
                    filled: true,
                    fillColor: Colors.white.withOpacity(0.15),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide.none,
                    ),
                    contentPadding: const EdgeInsets.symmetric(vertical: 10),
                  ),
                ),
              ),
              // Filter chips
              SizedBox(
                height: 40,
                child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: _statusFilters.length,
                  separatorBuilder: (_, __) => const SizedBox(width: 8),
                  itemBuilder: (_, i) {
                    final f = _statusFilters[i];
                    final selected = _selectedStatus == f;
                    return ChoiceChip(
                      label: Text(f[0].toUpperCase() + f.substring(1)),
                      selected: selected,
                      onSelected: (_) {
                        _selectedStatus = f;
                        _applyFilters();
                      },
                      selectedColor: AppColors.gold,
                      labelStyle: TextStyle(
                        color: selected ? AppColors.maroon : Colors.white70,
                        fontWeight: FontWeight.w600,
                        fontSize: 12,
                      ),
                      backgroundColor: Colors.white.withOpacity(0.15),
                      side: BorderSide.none,
                    );
                  },
                ),
              ),
              const SizedBox(height: 8),
            ],
          ),
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _filtered.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.business_outlined, size: 56, color: Colors.grey.shade400),
                      const SizedBox(height: 12),
                      Text('No drives found', style: TextStyle(color: Colors.grey.shade500, fontSize: 15)),
                    ],
                  ),
                )
              : RefreshIndicator(
                  onRefresh: _loadDrives,
                  child: ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: _filtered.length,
                    itemBuilder: (_, i) => _DriveCard(drive: _filtered[i], onApply: _loadDrives),
                  ),
                ),
    );
  }
}

class _DriveCard extends StatelessWidget {
  final PlacementDriveModel drive;
  final VoidCallback onApply;
  const _DriveCard({required this.drive, required this.onApply});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.06), blurRadius: 10, offset: const Offset(0, 2))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [AppColors.maroon.withOpacity(0.9), AppColors.maroonLight.withOpacity(0.8)],
              ),
              borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
            ),
            child: Row(
              children: [
                // Company initial avatar
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Center(
                    child: Text(
                      drive.companyName.isNotEmpty ? drive.companyName[0].toUpperCase() : '?',
                      style: const TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.w700),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(drive.companyName,
                          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 16)),
                      Text(drive.jobProfile,
                          style: const TextStyle(color: Colors.white70, fontSize: 13)),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: drive.statusColor.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: drive.statusColor.withOpacity(0.5)),
                  ),
                  child: Text(
                    drive.status[0].toUpperCase() + drive.status.substring(1),
                    style: TextStyle(color: drive.statusColor, fontSize: 11, fontWeight: FontWeight.w600),
                  ),
                ),
              ],
            ),
          ),

          // Details
          Padding(
            padding: const EdgeInsets.all(14),
            child: Column(
              children: [
                Row(
                  children: [
                    _DetailChip(icon: Icons.calendar_today_outlined,
                        label: DateFormat('d MMM yyyy').format(drive.date)),
                    const SizedBox(width: 8),
                    _DetailChip(icon: Icons.work_outline_rounded, label: drive.jobType),
                    if (drive.mode != null) ...[
                      const SizedBox(width: 8),
                      _DetailChip(icon: Icons.location_on_outlined, label: drive.mode!),
                    ],
                  ],
                ),
                const SizedBox(height: 10),
                Row(
                  children: [
                    if (drive.ctc != null)
                      _DetailChip(
                          icon: Icons.currency_rupee,
                          label: '${(drive.ctc! / 100000).toStringAsFixed(1)} LPA',
                          highlight: true),
                    if (drive.ctc != null) const SizedBox(width: 8),
                    _DetailChip(
                        icon: Icons.school_outlined,
                        label: 'Min CGPA: ${drive.minCgpa.toStringAsFixed(1)}'),
                  ],
                ),
                if (drive.status == 'upcoming') ...[
                  const SizedBox(height: 12),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      onPressed: () async {
                        try {
                          await ApiService().applyToDrive(drive.id);
                          if (context.mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Applied successfully!'),
                                backgroundColor: AppColors.success,
                                behavior: SnackBarBehavior.floating,
                              ),
                            );
                          }
                          onApply();
                        } catch (e) {
                          if (context.mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text(e.toString().contains('already') ? 'Already applied!' : 'Could not apply. Try again.'),
                                backgroundColor: AppColors.warning,
                                behavior: SnackBarBehavior.floating,
                              ),
                            );
                          }
                        }
                      },
                      icon: const Icon(Icons.send_rounded, size: 16),
                      label: const Text('Apply Now'),
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 10),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _DetailChip extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool highlight;
  const _DetailChip({required this.icon, required this.label, this.highlight = false});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: highlight ? AppColors.gold.withOpacity(0.15) : AppColors.background,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: highlight ? AppColors.gold.withOpacity(0.4) : Colors.grey.shade200),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 12, color: highlight ? AppColors.gold : AppColors.textSecondary),
          const SizedBox(width: 4),
          Text(label,
              style: TextStyle(
                  fontSize: 11,
                  color: highlight ? AppColors.maroon : AppColors.textSecondary,
                  fontWeight: highlight ? FontWeight.w600 : FontWeight.normal)),
        ],
      ),
    );
  }
}
