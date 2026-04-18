# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CulinaryOS (LocalCafe POS) is an offline-first tablet Point-of-Sale system built as a Google AI Studio app. All data persists exclusively in browser `localStorage` — there is no backend database or server-side state.

## Commands

```bash
npm run dev       # Dev server on port 3000 (0.0.0.0)
npm run build     # Production build to dist/
npm run preview   # Preview production build
npm run lint      # TypeScript type-check (tsc --noEmit) — this is the only linter
npm run clean     # Remove dist/
```

No test framework is configured; `npm run lint` is the only automated check.

## Architecture

### State Management

All application state lives in a single custom hook: `src/hooks/usePOSData.ts`. It owns:
- `inventory` (`InventoryItem[]`)
- `menu` (`MenuItem[]`)
- `orders` (`Order[]`)

Every state mutation auto-persists to `localStorage` under keys `pos_inventory`, `pos_menu`, and `pos_orders`. On first load it falls back to hardcoded `INITIAL_INVENTORY` and `INITIAL_MENU` defined inside the hook. Views receive state and setters as props from `App.tsx`, which is the sole consumer of `usePOSData`.

### View Routing

`App.tsx` manages the active tab (`'register' | 'inventory' | 'analytics' | 'settings'`) and conditionally renders the matching view. There is no router library — `Sidebar.tsx` emits tab change events and `App.tsx` switches views.

### Inventory Deduction Flow

When an order is placed in `RegisterView`, the hook's order-processing logic iterates each `CartItem`, looks up its `MenuItem.recipe` (array of `RecipeItem` with `inventoryId` and `amount`), and decrements the corresponding `InventoryItem.stock`. This is the primary business logic coupling between views.

### Styling Conventions

Tailwind CSS 4 via Vite plugin. Custom design tokens are declared in `src/index.css` under `@theme`:
- `bg-deep` → `#0F0F0F` (page background)
- `bg-surface` → `#1A1A1A` (card/panel background)
- `accent` → `#C68642` (primary interactive color — beige/brown)

Always use these semantic tokens instead of raw hex values.

### AI Integration

`GEMINI_API_KEY` is injected at build time via Vite's `define` config (sourced from `.env.local`). In AI Studio deployments the key is injected automatically at runtime. Access it as `process.env.GEMINI_API_KEY` in source.

### Bluetooth Printing

`SettingsView` uses the Web Bluetooth API to pair ESC/POS receipt printers. The printer handle is stored in component state (not in `usePOSData`) and falls back to `window.print()` when Bluetooth is unavailable.

## Key Types (`src/types.ts`)

```
InventoryItem   id, name, stock, unit, threshold
MenuItem        id, name, price, category, color, recipe: RecipeItem[]
RecipeItem      inventoryId, amount
CartItem        menuItem: MenuItem, quantity
Order           id, timestamp, items: CartItem[], total
MenuItemCategory  'Coffee' | 'Tea' | 'Pastries' | 'Food' | 'Other'
```

## Environment

Copy `.env.example` to `.env.local` and set `GEMINI_API_KEY` before running locally. The `APP_URL` variable is only needed for AI Studio cloud deployments.
