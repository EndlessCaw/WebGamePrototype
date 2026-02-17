# 03 — Architecture

Code structure, state, and data flow. Use this when refactoring or debugging.

---

## File layout (current)

```
src/
├── main.jsx         # React root, no game logic
├── App.jsx          # Single component: all game state + UI
├── App.css           # (optional; prototype may use Tailwind)
└── index.css         # Global styles
```

The prototype keeps **all game logic and UI in `App.jsx`**. For expansion, see [04 — Expansion guide](04-expansion-guide.md) (splitting constants, hooks, components).

---

## State (useState)

Grouped by responsibility:

| State | Type | Used in | Purpose |
|-------|------|---------|---------|
| **Session / meta** | | | |
| `balance` | number | menu, result | Player currency ($) |
| `gameState` | `'menu' \| 'playing' \| 'encounter' \| 'result'` | everywhere | Current screen/flow |
| `playerClass` | `'knight' \| 'thief' \| 'mage'` | menu, playing, encounter | Class abilities and multipliers |
| `inventory` | `{ shield, torch, sword: boolean }` | menu, playing, encounter | Equipment for this raid |
| **Raid (grid)** | | | |
| `grid` | `Cell[][]` | playing, resolveCell, handleMonster | 5×5 grid; each cell `{ type, revealed, collected? }` |
| `playerPos` | `{ r, c }` | playing, handleMove, handleMonster | Current cell |
| `hp` | number | playing | Current HP (0 = death); reset to MAX_HP at startGame |
| `encounterIsBoss` | boolean | playing | Current encounter is boss (2 HP damage) |
| `dungeonLevel` | number | playing | Current dungeon floor (1, 2, …); chest multipliers scale with it |
| `multiplier` | number | playing, result, cashout | Win = BASE_RAID_COST * multiplier |
| `armor` | 0 \| 1 | playing | Knight only; 1 = one hit absorb |
| `armorCooldown` | number | playing | Knight: steps toward ARMOR_RECOVERY_STEPS |
| `shieldActive` | boolean | playing, encounter | Shield not yet used this raid |
| `logs` | string[] | playing | Last N log lines |
| **Modals** | | | |
| `showExitModal` | boolean | playing | Cashout modal visible |
| `showEncounterModal` | boolean | playing | Monster (Sword choice) modal visible |
| `showChestModal` | boolean | playing | Chest modal visible |
| `pendingChest` | `{ r, c, baseType } \| null` | playing | Cell and type of chest being opened |
| `chestDisplayType` | string \| null | playing | Current chest type for modal |
| `mageScryUsed` | boolean | playing | Mage: Providenie used this raid |
| `showScryDirectionModal` | boolean | playing | Mage: direction picker for Providenie |
| `isDead` | boolean | result | Show death vs victory |
| **Derived** | | | |
| `currentRaidCost` | number | menu | BASE_RAID_COST + equipment; from useEffect |

---

## Key functions (in App)

| Function | Triggers | Effect |
|----------|----------|--------|
| `generateMap()` | startGame | New 5×5 grid, Start at (0,0), Exit guaranteed |
| `startGame()` | Menu «Начать рейд» | Deduct cost, init grid/position/multiplier/armor/logs, set playing |
| `handleMove(r, c)` | Click adjacent cell | Validates move, reveals cell, updates playerPos, calls resolveCell |
| `resolveCell(r, c, isNewCell)` | After move | Armor cooldown (Knight), chest → showChestModal (pendingChest), monster → encounter or handleMonster(false), exit → showExitModal |
| `rollChestUpgrade(baseType)` | Chest modal | Returns chest type after one upgrade roll (S→M/L, M→L). |
| `handleChestCollect()` | Chest modal auto-close | Closes chest modal (multiplier already applied on step). |
| `useMageScry(dr, dc)` | Mage Providenie direction | Reveals chain of empty cells in direction (dr, dc) until non-empty; sets mageScryUsed. |
| `handleMonster(attemptSword)` | Encounter modal | Sword/defense path; on hit applies MONSTER_DAMAGE or BOSS_DAMAGE to hp; clears cell; if hp ≤ 0 sets isDead + result |
| `useTorch()` | Torch button | Reveal 3×3, consume torch |
| `cashout()` | Exit modal «Забрать куш» | balance += BASE_RAID_COST * multiplier, set result |
| `goNextLevel()` | Exit modal «Следующий уровень» | dungeonLevel++, new map, reset pos only; HP, armor, shield, multiplier and inventory persist |
| (close only) | Exit modal «Пока остаться на этом уровне» | setShowExitModal(false); player keeps exploring same level |
| `addLog(msg)` | Various | Prepend message, keep last 5 |

---

## Data flow (simplified)

```
Menu:  playerClass, inventory → currentRaidCost
       startGame → balance -= cost, grid, playerPos, multiplier, armor, logs, gameState = 'playing'

Playing: grid, playerPos → handleMove → resolveCell
         resolveCell → chest (multiplier, clear cell) | monster (modal) | exit (modal)
         useTorch → grid (reveal 3×3), inventory.torch = false
         Encounter modal → handleMonster(true|false) → grid (clear monster), armor/shield/death/result
         Exit modal → cashout → balance += win, gameState = 'result'

Result: «В таверну» → gameState = 'menu', reset inventory, multiplier
```

---

## UI structure (JSX)

- **Always:** Balance bar (and multiplier when playing).
- **menu:** Class cards, equipment grid, «Начать рейд».
- **playing:** Grid (map), stats (armor/shield), Torch/Sword buttons, log.
- **Modals:** `showEncounterModal` (monster + Sword choice), `showExitModal` (cashout / continue).
- **result:** Victory or death message, win/loss amount, «В таверну».

`CellIcon` is a small presentational component mapping `CELL_TYPES` to icons; it accepts `collected` and dims the icon (opacity + grayscale) when true. `ChestModal` shows the chest with upgrade animation (two rolls at 1.2s and 2.4s) and a «Собрать» button.

---

## Dependencies

- **React** — UI and state.
- **lucide-react** — Icons (Shield, Flame, Sword, User, Ghost, Trophy, Map, etc.).
- **@twa-dev/sdk** — Optional; for Telegram Web App (expand, theme, etc.). Game logic does not depend on it.

---

## Where to go next

- **Adding content / refactoring:** [04 — Expansion guide](04-expansion-guide.md)
- **Mechanics and numbers:** [02 — Game design](02-game-design.md)
