// render.js - Rendering voor CryptoTracker
// Deze module bevat functies om de cryptotabel en rijen te genereren en te updaten in de DOM.
// Scheidt de logica voor DOM-manipulatie van de rest van de applicatie.
// Wordt aangeroepen vanuit app.js telkens als de tabel opnieuw gerenderd moet worden (na filteren, sorteren, ...).

import { isFavorite, toggleFavorite, favorites } from './favorites.js';

export function createCryptoRow(coin, index) {
  const isFav = isFavorite(coin.id);
  return `
    <tr>
      <td>${coin.market_cap_rank ?? '-'}</td>
      <td class="coin-name">
        <img src="${coin.image}" alt="${coin.name}" class="coin-logo" />
        ${coin.name} (${coin.symbol?.toUpperCase() ?? '-'})
      </td>
      <td>€${coin.current_price > 0.01 ? coin.current_price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 }) : coin.current_price?.toFixed(8) ?? '-'}</td>
      <td class="${coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}">
        ${coin.price_change_percentage_24h?.toFixed(2) ?? '-'}%
      </td>
      <td>€${coin.market_cap?.toLocaleString() ?? '-'}</td>
      <td>€${coin.total_volume?.toLocaleString() ?? '-'}</td>
      <td class="${coin.ath_change_percentage >= 0 ? 'positive' : 'negative'}">
        ${coin.ath_change_percentage?.toFixed(2) ?? '-'}%
      </td>
      <td class="favorite-icon ${isFav ? 'favorited' : ''}" data-index="${index}">
        ${isFav ? '★' : '☆'}
      </td>
    </tr>
  `;
}

export function renderTable(data, setupFavoriteListeners) {
  const tableBody = document.getElementById("crypto-table-body");
  tableBody.innerHTML = "";
  data.forEach((coin, index) => {
    tableBody.innerHTML += createCryptoRow(coin, index);
  });
  if (setupFavoriteListeners) setupFavoriteListeners();
}
