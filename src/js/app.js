import '../css/style.css';
import './theme.js';
import { fetchCryptoData } from './api.js';

const tableBody = document.getElementById("crypto-table-body");
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let showFavoritesOnly = false; // Track whether to show only favorites

function createCryptoRow(coin, index) {
  const isFavorite = favorites.includes(coin.id); // Check if the coin is a favorite
  return `
    <tr>
      <td>${coin.market_cap_rank}</td>
      <td class="coin-name">
        <img src="${coin.image}" alt="${coin.name}" class="coin-logo" />
        ${coin.name} (${coin.symbol.toUpperCase()})
      </td>
      <td>€${coin.current_price.toLocaleString()}</td>
      <td class="${coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}">
        ${coin.price_change_percentage_24h.toFixed(2)}%
      </td>
      <td>€${coin.market_cap.toLocaleString()}</td>
      <td>€${coin.total_volume.toLocaleString()}</td>
      <td class="${coin.ath_change_percentage >= 0 ? 'positive' : 'negative'}">
        ${coin.ath_change_percentage.toFixed(2)}%
      </td>
      <td class="favorite-icon" data-index="${index}">
        ${isFavorite ? '★' : '☆'}
      </td>
    </tr>
  `;
}

async function displayCryptos() {
  cryptoData = await fetchCryptoData();
  renderTable(cryptoData);
}

document.querySelectorAll("th[data-sort]").forEach(th => {
  th.style.cursor = "pointer";
  th.addEventListener("click", () => {
    const key = th.getAttribute("data-sort");
    if (currentSort.key === key) {
      currentSort.ascending = !currentSort.ascending;
    } else {
      currentSort.key = key;
      currentSort.ascending = true;
    }

    const sortedData = [...cryptoData].sort((a, b) => {
      const aValue = a[key] ?? 0;
      const bValue = b[key] ?? 0;

      return currentSort.ascending
        ? aValue - bValue
        : bValue - aValue;
    });

    renderTable(sortedData);
  });
});

function renderTable(data) {
  const tableBody = document.getElementById("crypto-table-body");
  tableBody.innerHTML = ""; // Clear the table
  data.forEach((coin, index) => {
    tableBody.innerHTML += createCryptoRow(coin, index); // Render rows
  });
  setupFavoriteListeners(); 
}

function setupFavoriteListeners() {
  document.querySelectorAll('.favorite-icon').forEach(icon => {
    icon.addEventListener('click', (event) => {
      const index = event.target.getAttribute('data-index');
      const coin = cryptoData[index];

      if (favorites.includes(coin.id)) {
        favorites = favorites.filter(fav => fav !== coin.id); // Remove from favorites
      } else {
        favorites.push(coin.id); // Add to favorites
      }

      localStorage.setItem('favorites', JSON.stringify(favorites)); // Save to localStorage
      renderTable(cryptoData); // Re-render the table
    });
  });
}

document.getElementById("favorites-toggle").addEventListener("click", () => {
  showFavoritesOnly = !showFavoritesOnly;
  const button = document.getElementById("favorites-toggle");
  button.textContent = showFavoritesOnly ? "Show All" : "Show Favorites"; 

  const filteredData = showFavoritesOnly
    ? cryptoData.filter(coin => favorites.includes(coin.id)) // Filter favorites
    : cryptoData; // Show all data

  renderTable(filteredData); 
});

document.getElementById("search-bar").addEventListener("input", (event) => {
  const query = event.target.value.toLowerCase();

  const filteredData = cryptoData.filter((coin) => {
    return (
      coin.name.toLowerCase().includes(query) ||
      coin.symbol.toLowerCase().includes(query)
    );
  });

  renderTable(filteredData); // Re-render the table with filtered data
});

let currentSort = {
  key: null,
  ascending: true
};

let cryptoData = []; // globale array voor sortering

// Pas data in na DOM-load
document.addEventListener("DOMContentLoaded", () => {
  displayCryptos();
});
