// favorites.js
// Beheer van favorieten: toevoegen, verwijderen, ophalen en opslag in localStorage

// Laad favorieten uit localStorage of initialiseer als lege array
export let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Controleer of een coin een favoriet is
export function isFavorite(id) {
  return favorites.includes(id);
}

// Voeg toe of verwijder een favoriet en sla op
export function toggleFavorite(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter(fav => fav !== id);
  } else {
    favorites.push(id);
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Haal alle favorieten op
export function getFavorites() {
  return favorites;
}
