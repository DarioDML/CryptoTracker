


export async function fetchCryptoData() {
    const url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&order=market_cap_desc&per_page=50&page=1&sparkline=false";
  
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Data ophalen mislukt");
  
      const data = await response.json();
      return data; // een array met crypto-objecten
    } catch (error) {
      console.error("Fout bij het ophalen van crypto data:", error);
      return [];
    }
  }
  