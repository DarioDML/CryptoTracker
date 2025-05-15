import '../css/style.css';
import './theme.js';
import { fetchCryptoData } from './api.js';

const tableBody = document.getElementById("crypto-table-body");
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let showFavoritesOnly = false; // Track whether to show only favorites
let filteredCryptoData = []; // Houd de gefilterde data bij
let originalCryptoData = [];

function createCryptoRow(coin, index) {
  const isFavorite = favorites.includes(coin.id); // Check if the coin is a favorite
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
      <td class="favorite-icon ${isFavorite ? 'favorited' : ''}" data-index="${index}">
        ${isFavorite ? '★' : '☆'}
      </td>
    </tr>
  `;
}

async function displayCryptos() {
  cryptoData = await fetchCryptoData();
  originalCryptoData = [...cryptoData]; // Sla originele volgorde op
  console.log(`Aantal munten opgehaald: ${cryptoData.length}`);
  renderTable(cryptoData);
}

document.querySelectorAll("th[data-sort]").forEach(th => {
  th.style.cursor = "pointer";
  th.addEventListener("click", () => {
    const key = th.getAttribute("data-sort");

    // Reset sorteerstatus voor alle headers
    document.querySelectorAll("th[data-sort]").forEach(header => {
      header.setAttribute("data-sort-active", "none");
    });

    // Update de huidige sorteerstatus
    if (currentSort.key === key) {
      if (currentSort.ascending === null) {
        currentSort.ascending = true; // Eerste klik: stijgend
      } else if (currentSort.ascending) {
        currentSort.ascending = false; // Tweede klik: dalend
      } else {
        currentSort.key = null; // Derde klik: geen sortering
        currentSort.ascending = null;
      }
    } else {
      currentSort.key = key;
      currentSort.ascending = true; // Start met stijgend sorteren
    }

    // Update de sorteerstatus in de header
    if (currentSort.key) {
      th.setAttribute("data-sort-active", currentSort.ascending ? "asc" : "desc");
      th.querySelector(".arrow.up").classList.toggle("active", currentSort.ascending);
      th.querySelector(".arrow.down").classList.toggle("active", !currentSort.ascending);
    } else {
      th.setAttribute("data-sort-active", "none");
      th.querySelector(".arrow.up").classList.remove("active");
      th.querySelector(".arrow.down").classList.remove("active");
    }

    // Sorteer of herstel de originele data
    let sortedData;
    if (currentSort.key) {
      sortedData = [...filteredCryptoData].sort((a, b) => {
        let aValue = a[currentSort.key] ?? 0;
        let bValue = b[currentSort.key] ?? 0;

        // Special case for sorting by name (alphabetical)
        if (currentSort.key === "name") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
          return currentSort.ascending
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        // Default numerical sorting
        return currentSort.ascending
          ? aValue - bValue
          : bValue - aValue;
      });
    } else {
      // Herstel de originele volgorde binnen de huidige filter
      if (filteredCryptoData.length === originalCryptoData.length) {
        sortedData = [...originalCryptoData];
      } else {
        // Filter opnieuw toepassen op originele volgorde
        const ids = filteredCryptoData.map(c => c.id);
        sortedData = originalCryptoData.filter(c => ids.includes(c.id));
      }
    }

    renderTable(sortedData); // Render de data
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
      const coin = filteredCryptoData[index]; // Gebruik filteredCryptoData voor juiste context

      if (favorites.includes(coin.id)) {
        favorites = favorites.filter(fav => fav !== coin.id); // Remove from favorites
      } else {
        favorites.push(coin.id); // Add to favorites
      }

      localStorage.setItem('favorites', JSON.stringify(favorites)); // Save to localStorage

      // Toon juiste lijst na update
      if (showFavoritesOnly) {
        const filteredData = cryptoData.filter(c => favorites.includes(c.id));
        renderTable(filteredData);
      } else {
        renderTable(cryptoData);
      }
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
  observeTableVisibility();
  observeFooterVisibility();
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

  let dataToFilter = cryptoData;
  if (showFavoritesOnly) {
    dataToFilter = cryptoData.filter(coin => favorites.includes(coin.id));
  }

  const filteredData = dataToFilter.filter(coin => {
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

// Functie om te observeren wanneer de tabel in beeld komt
function observeTableVisibility() {
  const table = document.getElementById("crypto-table");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log("De tabel is in beeld!");
          table.classList.add("highlight"); // Voeg een klasse toe voor visuele feedback
        } else {
          table.classList.remove("highlight"); // Verwijder de klasse als de tabel uit beeld is
        }
      });
    },
    {
      root: null, // Observeer binnen het viewport
      threshold: 0.1, // Activeer wanneer 10% van de tabel zichtbaar is
    }
  );

  observer.observe(table);
}

function observeFooterVisibility() {
  const footer = document.querySelector(".footer-banner");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log("De footer is in beeld!");
        }
      });
    },
    {
      root: null,
      threshold: 0.1,
    }
  );

  observer.observe(footer);
}
