# Setup Guide

## Prerequisites Installation

To work on this Telegram web game project, you need to install Node.js first.

### Step 1: Install Node.js

1. **Download Node.js:**
   - Visit: https://nodejs.org/
   - Download the **LTS (Long Term Support)** version (recommended)
   - Choose the Windows Installer (.msi) for your system (64-bit recommended)

2. **Install Node.js:**
   - Run the downloaded installer
   - Follow the installation wizard (use default settings)
   - Make sure to check "Add to PATH" option during installation

3. **Verify Installation:**
   - Open a **new** PowerShell or Command Prompt window
   - Run these commands to verify:
     ```powershell
     node --version
     npm --version
     ```
   - You should see version numbers (e.g., v20.x.x and 10.x.x)

### Step 2: Install Project Dependencies

Once Node.js is installed, open PowerShell in this project directory and run:

```powershell
npm install
```

This will install all required packages:
- React 18
- Vite (build tool)
- Telegram Web App SDK
- ESLint (code linting)

### Step 3: Start Development Server

After installation completes, start the development server:

```powershell
npm run dev
```

The game will be available at: `http://localhost:3000`

### Step 4: Build for Production

When ready to deploy:

```powershell
npm run build
```

The built files will be in the `dist` folder.

## Troubleshooting

### If npm commands don't work after installing Node.js:

1. **Close and reopen** your terminal/PowerShell window
2. Restart your computer if needed (to refresh PATH environment variable)
3. Verify Node.js is in PATH:
   ```powershell
   $env:Path -split ';' | Select-String node
   ```

### Alternative: Use nvm-windows (Node Version Manager)

If you want to manage multiple Node.js versions:

1. Download nvm-windows from: https://github.com/coreybutler/nvm-windows/releases
2. Install nvm-windows
3. Install Node.js through nvm:
   ```powershell
   nvm install lts
   nvm use lts
   ```

## Next Steps

After setup is complete:
1. Edit `src/App.jsx` to build your game
2. Customize styles in `src/App.css`
3. Test locally at `http://localhost:3000`
4. Deploy to a hosting service (Vercel, Netlify, etc.)
5. Connect to Telegram bot via @BotFather

## Project Structure

```
WebGamePrototype/
├── src/
│   ├── App.jsx          # Main game component
│   ├── App.css          # Game styles
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── index.html           # HTML template
├── vite.config.js       # Build configuration
└── package.json         # Dependencies
```
