// --- APP STATE ---
let state = {
  videos: (() => {
    const saved = localStorage.getItem("aghuse_videos");
    return saved ? JSON.parse(saved) : INITIAL_VIDEOS;
  })(),
  manuais: (() => {
    const saved = localStorage.getItem("aghuse_manuais");
    return saved ? JSON.parse(saved) : INITIAL_MANUAIS;
  })(),
  noticias: (() => {
    const saved = localStorage.getItem("aghuse_noticias");
    return saved ? JSON.parse(saved) : INITIAL_NOTICIAS;
  })(),
  feedbacks: (() => {
    const saved = localStorage.getItem("aghuse_feedbacks");
    return saved ? JSON.parse(saved) : INITIAL_FEEDBACKS;
  })(),
  estatisticas: {
    acessos: 1420,
    views: 489,
    online: 24
  },
  theme: localStorage.getItem("aghuse_theme") || 'dark-slate',
  showSoftLighting: true,
  activeMenu: 'inicio', // 'inicio' | 'videos' | 'manuais'
  activeModFilter: 'TODOS',
  activeManualFilter: 'TODOS',
  searchQuery: "",
  currentHeroIndex: 0,
  activePlayVideo: null, // { video, idx }
  videoPlayMode: 'video', // 'video' | 'simulator'
  showFeedbackModal: false,
  showSuporteModal: false,
  showAdminModal: false,
  isAdminAuthenticated: false,
  isEditMode: false,
  isVideoSimulating: false,
  simStep: 0,
  playerMute: false,
  playerSpeed: 1,

  // Admin form inputs
  adminUser: "",
  adminPass: "",
  newVideoTitle: "",
  newVideoFile: "",
  newVideoCapa: "",
  newVideoModulo: "INTERNACAO",
  newManualTitle: "",
  newManualFile: "",
  newManualCapa: "",
  newManualModulo: "INTERNACAO",
  newNoticiaTexto: "",

  // Feedback form inputs
  feedNome: "",
  feedSetor: "",
  feedTexto: ""
};

// --- SIMULATED WALKTHROUGH STEPS ---
const VIDEO_STEPS = [
  { title: "Acessar o Painel Principal", text: "Clique no menu lateral esquerdo e selecione a seção desejada." },
  { title: "Pesquisar Paciente pelo Prontuário", text: "Informe o número de registro de 8 dígitos ou use o cartão do SUS do paciente." },
  { title: "Verificar Pendências Clínicas", text: "Observe o indicador de cor verde para evoluções completas e vermelho para pendências." },
  { title: "Salvar Dados e Imprimir", text: "Para consolidar e imprimir a etiqueta de identificação ou o boletim definitivo." }
];

// --- CORE LOCALSTORAGE SYNCERS ---
function saveToStorage() {
  localStorage.setItem("aghuse_videos", JSON.stringify(state.videos));
  localStorage.setItem("aghuse_manuais", JSON.stringify(state.manuais));
  localStorage.setItem("aghuse_noticias", JSON.stringify(state.noticias));
  localStorage.setItem("aghuse_feedbacks", JSON.stringify(state.feedbacks));
  localStorage.setItem("aghuse_theme", state.theme);
}

// --- DYNAMIC HELPERS FOR DESIGN BADGES & COLORS ---
function getModNameLocalized(mod) {
  switch(mod) {
    case 'INTERNACAO': return "🏥 Internação";
    case 'EMERGENCIA': return "🚨 Emergência";
    case 'EXAMES': return "🔬 Exames";
    case 'SADT': return "🔬 Exames/SADT";
    case 'AMBULATORIO': return "📅 Ambulatório";
    case 'ESTOQUE': return "📦 Estoque";
    case 'FATURAMENTO': return "💰 Faturamento";
    default: return mod;
  }
}

function getModColorBadgeClass(mod) {
  switch(mod) {
    case 'INTERNACAO': return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    case 'EMERGENCIA': return "bg-rose-500/10 text-rose-400 border-rose-500/30";
    case 'EXAMES': case 'SADT': return "bg-blue-500/10 text-blue-400 border-blue-500/30";
    case 'AMBULATORIO': return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
    case 'ESTOQUE': return "bg-sky-500/10 text-sky-400 border-sky-500/30";
    case 'FATURAMENTO': return "bg-indigo-500/10 text-indigo-400 border-indigo-500/30";
    default: return "bg-gray-500/10 text-gray-400 border-gray-500/30";
  }
}

function getThemeClass() {
  switch (state.theme) {
    case 'dark-aurora':
      return "bg-gradient-to-tr from-[#0b0c13] via-[#120f26] to-[#0c1424] text-slate-100 selection:bg-purple-500/30";
    case 'light-slate':
      return "bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] text-slate-800 selection:bg-emerald-500/20";
    case 'dark-slate':
    default:
      return "bg-gradient-to-tr from-[#0a0d14] via-[#0f141f] to-[#121b2a] text-slate-100 selection:bg-emerald-500/30";
  }
}

function getCardBgClass() {
  if (state.theme === 'light-slate') {
    return "bg-white/85 backdrop-blur-md border border-slate-200/60 shadow-realistic-light hover:border-emerald-300";
  }
  return "bg-[#111827]/75 backdrop-blur-md border border-slate-800/80 shadow-realistic-lg hover:border-emerald-500/50";
}

function getPlaceholderImgStyle(titulo) {
  const colors = [
    "from-emerald-600 to-teal-900",
    "from-indigo-600 to-sky-900",
    "from-rose-600 to-orange-900",
    "from-blue-600 to-purple-900",
    "from-teal-600 to-indigo-900",
    "from-cyan-600 to-emerald-950"
  ];
  const index = Math.abs(titulo.charCodeAt(0) + (titulo.charCodeAt(1) || 0)) % colors.length;
  return colors[index];
}

// --- STATE MANAGEMENT TRIGGERS (Re-render) ---
function setState(changes) {
  state = { ...state, ...changes };
  saveToStorage();
  renderApp();
}

// --- ONLINE COUNTER SIMULATION ---
setInterval(() => {
  setState({
    estatisticas: {
      ...state.estatisticas,
      online: Math.max(12, state.estatisticas.online + Math.floor(Math.random() * 5) - 2)
    }
  });
}, 7000);

// --- AUTO-PLAY HERO CAROUSEL ---
let heroInterval = setInterval(triggerHeroSlide, 8500);
function resetHeroInterval() {
  clearInterval(heroInterval);
  heroInterval = setInterval(triggerHeroSlide, 8500);
}
function triggerHeroSlide() {
  if (state.activeMenu !== 'inicio') return;
  const topCount = Math.min(5, state.videos.length);
  if (topCount > 0) {
    setState({ currentHeroIndex: (state.currentHeroIndex + 1) % topCount });
  }
}

// --- INTERACTIVE ACTIONS ---
function handleScroll(rowId, direction) {
  const el = document.getElementById(rowId);
  if (el) {
    const amount = direction === 'left' ? -380 : 380;
    el.scrollBy({ left: amount, behavior: "smooth" });
  }
}

function incrementVideoViews(originalIdx) {
  const copy = [...state.videos];
  if (copy[originalIdx]) {
    copy[originalIdx] = {
      ...copy[originalIdx],
      views: (copy[originalIdx].views || 0) + 1
    };
    setState({ videos: copy });
  }
}

// --- RENDERING ENGINE (DOM SYNCS) ---
function renderApp() {
  const appContainer = document.getElementById("aghuse-app");
  if (!appContainer) return;

  // Apply Theme Classes to overall App Wrapper
  appContainer.className = `min-h-screen pb-24 md:pb-0 font-sans transition-colors duration-700 relative overflow-x-hidden ${getThemeClass()}`;

  // 1. Render Ambient glow particles
  renderAmbientGlow();

  // 2. Render Sticky Navigation Header
  renderNavbar();

  // 3. Render Mural Scroll Letreiro
  renderNewsTicker();

  // 4. Render Main Content Section
  renderMainContent();

  // 5. Render Modals Container
  renderModals();

  // 6. Render Mobile Navigation
  renderMobileNavbar();

  // Re-generate Lucide SVG Icons dynamic rendering
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

// --- SUB-RENDERING PARTS ---

function renderAmbientGlow() {
  const glowWrapper = document.getElementById("ambient-glow-container");
  if (!glowWrapper) return;

  if (!state.showSoftLighting) {
    glowWrapper.innerHTML = "";
    return;
  }

  if (state.theme !== 'light-slate') {
    glowWrapper.innerHTML = `
      <div class="absolute top-[-10%] left-[15%] w-[45rem] h-[45rem] rounded-full ambient-glow-emerald animate-float mix-blend-screen opacity-70"></div>
      <div class="absolute top-[35%] right-[-5%] w-[50rem] h-[50rem] rounded-full ambient-glow-blue animate-float mix-blend-screen opacity-50" style="animation-delay: 2s;"></div>
      <div class="absolute bottom-[10%] left-[-5%] w-[40rem] h-[40rem] rounded-full ambient-glow-purple animate-float mix-blend-screen opacity-45" style="animation-delay: 4s;"></div>
      <div class="absolute bottom-[-5%] right-[25%] w-[35rem] h-[35rem] rounded-full ambient-glow-amber animate-float mix-blend-screen opacity-30" style="animation-delay: 1s;"></div>
    `;
  } else {
    glowWrapper.innerHTML = `
      <div class="absolute top-[-5%] left-[10%] w-[35rem] h-[35rem] rounded-full bg-emerald-100/45 mix-blend-multiply filter blur-3xl opacity-75"></div>
      <div class="absolute top-[30%] right-[0%] w-[45rem] h-[45rem] rounded-full bg-blue-100/40 mix-blend-multiply filter blur-3xl opacity-60"></div>
      <div class="absolute bottom-[20%] left-[-5%] w-[35rem] h-[35rem] rounded-full bg-purple-100/30 mix-blend-multiply filter blur-3xl opacity-50"></div>
    `;
  }
}

function renderNavbar() {
  const navbarElement = document.getElementById("navbar-header");
  if (!navbarElement) return;

  navbarElement.className = `sticky top-0 z-[100] backdrop-blur-lg border-b transition-colors duration-500 ${
    state.theme === 'light-slate' 
      ? 'bg-white/80 border-slate-200/80 shadow-sm' 
      : 'bg-[#0f172a]/80 border-slate-800/80'
  }`;

  const navLinksHTML = `
    <li>
      <button onclick="setState({ activeMenu: 'inicio', activeModFilter: 'TODOS' })"
        class="px-3 py-2 rounded-lg transition-all cursor-pointer font-bold text-sm ${
          state.activeMenu === 'inicio' 
            ? state.theme === 'light-slate' ? 'text-emerald-600 bg-emerald-50' : 'text-emerald-400 bg-slate-800/50' 
            : 'hover:text-emerald-500 text-slate-400'
        }">
        Início
      </button>
    </li>
    <li>
      <button onclick="setState({ activeMenu: 'videos' })"
        class="px-3 py-2 rounded-lg transition-all cursor-pointer font-bold text-sm ${
          state.activeMenu === 'videos' 
            ? state.theme === 'light-slate' ? 'text-emerald-600 bg-emerald-50' : 'text-emerald-400 bg-slate-800/50' 
            : 'hover:text-emerald-500 text-slate-400'
        }">
        Vídeos Treinamento
      </button>
    </li>
    <li>
      <button onclick="setState({ activeMenu: 'manuais' })"
        class="px-3 py-2 rounded-lg transition-all cursor-pointer font-bold text-sm ${
          state.activeMenu === 'manuais' 
            ? state.theme === 'light-slate' ? 'text-emerald-600 bg-emerald-50' : 'text-emerald-400 bg-slate-800/50' 
            : 'hover:text-emerald-500 text-slate-400'
        }">
        Manuais PDF
      </button>
    </li>
    <li>
      <button onclick="setState({ showFeedbackModal: true })"
        class="px-3 py-2 rounded-lg text-amber-500 hover:text-amber-400 font-bold text-sm flex items-center gap-1 bg-amber-500/5 border border-amber-500/20 hover:border-amber-500/40 transition-all cursor-pointer">
        <i data-lucide="sparkles" class="w-3.5 h-3.5 fill-amber-500 text-amber-500"></i>
        Sugestões
      </button>
    </li>
  `;

  // Render Theme Switches Panel
  const themeControlsHTML = `
    <button title="Fundo Slate Noturno" onclick="setState({ theme: 'dark-slate' })"
      class="p-1.5 rounded-lg transition cursor-pointer ${state.theme === 'dark-slate' ? 'bg-slate-800 text-emerald-400 shadow' : 'text-slate-400 hover:text-white'}">
      <i data-lucide="moon" class="w-4 h-4"></i>
    </button>
    <button title="Fundo Aurora Cósmico" onclick="setState({ theme: 'dark-aurora' })"
      class="p-1.5 rounded-lg transition cursor-pointer ${state.theme === 'dark-aurora' ? 'bg-slate-800 text-purple-400 shadow' : 'text-slate-400 hover:text-white'}">
      <i data-lucide="sparkles" class="w-4 h-4"></i>
    </button>
    <button title="Fundo Claro Clássico" onclick="setState({ theme: 'light-slate' })"
      class="p-1.5 rounded-lg transition cursor-pointer ${state.theme === 'light-slate' ? 'bg-slate-200 text-emerald-600 shadow' : 'text-slate-500 hover:text-slate-850'}">
      <i data-lucide="sun" class="w-4 h-4"></i>
    </button>
  `;

  // Render Online Badge
  const onlineBadgeHTML = `
    <span class="relative flex h-2 w-2">
      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
      <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
    </span>
    <span>${state.estatisticas.online} online</span>
  `;

  // Render Quick Search
  const quickSearchHTML = `
    <i data-lucide="search" class="absolute left-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none"></i>
    <input type="text" value="${state.searchQuery}" oninput="setState({ searchQuery: this.value })"
      placeholder="Pesquisar..." 
      class="pl-9 pr-8 py-1.5 w-44 lg:w-56 text-xs rounded-lg outline-none transition-all duration-350 focus:w-60 ${
        state.theme === 'light-slate' 
          ? 'bg-slate-100 focus:bg-white text-slate-800 border border-slate-300 focus:ring-2 focus:ring-emerald-500' 
          : 'bg-slate-950/70 focus:bg-slate-950 text-white border border-slate-800 focus:border-emerald-500/50'
      }"
    />
    ${state.searchQuery ? `
      <button onclick="setState({ searchQuery: '' })" class="absolute right-2.5 top-2 text-slate-400 hover:text-white cursor-pointer">
        <i data-lucide="x" class="w-3.5 h-3.5"></i>
      </button>
    ` : ""}
  `;

  document.getElementById("nav-links").innerHTML = navLinksHTML;
  document.getElementById("theme-controls").innerHTML = themeControlsHTML;
  document.getElementById("quick-search").innerHTML = quickSearchHTML;
  document.getElementById("online-badge").innerHTML = onlineBadgeHTML;

  // Toggle dynamic color of online badge border
  const oBadge = document.getElementById("online-badge");
  oBadge.className = `hidden lg:flex items-center gap-2 h-7 px-3 rounded-full text-[11px] font-bold border transition-all ${
    state.theme === 'light-slate'
      ? 'bg-emerald-50/70 text-emerald-700 border-emerald-200'
      : 'bg-emerald-500/5 text-emerald-400 border-emerald-500/25'
  }`;

  // Admin button styling
  const adminBtn = document.getElementById("admin-gear-btn");
  if (adminBtn) {
    adminBtn.className = `p-1.5 rounded-lg border cursor-pointer hover:border-emerald-500 transition ${
      state.theme === 'light-slate' ? 'text-slate-700 border-slate-200' : 'text-slate-300 border-slate-800'
    }`;
  }
}

function renderNewsTicker() {
  const tickerElement = document.getElementById("news-ticker");
  if (!tickerElement) return;

  tickerElement.className = `h-11 overflow-hidden flex items-center gap-4 transition-all border-b ${
    state.theme === 'light-slate'
      ? 'bg-emerald-50/50 border-emerald-100 text-slate-800'
      : 'bg-emerald-500/5 border-emerald-950/40 text-slate-200'
  }`;

  const newsItemsHTML = state.noticias.map((n, idx) => `
    <span class="mr-24 font-semibold text-xs inline-flex items-center md:text-[13px]">
      <span class="mr-2.5 w-1.5 h-1.5 rounded-full bg-brand-green inline-block"></span>
      ${n.texto}
    </span>
  `).join("");

  document.getElementById("ticker-slider").innerHTML = newsItemsHTML;
}

function renderMainContent() {
  const contentElement = document.getElementById("main-content-view");
  if (!contentElement) return;

  // Reset Carousel auto-play check
  if (state.activeMenu !== 'inicio') {
    clearInterval(heroInterval);
  }

  if (state.activeMenu === 'inicio') {
    renderHomeView(contentElement);
  } else if (state.activeMenu === 'videos') {
    renderVideosView(contentElement);
  } else if (state.activeMenu === 'manuais') {
    renderManuaisView(contentElement);
  }
}

// --- HOME HOMEPAGE COMPONENT ---
function renderHomeView(wrapper) {
  // Sort and select top videos
  const topVideos = [...state.videos].sort((a, b) => (b.views || 0) - (a.views || 0));
  const featuredVideoHero = topVideos[state.currentHeroIndex] || state.videos[0] || null;

  // Filter videos & manuals
  const filteredVideos = state.videos.filter(v => {
    const matchesMod = state.activeModFilter === 'TODOS' || v.modulo === state.activeModFilter || (v.modulo === 'SADT' && state.activeModFilter === 'EXAMES');
    const matchesSearch = state.searchQuery === "" || 
      v.titulo.toLowerCase().includes(state.searchQuery.toLowerCase()) || 
      v.modulo.toLowerCase().includes(state.searchQuery.toLowerCase());
    return matchesMod && matchesSearch;
  });

  let heroHTML = "";
  if (featuredVideoHero) {
    const originalIdx = state.videos.indexOf(featuredVideoHero);
    
    // Ambient backlighting fallback and cover layout
    const fallbackCover = `
      <div class="absolute inset-0 bg-gradient-to-tr ${getPlaceholderImgStyle(featuredVideoHero.titulo)} opacity-70"></div>
    `;

    heroHTML = `
      <div id="hero-banner" class="relative rounded-3xl overflow-hidden aspect-[4/3] md:aspect-[21/9] flex items-center bg-slate-950 shadow-realistic-lg border border-slate-800/80 group">
        
        <div class="absolute inset-0 opacity-40 z-0 bg-cover bg-center transition-all duration-1000 group-hover:scale-105"
          style="background-image: url('trumbnail/${featuredVideoHero.capa}');">
          ${fallbackCover}
        </div>

        <div class="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent z-10"></div>

        <div class="relative z-20 px-6 sm:px-12 py-8 max-w-xl space-y-4">
          <span class="inline-flex items-center gap-1 px-3 py-1 bg-rose-600 text-[10px] font-black tracking-widest text-white uppercase rounded-md shadow-lg select-none">
            <i data-lucide="sparkles" class="w-3 h-3 fill-white text-white"></i>
            Mais Assistido da Semana
          </span>
          
          <h1 class="text-2xl sm:text-4xl font-display font-extrabold text-white leading-tight tracking-tight drop-shadow">
            Treinamento: <span class="text-brand-green">${featuredVideoHero.titulo}</span>
          </h1>
          
          <p class="text-xs sm:text-sm text-slate-300 leading-relaxed font-light line-clamp-3">
            Aprenda de maneira ágil e visual os fluxos de trabalho adequados para o módulo de <b>${getModNameLocalized(featuredVideoHero.modulo)}</b> no AGHUse. Evite erros comuns de cadastro e impulsione sua rotina assistencial ou administrativa.
          </p>

          <div class="flex flex-wrap items-center gap-3 pt-2">
            <button onclick="playVideoSelected(${originalIdx})"
              class="px-6 py-2.5 bg-brand-green hover:bg-emerald-500 text-slate-950 font-display font-black text-xs sm:text-sm rounded-xl flex items-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg shadow-emerald-950/30 cursor-pointer">
              <i data-lucide="play" class="w-4 h-4 fill-slate-950 text-slate-950"></i>
              Assistir Agora
            </button>
            
            <button onclick="setState({ showFeedbackModal: true })"
              class="px-4 py-2.5 bg-slate-900/40 hover:bg-slate-900/80 text-white font-medium text-xs sm:text-sm rounded-xl border border-slate-700/80 hover:border-slate-500 transition duration-200 cursor-pointer">
              Solicitar Outro Vídeo
            </button>
          </div>

          <div class="flex items-center gap-4 text-[11px] text-slate-400 font-medium pt-1 select-none">
            <span class="flex items-center gap-1">
              <i data-lucide="eye" class="w-3.5 h-3.5 text-emerald-400"></i>
              <b>${featuredVideoHero.views}</b> visualizações
            </span>
            <span>•</span>
            <span class="bg-slate-900/80 border border-slate-800 text-brand-green px-2 py-0.5 rounded uppercase font-bold text-[10px]">
              ${featuredVideoHero.modulo}
            </span>
            <span>•</span>
            <span class="text-slate-500 font-mono">v1.92</span>
          </div>
        </div>

        <div class="absolute right-6 bottom-6 z-20 flex items-center gap-2 select-none">
          <button onclick="slideHeroLeft()"
            class="p-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-900 transition-all cursor-pointer">
            <i data-lucide="chevron-left" class="w-4 h-4"></i>
          </button>
          ${Array.from({ length: Math.min(5, state.videos.length) }).map((_, i) => `
            <button onclick="setState({ currentHeroIndex: ${i} }); resetHeroInterval();"
              class="w-2 h-2 rounded-full transition-all cursor-pointer ${state.currentHeroIndex === i ? 'bg-brand-green w-4' : 'bg-slate-600'}">
            </button>
          `).join("")}
          <button onclick="slideHeroRight()"
            class="p-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-900 transition-all cursor-pointer">
            <i data-lucide="chevron-right" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    `;
  }

  // Modules selector chips
  const modulesHTML = [
    { id: 'TODOS', label: '🎛️ Todos' },
    { id: 'INTERNACAO', label: '🏥 Internação' },
    { id: 'EMERGENCIA', label: '🚨 Emergência' },
    { id: 'EXAMES', label: '🔬 Exames' },
    { id: 'AMBULATORIO', label: '📅 Ambulatório' },
    { id: 'ESTOQUE', label: '📦 Estoque' },
    { id: 'FATURAMENTO', label: '💰 Faturamento' }
  ].map(tab => `
    <button onclick="setState({ activeModFilter: '${tab.id}' })"
      class="px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
        state.activeModFilter === tab.id 
          ? 'bg-brand-green text-slate-950 font-black shadow shadow-brand-green/20 scale-[1.03]' 
          : state.theme === 'light-slate'
            ? 'bg-slate-200/70 text-slate-700 hover:bg-slate-200'
            : 'bg-slate-900/50 text-slate-400 border border-slate-800/80 hover:text-white hover:bg-slate-850'
      }">
      ${tab.label}
    </button>
  `).join("");

  // Horizontal Recommended videos row
  const rowVideosHTML = topVideos.map((video, idx) => {
    const originalIdx = state.videos.indexOf(video);
    const barPercent = Math.min(100, Math.round(((video.views || 0) / 60) * 100));
    
    const inlineAdminOpts = state.isEditMode ? `
      <div class="absolute top-4 left-4 z-40 flex flex-col gap-1 select-none">
        <button onclick="removeVideo(event, ${originalIdx})"
          class="px-2 py-1 bg-red-600 text-white font-bold text-[9px] rounded shadow-lg flex items-center gap-0.5 hover:bg-red-700 active:scale-95 cursor-pointer">
          <i data-lucide="trash-2" class="w-2.5 h-2.5"></i> Excluir
        </button>
        <button onclick="editItemTitle(event, 'video', ${originalIdx})"
          class="px-2 py-1 bg-yellow-500 text-slate-950 font-bold text-[9px] rounded shadow-lg flex items-center gap-0.5 hover:bg-yellow-400 active:scale-95 cursor-pointer">
          Renomear
        </button>
      </div>
    ` : "";

    const imgTag = video.capa ? `
      <img src="trumbnail/${video.capa}" alt="${video.titulo}" 
        class="w-full h-full object-cover transition duration-300 group-hover:scale-105"
        onerror="this.style.display='none'; this.parentElement.innerHTML='<div class=\\'w-full h-full bg-gradient-to-tr ${getPlaceholderImgStyle(video.titulo)} flex flex-col items-center justify-center p-3 text-center\\'><i data-lucide=\\'video\\' class=\\'w-7 h-7 text-white/50 mb-1\\'></i><span class=\\'text-[9px] text-white/40 uppercase tracking-widest font-mono\\'>Simulação</span></div>'; if(typeof lucide !== 'undefined') lucide.createIcons();"
      />
    ` : `
      <div class="w-full h-full bg-gradient-to-tr ${getPlaceholderImgStyle(video.titulo)} flex flex-col items-center justify-center p-3 text-center">
        <i data-lucide="video" class="w-7 h-7 text-white/50 mb-1"></i>
        <span class="text-[9px] text-white/40 uppercase font-mono">Instrução</span>
      </div>
    `;

    return `
      <div class="w-64 shrink-0 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.04] p-3 text-left relative group ${getCardBgClass()}">
        ${inlineAdminOpts}

        <div class="relative aspect-video rounded-xl overflow-hidden bg-slate-900 shadow-sm border border-slate-800/40">
          ${imgTag}
          <div class="absolute top-2.5 right-2.5 bg-rose-600 border border-rose-500/50 text-white font-display font-black text-[10px] px-2 py-0.5 rounded-md shadow-md">
            #${idx + 1}
          </div>
          <div class="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
            <button onclick="playVideoSelected(${originalIdx})"
              class="w-11 h-11 bg-white hover:bg-brand-green text-slate-950 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-90 shadow-lg cursor-pointer">
              <i data-lucide="play" class="w-5 h-5 fill-slate-950 text-slate-950 translate-x-0.5 border-none"></i>
            </button>
          </div>
        </div>

        <div class="w-full bg-slate-800 h-1 mt-3 rounded-full overflow-hidden select-none">
          <div class="bg-brand-green h-full" style="width: ${barPercent}%;"></div>
        </div>

        <div class="pt-3 space-y-2">
          <span class="inline-block px-2 py-0.5 text-[9px] rounded font-bold uppercase select-none ${getModColorBadgeClass(video.modulo)}">
            ${getModNameLocalized(video.modulo)}
          </span>
          <h4 onclick="playVideoSelected(${originalIdx})"
            class="font-display font-black text-xs h-9 overflow-hidden hover:text-brand-green cursor-pointer leading-snug tracking-tight transition line-clamp-2">
            ${video.titulo}
          </h4>
          <div class="flex justify-between items-center text-[10px] text-slate-400 pt-1 select-none font-medium">
            <span class="flex items-center gap-1">
              <i data-lucide="eye" class="w-3.5 h-3.5 text-slate-500"></i>
              ${video.views} acessos
            </span>
            <span class="font-mono text-[9px] font-bold text-slate-500">
              MÓDULO ${video.modulo.substring(0, 3)}
            </span>
          </div>
        </div>
      </div>
    `;
  }).join("");

  // Categories rows renderer
  let categoriesHTML = "";
  ['INTERNACAO', 'EMERGENCIA', 'EXAMES', 'AMBULATORIO'].forEach(cat => {
    const items = state.videos.filter(v => v.modulo === cat || (v.modulo === 'SADT' && cat === 'EXAMES'));
    if (items.length === 0) return;

    const itemsCards = items.slice(0, 4).map(video => {
      const originalIdx = state.videos.indexOf(video);
      const inlineAdmin = state.isEditMode ? `
        <div class="absolute top-4 left-4 z-40 select-none">
          <button onclick="removeVideo(event, ${originalIdx})"
            class="px-2 py-1 bg-red-600 text-white font-bold text-[9px] rounded shadow-lg flex items-center gap-0.5 cursor-pointer">
            <i data-lucide="trash-2" class="w-2.5 h-2.5"></i> Excluir
          </button>
        </div>
      ` : "";

      const imgTag = video.capa ? `
        <img src="trumbnail/${video.capa}" alt="${video.titulo}" 
          class="w-full h-full object-cover transition group-hover:scale-105"
          onerror="this.style.display='none'; this.parentElement.innerHTML='<div class=\\'w-full h-full bg-gradient-to-tr ${getPlaceholderImgStyle(video.titulo)} flex flex-col items-center justify-center p-3 text-center\\'><i data-lucide=\\'video\\' class=\\'w-7 h-7 text-white/50 mb-1\\'></i><span class=\\'text-[9px] text-white/40 uppercase font-mono\\'>Simulação</span></div>'; if(typeof lucide !== 'undefined') lucide.createIcons();"
        />
      ` : `
        <div class="w-full h-full bg-gradient-to-tr ${getPlaceholderImgStyle(video.titulo)} flex flex-col items-center justify-center p-3">
          <i data-lucide="video" class="w-6 h-6 text-white/50 mb-1"></i>
        </div>
      `;

      return `
        <div class="rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.03] p-3 text-left group relative ${getCardBgClass()}">
          ${inlineAdmin}
          
          <div class="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-850">
            ${imgTag}
            <div class="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-200">
              <button onclick="playVideoSelected(${originalIdx})"
                class="w-10 h-10 bg-brand-green text-slate-950 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 active:scale-90 transition-all">
                <i data-lucide="play" class="w-4.5 h-4.5 fill-slate-950 text-slate-950 translate-x-0.5 border-none"></i>
              </button>
            </div>
          </div>

          <div class="pt-3 space-y-1.5">
            <h4 onclick="playVideoSelected(${originalIdx})"
              class="font-display font-bold text-xs hover:text-brand-green transition-all line-clamp-2 cursor-pointer leading-snug h-9 pt-0.5">
              ${video.titulo}
            </h4>
            <div class="flex justify-between items-center text-[10px] text-slate-400 select-none">
              <span>👁 ${video.views} views</span>
              <span class="text-[9.5px] font-mono font-bold text-emerald-500">Assistir</span>
            </div>
          </div>
        </div>
      `;
    }).join("");

    categoriesHTML += `
      <div class="space-y-4">
        <div class="flex items-center gap-2 border-b border-slate-800/20 pb-2">
          <span class="w-2.5 h-2.5 rounded-full bg-brand-green"></span>
          <h3 class="font-display text-base font-extrabold select-none">
            Treinamento ${getModNameLocalized(cat)}
          </h3>
          <span class="bg-slate-800/40 text-slate-400 font-bold text-[10px] px-2 py-0.5 rounded-full">
            ${items.length} vídeos
          </span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          ${itemsCards}
        </div>
      </div>
    `;
  });

  // Assemble full Homepage
  wrapper.className = "space-y-12 animate-fade-in";
  wrapper.innerHTML = `
    ${heroHTML}

    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <span class="font-display font-semibold text-xs uppercase tracking-wider text-slate-500">
          Navegar por Módulos AGHUse
        </span>
        ${state.searchQuery ? `
          <span class="text-xs text-brand-green font-medium">
            Resultado da busca para "${state.searchQuery}"
          </span>
        ` : ""}
      </div>
      <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        ${modulesHTML}
      </div>
    </div>

    <!-- RECOMMENDED HORIZONTAL ROW -->
    <div id="highlights-container-row" class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="font-display text-lg font-bold flex items-center gap-2">
          <i data-lucide="sparkles" class="w-5 h-5 text-amber-500 fill-amber-500"></i>
          Vídeos Recomendados e Mais Assistidos
        </h3>
        <div class="flex gap-1.5 select-none">
          <button onclick="handleScroll('top-videos-shelf', 'left')"
            class="p-1.5 rounded-lg bg-slate-800/20 hover:bg-slate-800/40 border border-slate-700/20 hover:text-brand-green transition cursor-pointer">
            <i data-lucide="chevron-left" class="w-4 h-4"></i>
          </button>
          <button onclick="handleScroll('top-videos-shelf', 'right')"
            class="p-1.5 rounded-lg bg-slate-800/20 hover:bg-slate-800/40 border border-slate-700/20 hover:text-brand-green transition cursor-pointer">
            <i data-lucide="chevron-right" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
      
      <div id="top-videos-shelf" class="flex gap-6 overflow-x-auto scrollbar-none pb-4 smooth-scroll-snap">
        ${rowVideosHTML}
      </div>
    </div>

    <!-- CATEGORIES BLOCK -->
    <div id="segmented-categories-row" class="space-y-8 pt-4">
      ${categoriesHTML}
    </div>

    <!-- SIGN UP PDF MOCK OFFICIAL FORM BANNER -->
    <div id="cadastro-banner" class="relative rounded-3xl overflow-hidden p-8 sm:p-12 text-left shadow-realistic-lg bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 border border-emerald-900/40 select-none">
      <div class="absolute top-[-20%] right-[-10%] w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
      <div class="relative z-10 space-y-4 max-w-2xl">
        <span class="text-[10px] font-black tracking-widest text-[#f59e0b] uppercase bg-amber-500/10 px-3 py-1 border border-amber-500/25 rounded-md">
           Cadastro de Novo Usuário AGHUse
        </span>
        <h3 class="text-xl sm:text-3xl font-display font-black text-white leading-tight">
          Formulário Oficial de Cadastro de Operadores
        </h3>
        <p class="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
          Necessita de login para realizar prescrição, realizar laudos de exames ou efetuar internação definitiva? Acesse o formulário de cadastro, preencha as credenciais requeridas e colha a assinatura do chefe do setor para validação rápida pela TI.
        </p>
        <div class="pt-2">
          <a href="cadastro_aghuse/cadastro.html" target="_blank" rel="noreferrer"
            class="inline-flex items-center gap-2 px-6 py-3 bg-[#f59e0b] hover:bg-amber-400 font-display font-black text-xs sm:text-sm text-slate-950 rounded-xl transition shadow-lg shadow-amber-950/20 active:scale-95 cursor-pointer">
            <i data-lucide="file-spreadsheet" class="w-4 h-4"></i>
            Abrir Formulário de Cadastro
          </a>
        </div>
      </div>
    </div>
  `;
}

// --- VIDEO LIBRARY LIBRARY VIEW COMPONENT ---
function renderVideosView(wrapper) {
  const filteredVideos = state.videos.filter(v => {
    const matchesMod = state.activeModFilter === 'TODOS' || v.modulo === state.activeModFilter || (v.modulo === 'SADT' && state.activeModFilter === 'EXAMES');
    const matchesSearch = state.searchQuery === "" || 
      v.titulo.toLowerCase().includes(state.searchQuery.toLowerCase()) || 
      v.modulo.toLowerCase().includes(state.searchQuery.toLowerCase());
    return matchesMod && matchesSearch;
  });

  const filterChipsHTML = ['TODOS', 'INTERNACAO', 'EMERGENCIA', 'EXAMES', 'AMBULATORIO', 'ESTOQUE', 'FATURAMENTO'].map(category => `
    <button onclick="setState({ activeModFilter: '${category}' })"
      class="px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
        state.activeModFilter === category 
          ? 'bg-brand-green text-slate-950 font-black shadow shadow-brand-green/25' 
          : state.theme === 'light-slate'
            ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            : 'bg-slate-900/50 text-slate-400 border border-slate-800 hover:text-white'
      }">
      ${getModNameLocalized(category)}
    </button>
  `).join("");

  let gridHTML = "";
  if (filteredVideos.length > 0) {
    gridHTML = `
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        ${filteredVideos.map((video, idx) => {
          const originalIdx = state.videos.indexOf(video);
          const inlineAdmin = state.isEditMode ? `
            <div class="absolute top-4 left-4 z-40 select-none">
              <button onclick="removeVideo(event, ${originalIdx})"
                class="px-2 py-1 bg-red-650 text-white font-bold text-[9px] rounded shadow hover:bg-red-700 cursor-pointer">
                Excluir
              </button>
            </div>
          ` : "";

          const imgTag = video.capa ? `
            <img src="trumbnail/${video.capa}" alt="${video.titulo}" 
              class="w-full h-full object-cover transition duration-300 group-hover:scale-105"
              onerror="this.style.display='none'; this.parentElement.innerHTML='<div class=\\'w-full h-full bg-gradient-to-tr ${getPlaceholderImgStyle(video.titulo)} flex flex-col items-center justify-center p-3 text-center\\'><i data-lucide=\\'video\\' class=\\'w-7 h-7 text-white/50 mb-1\\'></i><span class=\\'text-[9px] text-white/45 uppercase font-mono\\'>Simulador</span></div>'; if(typeof lucide !== 'undefined') lucide.createIcons();"
            />
          ` : `
            <div class="w-full h-full bg-gradient-to-tr ${getPlaceholderImgStyle(video.titulo)} flex flex-col items-center justify-center p-3">
              <i data-lucide="video" class="w-6 h-6 text-white/50 mb-1"></i>
            </div>
          `;

          return `
            <div class="rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.03] p-3 text-left group relative ${getCardBgClass()}">
              ${inlineAdmin}

              <div class="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-850">
                ${imgTag}
                <div class="absolute inset-0 bg-slate-950/65 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-200">
                  <button onclick="playVideoSelected(${originalIdx})"
                    class="w-10 h-10 bg-brand-green text-slate-950 rounded-full flex items-center justify-center shadow-lg cursor-pointer">
                    <i data-lucide="play" class="w-4.5 h-4.5 fill-slate-950 text-slate-950 translate-x-0.5 border-none"></i>
                  </button>
                </div>
              </div>

              <div class="pt-3 space-y-1.5 text-left">
                <span class="inline-block px-2 py-0.5 text-[8.5px] rounded font-bold uppercase select-none ${getModColorBadgeClass(video.modulo)}">
                  ${getModNameLocalized(video.modulo)}
                </span>
                <h4 class="font-display font-bold text-xs line-clamp-2 h-9 leading-snug">
                  ${video.titulo}
                </h4>
                <div class="flex justify-between items-center text-[10px] text-slate-400 select-none pt-1">
                  <span>👁 ${video.views} visualizações</span>
                  <span class="text-[9.5px] font-mono font-bold text-emerald-500">PLAY ▶</span>
                </div>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  } else {
    gridHTML = `
      <div class="text-center py-20 space-y-3 rounded-2xl border border-dashed border-slate-700/40">
        <i data-lucide="alert-circle" class="w-8 h-8 text-slate-500 mx-auto"></i>
        <p class="text-slate-400 text-sm">Nenhum treinamento localizado na pesquisa de vídeos.</p>
        <button onclick="setState({ searchQuery: '', activeModFilter: 'TODOS' })" class="text-brand-green text-xs font-bold underline cursor-pointer">
          Limpar Filtros e Busca
        </button>
      </div>
    `;
  }

  wrapper.className = "space-y-8 animate-fade-in";
  wrapper.innerHTML = `
    <div class="space-y-2 text-left">
      <h2 class="text-2xl font-display font-black tracking-tight">
        Biblioteca de Vídeos de Treinamento
      </h2>
      <p class="text-sm text-slate-400 max-w-2xl font-light">
        Assista a tutoriais passo a passo produzidos especificamente pelos especialistas em sistemas do hospital. Filtre abaixo pelo seu setor de atuação.
      </p>
    </div>

    <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      ${filterChipsHTML}
    </div>

    ${gridHTML}
  `;
}

// --- MANUAL LIBRARY VIEW COMPONENT ---
function renderManuaisView(wrapper) {
  const filteredManuais = state.manuais.filter(m => {
    const matchesMod = state.activeManualFilter === 'TODOS' || m.modulo === state.activeManualFilter || (m.modulo === 'SADT' && state.activeManualFilter === 'EXAMES');
    const matchesSearch = state.searchQuery === "" || 
      m.titulo.toLowerCase().includes(state.searchQuery.toLowerCase()) || 
      m.modulo.toLowerCase().includes(state.searchQuery.toLowerCase());
    return matchesMod && matchesSearch;
  });

  const filterChipsHTML = ['TODOS', 'AMBULATORIO', 'INTERNACAO', 'EMERGENCIA', 'EXAMES'].map(category => `
    <button onclick="setState({ activeManualFilter: '${category}' })"
      class="px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
        state.activeManualFilter === category 
          ? 'bg-[#f59e0b] text-slate-950 font-black shadow shadow-amber-500/25' 
          : state.theme === 'light-slate'
            ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            : 'bg-slate-900/50 text-slate-400 border border-slate-800 hover:text-white'
      }">
      ${getModNameLocalized(category)}
    </button>
  `).join("");

  let gridHTML = "";
  if (filteredManuais.length > 0) {
    gridHTML = `
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        ${filteredManuais.map((manual, idx) => {
          const originalIdx = state.manuais.indexOf(manual);
          const inlineAdmin = state.isEditMode ? `
            <div class="absolute top-4 left-4 z-40 select-none">
              <button onclick="removeManual(event, ${originalIdx})"
                class="px-2 py-1 bg-red-650 text-white font-bold text-[9px] rounded shadow-lg cursor-pointer">
                Excluir
              </button>
            </div>
          ` : "";

          const imgTag = manual.capa ? `
            <img src="trumbnail/${manual.capa}" alt="${manual.titulo}" 
              class="w-full h-full object-cover transition duration-300 group-hover:scale-105"
              onerror="this.style.display='none'; this.parentElement.innerHTML='<div class=\\'w-full h-full bg-gradient-to-br ${getPlaceholderImgStyle(manual.titulo)} flex flex-col items-center justify-center p-3 text-center\\'><i data-lucide=\\'file-text\\' class=\\'w-8 h-8 text-white/50 mb-1\\'></i><span class=\\'text-[9px] text-white/40 uppercase font-mono tracking-wider font-extrabold text-xs\\'>PDF</span></div>'; if(typeof lucide !== 'undefined') lucide.createIcons();"
            />
          ` : `
            <div class="w-full h-full bg-gradient-to-br ${getPlaceholderImgStyle(manual.titulo)} flex flex-col items-center justify-center p-3 text-center">
              <i data-lucide="file-text" class="w-8 h-8 text-white/40 mb-1"></i>
              <span class="text-[10px] font-mono text-white/30 uppercase font-black">PDF</span>
            </div>
          `;

          return `
            <div onclick="window.open('pdfs/${manual.arquivo}')"
              class="rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.04] p-3 text-left group relative cursor-pointer ${getCardBgClass()}">
              ${inlineAdmin}

              <div class="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-950/70 border border-slate-850/40">
                ${imgTag}
                <div class="absolute top-2.5 right-2.5 bg-red-600 font-display font-black text-[9px] px-2 py-0.5 rounded shadow text-white">
                  PDF
                </div>
                <div class="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-250">
                  <i data-lucide="book-open" class="w-8 h-8 text-amber-500 animate-bounce"></i>
                </div>
              </div>

              <div class="pt-3 space-y-1">
                <h4 class="font-display font-bold text-[11px] leading-snug tracking-tight text-left text-slate-200 line-clamp-2 hover:underline h-8">
                  ${manual.titulo}
                </h4>
                <span class="text-[9px] text-amber-500 font-black tracking-wide uppercase select-none">
                  ${manual.modulo}
                </span>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  } else {
    gridHTML = `
      <div class="text-center py-20 space-y-3 rounded-2xl border border-dashed border-slate-700/40">
        <i data-lucide="file-text" class="w-8 h-8 text-slate-500 mx-auto"></i>
        <p class="text-slate-400 text-sm">Nenhum manual técnico localizado.</p>
      </div>
    `;
  }

  wrapper.className = "space-y-8 animate-fade-in";
  wrapper.innerHTML = `
    <div class="space-y-2 text-left">
      <h2 class="text-2xl font-display font-black tracking-tight">
        Procedimentos Operacionais e Manuais PDF
      </h2>
      <p class="text-sm text-slate-400 max-w-2xl font-light">
        Consulte documentações técnicas e guias ilustrados offline para dirimir dúvidas rápidas sobre parametrização e preenchimento de faturas.
      </p>
    </div>

    <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      ${filterChipsHTML}
    </div>

    ${gridHTML}
  `;
}

// --- PORTALS & MODALS SWITCH MANAGER ---
function renderModals() {
  const container = document.getElementById("modals-container");
  if (!container) return;

  container.innerHTML = "";

  // 1. DUAL PLAY MODE MODAL (VIDEO MP4 & STEP SIMULATOR)
  if (state.activePlayVideo) {
    const video = state.activePlayVideo.video;
    const isModeVideo = (state.videoPlayMode || 'video') === 'video';

    let mediaHTML = "";
    if (isModeVideo) {
      mediaHTML = `
        <div class="relative w-full h-full bg-black flex items-center justify-center animate-fade-in">
          <video id="aghuse-real-video" src="videos/${video.arquivo}" controls autoplay class="w-full h-full object-contain max-h-[500px]"
            onerror="this.style.display='none'; this.parentElement.innerHTML='<div class=\\'text-center p-6 space-y-3\\'><i data-lucide=\\'video-off\\' class=\\'w-12 h-12 text-slate-500 mx-auto\\'></i><p class=\\'text-sm text-slate-400 font-bold\\'>Arquivo de vídeo <b>${video.arquivo}</b> não encontrado na pasta <b>/videos</b>.</p><p class=\\'text-xs text-slate-500 font-light max-w-md mx-auto leading-relaxed\\'>Copie os arquivos de vídeo gravados (.mp4) para a pasta local <b>C:\\\\AGHUse\\\\AghusePlay\\\\aghuse-play\\\\videos</b> para assistir a gravação real diretamente na plataforma.</p></div>'; if(typeof lucide !== 'undefined') lucide.createIcons();"
          ></video>
        </div>
      `;
    } else {
      mediaHTML = `
        <div class="absolute inset-0 w-full h-full flex flex-col items-stretch justify-between bg-slate-900 z-10 select-none text-white animate-fade-in">
          
          <div class="bg-[#0c1322] px-4 py-2 flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800">
            <span class="font-semibold text-emerald-400 flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-ping"></span>
              AGHUse V.14 · Ambiente de Homologação e Simulação
            </span>
            <span class="font-mono text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
              Passo ${state.simStep + 1} de ${VIDEO_STEPS.length}
            </span>
          </div>

          <div class="flex-1 flex flex-col md:flex-row items-stretch overflow-hidden">
            
            <div class="flex-1 bg-slate-950 relative flex items-center justify-center p-8 overflow-hidden">
              <div class="absolute top-4 left-4 font-mono text-[9px] text-slate-600 uppercase">
                Visão Tela AGHUse
              </div>
              
              <div class="w-full max-w-md aspect-video rounded-xl bg-slate-900 border border-slate-800/80 p-4 shadow-realistic-lg text-left flex flex-col justify-between space-y-4 relative overflow-hidden">
                <div class="absolute -right-16 -top-16 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl"></div>
                
                <div class="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span class="text-[10px] font-bold text-brand-green tracking-widest uppercase">
                    AGHUse SIMULATOR
                  </span>
                  <span class="text-[9px] text-slate-500 font-mono">
                    SISTEMA HOSP. DE ALTA INTENSIDADE
                  </span>
                </div>

                <div class="space-y-2 py-2">
                  <label class="text-[9px] font-bold text-[#f59e0b] uppercase tracking-wide">
                    AÇÃO DO PASSO ${state.simStep + 1}
                  </label>
                  <p class="text-sm font-semibold text-white">
                    ${VIDEO_STEPS[state.simStep]?.title}
                  </p>
                  <p class="text-xs text-slate-400 leading-normal font-light">
                    ${VIDEO_STEPS[state.simStep]?.text}
                  </p>
                </div>

                <div class="h-6 bg-slate-950 rounded flex items-center px-2 border border-slate-800">
                  <span class="w-2 h-2 rounded-full bg-brand-green mr-2 animate-pulse"></span>
                  <span class="font-mono text-[10px] text-brand-green uppercase tracking-wide">
                    EXECUÇÃO CORRETA SELECIONADA
                  </span>
                </div>
              </div>
            </div>

            <div class="w-full md:w-64 bg-slate-900 px-6 py-6 border-t md:border-t-0 md:border-l border-slate-800 flex flex-col justify-between text-left shrink-0">
              <div class="space-y-4">
                <span class="text-[9px] uppercase tracking-widest font-black text-emerald-400">
                  Roteiro Instrucional
                </span>
                <div class="space-y-2">
                  <h4 class="text-xs font-bold text-white uppercase tracking-tight">
                    ${VIDEO_STEPS[state.simStep]?.title}
                  </h4>
                  <p class="text-[11.5px] text-slate-400 leading-relaxed font-light font-mono">
                    ${VIDEO_STEPS[state.simStep]?.text}
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-2 pt-6">
                <button ${state.simStep === 0 ? 'disabled' : ''} onclick="backSimStep()"
                  class="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none rounded text-xs transition font-semibold cursor-pointer text-white">
                  Voltar
                </button>
                ${state.simStep < VIDEO_STEPS.length - 1 ? `
                  <button onclick="nextSimStep()"
                    class="flex-1 py-1.5 bg-brand-green text-slate-950 font-black rounded text-xs hover:bg-emerald-400 transition cursor-pointer">
                    Avançar
                  </button>
                ` : `
                  <button onclick="setState({ videoPlayMode: 'video' })"
                    class="flex-1 py-1.5 bg-amber-500 text-slate-950 font-black rounded text-xs hover:bg-amber-400 transition cursor-pointer">
                    Concluir
                  </button>
                `}
              </div>
            </div>
          </div>

          <div class="bg-[#0a0f1d] px-6 py-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <div class="flex items-center gap-4">
              <button onclick="setState({ simStep: 0 })"
                class="text-xs text-red-400 hover:text-red-300 font-semibold cursor-pointer">
                Reiniciar
              </button>
              <button onclick="setState({ playerMute: !state.playerMute })"
                class="text-xs text-slate-400 hover:text-white cursor-pointer">
                ${state.playerMute ? "🔈 Áudio: Mudo" : "🔊 Áudio Ativo"}
              </button>
            </div>

            <div class="flex items-center gap-2">
              <span class="text-[10px] text-slate-500 font-mono">Velocidade:</span>
              <select value="${state.playerSpeed}" onchange="setState({ playerSpeed: Number(this.value) })"
                class="bg-slate-800 text-white text-[11px] rounded px-1.5 py-0.5 outline-none border border-slate-750">
                <option value="0.75" ${state.playerSpeed === 0.75 ? 'selected' : ''}>0.75x</option>
                <option value="1" ${state.playerSpeed === 1 ? 'selected' : ''}>1.0x (Normal)</option>
                <option value="1.5" ${state.playerSpeed === 1.5 ? 'selected' : ''}>1.5x</option>
              </select>
            </div>
          </div>
        </div>
      `;
    }

    const modalHTML = `
      <div id="modal-play-view" class="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 bg-slate-950/95 backdrop-blur-md animate-fade-in"
        onclick="setState({ activePlayVideo: null, isVideoSimulating: false })">
        <div class="w-full max-w-4xl bg-[#0f172a] border border-slate-800 rounded-3xl overflow-hidden shadow-realistic-lg text-left"
          onclick="event.stopPropagation()">
          
          <div class="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/60 select-none">
            <div class="flex items-center gap-2">
              <i data-lucide="video" class="w-4 h-4 text-brand-green animate-pulse"></i>
              <h3 class="font-display font-extrabold text-sm sm:text-base text-white truncate max-w-md">
                Treinando: <span class="text-brand-green">${video.titulo}</span>
              </h3>
            </div>
            <button onclick="setState({ activePlayVideo: null, isVideoSimulating: false })"
              class="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer">
              <i data-lucide="x" class="w-4 h-4"></i>
            </button>
          </div>

          <!-- DUAL SELECTOR BAR FOR CHANNELS -->
          <div class="flex border-b border-slate-800 bg-slate-950/50 p-1.5 select-none gap-2">
            <button onclick="setState({ videoPlayMode: 'video' })"
              class="flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                isModeVideo 
                  ? 'bg-brand-green text-slate-950 font-black shadow-md shadow-brand-green/20' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }">
              <i data-lucide="play-circle" class="w-4 h-4 ${isModeVideo ? 'fill-slate-950 text-slate-950' : 'text-slate-400'}"></i>
              Assistir Vídeo MP4 (Gravado)
            </button>
            <button onclick="setState({ videoPlayMode: 'simulator', simStep: 0 })"
              class="flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                !isModeVideo 
                  ? 'bg-brand-green text-slate-950 font-black shadow-md shadow-brand-green/20' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }">
              <i data-lucide="monitor" class="w-4 h-4 ${!isModeVideo ? 'fill-slate-950 text-slate-950' : 'text-slate-400'}"></i>
              Simulador Interativo AGHUse
            </button>
          </div>

          <div class="bg-slate-950 aspect-video relative flex flex-col items-center justify-center overflow-hidden">
            ${mediaHTML}
          </div>

          <div class="px-6 py-5 bg-slate-900/40 space-y-2 select-none">
            <span class="inline-block px-2 py-0.5 text-[9px] rounded font-bold uppercase ${getModColorBadgeClass(video.modulo)}">
              CATEGORIA ${video.modulo}
            </span>
            <p class="text-xs text-slate-400 font-light leading-relaxed">
              Caminho do Arquivo: <code class="font-mono text-emerald-400 bg-slate-950 px-2 py-0.5 rounded text-[10px]">videos/${video.arquivo}</code> · 
              Visualizações Totais Trackeadas: <b class="text-white">${video.views} visualizações</b>
            </p>
          </div>

        </div>
      </div>
    `;

    container.innerHTML += modalHTML;
  }

  // 2. FEEDBACK / SUGGESTION PORTAL MODAL
  if (state.showFeedbackModal) {
    const modalHTML = `
      <div class="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm animate-fade-in"
        onclick="setState({ showFeedbackModal: false })">
        <div class="w-full max-w-md bg-[#111827] border border-slate-800 rounded-2xl p-6 text-left shadow-realistic-lg relative"
          onclick="event.stopPropagation()">
          <div class="absolute top-[-10%] right-[0%] w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
          
          <div class="flex justify-between items-start mb-4">
            <div class="space-y-1">
              <h3 class="font-display font-extrabold text-base text-white flex items-center gap-1.5">
                <i data-lucide="sparkles" class="w-5 h-5 text-amber-500 fill-amber-500"></i>
                Sugerir Conteúdo ou Reportar
              </h3>
              <p class="text-xs text-slate-400 font-light">
                A equipe de TI utiliza sua opinião direta para expandir os fluxos.
              </p>
            </div>
            <button onclick="setState({ showFeedbackModal: false })"
              class="p-1 rounded bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer">
              <i data-lucide="x" class="w-3.5 h-3.5"></i>
            </button>
          </div>

          <form onsubmit="handleFeedbackSubmit(event)" class="space-y-4">
            <div class="space-y-1.5">
              <label class="block text-[9px] font-bold text-amber-500 uppercase tracking-widest font-mono">
                Seu Nome Completo
              </label>
              <input type="text" required value="${state.feedNome}" oninput="state.feedNome=this.value"
                placeholder="Ex: Maria Alice Silveira"
                class="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-white outline-none focus:border-amber-500"
              />
            </div>

            <div class="space-y-1.5">
              <label class="block text-[9px] font-bold text-amber-500 uppercase tracking-widest font-mono">
                Seu Setor de Atuação
              </label>
              <input type="text" required value="${state.feedSetor}" oninput="state.feedSetor=this.value"
                placeholder="Ex: Recepção, Posto 4, Faturamento..."
                class="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-white outline-none focus:border-amber-500"
              />
            </div>

            <div class="space-y-1.5">
              <label class="block text-[9px] font-bold text-amber-500 uppercase tracking-widest font-mono">
                Sua Mensagem ou Vídeo Solicitado
              </label>
              <textarea rows="3" required placeholder="Quais vídeos de treinamento você gostaria de ver publicados ou quais dúvidas você encontrou nos fluxos?"
                class="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-white outline-none focus:border-amber-500 resize-none"
                oninput="state.feedTexto=this.value"
              >${state.feedTexto}</textarea>
            </div>

            <div class="pt-2 flex gap-3 select-none">
              <button type="button" onclick="setState({ showFeedbackModal: false })"
                class="flex-1 py-2 bg-slate-850 hover:bg-slate-800 text-slate-400 font-bold rounded-xl text-xs transition cursor-pointer">
                Cancelar
              </button>
              <button type="submit"
                class="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs transition shadow-lg shadow-amber-950/20 cursor-pointer">
                Enviar Sugestão
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    container.innerHTML += modalHTML;
  }

  // 3. EMERGENCY WHATSAPP SUPPORT MODAL
  if (state.showSuporteModal) {
    const modalHTML = `
      <div class="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm animate-fade-in"
        onclick="setState({ showSuporteModal: false })">
        <div class="w-full max-w-sm bg-[#111827] border border-slate-800 rounded-2xl p-6 text-left shadow-realistic-lg relative"
          onclick="event.stopPropagation()">
          <div class="absolute top-[-10%] right-[-10%] w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div class="flex justify-between items-start mb-6">
            <div class="flex items-center gap-2.5">
              <div class="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center text-[#eab308]">
                <i data-lucide="phone" class="w-5 h-5 fill-yellow-500 text-yellow-500 animate-pulse"></i>
              </div>
              <div>
                <h3 class="font-display font-extrabold text-sm text-white">
                  Suporte Especializado TI
                </h3>
                <p class="text-[10px] text-slate-500 font-mono uppercase">
                  Plantão Hospitalar 24h
                </p>
              </div>
            </div>
            <button onclick="setState({ showSuporteModal: false })"
              class="p-1 rounded bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer">
              <i data-lucide="x" class="w-3.5 h-3.5"></i>
            </button>
          </div>

          <div class="space-y-4">
            <div class="p-3 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
              <div class="flex items-center justify-between text-xs">
                <span class="text-slate-500 font-medium">WhatsApp Plantão</span>
                <a href="https://wa.me/5581994882732" target="_blank" class="text-brand-green font-bold hover:underline">
                  Enviar Mensagem
                </a>
              </div>
              <p class="text-sm font-bold text-white font-mono">(81) 9.9488-2732</p>
            </div>

            <div class="p-3 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
              <div class="flex items-center justify-between text-xs">
                <span class="text-slate-500 font-medium">Ramal Interno TI</span>
                <span class="text-slate-400 font-bold font-mono">Disponível</span>
              </div>
              <p class="text-sm font-bold text-white font-mono">Ramal: 3184-3933</p>
            </div>

            <div class="p-3 bg-slate-950 border border-slate-850 rounded-xl space-y-1">
              <div class="flex items-center gap-1.5 text-xs text-amber-500 font-bold">
                <i data-lucide="info" class="w-3.5 h-3.5"></i>
                Quando ligar para o suporte?
              </div>
              <p class="text-[11px] text-slate-400 leading-normal font-light">
                Utilize o suporte urgente caso haja **indisponibilidade crítica do sistema**, travamento de prontuário eletrônico na emergência ou erros graves de permissão.
              </p>
            </div>

            <button onclick="setState({ showSuporteModal: false })"
              class="w-full py-2 bg-slate-850 hover:bg-slate-800 text-slate-200 font-bold rounded-xl text-xs transition cursor-pointer">
              Fechar Janela
            </button>
          </div>
        </div>
      </div>
    `;

    container.innerHTML += modalHTML;
  }

  // 4. MANAGEMENT ADMIN CONSOLE MODAL
  if (state.showAdminModal) {
    let adminContentHTML = "";

    if (!state.isAdminAuthenticated) {
      // Login screen
      adminContentHTML = `
        <div class="space-y-4">
          <div class="space-y-1.5 text-center">
            <h3 class="font-display font-extrabold text-base text-white">🔒 Login Administrativo</h3>
            <p class="text-xs text-slate-500">Apenas para equipe de suporte técnico e administradores.</p>
          </div>

          <form onsubmit="handleAdminLogin(event)" class="space-y-4">
            <div class="space-y-1.5 text-left">
              <label class="block text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Usuário</label>
              <input type="text" required placeholder="admin"
                class="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-white outline-none focus:border-brand-green"
                oninput="state.adminUser=this.value"
              />
            </div>

            <div class="space-y-1.5 text-left">
              <label class="block text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Senha</label>
              <input type="password" required placeholder="••••••••"
                class="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-white outline-none focus:border-brand-green"
                oninput="state.adminPass=this.value"
              />
            </div>

            <div class="pt-2 flex gap-3 select-none">
              <button type="button" onclick="setState({ showAdminModal: false })"
                class="flex-1 py-2 bg-slate-850 text-slate-400 font-bold rounded-xl text-xs transition cursor-pointer">
                Cancelar
              </button>
              <button type="submit"
                class="flex-1 py-2 bg-brand-green text-slate-950 font-black rounded-xl text-xs transition shadow-lg cursor-pointer">
                Entrar
              </button>
            </div>
          </form>
        </div>
      `;
    } else {
      // Authenticated Admin Dashboard panel
      const suggestionsRows = state.feedbacks.map(fb => `
        <div class="p-3 bg-slate-950 border border-slate-850 rounded-xl flex items-start justify-between gap-4 text-xs">
          <div class="space-y-1 text-left">
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="font-bold text-white">${fb.nome}</span>
              <span class="text-slate-500 font-mono text-[9px] uppercase">(${fb.setor})</span>
              <span class="text-slate-500 text-[10px]">${fb.data}</span>
            </div>
            <p class="text-slate-400 font-light leading-relaxed">${fb.texto}</p>
          </div>
          <button onclick="removeFeedback(event, '${fb.id}')"
            class="p-1 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded cursor-pointer transition">
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      `).join("") || `<p class="text-center py-4 text-slate-500 text-xs font-light">Nenhuma sugestão enviada no momento.</p>`;

      const noticiasRows = state.noticias.map((nt, idx) => `
        <div class="p-2.5 bg-slate-950 border border-slate-850 rounded-lg flex items-center justify-between gap-4 text-xs">
          <span class="text-slate-300 font-light text-left truncate flex-1">${nt.texto}</span>
          <button onclick="removeNoticia(event, ${idx})"
            class="p-1 text-red-500 hover:text-red-400 cursor-pointer transition">
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      `).join("") || `<p class="text-center py-4 text-slate-500 text-xs font-light">Nenhum informativo registrado.</p>`;

      adminContentHTML = `
        <div class="space-y-6 max-h-[80vh] overflow-y-auto pr-2 scrollbar-thin">
          
          <div class="flex justify-between items-center select-none">
            <div class="text-left">
              <h3 class="font-display font-extrabold text-base text-white">⚙️ Console de Gestão</h3>
              <p class="text-xs text-slate-500">Gerencie os vídeos, manuais, mural letreiro e feedbacks.</p>
            </div>
            <button onclick="setState({ isAdminAuthenticated: false, isEditMode: false })"
              class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 font-semibold rounded text-[11px] cursor-pointer">
              Logout
            </button>
          </div>

          <!-- ADMIN MODE QUICK CONTROLS -->
          <div class="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-center justify-between text-xs">
            <div class="text-left">
              <p class="font-bold text-emerald-400 flex items-center gap-1">
                <i data-lucide="info" class="w-3.5 h-3.5"></i> Edição Direta Habilitada
              </p>
              <p class="text-slate-400 text-[10px] font-light">Permite excluir e renomear itens direto na interface do site.</p>
            </div>
            <button onclick="setState({ isEditMode: !state.isEditMode })"
              class="px-3 py-1.5 font-bold rounded-lg text-xs transition cursor-pointer border ${
                state.isEditMode 
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' 
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              }">
              ${state.isEditMode ? "Desativar" : "Ativar"}
            </button>
          </div>

          <!-- TAB ACCORDION SECTIONS -->
          
          <!-- 1. INSERT VIDEO -->
          <div class="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
            <h4 class="font-display font-bold text-xs text-white uppercase text-left flex items-center gap-1">
              <i data-lucide="video" class="w-3.5 h-3.5 text-brand-green"></i> Cadastrar Novo Vídeo
            </h4>
            <form onsubmit="handleAddVideo(event)" class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div class="space-y-1 text-left">
                <label class="text-[9px] text-slate-500 font-bold uppercase">Título do Vídeo</label>
                <input type="text" required placeholder="EX: REALIZAR ADMISSÃO" value="${state.newVideoTitle}"
                  class="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white outline-none focus:border-brand-green"
                  oninput="state.newVideoTitle=this.value"
                />
              </div>
              <div class="space-y-1 text-left">
                <label class="text-[9px] text-slate-500 font-bold uppercase">Nome do Arquivo MP4</label>
                <input type="text" required placeholder="admissao.mp4" value="${state.newVideoFile}"
                  class="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white outline-none focus:border-brand-green"
                  oninput="state.newVideoFile=this.value"
                />
              </div>
              <div class="space-y-1 text-left">
                <label class="text-[9px] text-slate-500 font-bold uppercase">Capa (Preview)</label>
                <input type="text" placeholder="lista_internados.png" value="${state.newVideoCapa}"
                  class="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white outline-none focus:border-brand-green"
                  oninput="state.newVideoCapa=this.value"
                />
              </div>
              <div class="space-y-1 text-left">
                <label class="text-[9px] text-slate-500 font-bold uppercase">Módulo do Sistema</label>
                <select value="${state.newVideoModulo}" onchange="state.newVideoModulo=this.value"
                  class="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white outline-none focus:border-brand-green">
                  <option value="INTERNACAO">🏥 Internação</option>
                  <option value="EMERGENCIA">🚨 Emergência</option>
                  <option value="EXAMES">🔬 Exames SADT</option>
                  <option value="AMBULATORIO">📅 Ambulatório</option>
                  <option value="ESTOQUE">📦 Estoque</option>
                  <option value="FATURAMENTO">💰 Faturamento</option>
                </select>
              </div>
              <div class="sm:col-span-2 pt-1.5 select-none">
                <button type="submit" class="w-full py-2 bg-brand-green text-slate-950 font-black rounded-lg transition hover:scale-[1.01] cursor-pointer">
                  Salvar Treinamento Vídeo
                </button>
              </div>
            </form>
          </div>

          <!-- 2. INSERT MANUAL -->
          <div class="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
            <h4 class="font-display font-bold text-xs text-white uppercase text-left flex items-center gap-1">
              <i data-lucide="file-text" class="w-3.5 h-3.5 text-amber-500"></i> Cadastrar Novo Manual PDF
            </h4>
            <form onsubmit="handleAddManual(event)" class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div class="space-y-1 text-left">
                <label class="text-[9px] text-slate-500 font-bold uppercase">Título do Manual</label>
                <input type="text" required placeholder="EX: CADASTRAR AGENDAMENTOS" value="${state.newManualTitle}"
                  class="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white outline-none focus:border-amber-500"
                  oninput="state.newManualTitle=this.value"
                />
              </div>
              <div class="space-y-1 text-left">
                <label class="text-[9px] text-slate-500 font-bold uppercase">Arquivo PDF</label>
                <input type="text" required placeholder="manual_agendamentos.pdf" value="${state.newManualFile}"
                  class="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white outline-none focus:border-amber-500"
                  oninput="state.newManualFile=this.value"
                />
              </div>
              <div class="space-y-1 text-left">
                <label class="text-[9px] text-slate-500 font-bold uppercase">Capa do PDF (Preview)</label>
                <input type="text" placeholder="marcar_ambulatorio.png" value="${state.newManualCapa}"
                  class="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white outline-none focus:border-amber-500"
                  oninput="state.newManualCapa=this.value"
                />
              </div>
              <div class="space-y-1 text-left">
                <label class="text-[9px] text-slate-500 font-bold uppercase">Módulo Relacionado</label>
                <select value="${state.newManualModulo}" onchange="state.newManualModulo=this.value"
                  class="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white outline-none focus:border-amber-500">
                  <option value="AMBULATORIO">📅 Ambulatório</option>
                  <option value="INTERNACAO">🏥 Internação</option>
                  <option value="EMERGENCIA">🚨 Emergência</option>
                  <option value="EXAMES">🔬 Exames</option>
                </select>
              </div>
              <div class="sm:col-span-2 pt-1.5 select-none">
                <button type="submit" class="w-full py-2 bg-amber-500 text-slate-950 font-black rounded-lg transition hover:scale-[1.01] cursor-pointer">
                  Salvar Manual PDF
                </button>
              </div>
            </form>
          </div>

          <!-- 3. ADD NOTICE INFORMATION MURAL -->
          <div class="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
            <h4 class="font-display font-bold text-xs text-white uppercase text-left flex items-center gap-1">
              <i data-lucide="phone" class="w-3.5 h-3.5 text-blue-500"></i> Adicionar Letreiro Informativo
            </h4>
            <form onsubmit="handleAddNoticia(event)" class="flex gap-2 text-xs">
              <input type="text" required placeholder="Digite a notícia para rodar no topo..." value="${state.newNoticiaTexto}"
                class="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-2 text-white outline-none focus:border-blue-500"
                oninput="state.newNoticiaTexto=this.value"
              />
              <button type="submit" class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition shrink-0 cursor-pointer">
                Enviar
              </button>
            </form>
            <div class="space-y-2 pt-2">
              <label class="block text-[9.5px] font-bold text-slate-500 uppercase tracking-wider text-left font-mono">Letreiros Ativos</label>
              <div class="space-y-1.5">${noticiasRows}</div>
            </div>
          </div>

          <!-- 4. FEEDBACK LIST RECEIVED -->
          <div class="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
            <h4 class="font-display font-bold text-xs text-white uppercase text-left flex items-center gap-1">
              <i data-lucide="sparkles" class="w-3.5 h-3.5 text-amber-500"></i> Sugestões Recebidas (${state.feedbacks.length})
            </h4>
            <div class="space-y-2.5 max-h-56 overflow-y-auto pr-1 select-none">${suggestionsRows}</div>
          </div>

          <button onclick="setState({ showAdminModal: false })"
            class="w-full py-2.5 bg-slate-850 hover:bg-slate-800 text-slate-300 font-bold rounded-xl text-xs transition cursor-pointer">
            Fechar Painel
          </button>
        </div>
      `;
    }

    const modalHTML = `
      <div class="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm animate-fade-in"
        onclick="setState({ showAdminModal: false })">
        <div class="w-full max-w-lg bg-[#111827] border border-slate-800 rounded-2xl p-6 text-center shadow-realistic-lg relative"
          onclick="event.stopPropagation()">
          <button onclick="setState({ showAdminModal: false })"
            class="absolute top-4 right-4 p-1 rounded bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer">
            <i data-lucide="x" class="w-3.5 h-3.5"></i>
          </button>
          
          ${adminContentHTML}
        </div>
      </div>
    `;

    container.innerHTML += modalHTML;
  }
}

function renderMobileNavbar() {
  const mobileNav = document.getElementById("mobile-bottom-bar");
  if (!mobileNav) return;

  mobileNav.className = `md:hidden fixed bottom-0 left-0 right-0 z-[500] border-t backdrop-blur-md flex items-center justify-around h-16 px-2 shadow-2xl select-none transition-colors duration-500 ${
    state.theme === 'light-slate'
      ? 'bg-white/90 border-slate-200 text-slate-800'
      : 'bg-[#0b0f17]/95 border-slate-850/80 text-slate-300'
  }`;

  mobileNav.innerHTML = `
    <button onclick="setState({ activeMenu: 'inicio', activeModFilter: 'TODOS' })"
      class="flex flex-col items-center justify-center flex-1 h-full cursor-pointer transition-all ${
        state.activeMenu === 'inicio' ? 'text-brand-green scale-105' : 'text-slate-400 hover:text-slate-200'
      }">
      <i data-lucide="play" class="w-5 h-5 fill-current"></i>
      <span class="text-[9px] font-bold mt-1">Início</span>
    </button>

    <button onclick="setState({ activeMenu: 'videos' })"
      class="flex flex-col items-center justify-center flex-1 h-full cursor-pointer transition-all ${
        state.activeMenu === 'videos' ? 'text-brand-green scale-105' : 'text-slate-400 hover:text-slate-200'
      }">
      <i data-lucide="video" class="w-5 h-5"></i>
      <span class="text-[9px] font-bold mt-1">Vídeos</span>
    </button>

    <button onclick="setState({ activeMenu: 'manuais' })"
      class="flex flex-col items-center justify-center flex-1 h-full cursor-pointer transition-all ${
        state.activeMenu === 'manuais' ? 'text-brand-green scale-105' : 'text-slate-400 hover:text-slate-200'
      }">
      <i data-lucide="file-text" class="w-5 h-5"></i>
      <span class="text-[9px] font-bold mt-1">Manuais</span>
    </button>

    <button onclick="setState({ showFeedbackModal: true })"
      class="flex flex-col items-center justify-center flex-1 h-full cursor-pointer text-amber-500 hover:text-amber-400">
      <i data-lucide="sparkles" class="w-5 h-5 fill-current"></i>
      <span class="text-[9px] font-bold mt-1">Sugerir</span>
    </button>
  `;
}

// --- STATE ACTIONS AND HANDLERS ---

window.slideHeroLeft = function() {
  const limit = Math.min(5, state.videos.length);
  if (limit > 0) {
    setState({ currentHeroIndex: (state.currentHeroIndex - 1 + limit) % limit });
    resetHeroInterval();
  }
};

window.slideHeroRight = function() {
  const limit = Math.min(5, state.videos.length);
  if (limit > 0) {
    setState({ currentHeroIndex: (state.currentHeroIndex + 1) % limit });
    resetHeroInterval();
  }
};

window.playVideoSelected = function(originalIdx) {
  const video = state.videos[originalIdx];
  if (video) {
    setState({ activePlayVideo: { video, idx: originalIdx } });
    incrementVideoViews(originalIdx);
  }
};

window.backSimStep = function() {
  setState({ simStep: Math.max(0, state.simStep - 1) });
};

window.nextSimStep = function() {
  setState({ simStep: Math.min(VIDEO_STEPS.length - 1, state.simStep + 1) });
};

// --- FORM SUBMIT HANDLERS ---

window.handleFeedbackSubmit = function(e) {
  e.preventDefault();
  const text = state.feedTexto.trim();
  if (!text) {
    alert("Por favor, preencha a sua mensagem de sugestão!");
    return;
  }

  const newFb = {
    id: Math.random().toString(36).substring(2, 9),
    nome: state.feedNome.trim() || "Colaborador Anônimo",
    setor: state.feedSetor.trim() || "Setor Assistencial",
    texto: text,
    data: new Date().toLocaleDateString("pt-BR")
  };

  const updatedFb = [newFb, ...state.feedbacks];
  setState({
    feedbacks: updatedFb,
    feedNome: "",
    feedSetor: "",
    feedTexto: "",
    showFeedbackModal: false
  });

  alert("Sugestão enviada com sucesso! A equipe de TI agradece sua cooperação.");
};

window.handleAdminLogin = function(e) {
  e.preventDefault();
  if (state.adminUser === "admin" && state.adminPass === "Sucesso.2026") {
    setState({ isAdminAuthenticated: true, adminUser: "", adminPass: "" });
  } else {
    alert("Credenciais de administração inválidas!");
  }
};

// --- ADMIN ELEMENT MANIPULATIONS ---

window.handleAddVideo = function(e) {
  e.preventDefault();
  if (!state.newVideoTitle || !state.newVideoFile) {
    alert("Preencha o título e o nome do arquivo do vídeo!");
    return;
  }

  const newV = {
    titulo: state.newVideoTitle.toUpperCase(),
    modulo: state.newVideoModulo,
    arquivo: state.newVideoFile,
    capa: state.newVideoCapa || "lista_internados.png",
    views: 0
  };

  setState({
    videos: [...state.videos, newV],
    newVideoTitle: "",
    newVideoFile: "",
    newVideoCapa: ""
  });
  alert("Vídeo inserido com sucesso!");
};

window.handleAddManual = function(e) {
  e.preventDefault();
  if (!state.newManualTitle || !state.newManualFile) {
    alert("Preencha o título e o arquivo PDF!");
    return;
  }

  const newM = {
    titulo: state.newManualTitle.toUpperCase(),
    modulo: state.newManualModulo,
    arquivo: state.newManualFile,
    capa: state.newManualCapa || "grades_de_agendamento.png"
  };

  setState({
    manuais: [...state.manuais, newM],
    newManualTitle: "",
    newManualFile: "",
    newManualCapa: ""
  });
  alert("Manual PDF inserido com sucesso!");
};

window.handleAddNoticia = function(e) {
  e.preventDefault();
  const text = state.newNoticiaTexto.trim();
  if (!text) return;

  setState({
    noticias: [...state.noticias, { texto: text }],
    newNoticiaTexto: ""
  });
  alert("Nova notícia enviada ao letreiro!");
};

window.removeVideo = function(e, idx) {
  e.stopPropagation();
  if (confirm("Deseja mesmo remover permanentemente este vídeo?")) {
    const updated = state.videos.filter((_, i) => i !== idx);
    setState({ videos: updated });
  }
};

window.removeManual = function(e, idx) {
  e.stopPropagation();
  if (confirm("Deseja mesmo remover permanentemente este manual PDF?")) {
    const updated = state.manuais.filter((_, i) => i !== idx);
    setState({ manuais: updated });
  }
};

window.removeFeedback = function(e, id) {
  e.stopPropagation();
  if (confirm("Excluir sugestão da lista?")) {
    const updated = state.feedbacks.filter(f => f.id !== id);
    setState({ feedbacks: updated });
  }
};

window.removeNoticia = function(e, idx) {
  e.stopPropagation();
  const updated = state.noticias.filter((_, i) => i !== idx);
  setState({ noticias: updated });
};

window.editItemTitle = function(e, type, index) {
  e.stopPropagation();
  const current = type === 'video' ? state.videos[index].titulo : state.manuais[index].titulo;
  const res = prompt(`Editar título de ${type}:`, current);
  if (res && res.trim()) {
    if (type === 'video') {
      const copy = [...state.videos];
      copy[index].titulo = res.toUpperCase();
      setState({ videos: copy });
    } else {
      const copy = [...state.manuais];
      copy[index].titulo = res.toUpperCase();
      setState({ manuais: copy });
    }
  }
};

// --- APP BOOTSTRAP INITIALIZER ---
document.addEventListener("DOMContentLoaded", () => {
  renderApp();
});
