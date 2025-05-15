// sorting.js - Sorteerlogica voor CryptoTracker
// Deze module bevat functies om de dataset te sorteren op verschillende kolommen (naam, prijs, market cap, ...).
// De sorteerfunctie is generiek en ondersteunt oplopend/aflopend sorteren op elke property.
// Wordt aangeroepen vanuit app.js bij het sorteren van de tabel.

export function sortData(data, sortKey, ascending) {
  if (!sortKey) return data;
  return [...data].sort((a, b) => {
    let aValue = a[sortKey] ?? 0;
    let bValue = b[sortKey] ?? 0;
    if (sortKey === 'name') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
      return ascending ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
    return ascending ? aValue - bValue : bValue - aValue;
  });
}
