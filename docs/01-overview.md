# 01 — Game Overview

High-level description of the game, flow, and glossary.

---

## What the game is

A **dungeon raid** web game for Telegram. The player:

1. Chooses a **class** (Knight or Thief) and **equipment** (Shield, Torch, Sword).
2. Pays a **raid cost** (balance) and enters a **5×5 grid**.
3. Moves cell-by-cell; cells can be empty, chests, monsters, or exit.
4. Collects **chests** (multiplier), fights or avoids **monsters**, and reaches the **exit** to cash out.
5. Wins **balance = base raid cost × multiplier** or **dies** and loses the raid.

---

## Screens (game states)

| State | Description |
|-------|-------------|
| `menu` | Class selection, equipment selection, «Начать рейд» starts raid |
| `playing` | Grid view, movement, multiplier, armor/shield, torch/sword, log |
| `encounter` | Modal: monster — use Sword (50% ×2) or take hit with shield/armor |
| `result` | Victory (cashout amount) or death; «В таверну» returns to menu |

---

## Flow diagram

```
┌─────────┐     Начать рейд     ┌─────────┐     move / use     ┌─────────────┐
│  MENU   │ ──────────────────► │ PLAYING │ ◄────────────────► │ ENCOUNTER   │
└─────────┘   (pay raid cost)   └────┬────┘   (monster / exit)  │ (modal)     │
       ▲                             │                         └──────┬──────┘
       │                             │ cashout / die                  │
       │                             ▼                                │
       │                      ┌─────────────┐                         │
       └───────────────────── │   RESULT    │ ◄──────────────────────┘
              В таверну       └─────────────┘
```

---

## Glossary

| Term | Meaning |
|------|---------|
| **Raid** | One run through the grid from Start to Exit (or death). |
| **Raid cost** | Amount deducted from balance when starting (base + equipment). |
| **Multiplier** | Applied to base raid cost at cashout; increased by chests and (sometimes) monster win. |
| **Armor** | Knight-only; absorbs one monster hit, then recovers after 5 new cells. |
| **Shield** | One-time absorb (item); consumed on use. |
| **Torch** | One-time reveal of 3×3 around player (item). |
| **Sword** | On monster: 50% chance ×2 multiplier and kill; else sword lost and monster hits. |
| **Cashout** | Leaving via Exit; balance += base raid cost × multiplier. |

---

## Where to go next

- **Mechanics and numbers:** [02 — Game design](02-game-design.md)
- **Code and state:** [03 — Architecture](03-architecture.md)
- **Adding content:** [04 — Expansion guide](04-expansion-guide.md)
