# 02 — Game Design

Mechanics, balance constants, cell types, classes, and items. Use this when tuning or adding content.

---

## Constants (single source of truth)

Defined at the top of the main game component. Change here to rebalance.

| Constant | Value | Purpose |
|----------|--------|---------|
| `GRID_SIZE` | `5` | Grid is 5×5 |
| `BASE_RAID_COST` | `100` | Base bet per raid ($) |
| `ARMOR_RECOVERY_STEPS` | `5` | Knight: armor recovers after this many **new** cells revealed |

---

## Prices (equipment cost per raid)

| Item | Constant | Price ($) |
|------|----------|-----------|
| Shield | `PRICES.shield` | 50 |
| Torch | `PRICES.torch` | 30 |
| Sword | `PRICES.sword` | 40 |

**Raid cost** = `BASE_RAID_COST` + sum of selected equipment prices.  
Equipment is chosen once per raid (menu); one of each type max.

---

## Cell types

| Type | Constant | Behaviour |
|------|----------|-----------|
| Empty | `CELL_TYPES.EMPTY` | No effect |
| Wall | `CELL_TYPES.WALL` | Blocks movement |
| Monster | `CELL_TYPES.MONSTER` | Triggers encounter (Sword choice or direct hit) |
| Chest S | `CELL_TYPES.CHEST_S` | Multiplier × class multiplier (see below); cell becomes EMPTY |
| Chest M | `CELL_TYPES.CHEST_M` | Same |
| Chest L | `CELL_TYPES.CHEST_L` | Same |
| Exit | `CELL_TYPES.EXIT` | Opens cashout modal |
| Start | `CELL_TYPES.START` | Only at (0,0); already revealed |

**Map generation:** Weights define spawn chance (see `generateMap`). Exit is forced at (4,4) if none generated.

---

## Class multipliers (chests)

| Class | Chest S | Chest M | Chest L |
|-------|---------|---------|---------|
| Knight | 1.08 | 1.25 | 1.80 |
| Thief | 1.15 | 1.45 | 2.40 |

Multiplier is applied multiplicatively: `multiplier *= MULTIPLIERS[playerClass][cellType]`.

---

## Classes

| Class | Key mechanics |
|-------|----------------|
| **Knight** | Starts with 1 Armor. Armor absorbs one monster hit then is lost; recovers after `ARMOR_RECOVERY_STEPS` **new** cells revealed. |
| **Thief** | No armor. 10% dodge chance vs monster (then +0.5 to multiplier). Higher chest multipliers. |

---

## Monster encounter

1. **With Sword:** Player can choose «АТАКОВАТЬ». 50%: monster killed, multiplier ×2, sword consumed. 50%: sword consumed, monster hits (armor/shield/death).
2. **Without Sword or «ПРИНЯТЬ УДАР»:** Resolution order: Thief 10% dodge → Knight armor → Shield → else death.

After monster defeat (any method): cell becomes EMPTY.

---

## Map generation weights (reference)

Used in `generateMap()` to fill non-start cells:

- Empty: 50
- Wall: 0
- Monster: 20
- Chest S: 12, Chest M: 5, Chest L: 2
- Exit: 2 (and forced at bottom-right if missing)

---

## Where to add new content

- **New cell type:** Add to `CELL_TYPES`, weights in `generateMap`, and handling in `resolveCell` + `CellIcon`. See [04 — Expansion guide](04-expansion-guide.md).
- **New class:** Add to `MULTIPLIERS`, armor/ability logic in `resolveCell` and `handleMonster`. See [04 — Expansion guide](04-expansion-guide.md).
- **New item:** Add to `PRICES`, `inventory`, menu UI, and use logic (e.g. torch). See [04 — Expansion guide](04-expansion-guide.md).
