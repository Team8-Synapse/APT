import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../constants/colors.dart';
import '../models/placement_drive.dart';
import '../services/api_service.dart';

class CalendarScreen extends StatefulWidget {
  const CalendarScreen({super.key});

  @override
  State<CalendarScreen> createState() => _CalendarScreenState();
}

class _CalendarScreenState extends State<CalendarScreen> {
  final _api = ApiService();
  List<PlacementDriveModel> _drives = [];
  bool _isLoading = true;
  DateTime _focusedMonth = DateTime.now();
  DateTime? _selectedDay;

  @override
  void initState() {
    super.initState();
    _selectedDay = DateTime.now();
    _loadDrives();
  }

  Future<void> _loadDrives() async {
    setState(() => _isLoading = true);
    try {
      final data = await _api.getStudentDrives();
      setState(() {
        _drives = data.map((d) => PlacementDriveModel.fromJson(d)).toList();
        _isLoading = false;
      });
    } catch (_) {
      setState(() => _isLoading = false);
    }
  }

  List<PlacementDriveModel> _drivesForDay(DateTime day) {
    return _drives.where((d) =>
        d.date.year == day.year && d.date.month == day.month && d.date.day == day.day
    ).toList();
  }

  bool _hasDrive(DateTime day) => _drivesForDay(day).isNotEmpty;

  List<DateTime> _daysInMonth(DateTime month) {
    final first = DateTime(month.year, month.month, 1);
    final last = DateTime(month.year, month.month + 1, 0);
    return List.generate(last.day, (i) => DateTime(month.year, month.month, i + 1));
  }

  @override
  Widget build(BuildContext context) {
    final days = _daysInMonth(_focusedMonth);
    final firstWeekday = days.first.weekday % 7; // Sunday = 0
    final selectedDrives = _selectedDay != null ? _drivesForDay(_selectedDay!) : <PlacementDriveModel>[];

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Calendar', style: TextStyle(fontWeight: FontWeight.w700)),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
                // Month navigation
                Container(
                  color: AppColors.maroon,
                  padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      IconButton(
                        icon: const Icon(Icons.chevron_left, color: Colors.white),
                        onPressed: () => setState(
                            () => _focusedMonth = DateTime(_focusedMonth.year, _focusedMonth.month - 1)),
                      ),
                      Text(
                        DateFormat('MMMM yyyy').format(_focusedMonth),
                        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 16),
                      ),
                      IconButton(
                        icon: const Icon(Icons.chevron_right, color: Colors.white),
                        onPressed: () => setState(
                            () => _focusedMonth = DateTime(_focusedMonth.year, _focusedMonth.month + 1)),
                      ),
                    ],
                  ),
                ),

                // Calendar grid
                Container(
                  color: Colors.white,
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    children: [
                      // Day headers
                      Row(
                        children: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
                            .map((d) => Expanded(
                                  child: Center(
                                    child: Text(d,
                                        style: const TextStyle(
                                            fontSize: 11,
                                            fontWeight: FontWeight.w600,
                                            color: AppColors.textSecondary)),
                                  ),
                                ))
                            .toList(),
                      ),
                      const SizedBox(height: 8),
                      // Grid
                      GridView.builder(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 7, childAspectRatio: 1),
                        itemCount: days.length + firstWeekday,
                        itemBuilder: (_, index) {
                          if (index < firstWeekday) return const SizedBox();
                          final day = days[index - firstWeekday];
                          final isToday = day.year == DateTime.now().year &&
                              day.month == DateTime.now().month &&
                              day.day == DateTime.now().day;
                          final isSelected = _selectedDay != null &&
                              day.year == _selectedDay!.year &&
                              day.month == _selectedDay!.month &&
                              day.day == _selectedDay!.day;
                          final hasDrive = _hasDrive(day);

                          return GestureDetector(
                            onTap: () => setState(() => _selectedDay = day),
                            child: Container(
                              margin: const EdgeInsets.all(2),
                              decoration: BoxDecoration(
                                color: isSelected
                                    ? AppColors.maroon
                                    : isToday
                                        ? AppColors.gold.withOpacity(0.2)
                                        : null,
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Text(
                                    '${day.day}',
                                    style: TextStyle(
                                      fontSize: 12,
                                      fontWeight: isSelected || isToday ? FontWeight.w700 : FontWeight.normal,
                                      color: isSelected ? Colors.white : AppColors.textPrimary,
                                    ),
                                  ),
                                  if (hasDrive)
                                    Container(
                                      width: 5,
                                      height: 5,
                                      margin: const EdgeInsets.only(top: 2),
                                      decoration: BoxDecoration(
                                        color: isSelected ? Colors.white : AppColors.gold,
                                        shape: BoxShape.circle,
                                      ),
                                    ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
                    ],
                  ),
                ),

                // Events for selected day
                Expanded(
                  child: selectedDrives.isEmpty
                      ? Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(Icons.event_available_rounded, size: 40, color: Colors.grey.shade300),
                              const SizedBox(height: 8),
                              Text(
                                _selectedDay != null
                                    ? 'No drives on ${DateFormat('d MMM').format(_selectedDay!)}'
                                    : 'Select a date',
                                style: TextStyle(color: Colors.grey.shade400, fontSize: 13),
                              ),
                            ],
                          ),
                        )
                      : ListView.builder(
                          padding: const EdgeInsets.all(16),
                          itemCount: selectedDrives.length,
                          itemBuilder: (_, i) {
                            final d = selectedDrives[i];
                            return Container(
                              margin: const EdgeInsets.only(bottom: 10),
                              padding: const EdgeInsets.all(14),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: d.statusColor.withOpacity(0.3)),
                                boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 6)],
                              ),
                              child: Row(
                                children: [
                                  Container(
                                    width: 4,
                                    height: 50,
                                    decoration: BoxDecoration(
                                      color: d.statusColor,
                                      borderRadius: BorderRadius.circular(2),
                                    ),
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(d.companyName,
                                            style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
                                        Text(d.jobProfile,
                                            style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)),
                                        const SizedBox(height: 4),
                                        Row(
                                          children: [
                                            Container(
                                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                              decoration: BoxDecoration(
                                                  color: d.statusColor.withOpacity(0.1),
                                                  borderRadius: BorderRadius.circular(4)),
                                              child: Text(d.status,
                                                  style: TextStyle(color: d.statusColor, fontSize: 10, fontWeight: FontWeight.w600)),
                                            ),
                                            const SizedBox(width: 8),
                                            Text(d.jobType,
                                                style: const TextStyle(color: AppColors.textSecondary, fontSize: 10)),
                                          ],
                                        ),
                                      ],
                                    ),
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
