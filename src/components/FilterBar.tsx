import { useEffect, useState } from 'react';
import type { SearchFilters } from '@/lib/api';

const DIETS = ['', 'vegan', 'vegetarian', 'pescetarian', 'keto', 'paleo'];
const CUISINES = ['', 'italian', 'thai', 'mexican', 'indian', 'japanese'];
const INTOLS = ['gluten', 'dairy', 'peanut', 'seafood', 'sesame', 'soy', 'sulfite', 'shellfish'];

export default function FilterBar({ value, onChange }: { value: SearchFilters; onChange: (v: SearchFilters) => void; }) {
  const [local, setLocal] = useState<SearchFilters>(value);
  useEffect(() => setLocal(value), [value]);
  useEffect(() => { const t = setTimeout(() => onChange(local), 150); return () => clearTimeout(t); }, [local]);
  const toggleIntolerance = (i: string) => {
    const cur = new Set(local.intolerances || []);
    cur.has(i) ? cur.delete(i) : cur.add(i);
    setLocal({ ...local, intolerances: Array.from(cur) });
  };
  return (
    <div className="flex flex-wrap items-end gap-2">
      <label className="text-xs">
        <div className="mb-1 text-slate-500">Diet</div>
        <select className="input" value={local.diet || ''} onChange={(e)=>setLocal({ ...local, diet: e.target.value || undefined })}>
          {DIETS.map((d) => <option key={d} value={d}>{d || 'Any'}</option>)}
        </select>
      </label>
      <label className="text-xs">
        <div className="mb-1 text-slate-500">Cuisine</div>
        <select className="input" value={local.cuisine || ''} onChange={(e)=>setLocal({ ...local, cuisine: e.target.value || undefined })}>
          {CUISINES.map((c) => <option key={c} value={c}>{c || 'Any'}</option>)}
        </select>
      </label>
      <label className="text-xs">
        <div className="mb-1 text-slate-500">Max Time (min)</div>
        <input type="number" min={0} className="input w-32"
          value={local.maxReadyTime ?? ''}
          onChange={(e)=>setLocal({ ...local, maxReadyTime: e.target.value ? Number(e.target.value) : undefined })}
        />
      </label>
      <label className="text-xs">
        <div className="mb-1 text-slate-500">Sort</div>
        <select className="input" value={local.sort || ''} onChange={(e)=>setLocal({ ...local, sort: (e.target.value as any) || undefined })}>
          <option value="">Default</option>
          <option value="popularity">Popularity</option>
          <option value="healthiness">Healthiness</option>
          <option value="price">Price</option>
          <option value="time">Time</option>
        </select>
      </label>
      <div className="flex flex-wrap gap-1">
        {INTOLS.map((i) => {
          const active = (local.intolerances || []).includes(i);
          return (
            <button key={i} type="button" onClick={() => toggleIntolerance(i)}
              className={`badge ${active ? 'badge-sky' : ''}`} aria-pressed={active}>
              {i}
            </button>
          );
        })}
      </div>
    </div>
  );
}
