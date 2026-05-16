/* ═══════════════════════════════════════════════════════════
   SmartDash — app.js  (No Login Required)
   Handles: Routing, Portals, Favorites, Search,
            Theme, QR Generator, AI Chat, Admin Panel
═══════════════════════════════════════════════════════════ */

'use strict';

// ── App State ──────────────────────────────────────────────
const STATE = {
  user: { name: 'Explorer', role: 'user' },
  isDark: true,
  favorites: JSON.parse(localStorage.getItem('sd_favorites') || '[]'),
  recent:    JSON.parse(localStorage.getItem('sd_recent')    || '[]'),
  currentPage: 'dashboard',
  adminEditId: null,
};

// ── DEFAULT Portal Data (built-in, cannot be deleted) ─────
const DEFAULT_PORTALS = {
  government: [
    { id:'aadhaar',    name:'Aadhaar',       url:'https://uidai.gov.in',               icon:'🪪', color:'#ff8f00' },
    { id:'pan',        name:'PAN Portal',    url:'https://www.incometax.gov.in',       icon:'📄', color:'#1565c0' },
    { id:'digilocker', name:'DigiLocker',    url:'https://digilocker.gov.in',          icon:'🔒', color:'#2e7d32' },
    { id:'passport',   name:'Passport Seva', url:'https://passportindia.gov.in',      icon:'🛂', color:'#4527a0' },
    { id:'incometax',  name:'Income Tax',    url:'https://www.incometax.gov.in',       icon:'💰', color:'#00695c' },
    { id:'gst',        name:'GST Portal',    url:'https://www.gst.gov.in',             icon:'🧾', color:'#e65100' },
    { id:'epfo',       name:'EPFO',          url:'https://www.epfindia.gov.in',        icon:'👷', color:'#1a237e' },
    { id:'irctc',      name:'IRCTC',         url:'https://www.irctc.co.in',            icon:'🚆', color:'#b71c1c' },
  ],
  banking: [
    { id:'sbi',     name:'SBI',        url:'https://onlinesbi.sbi',          icon:'🏛️', color:'#1565c0' },
    { id:'hdfc',    name:'HDFC Bank',  url:'https://www.hdfcbank.com',       icon:'🔷', color:'#e53935' },
    { id:'icici',   name:'ICICI Bank', url:'https://www.icicibank.com',      icon:'🔶', color:'#ef6c00' },
    { id:'axis',    name:'Axis Bank',  url:'https://www.axisbank.com',       icon:'🔴', color:'#880e4f' },
    { id:'gpay',    name:'Google Pay', url:'https://pay.google.com',         icon:'💳', color:'#4285f4' },
    { id:'phonepe', name:'PhonePe',    url:'https://www.phonepe.com',        icon:'📱', color:'#5f259f' },
    { id:'paytm',   name:'Paytm',      url:'https://paytm.com',              icon:'💵', color:'#002970' },
    { id:'bhim',    name:'BHIM UPI',   url:'https://www.bhimupi.org.in',     icon:'🇮🇳', color:'#ff6f00' },
  ],
  education: [
    { id:'nptel',    name:'NPTEL',        url:'https://nptel.ac.in',            icon:'📚', color:'#1b5e20' },
    { id:'swayam',   name:'SWAYAM',       url:'https://swayam.gov.in',          icon:'🧑‍🎓', color:'#4a148c' },
    { id:'nsp',      name:'Scholarship',  url:'https://scholarships.gov.in',    icon:'🏅', color:'#e65100' },
    { id:'diksha',   name:'DIKSHA',       url:'https://diksha.gov.in',          icon:'🏫', color:'#1565c0' },
    { id:'khan',     name:'Khan Academy', url:'https://www.khanacademy.org',    icon:'🦉', color:'#14bf96' },
    { id:'coursera', name:'Coursera',     url:'https://www.coursera.org',       icon:'🎯', color:'#0056d2' },
  ],
  tools: [
    { id:'converter', name:'File Converter', url:'https://cloudconvert.com',        icon:'🔄', color:'#00838f', tool:true },
    { id:'compress',  name:'PDF Compressor', url:'https://smallpdf.com',            icon:'📦', color:'#ad1457', tool:true },
    { id:'resize',    name:'Image Resizer',  url:'https://imageresizer.com',        icon:'🖼️', color:'#558b2f', tool:true },
    { id:'qr',        name:'QR Generator',  url:'#',                                icon:'📲', color:'#6a1b9a', tool:true, action:'showQR' },
    { id:'merger',    name:'PDF Merger',     url:'https://smallpdf.com/merge-pdf',  icon:'📑', color:'#0277bd', tool:true },
    { id:'ocr',       name:'OCR Scanner',   url:'https://www.onlineocr.net',        icon:'🔍', color:'#f57f17', tool:true },
    { id:'color',     name:'Color Picker',  url:'https://coolors.co',               icon:'🎨', color:'#c62828', tool:true },
    { id:'word',      name:'Word Counter',  url:'https://wordcounter.net',           icon:'📝', color:'#37474f', tool:true },
  ],
  ai: [
    { id:'claude',     name:'Claude AI',  url:'https://claude.ai',              icon:'🧠', color:'#cc785c' },
    { id:'chatgpt',    name:'ChatGPT',    url:'https://chat.openai.com',        icon:'💬', color:'#10a37f' },
    { id:'gemini',     name:'Gemini',     url:'https://gemini.google.com',      icon:'✨', color:'#4285f4' },
    { id:'midjourney', name:'Midjourney', url:'https://www.midjourney.com',     icon:'🎨', color:'#7c3aed' },
    { id:'copilot',    name:'MS Copilot', url:'https://copilot.microsoft.com',  icon:'🤝', color:'#0078d4' },
    { id:'perplexity', name:'Perplexity', url:'https://www.perplexity.ai',      icon:'🔮', color:'#1fb8cd' },
  ],
  daily: [
    { id:'gmail',    name:'Gmail',        url:'https://mail.google.com',        icon:'📧', color:'#d93025' },
    { id:'gdrive',   name:'Google Drive', url:'https://drive.google.com',       icon:'☁️', color:'#1a73e8' },
    { id:'youtube',  name:'YouTube',      url:'https://youtube.com',            icon:'▶️', color:'#ff0000' },
    { id:'whatsapp', name:'WhatsApp Web', url:'https://web.whatsapp.com',       icon:'💬', color:'#25d366' },
    { id:'calendar', name:'Calendar',     url:'https://calendar.google.com',    icon:'📅', color:'#1a73e8' },
    { id:'notion',   name:'Notion',       url:'https://notion.so',              icon:'📋', color:'#666'    },
    { id:'github',   name:'GitHub',       url:'https://github.com',             icon:'🐙', color:'#24292e' },
    { id:'linkedin', name:'LinkedIn',     url:'https://linkedin.com',           icon:'💼', color:'#0077b5' },
  ],
};

// ── PORTALS = DEFAULT + custom from localStorage ──────────
let CUSTOM_PORTALS = JSON.parse(localStorage.getItem('sd_custom_portals') || '[]');
let CUSTOM_CATEGORIES = JSON.parse(localStorage.getItem('sd_custom_cats') || '[]');

// Build merged PORTALS object
function buildPortals() {
  // Deep-clone defaults
  const merged = {};
  Object.keys(DEFAULT_PORTALS).forEach(cat => {
    merged[cat] = [...DEFAULT_PORTALS[cat]];
  });
  // Add custom categories
  CUSTOM_CATEGORIES.forEach(cat => {
    if (!merged[cat.id]) merged[cat.id] = [];
  });
  // Add custom portals
  CUSTOM_PORTALS.forEach(portal => {
    if (!merged[portal.category]) merged[portal.category] = [];
    // Update if exists (edit), else push
    const idx = merged[portal.category].findIndex(p => p.id === portal.id);
    if (idx !== -1) merged[portal.category][idx] = portal;
    else merged[portal.category].push(portal);
  });
  return merged;
}

let PORTALS = buildPortals();

function getAllPortalsFlat() {
  return Object.entries(PORTALS).flatMap(([cat, items]) =>
    items.map(p => ({ ...p, category: cat }))
  );
}

// ── Category metadata ──────────────────────────────────────
const DEFAULT_CAT_META = {
  government: { label:'🏛️ Government Services', icon:'🏛️', desc:'Access Indian government portals securely', builtin:true },
  banking:    { label:'🏦 Banking Services',     icon:'🏦', desc:'Net banking, UPI and payment portals',      builtin:true },
  education:  { label:'🎓 Education Portals',    icon:'🎓', desc:'Online learning and academic resources',    builtin:true },
  tools:      { label:'🛠️ Utility Tools',        icon:'🛠️', desc:'File converters and productivity tools',   builtin:true },
  ai:         { label:'🤖 AI Hub',               icon:'🤖', desc:'Access top AI tools and assistants',       builtin:true },
  daily:      { label:'🌐 Daily Use',            icon:'🌐', desc:'Your everyday digital tools',              builtin:true },
};

function getCatMeta(catId) {
  if (DEFAULT_CAT_META[catId]) return DEFAULT_CAT_META[catId];
  const custom = CUSTOM_CATEGORIES.find(c => c.id === catId);
  if (custom) return { label: `${custom.icon} ${custom.name}`, icon: custom.icon, desc: custom.desc || '', builtin: false };
  return { label: catId, icon: '🔗', desc: '', builtin: false };
}

// ── Notifications ──────────────────────────────────────────
const NOTIFICATIONS = [
  { icon:'🔔', title:'Welcome to SmartDash!',     text:'No login needed — your workspace is ready.', time:'Just now', unread:true },
  { icon:'🏛️', title:'Income Tax deadline',        text:'ITR filing deadline: July 31, 2025.',         time:'1 hr ago',    unread:true },
  { icon:'📊', title:'New AI tools added',         text:'Perplexity AI is now available in AI Hub.',   time:'Yesterday',   unread:false },
  { icon:'🇮🇳', title:'New government scheme',     text:'PM Awas Yojana 2025 applications open.',      time:'2 days ago',  unread:false },
];

// ── AI Responses ───────────────────────────────────────────
const AI_RESPONSES = [
  "To access Aadhaar services, visit uidai.gov.in. You can update your address, download e-Aadhaar, and link your mobile number.",
  "For income tax filing (ITR), go to incometax.gov.in. You'll need your PAN, Aadhaar, and Form 16 from your employer.",
  "IRCTC train bookings can be done at irctc.co.in. Create an account and book tickets up to 120 days in advance.",
  "DigiLocker stores your government documents digitally. Link your Aadhaar to get your driving licence, vehicle registration, and more.",
  "For UPI payments, apps like Google Pay, PhonePe, and BHIM are linked to your bank. Enter the UPI ID or scan a QR code.",
  "NPTEL offers free certified online courses from IITs and IISc. Great for engineering and technical certifications.",
  "To open a bank account online (zero-balance), try SBI's YONO app or HDFC's digital account opening.",
  "I'm here to help you navigate India's digital services! Ask me about government portals, banking, or education.",
];

// ── Canvas Particle Background ─────────────────────────────
function initCanvas() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  for (let i = 0; i < 80; i++) {
    particles.push({ x:Math.random()*W, y:Math.random()*H, r:Math.random()*1.5+0.3,
      vx:(Math.random()-0.5)*0.2, vy:(Math.random()-0.5)*0.2, a:Math.random()*0.6+0.1 });
  }
  function draw() {
    ctx.clearRect(0,0,W,H);
    particles.forEach(p => {
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0)p.x=W; if(p.x>W)p.x=0; if(p.y<0)p.y=H; if(p.y>H)p.y=0;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle = STATE.isDark ? `rgba(160,200,255,${p.a})` : `rgba(99,102,241,${p.a*0.5})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// ── Portal Card ────────────────────────────────────────────
function createPortalCard(portal, delay = 0) {
  const isFav = STATE.favorites.includes(portal.id);
  const card = document.createElement('a');
  card.className = 'portal-card';
  card.href = portal.url === '#' ? 'javascript:void(0)' : portal.url;
  card.target = portal.url === '#' ? '_self' : '_blank';
  card.rel = 'noopener noreferrer';
  card.style.cssText = `--card-color:${portal.color}; animation-delay:${delay}ms`;
  card.dataset.id = portal.id;
  card.innerHTML = `
    <div class="card-dot"></div>
    <div class="card-shadow"></div>
    <div class="card-icon">${portal.icon}</div>
    <div class="card-name">${portal.name}</div>
    <button class="fav-btn ${isFav?'active':''}" title="Add to favorites"
      onclick="toggleFav(event,'${portal.id}')">⭐</button>
  `;
  card.addEventListener('click', e => {
    if (e.target.classList.contains('fav-btn')) return;
    addRecent(portal);
    if (portal.action === 'showQR') {
      document.getElementById('qrPanel').style.display = 'block';
      document.getElementById('qrPanel').scrollIntoView({ behavior:'smooth' });
    }
  });
  return card;
}

function renderGrid(gridId, portals) {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  grid.innerHTML = '';
  portals.forEach((p, i) => grid.appendChild(createPortalCard(p, i * 40)));
}

function renderAllPortals() {
  renderGrid('govGrid',   PORTALS.government || []);
  renderGrid('bankGrid',  PORTALS.banking    || []);
  renderGrid('eduGrid',   PORTALS.education  || []);
  renderGrid('toolGrid',  PORTALS.tools      || []);
  renderGrid('aiGrid',    PORTALS.ai         || []);
  renderGrid('dailyGrid', PORTALS.daily      || []);
  updateDashboardCounts();
}

function updateDashboardCounts() {
  const s = el => document.getElementById(el);
  if(s('countGov'))   s('countGov').textContent   = (PORTALS.government||[]).length;
  if(s('countBank'))  s('countBank').textContent  = (PORTALS.banking   ||[]).length;
  if(s('countTools')) s('countTools').textContent = (PORTALS.tools     ||[]).length;
  if(s('countAI'))    s('countAI').textContent    = (PORTALS.ai        ||[]).length;
}

function renderDashboardPreview() {
  const container = document.getElementById('allCategoriesPreview');
  if (!container) return;
  container.innerHTML = '';
  const categories = [
    { key:'government', page:'government' },
    { key:'banking',    page:'banking'    },
    { key:'ai',         page:'ai'         },
    { key:'daily',      page:'daily'      },
  ];
  categories.forEach(cat => {
    const meta = getCatMeta(cat.key);
    const section = document.createElement('div');
    section.className = 'category-section';
    section.innerHTML = `
      <div class="section-header">
        <h2 class="section-title">${meta.label}</h2>
        <a class="see-all" onclick="switchPage('${cat.page}',document.querySelector('[data-page=${cat.page}]'))">See all →</a>
      </div>
    `;
    const grid = document.createElement('div');
    grid.className = 'portal-grid';
    (PORTALS[cat.key] || []).slice(0, 4).forEach((p, i) => grid.appendChild(createPortalCard(p, i * 40)));
    section.appendChild(grid);
    container.appendChild(section);
  });
}

// ── Favorites ──────────────────────────────────────────────
function toggleFav(e, id) {
  e.preventDefault(); e.stopPropagation();
  const btn = e.currentTarget;
  const idx = STATE.favorites.indexOf(id);
  if (idx === -1) { STATE.favorites.push(id); btn.classList.add('active'); showToast('⭐ Added to favorites!'); }
  else { STATE.favorites.splice(idx, 1); btn.classList.remove('active'); showToast('🗑️ Removed from favorites'); }
  document.querySelectorAll('.fav-btn').forEach(b => {
    const card = b.closest('.portal-card');
    if (card && card.dataset.id === id) b.classList.toggle('active', STATE.favorites.includes(id));
  });
  localStorage.setItem('sd_favorites', JSON.stringify(STATE.favorites));
  renderFavorites(); updateFavCount();
  document.getElementById('statFav').textContent = `${STATE.favorites.length} Favorites`;
  const infoFav = document.getElementById('infoFavCount');
  if (infoFav) infoFav.textContent = STATE.favorites.length;
}

function renderFavorites() {
  const grid = document.getElementById('favGrid');
  grid.innerHTML = '';
  if (!STATE.favorites.length) { grid.innerHTML = '<div class="empty-state">No favorites yet. Click ⭐ on any portal card to add!</div>'; return; }
  getAllPortalsFlat().filter(p => STATE.favorites.includes(p.id)).forEach((p,i) => grid.appendChild(createPortalCard(p, i*40)));
}

function updateFavCount() {
  const badge = document.getElementById('favCount');
  badge.textContent = STATE.favorites.length;
  badge.classList.toggle('visible', STATE.favorites.length > 0);
}

// ── Recent ─────────────────────────────────────────────────
function addRecent(portal) {
  STATE.recent = STATE.recent.filter(p => p.id !== portal.id);
  STATE.recent.unshift(portal);
  STATE.recent = STATE.recent.slice(0, 8);
  localStorage.setItem('sd_recent', JSON.stringify(STATE.recent));
  renderRecent();
  document.getElementById('statRecent').textContent = `${STATE.recent.length} Recent`;
}

function renderRecent() {
  const grid = document.getElementById('recentGrid');
  grid.innerHTML = '';
  if (!STATE.recent.length) { grid.innerHTML = '<div class="empty-state">No recent activity yet. Start exploring!</div>'; return; }
  STATE.recent.forEach((p,i) => grid.appendChild(createPortalCard(p, i*30)));
}

// ── Search ─────────────────────────────────────────────────
let searchTimeout;
function handleSearch(query) {
  clearTimeout(searchTimeout);
  const resultsEl = document.getElementById('searchResults');
  if (!query.trim()) { resultsEl.classList.remove('open'); return; }
  searchTimeout = setTimeout(() => {
    const q = query.toLowerCase();
    const matches = getAllPortalsFlat().filter(p =>
      p.name.toLowerCase().includes(q) || p.category.includes(q)
    ).slice(0, 8);
    if (!matches.length) {
      resultsEl.innerHTML = '<p style="color:var(--muted);padding:12px 0">No results found.</p>';
    } else {
      resultsEl.innerHTML = matches.map(p => `
        <a class="search-result-item" href="${p.url}" target="_blank" rel="noopener"
           onclick="addRecent(${JSON.stringify(p).replace(/"/g,'&quot;')});document.getElementById('globalSearch').value='';document.getElementById('searchResults').classList.remove('open')">
          <span class="sr-icon">${p.icon}</span>
          <div><div class="sr-name">${p.name}</div><div class="sr-cat">${capitalize(p.category)}</div></div>
        </a>`).join('');
    }
    resultsEl.classList.add('open');
  }, 200);
}

document.addEventListener('click', e => {
  if (!e.target.closest('.search-bar') && !e.target.closest('.search-results'))
    document.getElementById('searchResults').classList.remove('open');
});
document.addEventListener('keydown', e => {
  if ((e.ctrlKey||e.metaKey) && e.key==='k') { e.preventDefault(); document.getElementById('globalSearch').focus(); }
  if (e.key==='Escape') { document.getElementById('searchResults').classList.remove('open'); document.getElementById('globalSearch').blur(); }
});

// ── Page Routing ───────────────────────────────────────────
function switchPage(pageId, navEl) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const page = document.getElementById(`page-${pageId}`);
  if (page) page.classList.add('active');
  if (navEl) navEl.classList.add('active');
  else { const nav = document.querySelector(`[data-page="${pageId}"]`); if(nav) nav.classList.add('active'); }
  STATE.currentPage = pageId;
  if (window.innerWidth < 900) document.getElementById('sidebar').classList.remove('open');
  document.getElementById('searchResults').classList.remove('open');
  // Refresh admin stats when opening admin
  if (pageId === 'admin') { renderAdminTable(); renderAdminStats(); renderCategoryList(); }
}

function toggleSidebar() { document.getElementById('sidebar').classList.toggle('open'); }

// ── Theme Toggle ───────────────────────────────────────────
function toggleTheme() {
  STATE.isDark = !STATE.isDark;
  document.body.classList.toggle('dark-mode', STATE.isDark);
  document.body.classList.toggle('light-mode', !STATE.isDark);
  document.getElementById('themeBtn').textContent = STATE.isDark ? '🌙' : '☀️';
  const darkToggle = document.getElementById('darkToggle');
  if (darkToggle) darkToggle.checked = STATE.isDark;
  localStorage.setItem('sd_theme', STATE.isDark ? 'dark' : 'light');
}

// ── Notifications ──────────────────────────────────────────
function renderNotifications() {
  document.getElementById('notifList').innerHTML = NOTIFICATIONS.map(n => `
    <div class="notif-item ${n.unread?'notif-unread':''}">
      <div class="notif-icon">${n.icon}</div>
      <div class="notif-text">
        <div class="notif-title">${n.title}</div>
        <div style="color:var(--text2);font-size:13px;margin-top:3px">${n.text}</div>
        <div class="notif-time">${n.time}</div>
      </div>
    </div>`).join('');
}

// ── Date/Time ──────────────────────────────────────────────
function updateDateTime() {
  const now = new Date();
  const hour = now.getHours();
  document.getElementById('greeting').textContent = hour<12?'Morning':hour<17?'Afternoon':'Evening';
  document.getElementById('currentDateTime').textContent =
    now.toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' });
}

// ── QR Generator ───────────────────────────────────────────
function showQR() { document.getElementById('qrPanel').style.display = 'block'; }
function generateQR() {
  const text = document.getElementById('qrInput').value.trim();
  if (!text) { showToast('⚠️ Enter text or URL to generate QR'); return; }
  const encoded = encodeURIComponent(text);
  document.getElementById('qrOutput').innerHTML = `
    <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encoded}" alt="QR Code" style="width:200px;height:200px"/>
    <p style="margin-top:10px;color:var(--muted);font-size:12px">Right-click to save QR code</p>`;
  showToast('✅ QR Code generated!');
}

// ── AI Chat ────────────────────────────────────────────────
function openAIChat() { document.getElementById('aiModal').classList.add('open'); }
function closeAIModal(e) { if(e.target.id==='aiModal') document.getElementById('aiModal').classList.remove('open'); }
function sendAIMsg() {
  const input = document.getElementById('aiInput');
  const msg = input.value.trim();
  if (!msg) return;
  input.value = '';
  const messages = document.getElementById('aiMessages');
  const userDiv = document.createElement('div');
  userDiv.className = 'ai-msg user-msg';
  userDiv.textContent = msg;
  messages.appendChild(userDiv);
  const typingDiv = document.createElement('div');
  typingDiv.className = 'ai-msg bot-msg';
  typingDiv.textContent = '⏳ Thinking…';
  messages.appendChild(typingDiv);
  messages.scrollTop = messages.scrollHeight;
  setTimeout(() => {
    typingDiv.textContent = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
    messages.scrollTop = messages.scrollHeight;
  }, 900);
}

// ── Compact View ───────────────────────────────────────────
function toggleCompact(checkbox) {
  document.querySelectorAll('.portal-card').forEach(card => { card.style.padding = checkbox.checked ? '12px 10px' : ''; });
  document.querySelectorAll('.portal-grid').forEach(g => { g.style.gridTemplateColumns = checkbox.checked ? 'repeat(auto-fill, minmax(110px, 1fr))' : ''; });
}

// ── Clear Data ─────────────────────────────────────────────
function clearData() {
  if (!confirm('Clear all favorites and recent history?')) return;
  STATE.favorites = []; STATE.recent = [];
  localStorage.removeItem('sd_favorites'); localStorage.removeItem('sd_recent');
  renderFavorites(); renderRecent(); updateFavCount();
  document.getElementById('statFav').textContent = '0 Favorites';
  document.getElementById('statRecent').textContent = '0 Recent';
  showToast('🗑️ Data cleared!');
  renderAllPortals(); renderDashboardPreview();
}

// ── Edit Profile ───────────────────────────────────────────
function editProfile() {
  const name = prompt('Enter your display name:', STATE.user.name || '');
  if (name && name.trim()) {
    const trimmed = name.trim();
    STATE.user.name = trimmed;
    const initials = trimmed.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase();
    document.getElementById('userName').textContent = trimmed.split(' ')[0];
    document.getElementById('userAvatar').textContent = initials;
    document.getElementById('profileAvatar').textContent = initials;
    document.getElementById('profileName').textContent = trimmed;
    document.getElementById('welcomeName').textContent = trimmed.split(' ')[0];
    localStorage.setItem('sd_username', trimmed);
    showToast('✅ Name updated!');
  }
}

// ── Toast ──────────────────────────────────────────────────
let toastTimeout;
function showToast(msg) {
  let toast = document.getElementById('sdToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'sdToast';
    Object.assign(toast.style, {
      position:'fixed', bottom:'24px', right:'24px',
      background:'var(--glass-strong)', backdropFilter:'blur(20px)',
      border:'1.5px solid var(--border)', borderRadius:'12px',
      padding:'12px 20px', color:'var(--text)', fontSize:'14px',
      fontWeight:'600', zIndex:'999', transition:'all 0.3s',
      boxShadow:'var(--shadow-lg)', transform:'translateY(80px)',
      opacity:'0', fontFamily:"'Outfit', sans-serif",
    });
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.transform = 'translateY(0)';
  toast.style.opacity = '1';
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => { toast.style.transform = 'translateY(80px)'; toast.style.opacity = '0'; }, 2800);
}

function capitalize(str) { return str.charAt(0).toUpperCase() + str.slice(1); }

// ══════════════════════════════════════════════════════════
//  🛡️  ADMIN PANEL FUNCTIONS
// ══════════════════════════════════════════════════════════

// ── Admin Tab Switching ────────────────────────────────────
function showAdminTab(tabId, btn) {
  document.querySelectorAll('.admin-tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`admin-tab-${tabId}`).classList.add('active');
  btn.classList.add('active');
  if (tabId === 'stats') renderAdminStats();
  if (tabId === 'categories') renderCategoryList();
}

// ── Live Preview ───────────────────────────────────────────
function updatePreview() {
  const name  = document.getElementById('adminName').value  || 'Website Name';
  const icon  = document.getElementById('adminIcon').value  || '🌐';
  const color = document.getElementById('adminColor').value || '#4fc3f7';
  document.getElementById('previewName').textContent = name;
  document.getElementById('previewIcon').textContent = icon;
  document.getElementById('previewCard').style.setProperty('--card-color', color);
}

function setColor(hex) {
  document.getElementById('adminColor').value = hex;
  updatePreview();
}

// ── Save / Add Link ────────────────────────────────────────
function adminSaveLink() {
  const name     = document.getElementById('adminName').value.trim();
  const url      = document.getElementById('adminUrl').value.trim();
  const icon     = document.getElementById('adminIcon').value.trim() || '🌐';
  const category = document.getElementById('adminCategory').value;
  const color    = document.getElementById('adminColor').value || '#4fc3f7';
  const desc     = document.getElementById('adminDesc').value.trim();
  const editId   = document.getElementById('adminEditId').value;

  if (!name) { showAdminMsg('adminFormMsg', '⚠️ Please enter a website name.', 'error'); return; }
  if (!url)  { showAdminMsg('adminFormMsg', '⚠️ Please enter a website URL.',  'error'); return; }
  if (!url.startsWith('http') && url !== '#') { showAdminMsg('adminFormMsg', '⚠️ URL must start with https://', 'error'); return; }

  if (editId) {
    // Edit existing custom portal
    const idx = CUSTOM_PORTALS.findIndex(p => p.id === editId);
    if (idx !== -1) {
      CUSTOM_PORTALS[idx] = { ...CUSTOM_PORTALS[idx], name, url, icon, category, color, desc };
    }
    showAdminMsg('adminFormMsg', '✅ Link updated successfully!', 'success');
  } else {
    // Check for duplicate
    const allFlat = getAllPortalsFlat();
    const isDup = allFlat.some(p => p.url.toLowerCase() === url.toLowerCase());
    if (isDup) { showAdminMsg('adminFormMsg', '⚠️ This URL already exists in the dashboard.', 'error'); return; }

    const newPortal = {
      id: 'custom_' + Date.now(),
      name, url, icon, category, color, desc,
      custom: true,
      addedAt: new Date().toISOString(),
    };
    CUSTOM_PORTALS.push(newPortal);
    showAdminMsg('adminFormMsg', `✅ "${name}" added to ${capitalize(category)}!`, 'success');
  }

  saveCustomPortals();
  adminClearForm();
  renderAdminTable();
  renderAllPortals();
  renderDashboardPreview();
  updateDashboardCounts();
  updateAdminCategoryOptions();
}

function saveCustomPortals() {
  localStorage.setItem('sd_custom_portals', JSON.stringify(CUSTOM_PORTALS));
  PORTALS = buildPortals();
}

// ── Clear Admin Form ───────────────────────────────────────
function adminClearForm() {
  document.getElementById('adminName').value     = '';
  document.getElementById('adminUrl').value      = '';
  document.getElementById('adminIcon').value     = '';
  document.getElementById('adminColor').value    = '#4fc3f7';
  document.getElementById('adminDesc').value     = '';
  document.getElementById('adminEditId').value   = '';
  document.getElementById('adminFormTitle').textContent = '➕ Add New Website Link';
  document.getElementById('adminSaveBtn').innerHTML = '<span>💾 Save Link</span>';
  document.getElementById('adminFormMsg').textContent = '';
  updatePreview();
}

// ── Edit a portal ──────────────────────────────────────────
function adminEditPortal(id) {
  // Find portal in CUSTOM_PORTALS
  const portal = CUSTOM_PORTALS.find(p => p.id === id);
  if (!portal) { showToast('⚠️ Built-in links cannot be edited. Only custom links can be edited.'); return; }

  document.getElementById('adminName').value     = portal.name;
  document.getElementById('adminUrl').value      = portal.url;
  document.getElementById('adminIcon').value     = portal.icon;
  document.getElementById('adminCategory').value = portal.category;
  document.getElementById('adminColor').value    = portal.color;
  document.getElementById('adminDesc').value     = portal.desc || '';
  document.getElementById('adminEditId').value   = portal.id;
  document.getElementById('adminFormTitle').textContent = `✏️ Edit: ${portal.name}`;
  document.getElementById('adminSaveBtn').innerHTML = '<span>✏️ Update Link</span>';
  updatePreview();
  // Switch to links tab and scroll to form
  showAdminTab('links', document.querySelector('.admin-tab-btn'));
  document.querySelector('.admin-form-card').scrollIntoView({ behavior:'smooth' });
}

// ── Delete a portal ────────────────────────────────────────
function adminDeletePortal(id) {
  const isDefault = getAllDefaultIds().includes(id);
  if (isDefault) { showToast('🔒 Built-in portals cannot be deleted.'); return; }
  if (!confirm('Delete this link?')) return;
  CUSTOM_PORTALS = CUSTOM_PORTALS.filter(p => p.id !== id);
  saveCustomPortals();
  renderAdminTable();
  renderAllPortals();
  renderDashboardPreview();
  updateDashboardCounts();
  showToast('🗑️ Link deleted.');
}

function getAllDefaultIds() {
  return Object.values(DEFAULT_PORTALS).flat().map(p => p.id);
}

// ── Render Admin Table ─────────────────────────────────────
function renderAdminTable(filter = '', catFilter = '') {
  const tbody = document.getElementById('adminLinksBody');
  const allPortals = getAllPortalsFlat();
  const defaultIds = getAllDefaultIds();

  let filtered = allPortals;
  if (filter) {
    const q = filter.toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.url.toLowerCase().includes(q));
  }
  if (catFilter) filtered = filtered.filter(p => p.category === catFilter);

  document.getElementById('adminLinkCount').textContent = filtered.length;
  const emptyEl = document.getElementById('adminTableEmpty');

  if (!filtered.length) {
    tbody.innerHTML = '';
    emptyEl.style.display = 'flex';
    return;
  }
  emptyEl.style.display = 'none';

  tbody.innerHTML = filtered.map(p => {
    const isBuiltin = defaultIds.includes(p.id);
    return `
      <tr>
        <td><span style="font-size:22px">${p.icon}</span></td>
        <td><strong>${p.name}</strong>${p.desc?`<br><span style="color:var(--muted);font-size:12px">${p.desc}</span>`:''}</td>
        <td><a href="${p.url}" target="_blank" rel="noopener" class="admin-url-link">${p.url.replace('https://','').substring(0,30)}${p.url.length>37?'…':''}</a></td>
        <td><span class="cat-badge">${getCatMeta(p.category).icon} ${capitalize(p.category)}</span></td>
        <td><span class="color-preview" style="background:${p.color}" title="${p.color}"></span></td>
        <td><span class="source-badge ${isBuiltin?'source-builtin':'source-custom'}">${isBuiltin?'Built-in':'Custom'}</span></td>
        <td class="admin-actions">
          ${!isBuiltin?`<button class="admin-action-btn edit-btn" onclick="adminEditPortal('${p.id}')" title="Edit">✏️</button>`:''}
          ${!isBuiltin?`<button class="admin-action-btn del-btn" onclick="adminDeletePortal('${p.id}')" title="Delete">🗑️</button>`:''}
          ${isBuiltin?'<span style="color:var(--muted);font-size:12px">Protected</span>':''}
        </td>
      </tr>`;
  }).join('');
}

function filterAdminLinks() {
  const search = document.getElementById('adminSearch').value;
  const cat    = document.getElementById('adminFilterCat').value;
  renderAdminTable(search, cat);
}

// ── Admin Stats ────────────────────────────────────────────
function renderAdminStats() {
  const overview = document.getElementById('adminStatsOverview');
  const allPortals = getAllPortalsFlat();
  const customCount = CUSTOM_PORTALS.length;
  const defaultCount = getAllDefaultIds().length;

  overview.innerHTML = `
    <div class="stats-row" style="margin-bottom:24px">
      <div class="stat-card glass-card">
        <div class="stat-icon" style="background:#4fc3f722">🔗</div>
        <div><div class="stat-num">${allPortals.length}</div><div class="stat-lbl">Total Links</div></div>
      </div>
      <div class="stat-card glass-card">
        <div class="stat-icon" style="background:#66bb6a22">✨</div>
        <div><div class="stat-num">${customCount}</div><div class="stat-lbl">Custom Added</div></div>
      </div>
      <div class="stat-card glass-card">
        <div class="stat-icon" style="background:#ab47bc22">🏛️</div>
        <div><div class="stat-num">${defaultCount}</div><div class="stat-lbl">Built-in Links</div></div>
      </div>
      <div class="stat-card glass-card">
        <div class="stat-icon" style="background:#ffa72622">📂</div>
        <div><div class="stat-num">${Object.keys(PORTALS).length}</div><div class="stat-lbl">Categories</div></div>
      </div>
    </div>`;

  // Bar chart
  const barChart = document.getElementById('statsBarChart');
  barChart.innerHTML = '';
  const maxCount = Math.max(...Object.values(PORTALS).map(v => v.length), 1);
  Object.entries(PORTALS).forEach(([cat, portals]) => {
    const meta = getCatMeta(cat);
    const pct = (portals.length / maxCount) * 100;
    barChart.innerHTML += `
      <div class="bar-row">
        <div class="bar-label">${meta.icon} ${capitalize(cat)}</div>
        <div class="bar-track">
          <div class="bar-fill" style="width:${pct}%;background:var(--accent)"></div>
        </div>
        <div class="bar-count">${portals.length}</div>
      </div>`;
  });

  // Recently added custom portals
  const recentAdded = document.getElementById('statsRecentAdded');
  const sorted = [...CUSTOM_PORTALS].sort((a,b) => new Date(b.addedAt||0) - new Date(a.addedAt||0)).slice(0,5);
  if (!sorted.length) {
    recentAdded.innerHTML = '<p style="color:var(--muted);padding:12px 0;font-size:14px">No custom links added yet. Go to Manage Links to add your first portal.</p>';
  } else {
    recentAdded.innerHTML = sorted.map(p => `
      <div class="recent-added-item">
        <span style="font-size:22px">${p.icon}</span>
        <div style="flex:1">
          <div style="font-weight:700;font-size:14px">${p.name}</div>
          <div style="color:var(--muted);font-size:12px">${capitalize(p.category)} • ${p.addedAt ? new Date(p.addedAt).toLocaleDateString('en-IN') : 'Recently'}</div>
        </div>
        <a href="${p.url}" target="_blank" rel="noopener" style="color:var(--accent);font-size:12px">Visit →</a>
      </div>`).join('');
  }
}

// ── Category Management ────────────────────────────────────
function addCategory() {
  const name = document.getElementById('catName').value.trim();
  const icon = document.getElementById('catIcon').value.trim() || '🔗';
  const desc = document.getElementById('catDesc').value.trim();

  if (!name) { showAdminMsg('catFormMsg', '⚠️ Please enter a category name.', 'error'); return; }

  const id = 'cat_' + name.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now();
  const existing = CUSTOM_CATEGORIES.find(c => c.name.toLowerCase() === name.toLowerCase());
  if (existing || DEFAULT_CAT_META[name.toLowerCase()]) {
    showAdminMsg('catFormMsg', '⚠️ A category with this name already exists.', 'error');
    return;
  }

  CUSTOM_CATEGORIES.push({ id, name, icon, desc });
  localStorage.setItem('sd_custom_cats', JSON.stringify(CUSTOM_CATEGORIES));
  PORTALS = buildPortals();

  document.getElementById('catName').value = '';
  document.getElementById('catIcon').value = '';
  document.getElementById('catDesc').value = '';

  showAdminMsg('catFormMsg', `✅ Category "${name}" added!`, 'success');
  renderCategoryList();
  updateAdminCategoryOptions();
}

function deleteCategory(id) {
  if (!confirm('Delete this category? All its custom links will also be removed.')) return;
  CUSTOM_CATEGORIES = CUSTOM_CATEGORIES.filter(c => c.id !== id);
  CUSTOM_PORTALS = CUSTOM_PORTALS.filter(p => p.category !== id);
  localStorage.setItem('sd_custom_cats', JSON.stringify(CUSTOM_CATEGORIES));
  saveCustomPortals();
  renderCategoryList();
  renderAdminTable();
  renderAllPortals();
  updateAdminCategoryOptions();
  showToast('🗑️ Category deleted.');
}

function renderCategoryList() {
  const list = document.getElementById('categoryList');
  if (!list) return;
  const builtins = Object.entries(DEFAULT_CAT_META).map(([id, meta]) => ({
    id, name: capitalize(id), icon: meta.icon, builtin: true,
    count: (PORTALS[id]||[]).length,
  }));
  const customs = CUSTOM_CATEGORIES.map(c => ({
    ...c, builtin: false, count: (PORTALS[c.id]||[]).length,
  }));
  const all = [...builtins, ...customs];
  list.innerHTML = all.map(cat => `
    <div class="cat-list-item">
      <span style="font-size:22px">${cat.icon}</span>
      <div style="flex:1">
        <div style="font-weight:700;font-size:14px">${cat.name}</div>
        <div style="color:var(--muted);font-size:12px">${cat.count} links · ${cat.builtin?'Built-in':'Custom'}</div>
      </div>
      ${!cat.builtin ? `<button class="admin-action-btn del-btn" onclick="deleteCategory('${cat.id}')" title="Delete">🗑️</button>` : '<span class="source-badge source-builtin">Protected</span>'}
    </div>`).join('');
}

function updateAdminCategoryOptions() {
  const sel = document.getElementById('adminCategory');
  const filterSel = document.getElementById('adminFilterCat');
  if (!sel) return;
  // Keep built-ins, add custom categories
  const customOpts = CUSTOM_CATEGORIES.map(c => `<option value="${c.id}">${c.icon} ${c.name}</option>`).join('');
  sel.querySelectorAll('.custom-cat-opt').forEach(o => o.remove());
  sel.insertAdjacentHTML('beforeend', customOpts.split('</option>').map(o => {
    if (!o) return '';
    return o + ' class="custom-cat-opt"</option>';
  }).join(''));

  // Also update filter select
  if (filterSel) {
    filterSel.querySelectorAll('.custom-cat-opt').forEach(o => o.remove());
    CUSTOM_CATEGORIES.forEach(c => {
      const opt = new Option(`${c.icon} ${c.name}`, c.id);
      opt.className = 'custom-cat-opt';
      filterSel.appendChild(opt);
    });
  }
}

// ── Import / Export ────────────────────────────────────────
function exportLinks() {
  const allPortals = getAllPortalsFlat();
  const data = JSON.stringify(allPortals, null, 2);
  downloadFile('smartdash-links.json', data, 'application/json');
  showToast('📤 Links exported as JSON!');
}

function exportCSV() {
  const allPortals = getAllPortalsFlat();
  const header = 'Name,URL,Icon,Category,Color\n';
  const rows = allPortals.map(p => `"${p.name}","${p.url}","${p.icon}","${p.category}","${p.color}"`).join('\n');
  downloadFile('smartdash-links.csv', header + rows, 'text/csv');
  showToast('📊 Links exported as CSV!');
}

function downloadFile(filename, content, type) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], { type }));
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

function importLinks(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      if (!Array.isArray(data)) throw new Error('Expected an array of links.');
      let added = 0;
      data.forEach(p => {
        if (!p.name || !p.url || !p.category) return;
        const exists = getAllPortalsFlat().some(ex => ex.url === p.url);
        if (exists) return;
        CUSTOM_PORTALS.push({
          id: 'import_' + Date.now() + '_' + Math.random().toString(36).substr(2,5),
          name: p.name, url: p.url, icon: p.icon || '🌐',
          category: p.category, color: p.color || '#4fc3f7',
          desc: p.desc || '', custom: true,
          addedAt: new Date().toISOString(),
        });
        added++;
      });
      saveCustomPortals();
      renderAllPortals(); renderAdminTable(); renderDashboardPreview();
      document.getElementById('importMsg').textContent = `✅ Imported ${added} links!`;
      document.getElementById('importMsg').className = 'admin-msg admin-msg-success';
      showToast(`✅ Imported ${added} new links!`);
    } catch(err) {
      document.getElementById('importMsg').textContent = '❌ Invalid file format. Please use a valid JSON export.';
      document.getElementById('importMsg').className = 'admin-msg admin-msg-error';
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}

function resetToDefault() {
  if (!confirm('This will remove ALL custom links you added. Built-in links stay. Continue?')) return;
  CUSTOM_PORTALS = [];
  localStorage.removeItem('sd_custom_portals');
  PORTALS = buildPortals();
  renderAllPortals(); renderAdminTable(); renderDashboardPreview(); updateDashboardCounts();
  showToast('♻️ Reset to default portals.');
}

function bulkAddLinks() {
  const raw = document.getElementById('bulkJson').value.trim();
  const msgEl = document.getElementById('bulkMsg');
  if (!raw) { msgEl.textContent = '⚠️ Please paste JSON data first.'; msgEl.className = 'admin-msg admin-msg-error'; return; }
  try {
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) throw new Error();
    let added = 0;
    data.forEach(p => {
      if (!p.name || !p.url || !p.category) return;
      CUSTOM_PORTALS.push({
        id: 'bulk_' + Date.now() + '_' + Math.random().toString(36).substr(2,5),
        name: p.name, url: p.url, icon: p.icon || '🌐',
        category: p.category, color: p.color || '#4fc3f7',
        desc: p.desc || '', custom: true,
        addedAt: new Date().toISOString(),
      });
      added++;
    });
    saveCustomPortals();
    renderAllPortals(); renderAdminTable(); renderDashboardPreview(); updateDashboardCounts();
    document.getElementById('bulkJson').value = '';
    msgEl.textContent = `✅ Added ${added} links successfully!`;
    msgEl.className = 'admin-msg admin-msg-success';
    showToast(`✅ Bulk added ${added} links!`);
  } catch {
    msgEl.textContent = '❌ Invalid JSON. Check the format and try again.';
    msgEl.className = 'admin-msg admin-msg-error';
  }
}

function showAdminMsg(elId, msg, type) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.textContent = msg;
  el.className = `admin-msg admin-msg-${type}`;
  setTimeout(() => { el.textContent = ''; el.className = 'admin-msg'; }, 4000);
}

// ── Init ───────────────────────────────────────────────────
(function init() {
  // Theme
  const savedTheme = localStorage.getItem('sd_theme');
  if (savedTheme === 'light') {
    STATE.isDark = false;
    document.body.classList.replace('dark-mode', 'light-mode');
    document.getElementById('themeBtn').textContent = '☀️';
    const dt = document.getElementById('darkToggle');
    if (dt) dt.checked = false;
  }

  // Saved username
  const savedName = localStorage.getItem('sd_username');
  if (savedName) {
    STATE.user.name = savedName;
    const initials = savedName.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase();
    document.getElementById('userName').textContent        = savedName.split(' ')[0];
    document.getElementById('userAvatar').textContent      = initials;
    document.getElementById('profileAvatar').textContent   = initials;
    document.getElementById('profileName').textContent     = savedName;
    document.getElementById('welcomeName').textContent     = savedName.split(' ')[0];
  }

  document.getElementById('joinDate').textContent =
    new Date().toLocaleDateString('en-IN', { year:'numeric', month:'long', day:'numeric' });
  document.getElementById('infoFavCount').textContent = STATE.favorites.length;

  renderAllPortals();
  renderFavorites();
  renderRecent();
  renderNotifications();
  renderDashboardPreview();
  renderAdminTable();
  updateFavCount();
  updateDateTime();
  setInterval(updateDateTime, 1000);
  initCanvas();
  document.getElementById('statFav').textContent    = `${STATE.favorites.length} Favorites`;
  document.getElementById('statRecent').textContent = `${STATE.recent.length} Recent`;

  // Live preview listeners
  document.getElementById('adminIcon').addEventListener('input', updatePreview);
  document.getElementById('adminName').addEventListener('input', updatePreview);
  document.getElementById('adminColor').addEventListener('input', updatePreview);
})();
