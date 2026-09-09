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

function articleUrl(article) {
  return `article.html?slug=${encodeURIComponent(article.slug)}`;
}

function applyArticleCard(card, article) {
  const image = card.querySelector('.story-image');
  const title = card.querySelector('h3');
  const desc = card.querySelector('.story-body p');
  const time = card.querySelector('.story-foot p') || card.querySelector('.story-body > p');
  const links = card.querySelectorAll('a');
  if (image) {
    image.style.backgroundImage = `url("${article.image}")`;
    image.href = articleUrl(article);
    image.querySelector('.category')?.replaceChildren(document.createTextNode(article.category));
  }
  if (title) title.textContent = article.title;
  if (desc && desc !== time) desc.textContent = article.deck;
  if (time) time.textContent = article.time;
  links.forEach(link => link.href = articleUrl(article));
}

function renderHome() {
  if (!window.ICON_NEWS) return;
  const news = window.ICON_NEWS;
  const featured = news.find(item => item.featured) || news[0];
  const hero = document.querySelector('.hero');
  if (hero) {
    const heroImage = hero.querySelector('.hero-image');
    const heroTitle = hero.querySelector('h1');
    const heroDesc = hero.querySelector('.hero-copy > p');
    const heroMeta = hero.querySelector('.meta');
    if (heroImage) {
      heroImage.style.backgroundImage = `linear-gradient(90deg,rgba(5,5,5,.9) 0%,rgba(5,5,5,.5) 30%,rgba(5,5,5,0) 65%), url("${featured.image}")`;
      heroImage.href = articleUrl(featured);
      heroImage.querySelector('.hero-category').textContent = featured.category;
    }
    if (heroTitle) heroTitle.innerHTML = `${featured.title} <span>👀</span>`;
    if (heroDesc) heroDesc.textContent = featured.deck;
    if (heroMeta) heroMeta.innerHTML = `<span>${featured.author.toUpperCase()}</span><span>·</span><span>${featured.time}</span>`;
    hero.querySelector('.primary-cta')?.setAttribute('href', articleUrl(featured));
  }

  document.querySelectorAll('.latest-editorial .story').forEach((card, index) => {
    const article = news[index];
    if (article) applyArticleCard(card, article);
  });

  document.querySelectorAll('.recent-grid .story').forEach((card, index) => {
    const article = news[(index + 4) % news.length];
    if (article) applyArticleCard(card, article);
  });

  document.querySelectorAll('.trend-compact > a').forEach((card, index) => {
    const article = news[index + 4];
    if (!article) return;
    card.href = articleUrl(article);
    const image = card.querySelector('.trend-mini');
    const title = card.querySelector('strong');
    const time = card.querySelector('small');
    if (image) image.style.backgroundImage = `url("${article.image}")`;
    if (title) title.textContent = article.title;
    if (time) time.textContent = article.time;
  });

  document.querySelectorAll('.ticker span').forEach((item, index) => {
    const article = news[index % news.length];
    if (!article) return;
    item.innerHTML = `<b>${article.time.replace('HACE ', '')}</b> ${article.title}`;
  });
}

function renderArticlePage() {
  if (!window.ICON_NEWS || !document.querySelector('.article-page')) return;
  const slug = new URLSearchParams(window.location.search).get('slug');
  const article = window.getIconNews(slug);
  document.title = `${article.title} — ICON MEDIA`;
  const top = document.querySelector('.article-top');
  const label = top?.querySelector('.article-breadcrumb strong');
  const title = top?.querySelector('h1');
  const deck = top?.querySelector('.article-deck');
  const metaRow = top?.querySelector('.article-meta-row');
  const authorName = top?.querySelector('.author-name');
  const hero = document.querySelector('.article-hero');
  const body = document.querySelector('.article-body');
  if (label) label.textContent = article.category;
  if (title) title.textContent = article.title;
  if (deck) deck.textContent = article.deck;
  if (authorName) authorName.innerHTML = `${article.author}<small>ICON MEDIA · ${article.date}</small>`;
  if (metaRow) {
    const meta = metaRow.querySelector('.article-meta');
    if (meta) meta.innerHTML = `<span>Actualizado ${article.time}</span><span>·</span><span>${article.read}</span>`;
  }
  if (hero) {
    hero.style.backgroundImage = `linear-gradient(180deg,transparent 55%,rgba(0,0,0,.38)),url("${article.image}")`;
    hero.setAttribute('aria-label', article.title);
  }
  if (body) {
    const lead = body.querySelector('.lead');
    const heading = body.querySelector('h2');
    const paragraphs = body.querySelectorAll('p:not(.article-note)');
    if (lead) lead.textContent = article.body[0] || article.deck;
    if (paragraphs[1]) paragraphs[1].textContent = article.body[1] || '';
    if (paragraphs[2]) paragraphs[2].textContent = article.body[2] || '';
    if (heading) heading.textContent = '¿Por qué todo el mundo está hablando de esto?';
  }

  const relatedGrid = document.querySelector('.article-more .related-grid');
  if (relatedGrid) {
    relatedGrid.innerHTML = '';
    window.ICON_NEWS.filter(item => item.slug !== article.slug).slice(0, 3).forEach(item => {
      const link = document.createElement('a');
      link.className = 'related-card';
      link.href = articleUrl(item);
      link.innerHTML = `<div class="related-image" style="background-image:url("${item.image}")"></div><span>${item.category} · ${item.time}</span><h3>${item.title}</h3>`;
      relatedGrid.appendChild(link);
    });
  }
}

renderHome();
renderArticlePage();

document.querySelectorAll('.story, .trend-compact>a').forEach((card, index) => {
  card.style.animationDelay = `${index * 45}ms`;
});

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

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}
