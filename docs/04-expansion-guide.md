# 04 — Expansion Guide

How to extend the game while keeping a clear structure. Follow the same patterns as the existing code.

---

## 1. Adding a new cell type

**Steps:**

1. **Constant**  
   In the same block as `CELL_TYPES`, add e.g. `NEW_TYPE: 'new_type'`.

2. **Map generation**  
   In `generateMap()`, add an entry to the `types` array with `type` and `weight`, and ensure it’s in `flatPool`. If it must appear exactly once (like Exit), after the loop force it on a chosen cell.

3. **Logic**  
   In `resolveCell(r, c, isNewCell)` add a branch:
   - `else if (cellType === CELL_TYPES.NEW_TYPE) { ... }`  
   Update `multiplier`, `balance`, or other state as needed. Optionally set `newGrid[r][c].type = CELL_TYPES.EMPTY` to “consume” the cell.

4. **Visual**  
   In `CellIcon`, add a case and return an icon or label:
   - `case CELL_TYPES.NEW_TYPE: return <SomeIcon ... />;`

5. **Docs**  
   Update [02 — Game design](02-game-design.md) (cell types table and map weights).

---

## 2. Adding a new class

**Steps:**

1. **Multipliers**  
   In `MULTIPLIERS`, add a key for the new class with chest multipliers, e.g.  
   `newClass: { [CELL_TYPES.CHEST_S]: 1.1, ... }`.

2. **Menu UI**  
   Add a class card (same pattern as Knight/Thief):  
   `playerClass === 'newClass'` for styling, `onClick={() => setPlayerClass('newClass')}`.

3. **Initial state**  
   In `startGame()`, set class-specific state (e.g. armor, special resource) for `playerClass === 'newClass'`.

4. **Abilities**  
   - In `resolveCell`: e.g. special behaviour on certain cells or on “new cell” step.  
   - In `handleMonster`: add a branch for the new class (e.g. different dodge chance or effect).

5. **Types**  
   If you introduce TypeScript later, extend the type of `playerClass` to include `'newClass'`.

6. **Docs**  
   Update [02 — Game design](02-game-design.md) (classes table and multipliers).

---

## 3. Adding a new item (equipment)

**Steps:**

1. **Price**  
   In `PRICES`, add e.g. `newItem: 60`.

2. **Inventory**  
   In `inventory` state, add a key: `newItem: false`.  
   In `startGame()` and in the result «В таверну» reset, include `newItem: false`.

3. **Raid cost**  
   In the `useEffect` that sets `currentRaidCost`, add:  
   `if (inventory.newItem) cost += PRICES.newItem;`

4. **Menu UI**  
   In the equipment grid, add a button with the same pattern as Shield/Torch/Sword:  
   `inventory.newItem`, `onClick` toggling `inventory.newItem`.

5. **Usage**  
   - If it’s used during the raid (like Torch): add a button or automatic trigger in the playing view, and in the handler update state and set `inventory.newItem = false`.  
   - If it’s passive (like Shield): use it in `handleMonster` or `resolveCell` (e.g. check `inventory.newItem` or a “active” copy set in `startGame`).

6. **Docs**  
   Update [02 — Game design](02-game-design.md) (prices and item behaviour).

---

## 4. Refactoring for scalability

To keep the project expandable without one huge file:

1. **Constants**  
   Move `GRID_SIZE`, `BASE_RAID_COST`, `PRICES`, `CELL_TYPES`, `MULTIPLIERS`, etc. to e.g. `src/constants.js` and import. Single place for balance and content.

2. **Hooks**  
   Extract:
   - `useRaidState()` — grid, playerPos, multiplier, armor, logs, etc.  
   - `useRaidActions(grid, playerPos, ...)` — handleMove, resolveCell, handleMonster, useTorch, cashout.  
   Keep `balance`, `gameState`, `playerClass`, `inventory` in `App` or a `useGameSession()` hook.

3. **Components**  
   Split by screen:  
   - `MenuScreen` — class + equipment + start.  
   - `PlayingScreen` — grid + sidebar (stats, torch, sword, log).  
   - `EncounterModal`, `ExitModal`, `ResultScreen`.  
   Keep `CellIcon` (or move to `components/CellIcon.jsx`).

4. **State location**  
   - Session state (balance, gameState, playerClass, inventory) can stay in `App` or a context.  
   - Raid state (grid, playerPos, multiplier, armor, logs, modals) can live in a hook or context used by `PlayingScreen` and modals.

5. **Docs**  
   After refactor, update [03 — Architecture](03-architecture.md) with new files and state location.

---

## 5. Checklist for any new feature

- [ ] Constants/types updated in one place.
- [ ] State initialised and reset (menu → playing → result → menu).
- [ ] UI for selection/use (menu and/or playing).
- [ ] Logic in `resolveCell`, `handleMonster`, or dedicated handler.
- [ ] `CellIcon` or other visuals if needed.
- [ ] [02 — Game design](02-game-design.md) and [03 — Architecture](03-architecture.md) updated.

---

## Where to read next

- **Mechanics/balance:** [02 — Game design](02-game-design.md)
- **Current code layout:** [03 — Architecture](03-architecture.md)
