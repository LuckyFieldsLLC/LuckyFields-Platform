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
    featured_projects: string;
    visit_site: string;
    view_github: string;
    filter_by_persona: string;
    filter_all: string;
    no_content: string;
    activity: string;
    categories: Record<string, string>;
    applications: string;
    media: string;
    ai_works: string;
  };
}

interface FeedItem {
  id: string;
  title: string;
  link: string;
  isoDate: string;
  contentSnippet: string;
}

async function init() {
  const [settings, projects, accounts, feedCache] = await Promise.all([
    loadData<SiteSettings>('/site_settings.json', { site_name: 'LuckyFields.Lab', default_lang: 'ja', available_langs: ['ja'] }),
    loadData<Project[]>('/projects.json', []),
    loadData<Account[]>('/accounts.json', []),
    loadData<FeedItem[]>('/.netlify/functions/get-cache?key=latest-feed', []).catch(() => []) as Promise<FeedItem[]>
  ]);

  const lang = localStorage.getItem('preferred_lang') || settings.default_lang;

  // App Shell Structure
  const app = document.querySelector<HTMLDivElement>('#app')!;
  app.innerHTML = `
    <header>
      <div class="logo">
        <a href="/">LuckyFields.Lab</a>
      </div>
      <div style="display: flex; align-items: center; gap: 1rem;">
        <select id="lang-select">
          ${settings.available_langs.map(l => `<option value="${l}" ${l === lang ? 'selected' : ''}>${l.toUpperCase()}</option>`).join('')}
        </select>
        <button class="hamburger-btn" id="menu-btn" aria-label="Menu">
          <div class="hamburger-line"></div>
          <div class="hamburger-line"></div>
          <div class="hamburger-line"></div>
        </button>
      </div>
    </header>
    
    <div id="drawer-overlay"></div>
    <aside id="drawer">
        <!-- Mobile Navigation -->
    </aside>

    <aside class="sidebar" id="sidebar">
      <!-- Desktop Navigation -->
    </aside>

    <main id="content">
      <!-- Dynamic Content Area -->
      <div id="dynamic-view"></div>
    </main>

    <footer>
      <p>© 2026 LuckyFields.LLC - All Rights Reserved.</p>
    </footer>
  `;

  const dynamicView = document.getElementById('dynamic-view')!;
  const sidebar = document.getElementById('sidebar')!;
  const drawer = document.getElementById('drawer')!;
  const drawerOverlay = document.getElementById('drawer-overlay')!;
  const menuBtn = document.getElementById('menu-btn')!;
  const langSelect = document.getElementById('lang-select') as HTMLSelectElement;

  if (langSelect) {
    langSelect.addEventListener('change', (e) => {
      const newLang = (e.target as HTMLSelectElement).value;
      localStorage.setItem('preferred_lang', newLang);
      window.location.reload();
    });
  }

  // Mobile Menu Toggle Logic
  if (menuBtn && drawer && drawerOverlay) {
    const toggleMenu = () => {
      drawer.classList.toggle('active');
      drawerOverlay.classList.toggle('active');
    };

    menuBtn.addEventListener('click', toggleMenu);
    drawerOverlay.addEventListener('click', toggleMenu);
  }

  let currentLang = lang;
  let currentFilter = 'all';

  // Navigation Menu Definition
  const menuItems = [
    { id: 'all', label: 'Dashboard', icon: '🏠' },
    { id: 'projects', label: 'Projects', icon: '📂' },
    { id: 'Applications', label: 'Applications', icon: '📱' },
    { id: 'Media', label: 'Media', icon: '🎬' },
    { id: 'Creative AI', label: 'AI Works', icon: '🤖' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  function renderSidebar() {
    const html = menuItems.map(item => `
      <div class="nav-item ${currentFilter === item.id ? 'active' : ''}" data-id="${item.id}">
        <span class="nav-icon">${item.icon}</span>
        <span>${item.label}</span>
      </div>
    `).join('');

    sidebar.innerHTML = html;

    // Also render drawer content
    drawer.innerHTML = `
      <div style="font-weight: 800; font-size: 1.25rem; margin-bottom: 2rem; padding: 0 1rem;">Menu</div>
      ${html}
    `;

    // Attach Event Listeners to both Sidebar and Drawer items
    [sidebar, drawer].forEach(container => {
      container.querySelectorAll('.nav-item').forEach(el => {
        el.addEventListener('click', () => {
          const id = el.getAttribute('data-id')!;
          currentFilter = id;
          renderUI();
          renderSidebar(); // Update active state

          // Close drawer on mobile selection
          if (container === drawer) {
            drawer.classList.remove('active');
            drawerOverlay.classList.remove('active');
          }
        });
      });
    });
  }

  function renderUI() {
    fetch(`/i18n/${currentLang}.json`).then(r => r.json()).then((dict: I18n) => {
      let html = '';

      if (currentFilter === 'all') {
        // Dashboard
        html += `<section class="featured-section">
            <h2>${dict.ui.featured_projects || 'Featured Projects'}</h2>
            <div class="grid">
                ${projects.filter(p => p.featured).map(p => renderProjectCard(p, currentLang, dict)).join('')}
            </div>
        </section>`;

        html += `<h2 class="category-title">Activity</h2>`;
        html += `<div id="feed-container">Loading...</div>`;

        // Use cached feed if available, otherwise load
        if (feedCache && feedCache.length > 0) {
          setTimeout(() => renderFeed(feedCache, 'feed-container'), 0);
        } else {
          loadFeed('feed-container');
        }
      }
      else if (currentFilter === 'projects') {
        html += `<h2 class="category-title">All Projects</h2>`;
        html += `<div class="grid">
          ${projects.map(p => renderProjectCard(p, currentLang, dict)).join('')}
        </div>`;
      }
      else if (currentFilter === 'Applications') {
        html += `<h2 class="category-title">${dict.ui.applications}</h2>`;
        const apps = accounts.filter(a => a.category === 'Applications' || a.category === 'Game Tools'); // Example mapping
        html += `<div class="grid">
            ${apps.map(a => renderAccountCard(a, dict)).join('')}
        </div>`;
      }
      else if (currentFilter === 'settings') {
        html += `<h2>Settings</h2><p style="color: var(--secondary-text); margin-top: 1rem;">Settings panel coming soon.</p>`;
      }
      else {
        // Filter by Category
        const filtered = projects.filter(p => p.category === currentFilter);
        html += `<h2 class="category-title">${currentFilter}</h2>`;
        if (filtered.length > 0) {
          html += `<div class="grid">
            ${filtered.map(p => renderProjectCard(p, currentLang, dict)).join('')}
          </div>`;
        } else {
          html += `<p style="color: var(--secondary-text);">No items found in this category.</p>`;
        }
      }
      dynamicView.innerHTML = html;
    });
  }

  renderSidebar();
  renderUI();
}

function renderFeed(data: any[], containerId: string) {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (!data || data.length === 0) {
    container.innerHTML = '<p class="muted">No recent activity.</p>';
    return;
  }
  container.innerHTML = data.slice(0, 5).map((item: any) => `
        <a href="${item.link}" target="_blank" class="feed-card">
        <div class="feed-date">${new Date(item.isoDate).toLocaleDateString()}</div>
        <div class="feed-title">${item.title}</div>
        <div class="feed-summary">${item.contentSnippet || ''}</div>
        </a>
    `).join('');
}

function loadFeed(containerId: string) {
  fetch('/.netlify/functions/rss-poll')
    .then(res => {
      if (!res.ok) throw new Error('API Error');
      return res.json();
    })
    .then(data => {
      renderFeed(data, containerId);
    })
    .catch(err => {
      const container = document.getElementById(containerId);
      if (container) container.innerHTML = `<p style="color:red">Failed to load feed.</p>`;
      console.error(err);
    });
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

// Function exported but unused, kept for future use
// @ts-ignore
function renderAccountCard(a: Account, dict: I18n) {
  return `
    <a href="${a.url}" target="_blank" class="card" style="justify-content: center; align-items: center; text-align: center;">
      <h3 style="margin-bottom: 0.5rem;">${a.title}</h3>
      <span class="tag" style="background: rgba(255, 255, 255, 0.05); color: var(--secondary-text);">${dict.ui.visit_site}</span>
    </a>
  `;
}

init();
