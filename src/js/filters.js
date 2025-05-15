// filters.js
// Filter functionaliteit

export function applyFilters(data, filters) {
  const {
    marketCapMin = 0,
    marketCapMax = Infinity,
    priceChangeMin = -Infinity,
    priceChangeMax = Infinity,
    volumeMin = 0,
    volumeMax = Infinity
  } = filters;

  return data.filter(coin => {
    return (
      coin.market_cap >= marketCapMin &&
      coin.market_cap <= marketCapMax &&
      coin.price_change_percentage_24h >= priceChangeMin &&
      coin.price_change_percentage_24h <= priceChangeMax &&
      coin.total_volume >= volumeMin &&
      coin.total_volume <= volumeMax
    );
  });
}
