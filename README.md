# Recipe Cookbook

A Vite + React project for discovering recipes, saving favorites to a cookbook, and auto-building a shopping list from ingredients. It includes infinite scrolling search powered by Spoonacular, a shared theme toggle, and local persistence so you can pick up where you left off.

## Features

- Search the Spoonacular catalog with debounced queries, filters, infinite scrolling pagination, and a one-click filter reset.
- Save recipes to a persistent cookbook and open a detailed lightbox with ingredients and summary.
- Add all ingredients from a recipe to an auto-grouped shopping list with one click.
- Light/dark mode toggle that remembers your preference and respects system settings.
- Client-side persistence backed by `localStorage` via a Zustand store.
- Responsive Tailwind UI with skeleton loading states for a polished feel.

## Prerequisites

- Node.js 18+ (aligns with the Vite React template requirements).
- `pnpm` package manager (`npm` or `yarn` work as well—adjust commands accordingly).
- A Spoonacular API key for authenticated recipe search.

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Copy the environment file and add your Spoonacular key:
   ```bash
   cp .env.example .env
   # edit .env and set VITE_SPOONACULAR_KEY=your_key_here
   ```
3. Run the development server:
   ```bash
   pnpm dev
   ```
4. Open `http://localhost:5173` and start exploring recipes. Scroll to trigger infinite loading, save favorites, and test the shopping list workflow.
   - Use the **Reset filters** button beside the filters to jump back to the default search at any time.

## Available Scripts

- `pnpm dev` – start the Vite dev server with hot-module replacement.
- `pnpm build` – run TypeScript checks and create an optimized production build.
- `pnpm preview` – serve the production build locally for verification.

## Project Structure

```
src/
  App.tsx                 # Recipe search landing page with filters and infinite scroll
  main.tsx                # App bootstrap wrapped with ThemeProvider and router
  index.css               # Tailwind layer setup plus global utilities
  components/
    FilterBar.tsx         # Search filters (diet, cuisine, etc.)
    PageLayout.tsx        # Shared layout with header, nav, and theme toggle
    RecipeCard.tsx        # Compact recipe preview used in grids
    RecipeModal.tsx       # Lightbox with detailed recipe info and shopping action
    ThemeProvider.tsx     # Context that manages light/dark preference + persistence
    ThemeToggle.tsx       # Button for switching modes
  routes/
    Cookbook.tsx          # Saved recipes grid backed by local storage
    ShoppingList.tsx      # Grouped shopping list view with clear action
  state/
    cookbookStore.ts      # Zustand store for cookbook and shopping list data
  lib/
    api.ts                # Spoonacular API helpers and shared types
```

## Environment Variables

| Name                  | Required | Description                                   |
|-----------------------|----------|-----------------------------------------------|
| `VITE_SPOONACULAR_KEY`| Yes      | Spoonacular API key for all recipe requests.  |

Values prefixed with `VITE_` are exposed to the browser by Vite, so protect your Spoonacular quota accordingly.

## Notes

- Cookbook favorites and shopping list items persist under `cookbook:v1` and `shopping-list:v1` keys in `localStorage`. Clear them via DevTools to reset.
- The recipe modal uses Spoonacular’s HTML summary—sanitization is not applied, so only use keys from trusted sources.
- Adjust Tailwind design tokens in `tailwind.config.js` to match your brand or integrate with other starters in the suite.
- When the recipe modal is open, page scrolling is automatically locked. Close the modal or press `Esc` to release it.
