// render.js - Rendering voor CryptoTracker
// Deze module bevat functies om de cryptotabel en rijen te genereren en te updaten in de DOM.
// Scheidt de logica voor DOM-manipulatie van de rest van de applicatie.
// Wordt aangeroepen vanuit app.js telkens als de tabel opnieuw gerenderd moet worden (na filteren, sorteren, ...).

import { isFavorite, toggleFavorite, favorites } from './favorites.js';

export function createCryptoRow(coin, index) {
  const isFav = isFavorite(coin.id);
  // Prijs: maximaal 6 cijfers totaal, altijd 2-6 decimalen, geen wetenschappelijke notatie
  let price = '-';
  if (typeof coin.current_price === 'number') {
    if (coin.current_price >= 1) {
      price = coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2, maximumSignificantDigits: 6 });
    } else if (coin.current_price > 0) {
      // Toon max 6 cijfers, dus bv. 0.000123, 0.012345, 0.00000123
      const match = coin.current_price.toFixed(8).match(/^(0\.0*\d{0,6})/);
      price = match ? match[1] : coin.current_price.toFixed(8);
    }
  }
  return `
    <tr>
      <td>${coin.market_cap_rank ?? '-'}</td>
      <td class="coin-name">
        <img src="${coin.image}" alt="${coin.name}" class="coin-logo" />
        ${coin.name} (${coin.symbol?.toUpperCase() ?? '-'})
      </td>
      <td>€${price}</td>
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
