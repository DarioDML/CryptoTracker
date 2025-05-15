// observer.js
// Intersection Observer functionaliteit

export function observeTableVisibility() {
  const table = document.getElementById("crypto-table");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log("De tabel is in beeld!");
          table.classList.add("highlight");
        } else {
          table.classList.remove("highlight");
        }
      });
    },
    {
      root: null,
      threshold: 0.1,
    }
  );
  observer.observe(table);
}

export function observeFooterVisibility() {
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
