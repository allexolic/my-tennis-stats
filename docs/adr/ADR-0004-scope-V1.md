# ADR-0004: Scope of Version 1

- **Status:** Accepted
- **Date:** 2026-08-08

## Context

The first version of the application aims to deliver a complete and stable experience for recreational tennis players.

Rather than implementing every possible feature, Version 1 focuses on validating the core workflow.

A limited scope reduces complexity, improves quality and provides a solid foundation for future versions.

---

## Decision

Version 1 intentionally limits the feature set to a single-set tennis match played offline.

Only features considered essential for validating the product are included.

---

## Included Features

### Match Management

- Create a new match.
- Resume an active match.
- Finish a match.
- View match summary.

---

### Match Recording

- Register service games.
- Register return games.
- Register tie-breaks.
- Automatic score calculation.
- Automatic server alternation.

---

### Statistics

- Service statistics.
- Return statistics.
- Hold percentage.
- Break percentage.
- Match duration.

---

### Persistence

- SQLite database.
- Drizzle ORM.
- Offline-first architecture.

---

## Excluded Features

The following features are intentionally postponed.

### Match Rules

- Best of three sets.
- Best of five sets.
- Super tie-break.
- Custom scoring rules.

---

### Statistics

- Point-by-point history.
- Rally analysis.
- Winners.
- Unforced errors.
- Serve placement.

---

### User Features

- Authentication.
- User accounts.
- Opponent profiles.
- Match history.
- Favorites.

---

### Synchronization

- Cloud synchronization.
- Multi-device support.
- Backup.
- Data sharing.

---

### Analytics

- Charts.
- Trends.
- Seasonal statistics.
- Performance evolution.

---

## Rationale

Restricting the scope allows the project to:

- Validate the product idea quickly.
- Maintain a clean architecture.
- Keep development incremental.
- Ensure high test coverage.
- Reduce technical debt.

---

## Future Versions

Version 2 is expected to introduce:

- Match history.
- Opponent profiles.
- Statistical evolution.
- UI refinements.
- Design System.
- Cloud synchronization preparation.

Future versions may expand the scoring model while preserving the current architecture.

---

## Decision Summary

Version 1 delivers a complete offline experience focused on a single-set tennis match.

Additional functionality will be introduced incrementally in future versions without changing the architectural principles established in Version 1.