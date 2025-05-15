// sorting.js
// Sorteer functionaliteit

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
