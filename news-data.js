window.ICON_NEWS = [
  {
    slug: 'nodal-vuelve-a-ser-tendencia',
    category: 'FAMOSOS',
    title: 'Nodal vuelve a ser tendencia y las redes tienen mucho que decir',
    deck: 'La conversación no se detiene y las redes ya tienen sus propias teorías.',
    body: [
      'La conversación alrededor del cantante volvió a crecer en redes y rápidamente pasó de publicación en publicación.',
      'En ICON MEDIA seguimos la historia desde lo que está confirmado hasta las reacciones que están dominando el feed.',
      'Por ahora, la conversación continúa creciendo y las redes ya tienen sus propias teorías.'
    ],
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1600&q=90',
    time: 'HACE 32 MIN',
    date: '9 SEPT 2026',
    read: '3 MIN DE LECTURA',
    author: 'Redacción ICON',
    featured: true
  },
  {
    slug: 'cancion-favorita-tiktok',
    category: 'MÚSICA',
    title: 'Esta canción ya es la nueva favorita de todos en TikTok',
    deck: 'El audio comenzó a aparecer en miles de videos y la conversación no deja de crecer.',
    body: ['Un audio puede tardar semanas en despegar o convertirse en tendencia en cuestión de horas.', 'Esta canción está entrando en esa segunda categoría: aparece en nuevos videos, edits y conversaciones todos los días.'],
    image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1600&q=90',
    time: 'HACE 1 HORA', date: '9 SEPT 2026', read: '3 MIN DE LECTURA', author: 'Redacción ICON'
  },
  {
    slug: 'trend-random-del-mes',
    category: 'VIRAL',
    title: 'El trend más random del mes: ¿por qué todos lo están haciendo?',
    deck: 'Internet encontró una nueva obsesión y nadie parece saber cómo empezó.',
    body: ['Primero apareció en pequeños grupos. Después llegó al feed de todo el mundo.', 'La fórmula de los trends cambia constantemente, pero este tiene algo que internet reconoce de inmediato: es fácil de copiar y difícil de ignorar.'],
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=90',
    time: 'HACE 2 HORAS', date: '9 SEPT 2026', read: '3 MIN DE LECTURA', author: 'Redacción ICON'
  },
  {
    slug: 'serie-del-momento',
    category: 'SERIES',
    title: 'La serie que está dominando y de la que todos hablan',
    deck: 'El estreno ya está provocando teorías, memes y conversaciones en redes.',
    body: ['Hay series que se ven y series que se convierten en conversación.', 'Esta está haciendo ambas cosas: cada episodio deja nuevas teorías y el internet se encarga del resto.'],
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=90',
    time: 'HACE 3 HORAS', date: '9 SEPT 2026', read: '4 MIN DE LECTURA', author: 'Redacción ICON'
  },
  {
    slug: 'teoria-nueva-era',
    category: 'TENDENCIAS',
    title: 'Internet ya tiene una teoría sobre la nueva era de las redes',
    deck: 'Una nueva conversación está creciendo entre creadores, usuarios y marcas.',
    body: ['Las plataformas cambian y con ellas cambia la manera en que consumimos contenido.', 'La nueva conversación gira alrededor de qué viene después y de cómo los creadores están adaptándose.'],
    image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=1200&q=90',
    time: 'HACE 2 HORAS', date: '9 SEPT 2026', read: '3 MIN DE LECTURA', author: 'Redacción ICON'
  },
  {
    slug: 'posible-colaboracion',
    category: 'FAMOSOS',
    title: '¿Se viene una nueva colaboración? Internet ya empezó a especular',
    deck: 'Una interacción en redes fue suficiente para disparar las teorías.',
    body: ['Una publicación breve bastó para que los usuarios empezaran a conectar pistas.', 'Todavía no hay confirmación, así que en ICON separamos la especulación de lo que realmente está confirmado.'],
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=90',
    time: 'HACE 4 HORAS', date: '9 SEPT 2026', read: '2 MIN DE LECTURA', author: 'Redacción ICON'
  },
  {
    slug: 'netflix-confirma',
    category: 'SERIES',
    title: 'Netflix confirma lo que todos esperaban',
    deck: 'El anuncio ya provocó una nueva ola de comentarios y teorías.',
    body: ['El anuncio llegó y las redes reaccionaron inmediatamente.', 'Ahora la conversación se concentra en lo que sigue y en las pistas que dejó el anuncio.'],
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=90',
    time: 'HACE 6 HORAS', date: '9 SEPT 2026', read: '3 MIN DE LECTURA', author: 'Redacción ICON'
  },
  {
    slug: 'tendencia-en-feeds',
    category: 'VIRAL',
    title: 'TikTok vuelve a poner esta tendencia en el centro de la conversación',
    deck: 'El formato reapareció y rápidamente empezó a llenar los feeds.',
    body: ['Los trends en redes rara vez desaparecen para siempre.', 'A veces solo necesitan una nueva versión, un nuevo audio o un creador que los vuelva a poner en circulación.'],
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200&q=90',
    time: 'HACE 18 MIN', date: '9 SEPT 2026', read: '3 MIN DE LECTURA', author: 'Redacción ICON'
  }
];

window.getIconNews = function (slug) {
  return window.ICON_NEWS.find(article => article.slug === slug) || window.ICON_NEWS[0];
};