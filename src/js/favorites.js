// favorites.js
// Beheer favorieten functionaliteit

export let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

export function isFavorite(id) {
  return favorites.includes(id);
}

export function toggleFavorite(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter(fav => fav !== id);
  } else {
    favorites.push(id);
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

export function getFavorites() {
  return favorites;
}
