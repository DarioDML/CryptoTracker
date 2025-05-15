import { fetchCryptoData } from './api.js';
import { favorites, isFavorite, toggleFavorite, getFavorites } from './favorites.js';
import { applyFilters } from './filters.js';
import { sortData } from './sorting.js';
import { createCryptoRow, renderTable } from './render.js';
import { observeTableVisibility, observeFooterVisibility } from './observer.js';
import '../css/style.css';
import './theme.js';

let showFavoritesOnly = false;
let filteredCryptoData = [];
let originalCryptoData = [];
let cryptoData = [];
let currentSort = { key: null, ascending: true };

function renderTableWithSync(data, setupFavoriteListeners) {
  filteredCryptoData = data;
  renderTable(data, setupFavoriteListeners);
}

async function displayCryptos() {
  cryptoData = await fetchCryptoData();
  originalCryptoData = [...cryptoData];
  renderTableWithSync(cryptoData, setupFavoriteListeners);
}

document.querySelectorAll('th[data-sort]').forEach(th => {
  th.style.cursor = 'pointer';
  th.addEventListener('click', () => {
    const key = th.getAttribute('data-sort');
    document.querySelectorAll('th[data-sort]').forEach(header => {
      header.setAttribute('data-sort-active', 'none');
    });
    if (currentSort.key === key) {
      if (currentSort.ascending === null) {
        currentSort.ascending = true;
      } else if (currentSort.ascending) {
        currentSort.ascending = false;
      } else {
        currentSort.key = null;
        currentSort.ascending = null;
      }
    } else {
      currentSort.key = key;
      currentSort.ascending = true;
    }
    if (currentSort.key) {
      th.setAttribute('data-sort-active', currentSort.ascending ? 'asc' : 'desc');
      th.querySelector('.arrow.up').classList.toggle('active', currentSort.ascending);
      th.querySelector('.arrow.down').classList.toggle('active', !currentSort.ascending);
    } else {
      th.setAttribute('data-sort-active', 'none');
      th.querySelector('.arrow.up').classList.remove('active');
      th.querySelector('.arrow.down').classList.remove('active');
    }
    let sortedData;
    if (currentSort.key) {
      sortedData = sortData(filteredCryptoData, currentSort.key, currentSort.ascending);
    } else {
      if (filteredCryptoData.length === originalCryptoData.length) {
        sortedData = [...originalCryptoData];
      } else {
        const ids = filteredCryptoData.map(c => c.id);
        sortedData = originalCryptoData.filter(c => ids.includes(c.id));
      }
    }
    filteredCryptoData = sortedData; // <-- fix: update filteredCryptoData zodat indexen kloppen
    renderTableWithSync(sortedData, setupFavoriteListeners);
  });
});

function setupFavoriteListeners() {
  document.querySelectorAll('.favorite-icon').forEach(icon => {
    icon.addEventListener('click', (event) => {
      const index = event.target.getAttribute('data-index');
      const coin = filteredCryptoData[index];
      toggleFavorite(coin.id);
      if (showFavoritesOnly) {
        // Toon alleen de gefilterde favorietenlijst
        const filteredData = filteredCryptoData.filter(c => getFavorites().includes(c.id));
        renderTableWithSync(filteredData, setupFavoriteListeners);
      } else {
        // Toon de huidige gefilterde lijst (bij filter/search)
        renderTableWithSync(filteredCryptoData, setupFavoriteListeners);
      }
    });
  });
}

document.getElementById('favorites-toggle').addEventListener('click', () => {
  showFavoritesOnly = !showFavoritesOnly;
  const button = document.getElementById('favorites-toggle');
  button.textContent = showFavoritesOnly ? 'Show All' : 'Show Favorites';
  const filteredData = showFavoritesOnly
    ? cryptoData.filter(coin => getFavorites().includes(coin.id))
    : cryptoData;
  renderTableWithSync(filteredData, setupFavoriteListeners);
});

document.getElementById('search-bar').addEventListener('input', (event) => {
  const query = event.target.value.toLowerCase();
  let dataToFilter = showFavoritesOnly
    ? cryptoData.filter(coin => getFavorites().includes(coin.id))
    : cryptoData;
  const filteredData = dataToFilter.filter((coin) => {
    return (
      coin.name.toLowerCase().includes(query) ||
      coin.symbol.toLowerCase().includes(query)
    );
  });
  renderTableWithSync(filteredData, setupFavoriteListeners);
});

// Filter functionaliteit
const filterButton = document.getElementById('filter-button');
const filterModal = document.getElementById('filter-modal');
const applyFiltersButton = document.getElementById('apply-filters');
const resetFiltersButton = document.getElementById('reset-filters');

filterButton.addEventListener('click', () => {
  filterModal.classList.toggle('hidden');
});

applyFiltersButton.addEventListener('click', () => {
  const marketCapMin = parseFloat(document.getElementById('market-cap-min').value) || 0;
  const marketCapMax = parseFloat(document.getElementById('market-cap-max').value) || Infinity;
  const priceChangeMin = parseFloat(document.getElementById('price-change-min').value) || -Infinity;
  const priceChangeMax = parseFloat(document.getElementById('price-change-max').value) || Infinity;
  const volumeMin = parseFloat(document.getElementById('volume-min').value) || 0;
  const volumeMax = parseFloat(document.getElementById('volume-max').value) || Infinity;
  let dataToFilter = showFavoritesOnly
    ? cryptoData.filter(coin => getFavorites().includes(coin.id))
    : cryptoData;
  const filteredData = applyFilters(dataToFilter, {
    marketCapMin,
    marketCapMax,
    priceChangeMin,
    priceChangeMax,
    volumeMin,
    volumeMax
  });
  renderTableWithSync(filteredData, setupFavoriteListeners);
  filterModal.classList.add('hidden');
});

resetFiltersButton.addEventListener('click', () => {
  document.getElementById('market-cap-min').value = '';
  document.getElementById('market-cap-max').value = '';
  document.getElementById('price-change-min').value = '';
  document.getElementById('price-change-max').value = '';
  document.getElementById('volume-min').value = '';
  document.getElementById('volume-max').value = '';
  renderTableWithSync(cryptoData, setupFavoriteListeners);
});

const closeFilterModalButton = document.getElementById('close-filter-modal');
closeFilterModalButton.addEventListener('click', () => {
  filterModal.classList.add('hidden');
});

document.addEventListener('DOMContentLoaded', () => {
  displayCryptos();
  observeTableVisibility();
  observeFooterVisibility();
});
