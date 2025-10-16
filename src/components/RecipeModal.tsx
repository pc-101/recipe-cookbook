import { useEffect, useState } from 'react';
import { useCookbook } from '@/state/cookbookStore';
import type { RecipeDetail } from '@/lib/api';

export default function RecipeModal({ id, onClose, fetcher }: { id: number; onClose: () => void; fetcher: (id:number)=>Promise<RecipeDetail>; }) {
  const [data, setData] = useState<RecipeDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addToShoppingFromRecipe } = useCookbook();

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    fetcher(id).then((d) => alive && setData(d)).catch((e) => alive && setError(e?.message || 'Failed to load recipe')).finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [id]);

  if (!data && loading) return <Overlay><div className="card">Loading…</div></Overlay>;
  if (error) return <Overlay><div className="card">{error}</div></Overlay>;
  if (!data) return null;

  return (
    <Overlay onClose={onClose}>
      <div className="card max-w-3xl p-0 overflow-hidden">
        {data.image && <img src={data.image} alt={data.title} className="aspect-[3/2] w-full object-cover" />}
        <div className="p-4 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-lg font-semibold">{data.title}</h2>
            <button className="btn" onClick={onClose}>Close</button>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            {data.readyInMinutes && <span className="badge badge-sky">⏱ {data.readyInMinutes}m</span>}
            {data.servings && <span className="badge badge-green">🍽 Serves {data.servings}</span>}
          </div>

          {data.extendedIngredients && (
            <div>
              <div className="mb-1 text-sm font-medium">Ingredients</div>
              <ul className="list-disc pl-5 text-sm">
                {data.extendedIngredients.map((i) => (
                  <li key={i.id || i.nameOriginal}>{i.original}</li>
                ))}
              </ul>
              <button className="btn mt-3" onClick={()=>addToShoppingFromRecipe(data)}>Add all to Shopping List</button>
            </div>
          )}

          {data.summary && (
            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: data.summary }} />
          )}
        </div>
      </div>
    </Overlay>
  );
}

function Overlay({ children, onClose }: { children: React.ReactNode; onClose?: ()=>void }){
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && onClose) onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={onClose}>
      <div onClick={(e)=>e.stopPropagation()}>{children}</div>
    </div>
  );
}
