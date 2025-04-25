import '../css/style.css';
import './theme.js';
import { fetchCryptoData } from './api.js';

const tableBody = document.getElementById("crypto-table-body");

function createCryptoRow(coin, index) {
  return `
    <tr>
      <td>${index + 1}</td>
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
      <td class="favorite-icon">☆</td>
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
  tableBody.innerHTML = "";
  data.forEach((coin, index) => {
    tableBody.innerHTML += createCryptoRow(coin, index);
  });
}

let currentSort = {
  key: null,
  ascending: true
};

let cryptoData = []; // globale array voor sortering

// Pas data in na DOM-load
document.addEventListener("DOMContentLoaded", () => {
  displayCryptos();
});
