const UNITS = [
  'teaspoon','tsp','tablespoon','tbsp','cup','cups','oz','ounce','ounces',
  'g','gram','grams','kg','kilogram','kilograms','lb','pound','pounds',
  'ml','milliliter','milliliters','l','liter','liters'
];

const stripPunct = (s: string) => s.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, ' ');
const collapseWs = (s: string) => s.replace(/\s+/g, ' ').trim();

export function normalizeIngredient(line: string): string {
  let s = line.toLowerCase();
  s = stripPunct(s);
  s = s.replace(/^\s*\d+([\/.]\d+)?\s*/,'');
  s = s.replace(new RegExp(`\\b(${UNITS.join('|')})\\b`, 'g'), '');
  s = s.replace(/\b(of|and|about|approx|roughly|to|or)\b/g, '');
  s = collapseWs(s);
  s = s.replace(/\b(tomatoes)\b/,'tomato')
       .replace(/\b(potatoes)\b/,'potato')
       .replace(/\b(garlic cloves|cloves garlic)\b/,'garlic')
       .replace(/\b(eggs)\b/,'egg');
  return s.split(' ').map(w => w ? w[0].toUpperCase() + w.slice(1) : w).join(' ');
}
