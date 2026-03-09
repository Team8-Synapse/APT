import 'package:flutter/material.dart';

class PlacementDriveModel {
  final String id;
  final String companyName;
  final String? companyLogo;
  final String jobProfile;
  final String? jobDescription;
  final String jobType;
  final DateTime date;
  final String status;
  final double? ctc;
  final double minCgpa;
  final List<String> allowedDepartments;
  final List<String> requirements;
  final String? workLocation;
  final String? mode;

  const PlacementDriveModel({
    required this.id,
    required this.companyName,
    this.companyLogo,
    required this.jobProfile,
    this.jobDescription,
    required this.jobType,
    required this.date,
    required this.status,
    this.ctc,
    required this.minCgpa,
    required this.allowedDepartments,
    required this.requirements,
    this.workLocation,
    this.mode,
  });

  factory PlacementDriveModel.fromJson(Map<String, dynamic> json) {
    return PlacementDriveModel(
      id: json['_id'] ?? '',
      companyName: json['companyName'] ?? '',
      companyLogo: json['companyLogo'],
      jobProfile: json['jobProfile'] ?? '',
      jobDescription: json['jobDescription'],
      jobType: json['jobType'] ?? 'Full Time',
      date: json['date'] != null
          ? DateTime.tryParse(json['date']) ?? DateTime.now()
          : DateTime.now(),
      status: json['status'] ?? 'upcoming',
      ctc: json['ctcDetails']?['ctc'] != null
          ? (json['ctcDetails']['ctc'] as num).toDouble()
          : null,
      minCgpa: (json['eligibility']?['minCgpa'] ?? 0).toDouble(),
      allowedDepartments:
          List<String>.from(json['eligibility']?['allowedDepartments'] ?? []),
      requirements: List<String>.from(json['requirements'] ?? []),
      workLocation: json['workLocation'],
      mode: json['mode'],
    );
  }

  Color get statusColor {
    switch (status) {
      case 'ongoing':
        return const Color(0xFF10B981);
      case 'upcoming':
        return const Color(0xFF3B82F6);
      case 'completed':
        return const Color(0xFF6B7280);
      case 'cancelled':
        return const Color(0xFFEF4444);
      default:
        return const Color(0xFF6B7280);
    }
  }
}


