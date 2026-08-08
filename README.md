# 🎾 My Tennis Stats

> Offline-first tennis match tracker designed for amateur players.

My Tennis Stats is a mobile application that allows amateur tennis players to record match statistics quickly and naturally.

Unlike traditional tennis statistics applications, this project does **not** require point-by-point tracking. Instead, statistics are recorded **only at the end of each game**, allowing players to stay focused on the match while still collecting meaningful performance data.

The application was designed with a strong emphasis on clean architecture, deterministic domain logic, and an offline-first experience.

---

# Features

## Match Management

- Create a new match
- Resume an active match
- Automatic match completion
- Match summary

## Match Recording

- Register service games
- Register return games
- Register tie-breaks
- Automatic server alternation
- Automatic score calculation

## Statistics

- Service games played
- Service games won
- Hold percentage
- Return games played
- Break percentage
- Valid second serves
- Double faults
- Points lost while serving
- Points won while returning
- Match duration

## Persistence

- Offline-first
- SQLite database
- Drizzle ORM
- Automatic database migrations

---

# Design Principles

The project follows a few fundamental principles.

- **Offline First**
- **Simplicity over Complexity**
- **End-of-game registration**
- **Deterministic domain calculations**
- **Single source of truth**
- **Incremental architecture**
- **Feature-based organization**

---

# Application Flow

```text
Home
    │
    ▼
Create Match
    │
    ▼
Match Screen
    │
    ├──────────────┐
    ▼              │
Register Game ◄────┘
    │
    ▼
6 × 6 ?
 │
 ├── No
 │
 ▼
Continue Match
 │
 └── Yes
      │
      ▼
Register Tie-break
      │
      ▼
Match Finished
      │
      ▼
Match Summary
      │
      ▼
Home
```

---

# Architecture

The application follows a layered architecture inspired by Clean Architecture and Domain-Driven Design.

```text
Presentation
       │
       ▼
Application
       │
       ▼
Domain
       │
       ▼
Infrastructure
```

## Presentation

Responsible for the user interface.

Examples:

- Expo Router
- React Native Screens
- Components
- Hooks
- View Models

---

## Application

Coordinates business operations.

Contains:

- Use Cases
- DTOs
- Ports
- Application Errors

Examples:

- CreateMatch
- RegisterGame
- RegisterTieBreak
- GetActiveMatch
- GetMatchSummary

---

## Domain

Contains all business rules.

Examples:

- Match
- MatchRecord
- MatchEngine
- StatisticsCalculator
- Validators
- Domain Errors

The domain has no dependency on React Native, Expo or SQLite.

---

## Infrastructure

Responsible for external integrations.

Examples:

- SQLite
- Drizzle ORM
- Repositories
- ID Generator
- Clock

---

# Tech Stack

- Expo
- React Native
- TypeScript
- Expo Router
- Expo SQLite
- Drizzle ORM
- Jest
- React Native Testing Library

---

# Project Structure

```text
app/
│
├── matches/
└── _layout.tsx

src/
│
├── features/
│   └── matches/
│       ├── application/
│       ├── domain/
│       ├── infrastructure/
│       └── presentation/
│
├── shared/
│
└── test/

docs/
└── adr/
```

---

# Domain Overview

The application is centered around a single aggregate root.

```text
Match
│
├── MatchRecord
│
├── MatchEngine
│
└── StatisticsCalculator
```

The `Match` stores immutable records only.

Everything else—including score, statistics, winner and current server—is calculated by the domain.

This guarantees a single source of truth and deterministic behavior.

---

# Database

SQLite is used as the local database.

Database schema changes are managed with Drizzle ORM migrations.

```bash
npm run drizzle:generate
npm run drizzle:migrate
```

---

# Running the Project

Install dependencies:

```bash
npm install
```

Start Expo:

```bash
npx expo start
```

Run on iOS:

```bash
i
```

Run on Android:

```bash
a
```

---

# Running Tests

Execute all tests:

```bash
npm test
```

Run TypeScript verification:

```bash
npm run typecheck
```

Run Expo diagnostics:

```bash
npx expo-doctor
```

---

# Architecture Decision Records

Architectural decisions are documented in the `docs/adr` directory.

Current ADRs:

- ADR-0001 — Base Architecture
- ADR-0002 — Match Registration Strategy
- ADR-0003 — Domain Model
- ADR-0004 — Version 1 Scope

---

# Roadmap

## Version 1

- ✅ Create match
- ✅ Resume active match
- ✅ Register games
- ✅ Register tie-break
- ✅ Match summary
- ✅ Offline persistence

## Version 2

Planned features:

- Match history
- Opponent profiles
- Statistics evolution
- Charts
- Design System
- UI refinements
- Cloud synchronization
- User authentication

---

# Development Guidelines

The project follows an incremental development strategy.

Every new feature should:

- Start in the Domain layer.
- Be exposed through an Application use case.
- Be consumed by the Presentation layer.
- Remain independent from infrastructure details.
- Include automated tests.

---

# License

This project is licensed under the MIT License.

---

# Author

**Alexandre Curvelo**

Software Engineer focused on Java, Cloud Computing and Mobile Development.

This project was created to provide a practical and enjoyable way for amateur tennis players to collect meaningful match statistics while keeping their attention where it belongs: on the court.