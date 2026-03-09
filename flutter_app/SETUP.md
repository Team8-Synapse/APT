# Flutter App Setup

This is the student-facing mobile app for Amrita Placement Tracker.
The existing Node.js backend is reused as-is — no backend changes needed.

## Prerequisites

1. Install Flutter SDK: https://docs.flutter.dev/get-started/install
2. Install Android Studio or Xcode (for iOS)
3. Run `flutter doctor` to verify setup

## First-time setup

```bash
cd flutter_app

# 1. Generate Android/iOS project scaffolding
flutter create . --org com.amrita --project-name amrita_placement_tracker

# 2. Install dependencies
flutter pub get

# 3. Create asset folders (required by pubspec.yaml)
mkdir assets/images assets/animations assets/fonts
```

## Configure API URL

Edit `lib/constants/api.dart`:

```dart
// Android emulator → host machine localhost
const String kApiBaseUrl = 'http://10.0.2.2:5005/api';

// Physical Android device on same WiFi (replace with your machine's LAN IP)
// const String kApiBaseUrl = 'http://192.168.1.X:5005/api';

// iOS Simulator
// const String kApiBaseUrl = 'http://localhost:5005/api';
```

## Run

```bash
# Start backend first (from project root)
cd ../server && node server.js

# Then run Flutter app
cd ../flutter_app
flutter run
```

## Screens

| Screen | Description |
|--------|-------------|
| Login | JWT auth against existing backend |
| Home (Dashboard) | Announcements, placement status, stats |
| Drives | Browse & apply to placement drives |
| PrepHub AI | RAG-powered chatbot using live DB data |
| Calendar | Visual monthly drive calendar |
| Profile | Student details, skills, certifications |

## Project Structure

```
lib/
  main.dart               # App entry, theme, auth gate
  constants/
    colors.dart           # Brand colors (maroon, gold)
    api.dart              # API endpoints
  models/
    user.dart             # UserModel, StudentProfileModel, SkillModel
    placement_drive.dart  # PlacementDriveModel
  services/
    api_service.dart      # Dio HTTP client — all API calls
    auth_service.dart     # ChangeNotifier — JWT + secure storage
  screens/
    login_screen.dart
    home_screen.dart      # Dashboard + bottom nav
    chatbot_screen.dart   # AI PrepHub with typing indicator
    drives_screen.dart    # Drive list + apply
    calendar_screen.dart  # Monthly calendar view
    profile_screen.dart   # Student profile
```

## Notes

- Fonts (Poppins) need to be downloaded and placed in `assets/fonts/`
  OR remove the `fonts:` block from `pubspec.yaml` to use the default font.
- The AI chatbot connects to `/api/ai/chat` — the RAG system automatically
  queries MongoDB for placement data based on the user's question.
