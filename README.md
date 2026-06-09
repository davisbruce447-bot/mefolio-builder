# 🎛️ Mefolio Builder

An interactive, high-fidelity developer profile builder and portfolio simulator inspired by Aylfolio. Designed with a dark slate cybernetic aesthetic, it features real-time interactive panels, customizable layouts, a mouse-responsive background, and a dedicated active diagnostic terminal emulator.

---

## ✨ Features

- **Constellation Grid Canvas**: Active mouse-responsive nodes rendering real-time geometric web connections over an eye-safe `#050505` dark background.
- **Dynamic Config Sandbox**: Edit your profile parameters (Name, Role, Location, Bio, Social Handles, and Projects) live and watch the preview update instantly.
- **Shell Terminal Simulator**: Run custom code sandboxed terminal commands directly on the client to explore structural stats:
  - `neofetch` - Custom ASCII Art system specification card.
  - `help` - Lists active supported shell commands.
  - `about` - Prints bio profiles and parameter lists.
  - `skills` - Lists loaded frameworks and library stacks.
  - `projects` - Prints interactive portfolio item cards dynamically.
  - `clear` - Flushes active stream history traces.
- **Preconfigured Theme Accents**: Cycle between stunning colors including Cyber Indigo, Deep Purple, Emerald Mint, Sunset Rose, and Crimson Amber.
- **Mobile-Responsive UI**: Desktop-first dual-pane layout that scales down gracefully into single-column responsive bento cards.

---

## 🛠️ System Stack

- **Frontend Core**: [React 18+](https://react.dev/) + [Vite](https://vite.dev/)
- **Programming Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling Architecture**: [Tailwind CSS](https://tailwindcss.com/)
- **Motion & Transitions**: [Motion (React)](https://motion.dev/)
- **Iconographies**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine (v18+ recommended).

### Installation

1. Clone or download this project workspace.
2. Install standard dependencies:
   ```bash
   npm install
   ```

### Development Startup

Run the development server locally:
```bash
npm run dev
```
The application will boot and be accessible at `http://localhost:3000`.

### Production Build

Compile the application for optimized production static file delivery:
```bash
npm run build
```
Web outputs are created inside the `/dist` directory.

---

## 📂 Project Structure

- `src/components/PortfolioView.tsx` — The portfolio preview frame containing active themes, projects, bento-grid, and active interactive shell terminal.
- `src/App.tsx` — The interactive configuration center housing profile text inputs, state synchronization, and split-desktop controls.
- `metadata.json` — System capability flags and permissions configurations.
