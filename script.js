const searchButton = document.getElementById('searchButton');
const searchDialog = document.getElementById('searchDialog');
const newsletterForm = document.getElementById('newsletterForm');
const searchInput = document.getElementById('searchInput');

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
  if (title) title.textContent = article.homeTitle || article.title;
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
    if (heroTitle) heroTitle.innerHTML = `${featured.homeTitle || featured.title} <span>👀</span>`;
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
    const article = news[index + 1];
    if (!article) return;
    card.href = articleUrl(article);
    const image = card.querySelector('.trend-mini');
    const title = card.querySelector('strong');
    const time = card.querySelector('small');
    if (image) image.style.backgroundImage = `url("${article.image}")`;
    if (title) title.textContent = article.homeTitle || article.title;
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

  const caption = document.querySelector('.article-caption');
  if (caption) caption.textContent = article.source ? `Imagen / fuente: ${article.source}` : 'Imagen: ICON MEDIA';

  if (body) {
    body.innerHTML = '';
    article.body.forEach((paragraph, index) => {
      const p = document.createElement('p');
      p.textContent = paragraph;
      if (index === 0) p.className = 'lead';
      body.appendChild(p);
    });

    const heading = document.createElement('h2');
    heading.textContent = 'Lo que hay que saber';
    body.appendChild(heading);

    const note = document.createElement('div');
    note.className = 'article-note';
    note.textContent = article.source
      ? `Fuente consultada: ${article.source}. ICON MEDIA separa los datos confirmados de las interpretaciones y tendencias en redes.`
      : 'ICON MEDIA separa los datos confirmados de las interpretaciones y tendencias en redes.';
    body.appendChild(note);

    const reactionRow = document.createElement('div');
    reactionRow.className = 'reaction-row';
    reactionRow.setAttribute('aria-label', 'Reacciones');
    ['😂 JAJA','👀 ¿QUÉ?','🔥 ICONIC','💀 NO PUEDE SER'].forEach(label => {
      const button = document.createElement('button');
      button.className = 'reaction';
      button.type = 'button';
      button.textContent = label;
      button.addEventListener('click', () => {
        localStorage.setItem(`icon-reaction-${article.slug}`, label);
        reactionRow.querySelectorAll('.reaction').forEach(b => b.classList.remove('selected'));
        button.classList.add('selected');
      });
      reactionRow.appendChild(button);
    });
    body.appendChild(reactionRow);

    const back = document.createElement('a');
    back.className = 'back-link';
    back.href = 'index.html';
    back.textContent = '← Volver a ICON MEDIA';
    body.appendChild(back);
  }

  document.querySelectorAll('.share-button').forEach(button => {
    button.addEventListener('click', async () => {
      const url = window.location.href;
      const label = button.textContent.trim();
      if (label === 'X') {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer');
      } else if (label === 'Facebook') {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer');
      } else {
        try {
          await navigator.clipboard.writeText(url);
          button.textContent = '✓ Copiado';
          setTimeout(() => button.textContent = 'Copiar enlace', 1800);
        } catch {
          prompt('Copia este enlace:', url);
        }
      }
    });
  });

  const relatedGrid = document.querySelector('.article-more .related-grid');
  if (relatedGrid) {
    relatedGrid.innerHTML = '';
    window.ICON_NEWS.filter(item => item.slug !== article.slug).slice(0, 3).forEach(item => {
      const link = document.createElement('a');
      link.className = 'related-card';
      link.href = articleUrl(item);
      link.innerHTML = `<div class="related-image" style="background-image:url('${item.image}')"></div><span>${item.category} · ${item.time}</span><h3>${item.title}</h3>`;
      relatedGrid.appendChild(link);
    });
  }
}

function renderCategoryPage() {
  if (!window.ICON_NEWS || !document.querySelector('.category-page')) return;

  const params = new URLSearchParams(window.location.search);
  const selected = (params.get('category') || '').toUpperCase();
  const aliases = {FAMOSOS:'FAMOSOS', MUSICA:'MÚSICA', 'MÚSICA':'MÚSICA', VIRAL:'VIRAL', SERIES:'SERIES', TENDENCIAS:'TENDENCIAS', INTERNET:'INTERNET', CREADORES:'CREADORES', GAMING:'GAMING', STREAMERS:'STREAMERS', CULTURA:'CULTURA'};
  const normalized = aliases[selected] || selected;
  const heading = document.querySelector('.category-intro h1');
  const intro = document.querySelector('.category-intro p');
  const result = document.querySelector('#categoryResults');

  document.querySelectorAll('.category-card').forEach(card => {
    const category = card.dataset.category;
    if (category) card.href = `categorias.html?category=${encodeURIComponent(category)}`;
  });

  document.querySelectorAll('.category-card').forEach(card => {
    const category = (card.dataset.category || '').toUpperCase();
    const count = window.ICON_NEWS.filter(article => article.category === category).length;
    const small = card.querySelector('small');
    if (small) small.textContent = small.textContent.replace(/\d+ ·/, `${String(count).padStart(2,'0')} ·`);
  });

  if (!result) return;

  const filtered = normalized ? window.ICON_NEWS.filter(article => article.category === normalized) : window.ICON_NEWS;
  if (normalized) {
    if (heading) heading.textContent = normalized;
    if (intro) intro.textContent = `Notas de ICON MEDIA sobre ${normalized.toLowerCase()}. Abre una historia para leerla completa.`;
  }

  result.innerHTML = '';
  if (!filtered.length) {
    result.innerHTML = '<div class="category-empty">Todavía no hay notas en esta categoría. Explora otra sección.</div>';
    return;
  }

  filtered.forEach(article => {
    const card = document.createElement('a');
    card.className = 'category-story';
    card.href = articleUrl(article);
    card.innerHTML = `<div class="category-story-image" style="background-image:url("${article.image}")"><span>${article.category}</span></div><div><small>${article.date} · ${article.read}</small><h3>${article.title}</h3><p>${article.deck}</p></div><strong>↗</strong>`;
    result.appendChild(card);
  });
}

function initSearch() {
  if (!searchButton || !searchDialog) return;
  searchButton.addEventListener('click', () => {
    if (typeof searchDialog.showModal === 'function') searchDialog.showModal();
    setTimeout(() => searchInput?.focus(), 50);
  });
  searchInput?.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    const results = document.getElementById('searchResults');
    if (!results || !window.ICON_NEWS) return;
    if (!q) { results.innerHTML = '<p>Escribe una palabra para buscar en ICON.</p>'; return; }
    const matches = window.ICON_NEWS.filter(a => [a.title,a.homeTitle,a.deck,a.category].join(' ').toLowerCase().includes(q)).slice(0,6);
    results.innerHTML = matches.length
      ? matches.map(a => `<a href="${articleUrl(a)}"><small>${a.category}</small><strong>${a.title}</strong></a>`).join('')
      : '<p>No encontramos notas con esa búsqueda.</p>';
  });
}
  
function initNewsletter() {
  if (!newsletterForm) return;
  newsletterForm.addEventListener('submit', event => {
    event.preventDefault();
    const input = newsletterForm.querySelector('input');
    const button = newsletterForm.querySelector('button');
    const email = input.value.trim();
    if (!email || !input.checkValidity()) { input.reportValidity(); return; }
    localStorage.setItem('icon-newsletter-email', email);
    button.textContent = '✓';
    button.disabled = true;
    input.value = '';
    input.placeholder = '¡Ya estás dentro!';
  });
}

function initMobileTicker() {
  const ticker = document.getElementById('ticker');
  if (!ticker) return;
  let offset = 0;
  setInterval(() => {
    if (window.innerWidth <= 650) {
      offset -= 0.55;
      ticker.style.transform = `translateX(${offset}px)`;
      if (Math.abs(offset) > Math.max(500, ticker.scrollWidth / 2)) offset = 0;
    }
  }, 40);
}

renderHome();
renderArticlePage();
renderCategoryPage();
initSearch();
initNewsletter();
initMobileTicker();

document.querySelectorAll('.story, .trend-compact>a').forEach((card, index) => {
  card.style.animationDelay = `${index * 45}ms`;
});

let deferredInstallPrompt = null;
window.addEventListener('beforeinstallprompt', event => {
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
window.addEventListener('appinstalled', () => { deferredInstallPrompt = null; document.querySelector('.install-app')?.remove(); });

async function initIconFeed() {
  const grid = document.getElementById('iconFeedGrid');
  const status = document.getElementById('iconFeedStatus');
  if (!grid) return;

  const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'
  }[char]));

  try {
    const response = await fetch('/api/youtube-feed', { headers: { Accept: 'application/json' } });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'No se pudo cargar el feed.');
    if (!data.videos?.length) {
      grid.innerHTML = '<div class="icon-feed-empty">Todavía no hay Shorts publicados.</div>';
      return;
    }

    window.ICON_FEED_VIDEOS = data.videos;

    grid.innerHTML = data.videos.map((video, index) => {
      const title = escapeHtml(video.title);
      const date = video.publishedAt
        ? new Intl.DateTimeFormat('es-MX', { day:'numeric', month:'short', year:'numeric' }).format(new Date(video.publishedAt))
        : '';

      return '<article class="icon-feed-card" data-feed-index="' + index + '">' +
        '<div class="icon-feed-video" role="button" tabindex="0" data-feed-index="' + index + '" aria-label="Abrir Short: ' + title + '">' +
          '<img src="' + escapeHtml(video.thumbnail) + '" alt="' + title + '" loading="lazy" decoding="async">' +
          '<span class="icon-feed-overlay"><span class="icon-feed-play">▶</span><small>SHORT</small><em>VER</em></span>' +
        '</div>' +
        '<div class="icon-feed-copy"><span>ICON MEDIA · ' + escapeHtml(date) + '</span><h3>' + title + '</h3></div>' +
      '</article>';
    }).join('');

    grid.querySelectorAll('.icon-feed-video').forEach(box => {
      const open = () => openIconVideo(Number(box.dataset.feedIndex));
      box.addEventListener('click', open);
      box.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          open();
        }
      });
    });

    if (status) status.textContent = data.videos.length + ' Shorts recientes · toca un Short para verlo';
  } catch (error) {
    grid.innerHTML = '<div class="icon-feed-empty">No pudimos cargar los Shorts ahora. Intenta de nuevo en unos minutos.</div>';
    if (status) status.textContent = '';
    console.error('ICON FEED:', error);
  }
}

let iconFeedIndex = 0;
// Intentamos entrar con sonido. En móviles el navegador puede bloquear autoplay con audio.
let iconFeedMuted = false;

function openIconVideo(index) {
  const videos = window.ICON_FEED_VIDEOS || [];
  if (!videos.length) return;
  iconFeedIndex = Math.max(0, Math.min(index, videos.length - 1));
  let dialog = document.getElementById('iconVideoDialog');
  if (!dialog) {
    dialog = document.createElement('dialog');
    dialog.id = 'iconVideoDialog';
    dialog.className = 'icon-video-dialog';
    dialog.innerHTML = '<div class="icon-video-modal"><button class="icon-video-close" type="button" aria-label="Cerrar">×</button><div class="icon-video-top"><span><b>ICON</b> FEED</span><button class="icon-video-sound" type="button" aria-label="Activar sonido">🔇</button></div><div class="icon-video-track"></div><button class="icon-video-prev" type="button" aria-label="Video anterior">↑</button><button class="icon-video-next" type="button" aria-label="Siguiente video">↓</button><div class="icon-video-hint">DESLIZA ↑ ↓</div></div>';
    document.body.appendChild(dialog);
    dialog.querySelector('.icon-video-close').addEventListener('click', closeIconVideo);
    dialog.querySelector('.icon-video-sound').addEventListener('click', toggleIconVideoAudio);
    dialog.querySelector('.icon-video-prev').addEventListener('click', () => changeIconVideo(-1));
    dialog.querySelector('.icon-video-next').addEventListener('click', () => changeIconVideo(1));
    let wheelLocked = false;
    dialog.addEventListener('wheel', event => {
      if (Math.abs(event.deltaY) <= 20 || wheelLocked) return;
      event.preventDefault();
      wheelLocked = true;
      changeIconVideo(event.deltaY > 0 ? 1 : -1);
      window.setTimeout(() => { wheelLocked = false; }, 520);
    }, { passive: false });
    dialog.addEventListener('click', event => { if (event.target === dialog) closeIconVideo(); });
  }
  // No reiniciamos el estado del audio al abrir/cambiar el visor.
  renderIconVideo();
  if (typeof dialog.showModal === 'function' && !dialog.open) dialog.showModal();
}

function renderIconVideo() {
  const dialog = document.getElementById('iconVideoDialog');
  const videos = window.ICON_FEED_VIDEOS || [];
  if (!dialog || !videos[iconFeedIndex]) return;

  const video = videos[iconFeedIndex];
  const track = dialog.querySelector('.icon-video-track');
  const sound = dialog.querySelector('.icon-video-sound');
  const safeTitle = String(video.title || 'Short de ICON MEDIA').replace(/"/g, '&quot;');
  const iframeSrc = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(video.id) +
    '?autoplay=1&mute=' + (iconFeedMuted ? '1' : '0') +
    '&playsinline=1&controls=1&rel=0&iv_load_policy=3&enablejsapi=1&origin=' +
    encodeURIComponent(window.location.origin);

  // Solo recreamos el iframe al cambiar de Short. El botón de audio usa
  // postMessage para no recargar el video ni dejarlo en Play.
  track.innerHTML = '<div class="icon-video-slide"><iframe title="' + safeTitle +
    '" src="' + iframeSrc +
    '" allow="autoplay; encrypted-media; picture-in-picture; web-share" allowfullscreen></iframe></div>';

  let gesture = track.querySelector('.icon-video-gesture');
  if (!gesture) {
    gesture = document.createElement('div');
    gesture.className = 'icon-video-gesture';
    gesture.setAttribute('aria-hidden', 'true');
    track.appendChild(gesture);

    let touchStartY = 0;
    let touchStartX = 0;
    let touchLocked = false;

    gesture.addEventListener('touchstart', event => {
      if (touchLocked) return;
      const touch = event.changedTouches[0];
      touchStartY = touch.clientY;
      touchStartX = touch.clientX;
    }, { passive: true });

    gesture.addEventListener('touchend', event => {
      if (touchLocked) return;
      const touch = event.changedTouches[0];
      const dy = touch.clientY - touchStartY;
      const dx = touch.clientX - touchStartX;

      if (Math.abs(dy) < 55 || Math.abs(dy) <= Math.abs(dx)) return;

      touchLocked = true;
      changeIconVideo(dy < 0 ? 1 : -1);
      window.setTimeout(() => { touchLocked = false; }, 520);
    }, { passive: true });
  }

  const iframe = track.querySelector('iframe');
  if (iframe && !iconFeedMuted) {
    iframe.addEventListener('load', () => {
      sendYouTubeCommand('unMute');
      sendYouTubeCommand('playVideo');
    }, { once: true });
  }

  sound.textContent = iconFeedMuted ? '🔇' : '🔊';
  sound.setAttribute('aria-label', iconFeedMuted ? 'Activar sonido' : 'Silenciar');
  dialog.querySelector('.icon-video-prev').disabled = iconFeedIndex === 0;
  dialog.querySelector('.icon-video-next').disabled = iconFeedIndex === videos.length - 1;
}

function sendYouTubeCommand(command) {
  const iframe = document.querySelector('#iconVideoDialog .icon-video-track iframe');
  if (!iframe?.contentWindow) return;

  iframe.contentWindow.postMessage(JSON.stringify({
    event: 'command',
    func: command,
    args: []
  }), 'https://www.youtube-nocookie.com');
}

function toggleIconVideoAudio() {
  iconFeedMuted = !iconFeedMuted;

  // No reconstruimos el iframe. YouTube cambia el audio y el Short sigue
  // reproduciéndose en la misma instancia.
  sendYouTubeCommand(iconFeedMuted ? 'mute' : 'unMute');
  sendYouTubeCommand('playVideo');

  const sound = document.querySelector('.icon-video-sound');
  if (sound) {
    sound.textContent = iconFeedMuted ? '🔇' : '🔊';
    sound.setAttribute('aria-label', iconFeedMuted ? 'Activar sonido' : 'Silenciar');
  }
}
function changeIconVideo(step) {
  const videos = window.ICON_FEED_VIDEOS || [];
  const next = iconFeedIndex + step;
  if (next < 0 || next >= videos.length) return;
  iconFeedIndex = next;
  renderIconVideo();
}

function closeIconVideo() {
  const dialog = document.getElementById('iconVideoDialog');
  if (!dialog) return;
  const track = dialog.querySelector('.icon-video-track');
  if (track) track.innerHTML = '';
  if (dialog.open) dialog.close();
}

function initIconLoopButton() {
  const button = document.getElementById('iconLoopButton');
  if (!button) return;

  button.addEventListener('click', () => {
    if (window.ICON_FEED_VIDEOS?.length) {
      openIconVideo(0);
      return;
    }

    document.getElementById('iconFeed')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

initIconFeed();
initIconLoopButton();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => { navigator.serviceWorker.register('./sw.js?v=7', { updateViaCache: 'none' }).then(registration => registration.update().catch(() => {})).catch(() => {}); });
}
