# ADR-0002: Match Registration Strategy

- **Status:** Accepted
- **Date:** 2026-08-08

## Context

The application aims to help amateur tennis players collect useful match statistics without interfering with the game itself.

Most tennis statistics applications require point-by-point interaction, forcing the player to register every rally outcome while the match is in progress.

Although this approach provides highly detailed data, it introduces several drawbacks for the target audience:

- Frequent interaction with the device during the match.
- High cognitive load.
- Increased chance of missing points.
- Poor usability for recreational players.
- Longer learning curve.
- Lower probability of long-term adoption.

The primary goal of this project is not to replace professional match analysis tools.

Instead, the objective is to provide a lightweight statistics application that players can realistically use during every recreational match.

---

## Decision

Statistics are registered **only once at the end of each game**.

The application never requires point-by-point interaction.

Instead, after a game finishes, the player records only the information that can reasonably be remembered.

### Service Game

When serving, the player records:

- Game result (Won/Lost)
- Valid second serves
- Double faults
- Points lost

### Return Game

When returning, the player records:

- Game result (Won/Lost)
- Points won while returning

### Tie-break

When a tie-break is required, the player records only:

- Final tie-break score

All remaining information—including score progression, service alternation, winner determination and match statistics—is calculated by the domain layer.

---

## Rationale

This approach significantly reduces the amount of interaction required during a match.

A complete game can typically be registered in only a few seconds between games.

The user is never required to unlock the phone or interact with the application during rallies.

This design aligns with the habits of recreational tennis players, who usually remember the key events of the previous game but not every individual point.

---

## Consequences

### Positive

- Very fast data entry.
- Minimal interruption during play.
- Low learning curve.
- High usability for amateur players.
- Statistics remain consistent because they are calculated by the domain.
- Simplified user interface.
- Smaller persistence model.
- Easier testing due to deterministic calculations.
- Lower battery usage during matches.

### Negative

- Point-by-point statistics are unavailable.
- Rally analysis is not possible.
- Serve placement analysis is not supported.
- Winners and unforced errors cannot be reconstructed later.
- Professional-level analytics are outside the scope of the application.

These limitations are acceptable because they are consistent with the product goals.

---

## Architectural Impact

This decision directly influenced the architecture of the application.

### Domain

The domain is based on completed games instead of individual points.

The `Match` aggregate stores a chronological collection of `MatchRecord` instances.

Statistics and score progression are always calculated from this history.

### Application

Application use cases register completed games rather than individual points.

Current use cases include:

- `CreateMatch`
- `RegisterGame`
- `RegisterTieBreak`
- `GetMatchSummary`

### Presentation

The user interface adapts automatically according to the current server.

Only the fields required for the current game are presented.

The application never asks the user to register events while a point is being played.

### Infrastructure

Only completed game records are persisted.

The database stores the minimum amount of information required to reconstruct the entire match.

Scores, service order and statistics are never stored redundantly.

---

## Alternatives Considered

### Alternative 1 — Point-by-point registration

#### Advantages

- Maximum statistical detail.
- Professional-level analysis.
- Complete rally reconstruction.

#### Disadvantages

- Excessive interaction during play.
- High cognitive load.
- Poor experience for recreational players.
- Increased probability of abandoned matches.

**Decision:** Rejected.

---

### Alternative 2 — End-of-game registration

#### Advantages

- Very fast workflow.
- Excellent usability.
- Minimal distraction.
- Consistent with recreational tennis.
- Simpler domain model.
- Easier maintenance.

#### Disadvantages

- Reduced statistical granularity.

**Decision:** Accepted.

---

## Future Considerations

Future versions may introduce optional advanced statistics.

However, the end-of-game workflow remains the primary interaction model of the application.

More detailed analysis should be implemented as an optional feature rather than replacing the current experience.

---

## Decision Summary

The application records statistics only after each completed game.

This decision prioritizes usability over statistical granularity and serves as the foundation for the domain model, application architecture and overall user experience.