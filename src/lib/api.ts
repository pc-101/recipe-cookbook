const API = 'https://api.spoonacular.com';

export type RecipeSummary = { id: number; title: string; image?: string; };
export type SearchResult = { results: RecipeSummary[]; totalResults?: number; };
export type Ingredient = { id?: number; original: string; nameOriginal?: string };
export type RecipeDetail = {
  id: number;
  title: string;
  image?: string;
  servings?: number;
  readyInMinutes?: number;
  extendedIngredients?: Ingredient[];
  summary?: string;
};

export type SearchFilters = {
  diet?: string;
  cuisine?: string;
  intolerances?: string[];
  maxReadyTime?: number;
  sort?: 'popularity' | 'healthiness' | 'price' | 'time';
};

const key = import.meta.env.VITE_SPOONACULAR_KEY;

function qs(params: Record<string, string | number | undefined>){
  const p = new URLSearchParams();
  Object.entries(params).forEach(([k,v]) => { if (v !== undefined && v !== null && v !== '') p.append(k, String(v)); });
  return p.toString();
}

export async function searchRecipes(query: string, page = 1, filters: SearchFilters = {}): Promise<SearchResult> {
  if (!key) throw new Error('Missing Spoonacular key. Add VITE_SPOONACULAR_KEY to .env.local');
  const perPage = 24;
  const params = {
    apiKey: key,
    query,
    number: perPage,
    offset: perPage * (page - 1),
    addRecipeInformation: 0,
    diet: filters.diet || undefined,
    cuisine: filters.cuisine || undefined,
    intolerances: filters.intolerances?.length ? filters.intolerances.join(',') : undefined,
    maxReadyTime: filters.maxReadyTime || undefined,
    sort: filters.sort || undefined,
  };
  const url = `${API}/recipes/complexSearch?${qs(params)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('API error');
  return res.json();
}

export async function getRecipeById(id: number): Promise<RecipeDetail> {
  if (!key) throw new Error('Missing Spoonacular key. Add VITE_SPOONACULAR_KEY to .env.local');
  const url = `${API}/recipes/${id}/information?${qs({ apiKey: key, includeNutrition: 0 })}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('API error');
  return res.json();
}
