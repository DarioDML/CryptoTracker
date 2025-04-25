// theme.js
const toggleButton = document.getElementById('theme-toggle');
const html = document.documentElement;

if (localStorage.getItem('theme') === 'dark') {
  html.setAttribute('data-theme', 'dark');
}

toggleButton.addEventListener('click', () => {
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
});