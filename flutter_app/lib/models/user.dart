import 'package:flutter/material.dart';

class UserModel {
  final String id;
  final String email;
  final String role;
  final String? name;

  const UserModel({
    required this.id,
    required this.email,
    required this.role,
    this.name,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['_id'] ?? json['id'] ?? '',
      email: json['email'] ?? '',
      role: json['role'] ?? 'student',
      name: json['name'],
    );
  }

  bool get isAdmin => role == 'admin';
  bool get isStudent => role == 'student';
}

class SkillModel {
  final String name;
  final String level;

  const SkillModel({required this.name, required this.level});

  factory SkillModel.fromJson(Map<String, dynamic> json) {
    return SkillModel(
      name: json['name'] ?? '',
      level: json['level'] ?? 'Beginner',
    );
  }

  Color get levelColor {
    switch (level) {
      case 'Advanced':
        return const Color(0xFF10B981);
      case 'Intermediate':
        return const Color(0xFF3B82F6);
      default:
        return const Color(0xFFF59E0B);
    }
  }
}

class StudentProfileModel {
  final String id;
  final String rollNumber;
  final String firstName;
  final String lastName;
  final String? email;
  final String department;
  final String batch;
  final double cgpa;
  final int backlogs;
  final String placementStatus;
  final String? offeredCompany;
  final String? offeredRole;
  final double? offeredCTC;
  final List<SkillModel> skills;
  final List<String> certifications;
  final String? resumeUrl;
  final String? linkedIn;
  final String? github;

  const StudentProfileModel({
    required this.id,
    required this.rollNumber,
    required this.firstName,
    required this.lastName,
    this.email,
    required this.department,
    required this.batch,
    required this.cgpa,
    required this.backlogs,
    required this.placementStatus,
    this.offeredCompany,
    this.offeredRole,
    this.offeredCTC,
    required this.skills,
    required this.certifications,
    this.resumeUrl,
    this.linkedIn,
    this.github,
  });

  String get fullName => '$firstName $lastName';

  factory StudentProfileModel.fromJson(Map<String, dynamic> json) {
    return StudentProfileModel(
      id: json['_id'] ?? '',
      rollNumber: json['rollNumber'] ?? '',
      firstName: json['firstName'] ?? '',
      lastName: json['lastName'] ?? '',
      email: json['email'],
      department: json['department'] ?? '',
      batch: json['batch'] ?? '',
      cgpa: (json['cgpa'] ?? 0).toDouble(),
      backlogs: json['backlogs'] ?? 0,
      placementStatus: json['placementStatus'] ?? 'not_placed',
      offeredCompany: json['offeredCompany'],
      offeredRole: json['offeredRole'],
      offeredCTC: json['offeredCTC'] != null
          ? (json['offeredCTC'] as num).toDouble()
          : null,
      skills: (json['skills'] as List<dynamic>? ?? [])
          .map((s) => SkillModel.fromJson(s))
          .toList(),
      certifications: List<String>.from(json['certifications'] ?? []),
      resumeUrl: json['resumeUrl'],
      linkedIn: json['linkedIn'],
      github: json['github'],
    );
  }
}


