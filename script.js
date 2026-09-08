const searchButton = document.getElementById('searchButton');
const searchDialog = document.getElementById('searchDialog');
const newsletterForm = document.getElementById('newsletterForm');
const searchInput = document.getElementById('searchInput');

if (searchButton && searchDialog) {
  searchButton.addEventListener('click', () => {
    if (typeof searchDialog.showModal === 'function') searchDialog.showModal();
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
if (ticker) {
  let offset = 0;
  setInterval(() => {
    if (window.innerWidth <= 650) {
      offset -= 0.55;
      ticker.style.transform = `translateX(${offset}px)`;
      if (Math.abs(offset) > Math.max(500, ticker.scrollWidth / 2)) offset = 0;
    }
  }, 40);
}

const cards = document.querySelectorAll('.story, .trend-compact>a');
cards.forEach((card, index) => { card.style.animationDelay = `${index * 45}ms`; });

let deferredInstallPrompt = null;
window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  if (document.querySelector('.install-app')) return;
  const banner = document.createElement('div');
  banner.className = 'install-app';
  banner.innerHTML = '<div><strong>Instala ICON MEDIA</strong><small>Ten las noticias siempre a la mano.</small></div><button type="button" class="install-action">Instalar</button><button type="button" class="dismiss" aria-label="Cerrar">×</button>';
  document.body.appendChild(banner);
  banner.querySelector('.install-action').addEventListener('click', async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    banner.remove();
  });
  banner.querySelector('.dismiss').addEventListener('click', () => banner.remove());
});

window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;
  document.querySelector('.install-app')?.remove();
});

// Force the reliable vector logo asset and refresh favicon references.
const logoImg = document.querySelector('.brand-logo-button img');
if (logoImg) {
  logoImg.src = './icon.svg?v=5';
  logoImg.removeAttribute('srcset');
}
document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]').forEach((link) => {
  link.href = './icon.svg?v=5';
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}
