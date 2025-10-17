import { useCookbook } from '@/state/cookbookStore';
import RecipeCard from '@/components/RecipeCard';
import RecipeModal from '@/components/RecipeModal';
import { useState } from 'react';
import { getRecipeById } from '@/lib/api';
import PageLayout from '@/components/PageLayout';

export default function Cookbook(){
  const { saved } = useCookbook();
  const [activeId, setActiveId] = useState<number|null>(null);

  return (
    <PageLayout
      title="📚 Cookbook"
      links={[
        { to: '/', label: 'Home' },
        { to: '/shopping-list', label: 'Shopping List' },
      ]}
    >
      {saved.length === 0 ? (
        <div className="text-sm text-slate-500">Your cookbook is empty. Go add some favorites!</div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {saved.map(r => <RecipeCard key={r.id} recipe={r} onOpen={() => setActiveId(r.id)} />)}
        </div>
      )}
      {activeId && <RecipeModal id={activeId} onClose={() => setActiveId(null)} fetcher={getRecipeById} />}
    </PageLayout>
  );
}
