import '../css/style.css';
import './theme.js';
import { fetchCryptoData } from './api.js';

const tableBody = document.getElementById("crypto-table-body");
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let showFavoritesOnly = false; // Track whether to show only favorites
let filteredCryptoData = []; // Houd de gefilterde data bij

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
      <td class="favorite-icon ${isFavorite ? 'favorited' : ''}" data-index="${index}">
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

    const sortedData = [...filteredCryptoData].sort((a, b) => {
      const aValue = a[key] ?? 0;
      const bValue = b[key] ?? 0;

      return currentSort.ascending
        ? aValue - bValue
        : bValue - aValue;
    });

    renderTable(sortedData); // Render de gesorteerde data
  });
});

function renderTable(data) {
  filteredCryptoData = data; // Update de gefilterde data
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

const filterButton = document.getElementById("filter-button");
const filterModal = document.getElementById("filter-modal");
const applyFiltersButton = document.getElementById("apply-filters");
const resetFiltersButton = document.getElementById("reset-filters");

filterButton.addEventListener("click", () => {
  filterModal.classList.toggle("hidden"); // Toon of verberg het modaal
});

applyFiltersButton.addEventListener("click", () => {
  const marketCapMin = parseFloat(document.getElementById("market-cap-min").value) || 0;
  const marketCapMax = parseFloat(document.getElementById("market-cap-max").value) || Infinity;
  const priceChangeMin = parseFloat(document.getElementById("price-change-min").value) || -Infinity;
  const priceChangeMax = parseFloat(document.getElementById("price-change-max").value) || Infinity;
  const volumeMin = parseFloat(document.getElementById("volume-min").value) || 0;
  const volumeMax = parseFloat(document.getElementById("volume-max").value) || Infinity;

  const filteredData = cryptoData.filter(coin => {
    return (
      coin.market_cap >= marketCapMin &&
      coin.market_cap <= marketCapMax &&
      coin.price_change_percentage_24h >= priceChangeMin &&
      coin.price_change_percentage_24h <= priceChangeMax &&
      coin.total_volume >= volumeMin &&
      coin.total_volume <= volumeMax
    );
  });

  renderTable(filteredData); // Re-render de tabel met gefilterde data
  filterModal.classList.add("hidden"); // Verberg het modaal
});

resetFiltersButton.addEventListener("click", () => {
  document.getElementById("market-cap-min").value = "";
  document.getElementById("market-cap-max").value = "";
  document.getElementById("price-change-min").value = "";
  document.getElementById("price-change-max").value = "";
  document.getElementById("volume-min").value = "";
  document.getElementById("volume-max").value = "";

  renderTable(cryptoData); // Toon alle data opnieuw
});

const closeFilterModalButton = document.getElementById("close-filter-modal");

closeFilterModalButton.addEventListener("click", () => {
  filterModal.classList.add("hidden");
});
