# ADR-0003: Domain Model

- **Status:** Accepted
- **Date:** 2026-08-08

## Context

The application records tennis matches by storing completed games and deriving all match information from those records.

During the design phase, several approaches were evaluated regarding how the match state should be represented and persisted.

The objective was to keep the domain simple, deterministic and independent from any persistence technology.

---

## Decision

The domain is centered around a single aggregate root: `Match`.

A `Match` contains an ordered collection of immutable `MatchRecord` instances.

The application never persists derived information such as:

- Current score
- Current server
- Match statistics
- Match winner
- Match progress

These values are calculated whenever needed.

---

## Domain Structure

### Aggregate Root

```
Match
```

The `Match` entity is responsible for representing the lifecycle of a tennis match.

It contains:

- Match metadata
- Opponent information
- First server
- Current status
- Match records

---

### Match Records

Every event that changes the match is represented by a `MatchRecord`.

Current record types are:

- `PLAYER_SERVICE_GAME`
- `PLAYER_RETURN_GAME`
- `SET_TIE_BREAK`

Records are immutable after creation.

A record is never edited.

---

### MatchEngine

`MatchEngine` is responsible for deriving the current state of the match.

It calculates:

- Current score
- Current server
- Match winner
- Match completion
- Next expected record

The engine is deterministic.

Given the same match history, it always produces the same result.

---

### StatisticsCalculator

The `StatisticsCalculator` derives all statistics from match records.

Examples include:

- Service games played
- Service games won
- Hold percentage
- Return games played
- Break percentage
- Double faults
- Valid second serves
- Points won while returning

Statistics are never persisted.

---

## Consequences

### Positive

- Single source of truth.
- No duplicated information.
- Deterministic calculations.
- Easier testing.
- Simple persistence model.
- Easier future synchronization.
- Easier auditing.

### Negative

- Calculations occur every time the match is loaded.
- Slightly more processing than storing calculated values.

The performance impact is negligible due to the small amount of match data.

---

## Alternatives Considered

### Alternative 1 — Persist current score and statistics

Advantages:

- Faster reads.

Disadvantages:

- Data duplication.
- Risk of inconsistent state.
- More complex updates.

**Decision:** Rejected.

---

### Alternative 2 — Calculate derived information

Advantages:

- Single source of truth.
- No synchronization problems.
- Simpler maintenance.
- Better testability.

**Decision:** Accepted.

---

## Future Considerations

The current model naturally supports future features such as:

- Match history
- Cloud synchronization
- Data export
- Advanced statistics
- Analytics dashboards

without changing the domain model.

---

## Decision Summary

The application persists only immutable match records.

All scores, statistics and match progress are calculated by the domain layer whenever requested.