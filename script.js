const searchButton = document.getElementById('searchButton');
const searchDialog = document.getElementById('searchDialog');
const newsletterForm = document.getElementById('newsletterForm');
const searchInput = document.getElementById('searchInput');

if (searchButton && searchDialog) {
  searchButton.addEventListener('click', () => {
    searchDialog.showModal();
    setTimeout(() => searchInput?.focus(), 50);
  });
}

if (newsletterForm) {
  newsletterForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const button = newsletterForm.querySelector('button');
    const input = newsletterForm.querySelector('input');
    button.textContent = '✓';
    button.disabled = true;
    input.value = '';
    input.placeholder = '¡Ya estás dentro!';
  });
}

const ticker = document.getElementById('ticker');
if (ticker && window.matchMedia('(max-width: 650px)').matches) {
  let offset = 0;
  setInterval(() => {
    offset -= 0.55;
    ticker.style.transform = `translateX(${offset}px)`;
    if (Math.abs(offset) > ticker.scrollWidth / 2) offset = 0;
  }, 40);
}

const cards = document.querySelectorAll('.story, .trend-compact>a');
cards.forEach((card, index) => {
  card.style.animationDelay = `${index * 45}ms`;
});
