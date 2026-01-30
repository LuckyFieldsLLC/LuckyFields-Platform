import './style.css';

interface Project {
  id: string;
  title: string;
  category: string;
  subcategory?: string;
  persona: string[];
  featured?: boolean;
  description: Record<string, string>;
  links: { type: string; url: string }[];
  tags: string[];
}

interface Account {
  id: string;
  title: string;
  category: string;
  url: string;
  persona: string[];
  enabled: boolean;
}

interface SiteSettings {
  site_name: string;
  default_lang: string;
  available_langs: string[];
}

async function loadData<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (e) {
    console.error(`Failed to load data from ${path}:`, e);
    return fallback;
  }
}

interface I18n {
  ui: {
    featured: string;
    visit_site: string;
    view_github: string;
    filter_by_persona: string;
    filter_all: string;
    no_content: string;
    activity: string;
    categories: Record<string, string>;
  };
}

interface FeedItem {
  id: string;
  title: string;
  url: string;
  date: string;
  summary: string;
  sourceId: string;
  persona: string[];
  category: string;
}

let currentFilter = 'all';

async function init() {
  const [settings, projects, accounts, feedCache] = await Promise.all([
    loadData<SiteSettings>('/site_settings.json', { site_name: 'LuckyFields.Lab', default_lang: 'ja', available_langs: ['ja'] }),
    loadData<Project[]>('/projects.json', []),
    loadData<Account[]>('/accounts.json', []),
    loadData<FeedItem[]>('/.netlify/functions/get-cache?key=latest-feed', []).catch(() => []) as Promise<FeedItem[]>
  ]);

  const lang = localStorage.getItem('preferred_lang') || settings.default_lang;
  const dict = await loadData<I18n>(`/i18n/${lang}.json`, {
    ui: { featured: 'Featured', visit_site: 'Visit', view_github: 'GitHub', filter_by_persona: 'Filter', filter_all: 'All', no_content: 'None', activity: 'Activity', categories: {} }
  });

  const app = document.querySelector<HTMLDivElement>('#app')!;

  // Render Header
  app.innerHTML = `
    <header>
      <div class="logo"><a href="/" style="text-decoration:none; color:inherit;"><strong>${settings.site_name}</strong></a></div>
      <nav>
        <select id="lang-select">
          ${settings.available_langs.map(l => `<option value="${l}" ${l === lang ? 'selected' : ''}>${l.toUpperCase()}</option>`).join('')}
        </select>
      </nav>
    </header>
    <div id="filter-container"></div>
    <main id="content"></main>
  `;

  document.querySelector('#lang-select')?.addEventListener('change', (e) => {
    const newLang = (e.target as HTMLSelectElement).value;
    localStorage.setItem('preferred_lang', newLang);
    window.location.reload();
  });

  // Extract all personas
  const allPersonas = Array.from(new Set([
    ...projects.flatMap(p => p.persona),
    ...accounts.flatMap(a => a.persona),
    ...feedCache.flatMap(f => f.persona)
  ]));

  function renderUI() {
    const content = document.querySelector('#content')!;
    const filterContainer = document.querySelector('#filter-container')!;
    content.innerHTML = '';

    // Render Filter Bar
    filterContainer.innerHTML = `
      <div class="filter-bar">
        <span class="persona-label">${dict.ui.filter_by_persona}</span>
        <button class="filter-btn ${currentFilter === 'all' ? 'active' : ''}" data-filter="all">${dict.ui.filter_all}</button>
        ${allPersonas.map(p => `<button class="filter-btn ${currentFilter === p ? 'active' : ''}" data-filter="${p}">${p}</button>`).join('')}
      </div>
    `;

    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentFilter = btn.getAttribute('data-filter') || 'all';
        renderUI();
      });
    });

    const filteredProjects = projects.filter(p => currentFilter === 'all' || p.persona.includes(currentFilter));
    const filteredAccounts = accounts.filter(a => (currentFilter === 'all' || a.persona.includes(currentFilter)) && a.enabled);
    const filteredFeed = feedCache.filter(f => currentFilter === 'all' || f.persona.includes(currentFilter));

    // Featured Section (only if filter is 'all' or specific persona matches featured)
    const featured = filteredProjects.filter(p => p.featured);
    if (featured.length > 0) {
      const featuredEl = document.createElement('section');
      featuredEl.className = 'featured-section';
      featuredEl.innerHTML = `
        <h2>${dict.ui.featured}</h2>
        <div class="grid">
          ${featured.map(p => renderProjectCard(p, lang, dict)).join('')}
        </div>
      `;
      content.appendChild(featuredEl);
    }

    // Activity / Feed Section
    if (filteredFeed.length > 0) {
      const activityEl = document.createElement('section');
      activityEl.innerHTML = `
        <h2 class="category-title">${dict.ui.activity}</h2>
        <div class="card" style="padding:0; overflow:hidden;">
          ${filteredFeed.slice(0, 10).map(f => renderFeedCard(f)).join('')}
        </div>
      `;
      content.appendChild(activityEl);
    }

    // Categories
    const categories = ['Applications', 'Creative AI', 'Media'];
    categories.forEach(cat => {
      const catProjects = filteredProjects.filter(p => p.category === cat && !p.featured);
      const catAccounts = filteredAccounts.filter(a => a.category === cat);

      if (catProjects.length > 0 || catAccounts.length > 0) {
        const section = document.createElement('section');
        const catTitle = dict.ui.categories[cat] || cat;
        section.innerHTML = `
          <h2 class="category-title">${catTitle}</h2>
          <div class="grid">
            ${catProjects.map(p => renderProjectCard(p, lang, dict)).join('')}
            ${catAccounts.map(a => renderAccountCard(a, dict)).join('')}
          </div>
        `;
        content.appendChild(section);
      }
    });

    if (content.innerHTML === '') {
      content.innerHTML = `<p class="muted">${dict.ui.no_content}</p>`;
    }
  }

  renderUI();
}

function renderFeedCard(f: FeedItem) {
  const date = new Date(f.date).toLocaleDateString();
  return `
    <a href="${f.url}" target="_blank" class="feed-card">
      <div class="feed-date">${date}</div>
      <div class="feed-title">${f.title}</div>
      <div class="feed-summary">${f.summary}</div>
    </a>
  `;
}

function renderProjectCard(p: Project, lang: string, dict: I18n) {
  const desc = p.description[lang] || p.description['en'] || Object.values(p.description)[0] || '';
  return `
    <div class="card">
      <div style="margin-bottom: 0.5rem; display: flex; gap: 0.5rem;">
        ${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}
      </div>
      <h3>${p.title}</h3>
      <p>${desc}</p>
      <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
        ${p.links.map(l => {
    const label = l.type === 'github' ? dict.ui.view_github : dict.ui.visit_site;
    const icon = l.type === 'github' ? '📦' : '🔗';
    return `<a href="${l.url}" target="_blank" class="tag" style="background: rgba(59, 130, 246, 0.1); border-color: rgba(59, 130, 246, 0.2); color: #60a5fa; font-weight: 600;">${icon} ${label}</a>`;
  }).join('')}
      </div>
    </div>
  `;
}

function renderAccountCard(a: Account, dict: I18n) {
  return `
    <a href="${a.url}" target="_blank" class="card" style="justify-content: center; align-items: center; text-align: center;">
      <h3 style="margin-bottom: 0.5rem;">${a.title}</h3>
      <span class="tag" style="background: rgba(255, 255, 255, 0.05); color: var(--secondary-text);">${dict.ui.visit_site}</span>
    </a>
  `;
}

init();
