import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { searchRecipes, getRecipeById, type SearchResult, type RecipeSummary, type SearchFilters } from '@/lib/api';
import { useDebounce } from '@/hooks/useDebounce';
import RecipeCard from '@/components/RecipeCard';
import RecipeModal from '@/components/RecipeModal';
import FilterBar from '@/components/FilterBar';

const FILTERS_KEY = 'recipe-filters:v1';

export default function App() {
  const [query, setQuery] = useState('');
  const debounced = useDebounce(query, 400);
  const [results, setResults] = useState<RecipeSummary[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [filters, setFilters] = useState<SearchFilters>(() => {
    try { return JSON.parse(localStorage.getItem(FILTERS_KEY) || '{}'); } catch { return {}; }
  });

  useEffect(() => {
    localStorage.setItem(FILTERS_KEY, JSON.stringify(filters));
  }, [filters]);

  const load = async (q: string, p: number, append = false) => {
    setLoading(true);
    setError(null);
    try {
      const res: SearchResult = await searchRecipes(q, p, filters);
      setTotal(res.totalResults || 0);
      setResults((cur) => append ? [...cur, ...res.results] : res.results);
    } catch (e: any) {
      setError(e?.message || 'Failed to fetch recipes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debounced.trim()) {
      setPage(1);
      load(debounced.trim(), 1, false);
    } else {
      setResults([]);
      setTotal(0);
    }
  }, [debounced, filters]);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const obs = new IntersectionObserver((entries) => {
      const [e] = entries;
      if (e.isIntersecting && results.length < total && !loading) {
        const next = page + 1;
        setPage(next);
        load(debounced, next, true);
      }
    }, { rootMargin: '100px' });
    obs.observe(node);
    return () => obs.disconnect();
  }, [results, total, loading, page, debounced, filters]);

  return (
    <div>
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <div className="container mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <div className="font-semibold">🍳 Recipe Finder</div>
          <nav className="flex items-center gap-2 text-sm">
            <Link className="btn" to="/cookbook">Cookbook</Link>
            <Link className="btn" to="/shopping-list">Shopping List</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-4 py-6">
        <div className="flex flex-col gap-3">
          <input
            className="input"
            placeholder="Search recipes (e.g., chicken pasta, vegan curry)…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <FilterBar value={filters} onChange={setFilters} />
        </div>

        {error && <div className="rounded-md border border-rose-300 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-900/30 dark:text-rose-300">{error}</div>}

        {!loading && results.length === 0 && debounced && (
          <div className="text-sm text-slate-500">No recipes. Try a different query or filters.</div>
        )}

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {loading && results.length === 0
            ? Array.from({ length: 8 }).map((_, i) => <div key={i} className="card p-0"><div className="skeleton aspect-square w-full" /><div className="p-3 space-y-2"><div className="skeleton h-4 w-3/4" /><div className="skeleton h-4 w-1/2" /></div></div>)
            : results.map((r) => (<RecipeCard key={r.id} recipe={r} onOpen={() => setActiveId(r.id)} />))
          }
        </div>

        {loading && results.length > 0 && <div className="text-sm text-slate-500">Loading more…</div>}
        <div ref={sentinelRef} />

        {activeId && (
          <RecipeModal id={activeId} onClose={() => setActiveId(null)} fetcher={getRecipeById} />
        )}
      </main>
    </div>
  );
}
