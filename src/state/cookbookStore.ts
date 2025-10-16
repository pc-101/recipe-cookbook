import { create } from 'zustand';
import type { RecipeDetail, RecipeSummary } from '@/lib/api';
import { normalizeIngredient } from '@/lib/ingredients';

type ShoppingMap = Record<string, string[]>; // category -> items

type Store = {
  saved: RecipeSummary[];
  shoppingList: ShoppingMap;
  isSaved: (id: number) => boolean;
  toggleSave: (recipe: RecipeSummary) => void;
  addToShoppingFromRecipe: (recipe: RecipeDetail) => void;
  clearShopping: () => void;
};

const KEY = 'recipe-cookbook:v1';

const persisted = (() => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
})();

export const useCookbook = create<Store>((set, get) => ({
  saved: persisted?.saved ?? [],
  shoppingList: persisted?.shoppingList ?? {},
  isSaved: (id) => get().saved.some(r => r.id === id),
  toggleSave: (recipe) => set((s) => {
    const exists = s.saved.some(r => r.id === recipe.id);
    const next = exists ? s.saved.filter(r => r.id !== recipe.id) : [recipe, ...s.saved];
    const state = { ...s, saved: next };
    if (typeof window !== 'undefined') localStorage.setItem(KEY, JSON.stringify(state));
    return state;
  }),
  addToShoppingFromRecipe: (recipe) => set((s) => {
    const map: ShoppingMap = { ...s.shoppingList };
    const cat = 'Groceries';
    (recipe.extendedIngredients || []).forEach((ing) => {
      const normalized = normalizeIngredient(ing.original);
      if (!normalized) return;
      if (!map[cat]) map[cat] = [];
      if (!map[cat].includes(normalized)) map[cat].push(normalized);
    });
    const state = { ...s, shoppingList: map };
    if (typeof window !== 'undefined') localStorage.setItem(KEY, JSON.stringify(state));
    return state;
  }),
  clearShopping: () => set((s) => {
    const state = { ...s, shoppingList: {} };
    if (typeof window !== 'undefined') localStorage.setItem(KEY, JSON.stringify(state));
    return state;
  }),
}));
