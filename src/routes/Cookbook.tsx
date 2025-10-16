import { Link } from 'react-router-dom';
import { useCookbook } from '@/state/cookbookStore';
import RecipeCard from '@/components/RecipeCard';
import RecipeModal from '@/components/RecipeModal';
import { useState } from 'react';
import { getRecipeById } from '@/lib/api';

export default function Cookbook(){
  const { saved } = useCookbook();
  const [activeId, setActiveId] = useState<number|null>(null);

  return (
    <div>
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <div className="container mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <div className="font-semibold">📚 Cookbook</div>
          <nav className="flex items-center gap-2 text-sm">
            <Link className="btn" to="/">Search</Link>
            <Link className="btn" to="/shopping-list">Shopping List</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl space-y-6 px-4 py-6">
        {saved.length === 0 ? (
          <div className="text-sm text-slate-500">Your cookbook is empty. Go add some favorites!</div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {saved.map(r => <RecipeCard key={r.id} recipe={r} onOpen={() => setActiveId(r.id)} />)}
          </div>
        )}
        {activeId && <RecipeModal id={activeId} onClose={() => setActiveId(null)} fetcher={getRecipeById} />}
      </main>
    </div>
  );
}
