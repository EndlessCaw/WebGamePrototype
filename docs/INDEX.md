# Game Documentation — Index

Documentation for the Telegram dungeon-raid web game. Use this index to navigate and extend the project.

---

## Hierarchy overview

```
docs/
├── INDEX.md              ← You are here (map of all docs)
├── 01-overview.md        Game summary, flow, glossary
├── 02-game-design.md     Mechanics, balance, constants, content
├── 03-architecture.md    Code structure, state, components
├── 04-expansion-guide.md How to add features and content
├── 05-telegram-как-открыть.md Как выложить и открыть в Telegram на телефоне
└── GitHub-Pages-инструкция.md Залить на GitHub Pages пошагово
```

---

## Documents

| Document | Purpose | When to read |
|----------|---------|--------------|
| [01 — Overview](01-overview.md) | High-level game flow, screens, glossary | Onboarding, quick reference |
| [02 — Game design](02-game-design.md) | Mechanics, balance, cell types, classes, items | Tuning balance, adding content |
| [03 — Architecture](03-architecture.md) | State, components, data flow, file layout | Refactoring, debugging |
| [04 — Expansion guide](04-expansion-guide.md) | How to add classes, cells, items, UI | Extending the game |
| [05 — Telegram: как открыть](05-telegram-как-открыть.md) | Выложить в интернет, бот, открыть на телефоне | Публикация в Telegram |
| [GitHub Pages — инструкция](GitHub-Pages-инструкция.md) | Залить игру на GitHub Pages пошагово | Деплой на GitHub Pages |

---

## Quick reference

- **Game flow:** Menu → Raid (grid) → Encounter/Exit modals → Result → Menu
- **Constants:** `GRID_SIZE`, `BASE_RAID_COST`, `PRICES`, `CELL_TYPES`, `MULTIPLIERS` — see [02-game-design.md](02-game-design.md)
- **State:** `gameState`, `balance`, `inventory`, `grid`, `playerPos`, etc. — see [03-architecture.md](03-architecture.md)

---

## Conventions

- **RU** — In-game text is in Russian (e.g. «Поход начался», «Рыцарь», «Вор»).
- **$** — Currency symbol used in UI for balance and prices.
- Docs use **English** for code, file names, and technical terms.
