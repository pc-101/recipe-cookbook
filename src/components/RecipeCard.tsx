import { useCookbook } from '@/state/cookbookStore';
import type { RecipeSummary } from '@/lib/api';

export default function RecipeCard({ recipe, onOpen }: { recipe: RecipeSummary; onOpen: () => void }){
  const { isSaved, toggleSave } = useCookbook();
  const saved = isSaved(recipe.id);

  return (
    <div className="card group cursor-pointer p-0 overflow-hidden" onClick={onOpen}>
      {recipe.image && <img src={recipe.image} alt={recipe.title} className="aspect-square w-full object-cover" loading="lazy" />}
      <div className="p-3">
        <div className="line-clamp-2 text-sm font-medium">{recipe.title}</div>
        <div className="mt-2 flex items-center justify-between">
          <button className="btn" onClick={(e)=>{e.stopPropagation(); onOpen();}}>View</button>
          <button className={`btn ${saved ? 'bg-emerald-500 text-white border-emerald-600' : ''}`} onClick={(e)=>{e.stopPropagation(); toggleSave(recipe);}}>
            {saved ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
