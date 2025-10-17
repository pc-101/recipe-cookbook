import { useCookbook } from '@/state/cookbookStore';
import PageLayout from '@/components/PageLayout';

export default function ShoppingList(){
  const { shoppingList, clearShopping } = useCookbook();
  const sections = Object.entries(shoppingList);

  return (
    <PageLayout
      title="🧾 Shopping List"
      links={[
        { to: '/', label: 'Home' },
        { to: '/cookbook', label: 'Cookbook' },
      ]}
    >
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
    </PageLayout>
  );
}
