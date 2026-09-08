const searchButton = document.getElementById('searchButton');
const searchDialog = document.getElementById('searchDialog');
const newsletterForm = document.getElementById('newsletterForm');

searchButton.addEventListener('click', () => searchDialog.showModal());

newsletterForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const button = newsletterForm.querySelector('button');
  button.textContent = 'Listo. Estás dentro ✨';
  button.disabled = true;
  newsletterForm.querySelector('input').value = '';
});

const ticker = document.getElementById('ticker');
let tickerOffset = 0;
setInterval(() => {
  if (window.innerWidth < 700) {
    tickerOffset -= 1;
    ticker.style.transform = `translateX(${tickerOffset}px)`;
    if (Math.abs(tickerOffset) > 900) tickerOffset = 0;
  }
}, 40);
