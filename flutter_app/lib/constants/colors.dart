import 'package:flutter/material.dart';

class AppColors {
  static const Color maroon = Color(0xFF7B1C1C);
  static const Color maroonDark = Color(0xFF5A1212);
  static const Color maroonLight = Color(0xFF9E2A2A);
  static const Color gold = Color(0xFFC9A84C);
  static const Color goldLight = Color(0xFFE8C96A);
  static const Color background = Color(0xFFF8F4F0);
  static const Color cardBg = Color(0xFFFFFFFF);
  static const Color textPrimary = Color(0xFF1A1A2E);
  static const Color textSecondary = Color(0xFF6B7280);
  static const Color success = Color(0xFF10B981);
  static const Color warning = Color(0xFFF59E0B);
  static const Color error = Color(0xFFEF4444);
  static const Color info = Color(0xFF3B82F6);

  // Gradient
  static const LinearGradient maroonGradient = LinearGradient(
    colors: [maroonDark, maroon, maroonLight],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
}
