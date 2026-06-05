# FarmOS — Smart Farm Management & Decision Support Platform

<div align="center">

![Flutter](https://img.shields.io/badge/Flutter-3.10%2B-02569B?style=flat-square&logo=flutter)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=flat-square&logo=postgresql)
![Flask](https://img.shields.io/badge/Flask-AI%20Service-000000?style=flat-square&logo=flask)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

**An agricultural ERP platform built for small-to-mid scale farmers in Southern Africa.**  
Task automation · AI crop scheduling · Financial tracking · Team collaboration

</div>

---

## Overview

FarmOS is a full-stack mobile application that gives farmers a single platform to manage their entire farm operation — from planting to harvest, from task assignment to financial reporting. It is designed with offline-first use in mind, role-based access control baked in from day one, and an AI scheduling layer powered by the AquaCrop crop simulation model.

The system is built as a modular, layered architecture with a Flutter mobile frontend, a Node.js REST API gateway, a PostgreSQL database, and an optional Flask AI service for crop schedule generation and yield prediction.

---

## Architecture

```
Flutter Mobile App (Client)
         │
         ▼
Node.js API Gateway (Express + JWT)
         │
   ┌─────┴──────┐
   │            │
PostgreSQL    Flask AI Service
Database      (AquaCrop + Rules Engine)
```

**Architectural patterns:**
- Layered Architecture (Presentation → Provider → Service → Data)
- Domain-based modular structure
- RESTful API with stateless JWT authentication
- Role-Based Access Control (RBAC) enforced at middleware level
- Offline-first mobile with local SQLite sync queue

---

## Features

### Phase 1 — Core (Current)
- **Authentication** — JWT-based login and registration, secure token storage
- **Farm Management** — Multi-farm support, field management with soil data
- **Crop Cycles** — Track planting to harvest with growth stage progression
- **Task System** — Create, assign, and track tasks with a full audit trail
- **Role-Based Access** — Owner · Manager · Worker · Agronomist · Viewer roles per farm
- **Dashboard** — Real-time overview: tasks, weather, stats, alerts

### Phase 2
- **Membership Management** — Invite team members, assign and change roles
- **Goals System** — Set yield, profit, and efficiency targets with progress tracking
- **RBAC UI Enforcement** — Role-aware navigation and screen-level guards

### Phase 3
- **AI Scheduling** — AquaCrop-powered irrigation and fertiliser schedule generation
- **AI Recommendations** — Weather-aware pest, harvest, and input timing suggestions

### Phase 4
- **Finance Module** — Income, expense, and profit tracking by field and crop
- **QuickBooks Integration** — OAuth-based sync; manual entry fallback when offline
- **Financial Reports** — Monthly, quarterly, and yearly export-ready summaries

### Phase 5
- **Team Messaging** — Farm-scoped group chats and direct messages
- **Push Notifications** — Task reminders, weather alerts, goal progress (Firebase FCM)

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Mobile | Flutter 3.10+ | Cross-platform iOS & Android |
| State management | Provider (ChangeNotifier) | Reactive UI state |
| Navigation | GoRouter | Declarative routing with auth guards |
| HTTP client | Dio | API calls with JWT interceptor |
| Secure storage | flutter_secure_storage | Token persistence |
| Local database | SQLite (sqflite) | Offline-first sync queue |
| Charts | fl_chart | Finance bar charts, goal ring charts |
| Backend | Node.js + Express | REST API gateway |
| Authentication | JWT + bcrypt | Stateless token auth |
| Database | PostgreSQL 15 | Primary data store |
| AI service | Python + Flask | AquaCrop crop simulation |
| Notifications | Firebase FCM | Push notifications (Phase 5) |
| Accounting | QuickBooks API | Financial data sync (Phase 4) |
| Weather | OpenWeather API | Current and forecast data |

---

## Project Structure

```
farmos/
├── lib/
│   ├── main.dart                          # Entry point, MultiProvider setup
│   ├── core/
│   │   ├── theme/app_theme.dart           # AppColors, AppTextStyles, ThemeData
│   │   ├── constants/api_constants.dart   # All API endpoints + storage keys
│   │   └── router/app_router.dart         # GoRouter config, all 35 routes
│   ├── data/
│   │   ├── models/models.dart             # 12 data models with fromJson/toJson
│   │   └── services/
│   │       ├── api_service.dart           # Dio singleton + JWT interceptor
│   │       └── domain_services.dart       # Auth, Farm, Task, Finance, AI...
│   ├── providers/
│   │   └── providers.dart                 # 10 ChangeNotifier state providers
│   └── ui/
│       ├── widgets/shared_widgets.dart    # 14 reusable components
│       └── screens/
│           ├── splash/                    # Splash + token routing
│           ├── onboarding/                # 4-slide feature intro
│           ├── auth/                      # Login, Register
│           ├── setup/                     # 3-step farm wizard
│           ├── main/                      # BottomNav shell
│           ├── dashboard/                 # Home screen
│           ├── tasks/                     # List, Detail, Create, Update, Calendar
│           ├── farm/                      # Farm list, Detail, Fields, Crop cycles
│           ├── membership/                # Members, Add member, Edit role
│           ├── ai/                        # Auto schedule, Recommendations
│           ├── goals/                     # Goals dashboard, Create goal
│           ├── finance/                   # Overview, QuickBooks, Transactions, Reports
│           ├── messaging/                 # Chat list, Chat room
│           ├── notifications/             # Notification feed
│           └── profile/                   # Profile, Settings
└── assets/
    ├── images/
    └── icons/
```

---

## Data Model

```
User
 └── FarmMembership (role per farm)
      └── Farm
           ├── Field (soil_type, pH, hectares, water_source)
           │    └── CropCycle (crop_type, planting_date, stage, progress)
           │         └── Task (title, priority, status, due_date)
           │              └── TaskUpdate (comment, new_status, audit trail)
           ├── Goal (type, target_value, current_value, deadline)
           └── Transaction (income/expense, category, date, QB_synced)
```

---

## Getting Started

### Prerequisites

- Flutter SDK ≥ 3.10
- Dart ≥ 3.0
- Node.js ≥ 18 (for backend)
- PostgreSQL 15 (for backend)
- Python 3.10+ with Flask (for AI service — optional in Phase 1)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/farmos.git
cd farmos
```

### 2. Install Flutter dependencies

```bash
flutter pub get
```

### 3. Configure environment

Open `lib/core/constants/api_constants.dart` and update the base URL:

```dart
// For Android emulator (maps localhost to 10.0.2.2)
static const String baseUrl = 'http://10.0.2.2:3000/api';

// For iOS simulator or physical device on same network
static const String baseUrl = 'http://YOUR_LOCAL_IP:3000/api';
```

### 4. Android permissions

In `android/app/src/main/AndroidManifest.xml`, add inside `<manifest>`:

```xml
<uses-permission android:name="android.permission.INTERNET"/>
<uses-permission android:name="android.permission.CAMERA"/>
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
```

Create `android/app/src/main/res/xml/network_security_config.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
  <domain-config cleartextTrafficPermitted="true">
    <domain includeSubdomains="true">localhost</domain>
    <domain includeSubdomains="true">10.0.2.2</domain>
  </domain-config>
</network-security-config>
```

### 5. iOS permissions

In `ios/Runner/Info.plist`, add:

```xml
<key>NSCameraUsageDescription</key>
<string>FarmOS uses your camera to scan soil reports and receipts.</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>FarmOS accesses your photos to attach field images to tasks.</string>
<key>NSAppTransportSecurity</key>
<dict>
  <key>NSAllowsArbitraryLoads</key>
  <true/>
</dict>
```

### 6. Run the app

```bash
flutter run
```

The app runs in **dummy data mode** by default — every screen is fully functional with realistic sample data and requires no backend connection.

---

## Switching from Dummy Data to Real API

Each provider has a single flag. Flip it one provider at a time as you build out backend endpoints:

```dart
// In lib/providers/providers.dart — inside each provider class:
static const _useDummy = true;   // ← change to false when backend is ready
```

Provider-to-endpoint mapping:

| Provider | Endpoints needed |
|---|---|
| `AuthProvider` | `POST /auth/login`, `POST /auth/register` |
| `FarmProvider` | `GET/POST /farms`, `GET/POST /farms/:id/members` |
| `FieldProvider` | `GET/POST/PUT /farms/:id/fields` |
| `CropCycleProvider` | `GET/POST /farms/:id/crop-cycles` |
| `TaskProvider` | `GET/POST /crop-cycles/:id/tasks`, `PUT /tasks/:id`, `POST /tasks/:id/updates` |
| `FinanceProvider` | `GET/POST /finance/transactions`, `GET /finance/quickbooks/status` |
| `GoalsProvider` | `GET/POST /goals` |
| `WeatherProvider` | `GET /weather/current` |
| `AiProvider` | `POST /ai/generate-schedule` (Flask service) |
| `MessagingProvider` | `GET /messages/conversations`, WebSocket (Phase 5) |

---

## Role-Based Access Control

Roles are assigned **per farm**, not globally. A user can be a Manager on one farm and a Worker on another.

| Permission | Owner | Manager | Worker | Agronomist | Viewer |
|---|:---:|:---:|:---:|:---:|:---:|
| Create tasks | ✓ | ✓ | | | |
| Update task status | ✓ | ✓ | ✓ | | |
| View tasks | ✓ | ✓ | ✓ | ✓ | ✓ |
| Manage members | ✓ | | | | |
| View financials | ✓ | ✓ | | | |
| Edit financials | ✓ | | | | |
| Run AI scheduler | ✓ | ✓ | | ✓ | |
| Manage farm settings | ✓ | | | | |

---

## QuickBooks Integration

FarmOS **integrates with** QuickBooks — it does not replace it.

```
User taps "Connect"
       │
       ▼
Node.js generates OAuth URL
       │
       ▼
User authorises in QuickBooks
       │
       ▼
QB redirects to farmos://quickbooks/callback
       │
       ▼
Node.js stores access + refresh tokens
       │
       ▼
Transactions sync automatically
```

Manual transaction entry is always available as a fallback when QuickBooks is not connected or the user is offline.

To configure:
1. Register at [developer.intuit.com](https://developer.intuit.com)
2. Add your client ID and redirect URI to `api_constants.dart`:
```dart
static const String qbClientId    = 'YOUR_QB_CLIENT_ID';
static const String qbRedirectUri = 'farmos://quickbooks/callback';
```

---

## Dummy Data Reference

All sample data is defined as static methods on model classes — never hardcoded in screens.

| Model | Accessor | Records |
|---|---|---|
| `UserModel` | `UserModel.dummy` | 1 user (Kabo Sithole) |
| `FarmModel` | `FarmModel.dummyList` | 2 farms |
| `MembershipModel` | `MembershipModel.dummyList` | 4 members (Owner, Manager, 2× Worker) |
| `FieldModel` | `FieldModel.dummyList` | 3 fields (Field A/B/C) |
| `CropCycleModel` | `CropCycleModel.dummyList` | 3 cycles (Corn 62%, Wheat 81%, Soy 44%) |
| `TaskModel` | `TaskModel.dummyList` | 4 tasks (Pending, Overdue, Completed, Pending) |
| `TaskUpdateModel` | `TaskUpdateModel.dummyFor(id)` | 2 audit entries |
| `TransactionModel` | `TransactionModel.dummyList` | 4 transactions (BWP) |
| `GoalModel` | `GoalModel.dummyList` | 4 goals (On track, Behind, Excellent, At risk) |
| `WeatherModel` | `WeatherModel.dummy` | 24°C, partly cloudy, Gaborone |
| `ConversationModel` | `ConversationModel.dummyList` | 3 conversations |
| `MessageModel` | `MessageModel.dummyFor(id)` | 4 messages per conversation |

---

## Development Roadmap

```
Phase 1  ████████████████████  Auth, Farm setup, Task system         ← Current
Phase 2  ████████████░░░░░░░░  Membership UI, Goals, RBAC enforcement
Phase 3  ████░░░░░░░░░░░░░░░░  AI scheduling (AquaCrop + Flask)
Phase 4  ██░░░░░░░░░░░░░░░░░░  Finance + QuickBooks integration
Phase 5  █░░░░░░░░░░░░░░░░░░░  Messaging + Push notifications
```

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Follow the existing architecture — new features go in the correct domain layer (model → service → provider → screen)
4. Keep `_useDummy = true` in providers during development; backend integration is a separate PR
5. Submit a pull request with a clear description of what was changed and why

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

## Acknowledgements

- [AquaCrop](https://www.fao.org/aquacrop) — FAO crop water productivity model
- [OpenWeather API](https://openweathermap.org/api) — Weather data
- [QuickBooks API](https://developer.intuit.com) — Accounting integration
- Built for farmers in Botswana, Namibia, and the broader Southern Africa region