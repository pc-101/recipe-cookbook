import { Link } from 'react-router-dom';
import { useCookbook } from '@/state/cookbookStore';

export default function ShoppingList(){
  const { shoppingList, clearShopping } = useCookbook();
  const sections = Object.entries(shoppingList);

  return (
    <div>
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <div className="container mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <div className="font-semibold">🧾 Shopping List</div>
          <nav className="flex items-center gap-2 text-sm">
            <Link className="btn" to="/">Search</Link>
            <Link className="btn" to="/cookbook">Cookbook</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl space-y-6 px-4 py-6">
        {sections.length === 0 ? (
          <div className="text-sm text-slate-500">No items yet. Add recipes to your cookbook, then generate a list from the modal.</div>
        ) : (
          <div className="space-y-6">
            {sections.map(([category, items]) => (
              <div key={category} className="card">
                <div className="mb-2 font-medium">{category}</div>
                <ul className="list-disc pl-5 text-sm">
                  {(items as string[]).map((it, i) => <li key={i}>{it}</li>)}
                </ul>
              </div>
            ))}
            <button className="btn" onClick={clearShopping}>Clear list</button>
          </div>
        )}
      </main>
    </div>
  );
}
