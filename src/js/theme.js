// theme.js - Thema beheer voor CryptoTracker
// Deze module regelt het wisselen tussen light en dark mode en slaat de gebruikersvoorkeur op in localStorage.
// Bevat logica om het thema toe te passen op de UI en te onthouden bij volgende bezoeken.
// Wordt automatisch geladen bij het opstarten van de app.

const toggleButton = document.getElementById('theme-toggle');
const html = document.documentElement;

function updateThemeIcon() {
  const isDark = html.getAttribute('data-theme') === 'dark';
  toggleButton.textContent = isDark ? '☀️' : '🌙'; // Sun for light mode, moon for dark mode
}

// Set initial theme and icon
if (localStorage.getItem('theme') === 'dark') {
  html.setAttribute('data-theme', 'dark');
}
updateThemeIcon();

toggleButton.addEventListener('click', () => {
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
  updateThemeIcon(); // Update the icon after toggling
});