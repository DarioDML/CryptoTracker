<img src="public/LogoCryptoTracker.png" width="128"/>

# CryptoTracker
Interactive Single Page Application for Web Advanced

## Projectbeschrijving
CryptoTracker is een interactieve single-page webapplicatie waarmee gebruikers live cryptocurrency-data kunnen verkennen, filteren, sorteren en opslaan in persoonlijke favorieten. De applicatie biedt een gebruiksvriendelijke interface en maakt gebruik van moderne webtechnologieën om een responsieve en aantrekkelijke gebruikerservaring te bieden.

## Gebruikte API + link
De applicatie maakt gebruik van de [CoinGecko API](https://www.coingecko.com/en/api) om live cryptocurrency-data op te halen. Deze API biedt uitgebreide informatie over cryptocurrencies, zoals prijzen, marktkapitalisatie, volume en meer.

## Voor elk technisch concept: waar en hoe toegepast
Hieronder een overzicht van de technische vereisten en waar deze in de code zijn toegepast:

### DOM Manipulatie
- **Elementen selecteren**: `document.querySelector` en `document.getElementById` worden gebruikt in `app.js` (bijv. regel 34).
- **Elementen manipuleren**: Dynamische tabelrijen worden gegenereerd in de functie `renderTable` in `app.js` (regel 70).
- **Events aan elementen koppelen**: Event listeners worden toegevoegd aan knoppen zoals de sorteerheaders en filterknoppen (bijv. regel 40).

### Modern JavaScript
- **Gebruik van constanten**: `const` wordt gebruikt voor variabelen zoals `filterButton` en `applyFiltersButton` in `app.js`.
- **Template literals**: Gebruikt in de functie `createCryptoRow` om dynamische HTML te genereren (regel 10).
- **Iteratie over arrays**: `.forEach` wordt gebruikt om data te renderen in `renderTable` (regel 72).
- **Array methodes**: `.filter`, `.sort` en `.map` worden gebruikt voor filtering en sortering van data (bijv. regel 50).
- **Arrow functions**: Gebruikt in event listeners en array-methodes (bijv. regel 42).
- **Conditional (ternary) operator**: Gebruikt in `createCryptoRow` om te bepalen of een cryptocurrency een favoriet is (regel 15).
- **Callback functions**: Gebruikt in array-methodes zoals `.filter` en `.sort`.
- **Promises**: De CoinGecko API wordt aangeroepen met `fetch` en verwerkt met `.then` en `async/await`.
- **Async & Await**: Gebruikt in `displayCryptos` om data op te halen van de API (regel 34).
- **Observer API**: De **Intersection Observer API** wordt gebruikt om te detecteren wanneer de tabel (`#crypto-table`) en de footer (`.footer-banner`) in beeld komen:
  - **Tabel**: Wanneer de tabel in beeld komt, wordt een visueel effect toegevoegd door de klasse `highlight` toe te voegen. Dit is geïmplementeerd in `app.js` (regel XXX).
  - **Footer**: Wanneer de footer in beeld komt, wordt een melding in de console weergegeven. Dit is geïmplementeerd in `app.js` (regel XXX).

### Data & API
- **Fetch om data op te halen**: Gebruikt in `displayCryptos` om data van de CoinGecko API op te halen (regel 34).
- **JSON manipuleren en weergeven**: De API-respons wordt verwerkt en weergegeven in de tabel.

### Opslag & validatie
- **Formulier validatie**: NOG INVULLEN!!
- **Gebruik van LocalStorage**: Favorieten worden opgeslagen in `localStorage` en geladen bij het opstarten van de applicatie (regel 90).

### Styling & layout
- **Basis HTML layout**: De applicatie maakt gebruik van een tabel om data weer te geven en een modaal voor filters.
- **Basis CSS**: Stijlen zijn toegepast voor de tabel, knoppen en het filtermodaal.
- **Gebruiksvriendelijke elementen**: Knoppen hebben hover-effecten en de sorteerheaders tonen pijltjes om de sorteerstatus aan te geven.

### Tooling & structuur
- **Project opgezet met Vite**: Het project maakt gebruik van Vite voor snelle ontwikkeling.
- **Correcte folderstructuur**: HTML, CSS en JavaScript zijn gescheiden in de `src`-map.

## Installatie-instructies
1. Clone de repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigeer naar de projectmap:
   ```bash
   cd Project_WebAdvanced
   ```
3. Installeer de benodigde dependencies:
   ```bash
   npm install
   ```
4. Start de ontwikkelserver:
   ```bash
   npm run dev
   ```
5. Open de applicatie in je browser via de link die Vite genereert.

## Screenshots
### Overzicht van de applicatie
*(Voeg hier een screenshot toe van de tabel met cryptocurrencies)*

### Filtermodaal
*(Voeg hier een screenshot toe van het filtermodaal)*

### Favorietenweergave
*(Voeg hier een screenshot toe van de favorietenfunctie)*

## Gebruikte bronnen
- [CoinGecko API](https://www.coingecko.com/en/api)
- [MDN Web Docs](https://developer.mozilla.org/)
- [Vite](https://vitejs.dev/)
- [CSS Tricks](https://css-tricks.com/)
- AI-assistentie via GitHub Copilot

