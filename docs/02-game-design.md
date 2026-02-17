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
| `MAX_HP` | `3` | Player HP at raid start; 0 = death |
| `MONSTER_DAMAGE` | `1` | HP lost when monster hits (no armor/shield) |
| `BOSS_DAMAGE` | `2` | HP lost when boss hits (no armor/shield) |
| `LEVEL_BONUS_PER_FLOOR` | `0.1` | Each dungeon level adds +10% to chest multipliers (level 2 = ×1.1, level 3 = ×1.2, …) |

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
| Monster | `CELL_TYPES.MONSTER` | Encounter; hit = −1 HP (or armor/shield/sword). 0 HP = death. |
| Boss | `CELL_TYPES.BOSS` | Same as monster; hit = −2 HP. One per map if none spawned. |
| Chest S | `CELL_TYPES.CHEST_S` | Opens chest modal; can upgrade to M/L by chance; after «Собрать» multiplier applied, cell stays but icon dimmed (`collected: true`) |
| Chest M | `CELL_TYPES.CHEST_M` | Same; can upgrade to L by chance |
| Chest L | `CELL_TYPES.CHEST_L` | Same; no upgrade |
| Exit | `CELL_TYPES.EXIT` | Opens cashout modal |
| Start | `CELL_TYPES.START` | Only at (0,0); already revealed |

**Map generation:** Weights define spawn chance (see `generateMap`). Exit is forced at (4,4) if none generated.

---

## Class multipliers (chests)

| Class | Chest S | Chest M | Chest L |
|-------|---------|---------|---------|
| Knight | 1.08 | 1.25 | 1.80 |
| Thief | 1.15 | 1.45 | 2.40 |
| Mage | 1.10 | 1.35 | 2.00 |

Multiplier is applied multiplicatively: `multiplier *= MULTIPLIERS[playerClass][cellType]`.

---

## Chest upgrade (Vampire Survivors style)

When the player steps on a chest, a modal opens. The chest can **upgrade** to a higher rarity (two rolls: at 1.2s and 2.4s):

| From | To M | To L |
|------|-----|-----|
| S    | 15% | 5%  |
| M    | —   | 20% |
| L    | —   | —   |

After the animation, the player taps **«Собрать»**; the (possibly upgraded) chest’s multiplier is applied. The cell keeps its type but is marked `collected: true`; the icon on the map is dimmed (opacity + grayscale), not removed. Chest gain is scaled by **dungeon level**: `gain = MULTIPLIERS[class][chest] × (1 + (level − 1) × LEVEL_BONUS_PER_FLOOR)`.

**Уровни подземелья:** на выходе игрок может **«Забрать куш»** (забрать деньги и в таверну), **«Следующий уровень»** (новая карта, сбрасывается только позиция; HP, броня, щит и множитель сохраняются; сундуки выше) или **«Пока остаться на этом уровне»** — закрыть модалку и продолжить исследование этажа.

---

## Classes

| Class | Key mechanics |
|-------|----------------|
| **Knight** | Starts with 1 Armor. Armor absorbs one monster hit then is lost; recovers after `ARMOR_RECOVERY_STEPS` **new** cells revealed. |
| **Thief** | No armor. 10% dodge chance vs monster (then +0.5 to multiplier). Higher chest multipliers. |
| **Mage** | No armor. **Провидение**: once per raid, choose a direction; cells in that line are revealed one by one until (and including) the first non-empty cell (wall, monster, chest, exit), then stop. |

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
