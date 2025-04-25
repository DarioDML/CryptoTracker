// theme.js
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