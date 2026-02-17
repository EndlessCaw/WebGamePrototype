# Telegram Dungeon Raid — Web Game

A **dungeon raid** web game for Telegram: choose class and equipment, enter a 5×5 grid, collect chests, fight monsters, and reach the exit to cash out. Built with React, Vite, Tailwind CSS, and the Telegram Web App SDK.

---

## Game at a glance

- **Menu:** Pick **Knight** or **Thief**, buy **Shield / Torch / Sword**, pay raid cost, start raid.
- **Raid:** Move on a 5×5 grid. Cells can be empty, chests (multiplier), monsters, or exit. Use armor, shield, torch, and sword during the run.
- **Result:** Cash out at the exit (balance = base cost × multiplier) or die to a monster and lose the raid.

Full mechanics, balance, and expansion notes are in the **docs** (see below).

---

## Quick start

**Prerequisites:** Node.js 18+

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Build for production: `npm run build` → output in `dist/`.

---

## Documentation (hierarchy)

All game documentation lives under **`docs/`** so the project stays easy to expand.

| Document | Purpose |
|----------|---------|
| **[docs/INDEX.md](docs/INDEX.md)** | **Start here** — index and short reference |
| [docs/01-overview.md](docs/01-overview.md) | Game flow, screens, glossary |
| [docs/02-game-design.md](docs/02-game-design.md) | Mechanics, balance, constants, cell types, classes |
| [docs/03-architecture.md](docs/03-architecture.md) | State, components, data flow |
| [docs/04-expansion-guide.md](docs/04-expansion-guide.md) | How to add cells, classes, items, refactor |

Use **INDEX.md** to navigate; use the expansion guide when adding new content or splitting the codebase.

---

## Project structure

```
WebGamePrototype/
├── docs/                    # Game documentation (hierarchy)
│   ├── INDEX.md             # Doc index & quick reference
│   ├── 01-overview.md       # Flow, screens, glossary
│   ├── 02-game-design.md    # Mechanics, balance, content
│   ├── 03-architecture.md   # State, components
│   └── 04-expansion-guide.md# How to extend
├── src/
│   ├── App.jsx              # Game logic + UI (prototype)
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── public/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## Tech stack

- **React 18** — UI and state
- **Vite** — Dev server and build
- **Tailwind CSS** — Styling
- **lucide-react** — Icons
- **@twa-dev/sdk** — Telegram Web App (optional; for theme, expand, etc.)

---

## Testing in Telegram

1. Create a bot with [@BotFather](https://t.me/BotFather).
2. Create a Web App and set its URL to your **deployed** game (e.g. `https://your-app.vercel.app`). The URL must be **HTTPS** and **publicly accessible**.
3. For local testing, expose `localhost` with [ngrok](https://ngrok.com/) and use the ngrok HTTPS URL in BotFather (update it when ngrok URL changes).

### Почему не открывается ссылка на игру

- **В BotFather указан localhost** — Telegram не может открыть `http://localhost:3000`. Нужен публичный HTTPS-адрес (деплой или ngrok).
- **Игра не задеплоена** — залейте сборку (`npm run build` → папка `dist/`) на Vercel, Netlify или другой хостинг и укажите этот URL в настройках Web App.
- **Неправильный или устаревший URL** — проверьте в @BotFather → ваш бот → Bot Settings → Menu Button / Web App, что URL без опечаток и ведёт на актуальный адрес (если использовали ngrok, URL мог смениться).
- **Деплой в подпапку** — если игра открывается по адресу вида `https://site.com/game/`, в `vite.config.js` задайте `base: '/game/'` и пересоберите проект.

---

## License

MIT
