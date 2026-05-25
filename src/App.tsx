import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Video as VideoIcon, 
  FileText, 
  Sparkles, 
  Moon, 
  Sun, 
  Search, 
  X, 
  Settings, 
  Phone, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Trash2, 
  AlertCircle, 
  VideoOff, 
  FileSpreadsheet, 
  Plus, 
  Lock, 
  MessageSquare,
  Bookmark,
  UserPlus
} from 'lucide-react';
import { Video, Manual, Noticia, Feedback, ThemeType, MenuType, ViewLogEntry } from './types';
import { INITIAL_VIDEOS, INITIAL_MANUAIS, INITIAL_NOTICIAS, INITIAL_FEEDBACKS, VIDEO_STEPS } from './data';
import Logo from './components/Logo';

export default function App() {
  // Persistence States
  const [videos, setVideos] = useState<Video[]>(() => {
    const saved = localStorage.getItem("aghuse_videos");
    return saved ? JSON.parse(saved) : INITIAL_VIDEOS;
  });

  const [manuais, setManuais] = useState<Manual[]>(() => {
    const saved = localStorage.getItem("aghuse_manuais");
    return saved ? JSON.parse(saved) : INITIAL_MANUAIS;
  });

  const [noticias, setNoticias] = useState<Noticia[]>(() => {
    const saved = localStorage.getItem("aghuse_noticias");
    return saved ? JSON.parse(saved) : INITIAL_NOTICIAS;
  });

  const [feedbacks, setFeedbacks] = useState<Feedback[]>(() => {
    const saved = localStorage.getItem("aghuse_feedbacks");
    return saved ? JSON.parse(saved) : INITIAL_FEEDBACKS;
  });

  const [theme, setTheme] = useState<ThemeType>(() => {
    return (localStorage.getItem("aghuse_theme") as ThemeType) || 'dark-slate';
  });

  const [viewLogs, setViewLogs] = useState<ViewLogEntry[]>(() => {
    const saved = localStorage.getItem("aghuse_view_logs");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [
      { id: "log1", type: "video", title: "REDE REDS", module: "INTERNACAO", date: "24/05/2026 02:15" },
      { id: "log2", type: "pdf", title: "PREENCHER LAUDO AIH", module: "INTERNACAO", date: "24/05/2026 01:50" },
      { id: "log3", type: "video", title: "REGISTRAR LAUDO AIH", module: "INTERNACAO", date: "24/05/2026 01:02" },
      { id: "log4", type: "pdf", title: "GRADE DE AGENDAMENTO AMBULATÓRIO", module: "AMBULATORIO", date: "23/05/2026 21:30" }
    ];
  });

  // UI Flow States
  const [activeMenu, setActiveMenu] = useState<MenuType>('inicio');
  const [activeModFilter, setActiveModFilter] = useState<string>('TODOS');
  const [activeManualFilter, setActiveManualFilter] = useState<string>('TODOS');
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentHeroIndex, setCurrentHeroIndex] = useState<number>(0);
  const [activePlayVideo, setActivePlayVideo] = useState<{ video: Video; idx: number } | null>(null);
  const [videoPlayMode, setVideoPlayMode] = useState<'video' | 'simulator'>('video');
  const [simStep, setSimStep] = useState<number>(0);
  const [onlineCount, setOnlineCount] = useState<number>(24);
  const [logoError, setLogoError] = useState<boolean>(false);

  // Modals visibility
  const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);
  const [showSuporteModal, setShowSuporteModal] = useState<boolean>(false);
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  // Admin inputs
  const [adminUser, setAdminUser] = useState<string>("");
  const [adminPass, setAdminPass] = useState<string>("");
  
  // Custom new entry state
  const [nvTitulo, setNvTitulo] = useState<string>("");
  const [nvArquivo, setNvArquivo] = useState<string>("");
  const [nvCapa, setNvCapa] = useState<string>("");
  const [nvModulo, setNvModulo] = useState<string>("INTERNACAO");

  const [nmTitulo, setNmTitulo] = useState<string>("");
  const [nmArquivo, setNmArquivo] = useState<string>("");
  const [nmCapa, setNmCapa] = useState<string>("");
  const [nmModulo, setNmModulo] = useState<string>("INTERNACAO");

  const [newAviso, setNewAviso] = useState<string>("");

  // Feedback input
  const [feedNome, setFeedNome] = useState<string>("");
  const [feedSetor, setFeedSetor] = useState<string>("");
  const [feedTexto, setFeedTexto] = useState<string>("");

  // Persist state updates
  useEffect(() => {
    localStorage.setItem("aghuse_videos", JSON.stringify(videos));
  }, [videos]);

  useEffect(() => {
    localStorage.setItem("aghuse_manuais", JSON.stringify(manuais));
  }, [manuais]);

  useEffect(() => {
    localStorage.setItem("aghuse_noticias", JSON.stringify(noticias));
  }, [noticias]);

  useEffect(() => {
    localStorage.setItem("aghuse_feedbacks", JSON.stringify(feedbacks));
  }, [feedbacks]);

  useEffect(() => {
    localStorage.setItem("aghuse_theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("aghuse_view_logs", JSON.stringify(viewLogs));
  }, [viewLogs]);

  const addViewLog = (type: 'video' | 'pdf', title: string, module: string) => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('pt-BR') + ' ' + now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const newEntry: ViewLogEntry = {
      id: "log_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      type,
      title,
      module,
      date: formattedDate
    };
    setViewLogs(prev => [newEntry, ...prev].slice(0, 100));
  };

  // Online Visitor Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount(prev => Math.max(12, prev + Math.floor(Math.random() * 5) - 2));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Automatic Hero Slide transition
  useEffect(() => {
    if (activeMenu !== 'inicio' || activePlayVideo || showFeedbackModal || showSuporteModal || showAdminModal) return;
    const interval = setInterval(() => {
      const topCount = Math.min(5, videos.length);
      if (topCount > 0) {
        setCurrentHeroIndex(prev => (prev + 1) % topCount);
      }
    }, 8500);
    return () => clearInterval(interval);
  }, [activeMenu, activePlayVideo, showFeedbackModal, showSuporteModal, showAdminModal, videos.length]);

  // Handle slide helper functions
  const slideHeroLeft = () => {
    const limit = Math.min(5, videos.length);
    if (limit > 0) {
      setCurrentHeroIndex(prev => (prev - 1 + limit) % limit);
    }
  };

  const slideHeroRight = () => {
    const limit = Math.min(5, videos.length);
    if (limit > 0) {
      setCurrentHeroIndex(prev => (prev + 1) % limit);
    }
  };

  // Views tracker increment
  const triggerPlayVideo = (video: Video, index?: number) => {
    let targetIdx = index !== undefined ? index : -1;
    if (targetIdx === -1 || targetIdx >= videos.length || videos[targetIdx].titulo !== video.titulo) {
      targetIdx = videos.findIndex(v => v.titulo === video.titulo && v.modulo === video.modulo);
    }
    if (targetIdx === -1) {
      targetIdx = videos.findIndex(v => v.titulo === video.titulo);
    }
    if (targetIdx !== -1) {
      const updated = [...videos];
      const videoToUpdate = updated[targetIdx];
      const updatedVideo = { ...videoToUpdate, views: (videoToUpdate.views || 0) + 1 };
      updated[targetIdx] = updatedVideo;
      setVideos(updated);
      setActivePlayVideo({ video: updatedVideo, idx: targetIdx });
      setVideoPlayMode('video');
      addViewLog('video', updatedVideo.titulo, updatedVideo.modulo);
    } else {
      setActivePlayVideo({ video, idx: 0 });
      setVideoPlayMode('video');
      addViewLog('video', video.titulo, video.modulo);
    }
  };

  // Manual views tracking
  const triggerViewManual = (manual: Manual, index?: number) => {
    let targetIdx = index !== undefined ? index : -1;
    if (targetIdx === -1 || targetIdx >= manuais.length || manuais[targetIdx].titulo !== manual.titulo) {
      targetIdx = manuais.findIndex(m => m.titulo === manual.titulo && m.modulo === manual.modulo);
    }
    if (targetIdx === -1) {
      targetIdx = manuais.findIndex(m => m.titulo === manual.titulo);
    }
    if (targetIdx !== -1) {
      const updated = [...manuais];
      const manualToUpdate = updated[targetIdx];
      const updatedManual = { ...manualToUpdate, views: (manualToUpdate.views || 0) + 1 };
      updated[targetIdx] = updatedManual;
      setManuais(updated);
      addViewLog('pdf', updatedManual.titulo, updatedManual.modulo);
    } else {
      addViewLog('pdf', manual.titulo, manual.modulo);
    }
    window.open(`pdfs/${manual.arquivo}`, '_blank');
  };

  // Scrolling helpers
  const handleHorizontalScroll = (elementId: string, direction: 'left' | 'right') => {
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollBy({ left: direction === 'left' ? -340 : 340, behavior: 'smooth' });
    }
  };

  // Dynamic colors for cards with missing covers
  const getGradientForTitle = (title: string) => {
    const gradients = [
      "from-emerald-600 to-teal-900",
      "from-indigo-600 to-sky-900",
      "from-rose-600 to-orange-900",
      "from-blue-600 to-purple-900",
      "from-teal-600 to-indigo-900",
      "from-cyan-600 to-emerald-950"
    ];
    const index = Math.abs(title.charCodeAt(0) + (title.charCodeAt(1) || 0)) % gradients.length;
    return gradients[index];
  };

  // Human friendly Module labels
  const getModNameLocalized = (mod: string) => {
    switch(mod) {
      case 'INTERNACAO': return "🏥 Internação";
      case 'EMERGENCIA': return "🚨 Emergência";
      case 'EXAMES': case 'SADT': return "🔬 Exames";
      case 'AMBULATORIO': return "📅 Ambulatório";
      case 'ESTOQUE': return "📦 Estoque";
      case 'FATURAMENTO': return "💰 Faturamento";
      default: return `📂 ${mod}`;
    }
  };

  const getModColorBadge = (mod: string) => {
    switch(mod) {
      case 'INTERNACAO': return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case 'EMERGENCIA': return "bg-rose-500/10 text-rose-400 border-rose-500/30";
      case 'EXAMES': case 'SADT': return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      case 'AMBULATORIO': return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
      case 'ESTOQUE': return "bg-sky-500/10 text-sky-400 border-sky-500/30";
      case 'FATURAMENTO': return "bg-indigo-500/10 text-indigo-400 border-indigo-500/30";
      default: return "bg-slate-500/10 text-slate-400 border-slate-500/30";
    }
  };

  // Base background theme selectors
  const getThemeWrapperClass = () => {
    switch (theme) {
      case 'dark-aurora': return "bg-gradient-to-tr from-[#0b0c13] via-[#120f26] to-[#0c1424] text-slate-100 selection:bg-purple-500/30";
      case 'light-slate': return "bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] text-slate-800 selection:bg-emerald-500/20";
      case 'dark-slate': default: return "bg-gradient-to-tr from-[#0a0d14] via-[#0f141f] to-[#121b2a] text-slate-100 selection:bg-emerald-500/30";
    }
  };

  const getCardBgClass = () => {
    if (theme === 'light-slate') {
      return "bg-white/85 backdrop-blur-md border border-slate-200 shadow-realistic-light hover:border-emerald-500/40";
    }
    return "bg-[#111827]/75 backdrop-blur-md border border-slate-800/80 shadow-realistic-lg hover:border-emerald-500/40";
  };

  // Form Handlers
  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedTexto.trim()) {
      alert("Por favor, preencha o campo de texto.");
      return;
    }
    const newFeedback: Feedback = {
      id: "f_" + Math.random().toString(36).substring(2, 9),
      nome: feedNome.trim() || "Anônimo",
      setor: feedSetor.trim() || "Setor Geral",
      texto: feedTexto.trim(),
      data: new Date().toLocaleDateString("pt-BR")
    };
    setFeedbacks([newFeedback, ...feedbacks]);
    setFeedNome("");
    setFeedSetor("");
    setFeedTexto("");
    setShowFeedbackModal(false);
    alert("✓ Sua sugestão foi encaminhada ao setor de TI! Muito obrigado.");
  };

  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUser === "admin" && adminPass === "Sucesso.2026") {
      setIsAdminAuthenticated(true);
      setAdminUser("");
      setAdminPass("");
    } else {
      alert("❌ Acesso administrativo negado. Verifique os dados.");
    }
  };

  // Management Add Actions
  const handleAddNewVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nvTitulo || !nvArquivo) {
      alert("Preencha ao menos o Título e o Arquivo do vídeo.");
      return;
    }
    const newlyAdded: Video = {
      titulo: nvTitulo.toUpperCase(),
      modulo: nvModulo,
      arquivo: nvArquivo,
      capa: nvCapa || "lista_internados.png",
      views: 0
    };
    setVideos([newlyAdded, ...videos]);
    setNvTitulo("");
    setNvArquivo("");
    setNvCapa("");
    alert("✓ Vídeo publicado com sucesso!");
  };

  const handleAddNewManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nmTitulo || !nmArquivo) {
      alert("Preencha ao menos o Título e o Arquivo do manual.");
      return;
    }
    const newlyAdded: Manual = {
      titulo: nmTitulo.toUpperCase(),
      modulo: nmModulo,
      arquivo: nmArquivo,
      capa: nmCapa || "grades_de_agendamento.png"
    };
    setManuais([newlyAdded, ...manuais]);
    setNmTitulo("");
    setNmArquivo("");
    setNmCapa("");
    alert("✓ Manual técnico inserido!");
  };

  const handleAddNewAviso = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAviso.trim()) return;
    setNoticias([{ texto: newAviso.trim() }, ...noticias]);
    setNewAviso("");
    alert("✓ Letreiro atualizado!");
  };

  const removeVideoItem = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    if (confirm("Deseja mesmo remover permanentemente este vídeo?")) {
      setVideos(videos.filter((_, idx) => idx !== index));
    }
  };

  const removeManualItem = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    if (confirm("Deseja mesmo remover permanentemente este manual?")) {
      setManuais(manuais.filter((_, idx) => idx !== index));
    }
  };

  const removeAvisoItem = (index: number) => {
    setNoticias(noticias.filter((_, idx) => idx !== index));
  };

  const removeFeedbackLog = (index: number) => {
    setFeedbacks(feedbacks.filter((_, idx) => idx !== index));
  };

  // Edit fields inline helper
  const editTitleInline = (e: React.MouseEvent, type: 'video' | 'manual', index: number) => {
    e.stopPropagation();
    const currentVal = type === 'video' ? videos[index].titulo : manuais[index].titulo;
    const proposed = prompt("Editar título do item:", currentVal);
    if (proposed && proposed.trim()) {
      if (type === 'video') {
        const copy = [...videos];
        copy[index] = { ...copy[index], titulo: proposed.toUpperCase().trim() };
        setVideos(copy);
      } else {
        const copy = [...manuais];
        copy[index] = { ...copy[index], titulo: proposed.toUpperCase().trim() };
        setManuais(copy);
      }
    }
  };

  // Searching logic pre-filtering
  const getFilteredVideos = () => {
    return videos.filter(v => {
      const matchMod = activeModFilter === 'TODOS' || v.modulo === activeModFilter || (v.modulo === 'SADT' && activeModFilter === 'EXAMES');
      const matchSearch = searchQuery === "" || 
        v.titulo.toLowerCase().includes(searchQuery.toLowerCase()) || 
        v.modulo.toLowerCase().includes(searchQuery.toLowerCase());
      return matchMod && matchSearch;
    });
  };

  const getFilteredManuais = () => {
    return manuais.filter(m => {
      const matchMod = activeManualFilter === 'TODOS' || m.modulo === activeManualFilter || (m.modulo === 'SADT' && activeManualFilter === 'EXAMES');
      const matchSearch = searchQuery === "" || 
        m.titulo.toLowerCase().includes(searchQuery.toLowerCase()) || 
        m.modulo.toLowerCase().includes(searchQuery.toLowerCase());
      return matchMod && matchSearch;
    });
  };

  // High interest recommendations on home
  const topRecomendados = [...videos].sort((a, b) => b.views - a.views);
  const featuredHero = topRecomendados[currentHeroIndex] || videos[0] || null;

  return (
    <div id="aghuse-app" className={`min-h-screen pb-24 md:pb-0 font-sans transition-colors duration-700 relative overflow-x-hidden ${getThemeWrapperClass()}`}>
      
      {/* Dynamic Ambient Blur Background elements */}
      {theme !== 'light-slate' ? (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden h-max">
          <div className="absolute top-[-10%] left-[15%] w-[45rem] h-[45rem] rounded-full ambient-glow-emerald animate-float mix-blend-screen opacity-70"></div>
          <div className="absolute top-[35%] right-[-5%] w-[50rem] h-[50rem] rounded-full ambient-glow-blue animate-float mix-blend-screen opacity-50" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-[10%] left-[-5%] w-[40rem] h-[40rem] rounded-full ambient-glow-purple animate-float mix-blend-screen opacity-45" style={{ animationDelay: '4s' }}></div>
          <div className="absolute bottom-[-5%] right-[25%] w-[35rem] h-[35rem] rounded-full ambient-glow-amber animate-float mix-blend-screen opacity-30" style={{ animationDelay: '1s' }}></div>
        </div>
      ) : (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden h-max">
          <div className="absolute top-[-5%] left-[10%] w-[35rem] h-[35rem] rounded-full bg-emerald-100/45 mix-blend-multiply filter blur-3xl opacity-75"></div>
          <div className="absolute top-[30%] right-[0%] w-[45rem] h-[45rem] rounded-full bg-blue-100/40 mix-blend-multiply filter blur-3xl opacity-65"></div>
          <div className="absolute bottom-[20%] left-[-5%] w-[35rem] h-[35rem] rounded-full bg-purple-100/30 mix-blend-multiply filter blur-3xl opacity-50"></div>
        </div>
      )}

      {/* Main Responsive Navigation Bar */}
      <header className={`sticky top-0 z-[100] backdrop-blur-lg border-b transition-colors duration-500 ${theme === 'light-slate' ? 'bg-white/85 border-slate-200/80 shadow-sm text-slate-800' : 'bg-[#0f172a]/85 border-slate-800/80 text-white'}`}>
        <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center justify-between">
          
          <div className="flex items-center gap-2 sm:gap-6 flex-1 min-w-0">
            {/* Logo area */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 cursor-pointer" onClick={() => { setActiveMenu('inicio'); setActiveModFilter('TODOS'); }}>
              {!logoError ? (
                <>
                  <img 
                    src="assests/aghuseplay.png" 
                    alt="AGHUse Play" 
                    className="h-8 sm:h-10 w-auto" 
                    onError={() => setLogoError(true)}
                  />
                  <span className="font-display font-black text-base sm:text-xl tracking-tight text-brand-green hidden sm:block">
                    AGHUse Play
                  </span>
                </>
              ) : (
                <Logo className="h-8 sm:h-10 w-auto" />
              )}
            </div>

            {/* Nav Menu Tabs for desktop screens */}
            <nav className="hidden md:flex items-center gap-1">
              <button 
                onClick={() => { setActiveMenu('inicio'); setActiveModFilter('TODOS'); }}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${activeMenu === 'inicio' ? theme === 'light-slate' ? 'text-emerald-700 bg-emerald-50' : 'text-emerald-400 bg-slate-800/60' : 'hover:text-emerald-500 text-slate-400'}`}
              >
                Início
              </button>
              <button 
                onClick={() => setActiveMenu('videos')}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${activeMenu === 'videos' ? theme === 'light-slate' ? 'text-emerald-700 bg-emerald-50' : 'text-emerald-400 bg-slate-800/60' : 'hover:text-emerald-500 text-slate-400'}`}
              >
                Vídeos Treinamento
              </button>
              <button 
                onClick={() => setActiveMenu('manuais')}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${activeMenu === 'manuais' ? theme === 'light-slate' ? 'text-emerald-700 bg-emerald-50' : 'text-emerald-400 bg-slate-800/60' : 'hover:text-emerald-500 text-slate-400'}`}
              >
                Manuais PDF
              </button>
              <button 
                onClick={() => setShowFeedbackModal(true)}
                className="px-3 py-1.5 rounded-lg text-amber-500 hover:text-amber-400 font-bold text-xs flex items-center gap-1 bg-amber-500/5 border border-amber-500/15 hover:border-amber-500/30 transition duration-200 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 fill-amber-500/20 text-amber-500" />
                <span>Sugestões</span>
              </button>
            </nav>

            {/* Quick Filter Search Input */}
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar..." 
                className={`pl-9 pr-8 py-1.5 w-40 lg:w-52 text-xs rounded-lg outline-none transition-all duration-350 focus:w-56 ${theme === 'light-slate' ? 'bg-slate-100 hover:bg-slate-200/60 focus:bg-white text-slate-850 border border-slate-300 focus:ring-2 focus:ring-emerald-500/40' : 'bg-slate-950/65 focus:bg-slate-950 text-white border border-slate-800/80 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20'}`}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")} 
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Botão Cadastro AGHUse */}
            <a 
              href="/cadastro_aghuse/cadastro.html"
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden lg:flex items-center gap-1.5 h-8 px-4 rounded-full text-xs font-black tracking-wide border transition-all cursor-pointer shadow-sm hover:scale-[1.03] ${theme === 'light-slate' ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500' : 'bg-emerald-500/10 text-brand-green border-brand-green/30 hover:bg-emerald-500/25 hover:text-white'}`}
            >
              <UserPlus className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              <span>Cadastro AGHUse</span>
            </a>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Visual style controls */}
            <div className="hidden sm:flex items-center gap-1 p-1 bg-slate-950/20 rounded-lg border border-slate-850/40 mr-1.5">
              <button 
                title="Slate Noturno" 
                onClick={() => setTheme('dark-slate')} 
                className={`p-1.5 rounded-md transition cursor-pointer ${theme === 'dark-slate' ? 'bg-slate-850 text-emerald-400 shadow' : 'text-slate-400 hover:text-white'}`}
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
              <button 
                title="Galáctico Aurora" 
                onClick={() => setTheme('dark-aurora')} 
                className={`p-1.5 rounded-md transition cursor-pointer ${theme === 'dark-aurora' ? 'bg-[#181530] text-purple-400 shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                <Sparkles className="w-3.5 h-3.5" />
              </button>
              <button 
                title="Clássico Claro" 
                onClick={() => setTheme('light-slate')} 
                className={`p-1.5 rounded-md transition cursor-pointer ${theme === 'light-slate' ? 'bg-slate-200 text-emerald-600 shadow' : 'text-slate-500 hover:text-slate-200'}`}
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Emergency TI Support Contact */}
            <button 
              onClick={() => setShowSuporteModal(true)} 
              className={`p-1.5 sm:p-2 rounded-lg border text-yellow-500 bg-yellow-500/5 hover:bg-yellow-500/10 transition cursor-pointer ${theme === 'light-slate' ? 'border-yellow-200' : 'border-yellow-500/30'}`}
              title="Suporte Especializado TI"
            >
              <Phone className="w-3.5 h-3.5" />
            </button>

            {/* Administrate dashboard */}
            <button 
              onClick={() => setShowAdminModal(true)} 
              className={`p-1.5 sm:p-2 rounded-lg border cursor-pointer transition hover:border-emerald-500/50 ${theme === 'light-slate' ? 'text-slate-700 border-slate-200 bg-slate-100/50' : 'text-slate-300 border-slate-800 bg-slate-950/20'}`}
              title="Painel Admin Administrativo"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </header>

      {/* Announcements dynamic letreiro ticker */}
      <div className={`h-11 overflow-hidden flex items-center gap-4 border-b ${theme === 'light-slate' ? 'bg-emerald-50/50 border-emerald-100 text-slate-800' : 'bg-emerald-500/5 border-emerald-950/30 text-slate-100'}`}>
        <div className="ticker-container select-none">
          <div className="ticker-content">
            {noticias.length > 0 ? (
              noticias.concat(noticias).map((n, i) => (
                <span key={i} className="mr-24 font-bold text-xs inline-flex items-center whitespace-nowrap">
                  <span className="mr-3 w-1.5 h-1.5 rounded-full bg-brand-green inline-block"></span>
                  {n.texto}
                </span>
              ))
            ) : (
              <span className="mr-24 font-bold text-xs inline-flex items-center whitespace-nowrap">
                <span className="mr-3 w-1.5 h-1.5 rounded-full bg-brand-green inline-block"></span>
                Seja bem-vindo ao portal unificado de controle operacional AGHUse Play!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main screen renderer */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 sm:py-8 min-h-[70vh] z-10 relative">
        {activeMenu === 'inicio' && (
          <div className="space-y-12 animate-fade-in">
            
            {/* Elegant Hero Carousel Section */}
            {featuredHero && (
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-[4/3] sm:aspect-[3/2] md:aspect-[21/9] flex items-center bg-slate-950 shadow-realistic-lg border border-slate-800/80 group">
                <div className="absolute inset-0 opacity-40 z-0 bg-cover bg-center transition-all duration-1000 group-hover:scale-[1.02]" style={{ backgroundImage: `url('trumbnail/${featuredHero.capa}')` }}>
                  <div className={`absolute inset-0 bg-gradient-to-tr ${getGradientForTitle(featuredHero.titulo)} opacity-80`}></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent z-10"></div>
                
                <div className="relative z-20 px-6 sm:px-12 py-6 max-w-lg sm:max-w-xl md:max-w-2xl space-y-3 sm:space-y-4 text-left">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 text-[10px] font-black tracking-wider text-white uppercase rounded-md shadow-md select-none border border-red-500/30">
                    <Sparkles className="w-3 h-3 fill-white text-white animate-pulse" />
                    <span>Destaque</span>
                  </span>
                  <h1 className="text-xl sm:text-3xl md:text-5xl font-display font-extrabold text-white leading-tight tracking-tight">
                    Fluxo: <span className="text-brand-green">{featuredHero.titulo}</span>
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-350 leading-relaxed font-light line-clamp-2 sm:line-clamp-3">
                    Assista a esta videoaula ilustrativa para fixar o fluxo operacional de <b>{getModNameLocalized(featuredHero.modulo)}</b> no AGHUse evitando erros de faturamento e registro de prontuários.
                  </p>
                  
                  <div className="flex items-center gap-3 pt-2">
                    <button 
                      onClick={() => triggerPlayVideo(featuredHero, videos.indexOf(featuredHero))}
                      className="px-5 py-2.5 bg-brand-green hover:bg-emerald-500 text-slate-950 font-display font-black text-xs sm:text-sm rounded-xl flex items-center gap-2 transition duration-300 hover:scale-[1.03] shadow-lg shadow-emerald-950/30 cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-slate-950 text-slate-950 translate-x-0.5" />
                      <span>Assistir Agora</span>
                    </button>
                    <button 
                      onClick={() => setShowFeedbackModal(true)}
                      className="px-4 py-2.5 bg-slate-900/55 hover:bg-slate-900/80 text-slate-200 font-bold text-xs sm:text-sm rounded-xl border border-slate-700 hover:border-slate-500 transition duration-200 cursor-pointer"
                    >
                      Solicitar Outro
                    </button>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400 font-medium pt-3 select-none flex-wrap">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4 text-emerald-400" />
                      <b>{featuredHero.views}</b> views
                    </span>
                    <span>•</span>
                    <span className="bg-slate-900/80 border border-slate-850 text-brand-green px-2 py-0.5 rounded font-black text-[10px]">
                      {featuredHero.modulo}
                    </span>
                  </div>
                </div>

                {/* Slider nav bullets */}
                <div className="absolute right-4 sm:right-8 bottom-4 sm:bottom-6 z-20 flex items-center gap-2 select-none">
                  <button 
                    onClick={slideHeroLeft} 
                    className="p-1.5 sm:p-2 rounded-lg bg-slate-900/70 border border-slate-800 text-slate-300 hover:text-white transition duration-200 cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                  {Array.from({ length: Math.min(5, videos.length) }).map((_, i) => (
                    <button 
                      key={i}
                      onClick={() => setCurrentHeroIndex(i)} 
                      className={`w-2 h-2 rounded-full transition-all cursor-pointer ${currentHeroIndex === i ? 'bg-brand-green w-5' : 'bg-slate-650'}`}
                    ></button>
                  ))}
                  <button 
                    onClick={slideHeroRight} 
                    className="p-1.5 sm:p-2 rounded-lg bg-slate-900/70 border border-slate-800 text-slate-300 hover:text-white transition duration-200 cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Grid dos Módulos do Sistema Hospitalar */}
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b pb-2.5 dark:border-slate-800/40 border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <h3 className="font-display font-black text-xs uppercase tracking-wider text-slate-500 dark:text-slate-405 text-left">
                    Módulos Operacionais do Sistema Hospitalar AGHUse
                  </h3>
                </div>
                {searchQuery && (
                  <span className="text-xs text-brand-green font-medium">
                    Filtrando busca por "{searchQuery}"
                  </span>
                )}
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { id: 'INTERNACAO', title: 'Internação', emoji: '🏥', desc: 'Leitos & Internados', color: 'from-emerald-600/10 to-emerald-950/5 text-emerald-400 border-emerald-550/20 hover:border-emerald-500/50' },
                  { id: 'EMERGENCIA', title: 'Emergência', emoji: '🚨', desc: 'Pronto Atendimento', color: 'from-rose-600/10 to-rose-950/5 text-rose-400 border-rose-550/20 hover:border-rose-500/50' },
                  { id: 'EXAMES', title: 'Exames SADT', emoji: '🔬', desc: 'Pedidos & Laudos', color: 'from-blue-600/10 to-blue-950/5 text-blue-400 border-blue-550/20 hover:border-blue-500/50' },
                  { id: 'AMBULATORIO', title: 'Ambulatório', emoji: '📅', desc: 'Consultas Grade', color: 'from-amber-600/10 to-amber-950/5 text-amber-400 border-amber-550/20 hover:border-amber-500/50' },
                  { id: 'ESTOQUE', title: 'Estoque', emoji: '📦', desc: 'Controles Farmácia', color: 'from-purple-600/10 to-purple-950/5 text-purple-400 border-purple-550/20 hover:border-purple-500/50' },
                  { id: 'FATURAMENTO', title: 'Faturamento', emoji: '💰', desc: 'Faturamento AIH/SUS', color: 'from-teal-600/10 to-teal-950/5 text-teal-400 border-teal-550/20 hover:border-teal-500/50' }
                ].map(mod => {
                  const videoCount = videos.filter(v => v.modulo === mod.id || (mod.id === 'EXAMES' && v.modulo === 'SADT')).length;
                  const manualCount = manuais.filter(m => m.modulo === mod.id || (mod.id === 'EXAMES' && m.modulo === 'SADT')).length;
                  return (
                    <div
                      key={mod.id}
                      onClick={() => { 
                        setActiveModFilter(mod.id); 
                        setActiveManualFilter(mod.id);
                        setActiveMenu('videos'); 
                      }}
                      className={`relative overflow-hidden p-4 rounded-2xl border bg-gradient-to-br ${mod.color} hover:scale-[1.04] transition-all duration-300 cursor-pointer text-left group shadow-sm hover:shadow-lg`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-3xl select-none filter drop-shadow">{mod.emoji}</span>
                        <ChevronRight className="w-4 h-4 text-slate-550 group-hover:text-white transition duration-200" />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="font-display font-extrabold text-sm text-slate-100 group-hover:text-white leading-tight">
                          {mod.title}
                        </h4>
                        <p className="text-[10px] text-slate-400 leading-none pb-1.5">{mod.desc}</p>
                      </div>
                      <div className="pt-2 border-t border-slate-800/30 flex items-center justify-between text-[9px] font-bold text-slate-400">
                        <span className="flex items-center gap-0.5">
                          <Play className="w-2.5 h-2.5 fill-current text-slate-500 group-hover:text-emerald-400" />
                          {videoCount} {videoCount === 1 ? 'vídeo' : 'vídeos'}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <FileText className="w-2.5 h-2.5 text-slate-500 group-hover:text-rose-400" />
                          {manualCount} {manualCount === 1 ? 'PDF' : 'PDFs'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Vídeos Recomendados row */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg sm:text-xl font-bold flex items-center gap-2 text-left">
                  <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500/20" />
                  <span>Rank de Vídeos Recomendados</span>
                </h3>
                <div className="flex gap-2 select-none">
                  <button 
                    onClick={() => handleHorizontalScroll('top-videos-row', 'left')}
                    className="p-1.5 sm:p-2 rounded-lg bg-slate-800/20 hover:bg-slate-800/40 border border-slate-700/20 hover:text-brand-green transition cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleHorizontalScroll('top-videos-row', 'right')}
                    className="p-1.5 sm:p-2 rounded-lg bg-slate-800/20 hover:bg-slate-800/40 border border-slate-700/20 hover:text-brand-green transition cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div 
                id="top-videos-row" 
                className="flex gap-6 overflow-x-auto scrollbar-none pb-4 smooth-scroll-snap"
              >
                {topRecomendados.map((video, idx) => {
                  const originalIndex = videos.indexOf(video);
                  const barPercent = Math.min(100, Math.round(((video.views || 0) / 60) * 100));
                  return (
                    <div 
                      key={originalIndex} 
                      className={`w-56 sm:w-64 shrink-0 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.03] p-3 text-left relative group ${getCardBgClass()}`}
                    >
                      {/* Trash controls if admin edit mode active */}
                      {isEditMode && (
                        <div className="absolute top-4 left-4 z-40 flex flex-col gap-1.5 select-none">
                          <button 
                            onClick={(e) => removeVideoItem(e, originalIndex)}
                            className="bg-red-650 hover:bg-red-700 text-white font-bold text-[10px] px-2 py-1 rounded-md shadow-md flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Excluir</span>
                          </button>
                          <button 
                            onClick={(e) => editTitleInline(e, 'video', originalIndex)}
                            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[10px] px-2 py-1 rounded-md shadow-md cursor-pointer"
                          >
                            Editar
                          </button>
                        </div>
                      )}

                      <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800/40">
                        {video.capa ? (
                          <img 
                            src={`trumbnail/${video.capa}`} 
                            alt={video.titulo} 
                            className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                              const parent = (e.target as HTMLElement).parentElement;
                              if (parent) {
                                parent.innerHTML = `<div class="w-full h-full bg-gradient-to-tr ${getGradientForTitle(video.titulo)} flex flex-col items-center justify-center p-3 text-center"><i class="w-6 h-6 text-white/50 mb-1" data-lucide="video"></i><span class="text-[9px] text-white/30 uppercase tracking-wider font-mono">Aula Ilustrativa</span></div>`;
                              }
                            }}
                          />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-tr ${getGradientForTitle(video.titulo)} flex flex-col items-center justify-center p-3 text-center`}>
                            <VideoIcon className="w-7 h-7 text-white/50 mb-1" />
                            <span className="text-[9px] text-white/30 uppercase tracking-wider font-mono">Vídeo aula</span>
                          </div>
                        )}
                        <div className="absolute top-2.5 right-2.5 bg-rose-600/90 border border-rose-500/40 text-white font-display font-black text-[10px] px-2 py-0.5 rounded-md shadow-md">
                          #{idx + 1}
                        </div>
                        <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                          <button 
                            onClick={() => triggerPlayVideo(video, originalIndex)}
                            className="w-11 h-11 bg-white hover:bg-brand-green text-slate-950 rounded-full flex items-center justify-center shadow-lg cursor-pointer transition transform hover:scale-110"
                          >
                            <Play className="w-5 h-5 fill-slate-950 text-slate-950 translate-x-0.5" />
                          </button>
                        </div>
                      </div>

                      {/* Views progress metrics bar */}
                      <div className="w-full bg-slate-800 h-1.5 mt-3 rounded-full overflow-hidden select-none">
                        <div className="bg-brand-green h-full rounded-full transition-all duration-500" style={{ width: `${barPercent}%` }}></div>
                      </div>

                      <div className="pt-3 space-y-2">
                        <span className={`inline-block px-2 py-0.5 text-[9px] rounded font-bold uppercase select-none ${getModColorBadge(video.modulo)}`}>
                          {getModNameLocalized(video.modulo)}
                        </span>
                        <h4 
                          onClick={() => triggerPlayVideo(video, originalIndex)}
                          className="font-display font-bold text-xs h-9 overflow-hidden hover:text-brand-green cursor-pointer leading-snug tracking-tight transition line-clamp-2"
                        >
                          {video.titulo}
                        </h4>
                        <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 select-none font-medium">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5 text-slate-450" />
                            {video.views} visualizações
                          </span>
                          <span className="font-mono text-[9px] font-bold text-slate-500">
                            MÓD. {video.modulo.substring(0, 4)}
                          </span>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

            {/* Categorized Segments on home view */}
            <div className="space-y-10 pt-4 text-left">
              {['INTERNACAO', 'EMERGENCIA', 'EXAMES', 'AMBULATORIO'].map(modCode => {
                const grouped = videos.filter(v => v.modulo === modCode || (v.modulo === 'SADT' && modCode === 'EXAMES'));
                if (grouped.length === 0) return null;
                
                return (
                  <div key={modCode} className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-800/10 dark:border-slate-800/40 pb-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-brand-green"></span>
                      <h3 className="font-display text-base font-extrabold select-none">
                        Procedimentos de {getModNameLocalized(modCode)}
                      </h3>
                      <span className="bg-slate-200 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold text-[10px] px-2 py-0.5 rounded-full">
                        {grouped.length} vídeos
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {grouped.slice(0, 4).map(video => {
                        const originalIndex = videos.indexOf(video);
                        return (
                          <div 
                            key={originalIndex} 
                            className={`rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] p-3 text-left group relative ${getCardBgClass()}`}
                          >
                            {isEditMode && (
                              <button 
                                onClick={(e) => removeVideoItem(e, originalIndex)}
                                className="absolute top-4 left-4 z-40 bg-red-650 text-white font-bold text-[9px] px-2 py-1 rounded shadow-lg cursor-pointer"
                              >
                                Excluir
                              </button>
                            )}

                            <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-900">
                              {video.capa ? (
                                <img 
                                  src={`trumbnail/${video.capa}`} 
                                  alt={video.titulo} 
                                  className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                    const parent = (e.target as HTMLElement).parentElement;
                                    if (parent) {
                                      parent.innerHTML = `<div class="w-full h-full bg-gradient-to-tr ${getGradientForTitle(video.titulo)} flex flex-col items-center justify-center p-3 text-center"><i class="w-6 h-6 text-white/50 mb-1" data-lucide="video"></i><span class="text-[9px] text-white/30 uppercase tracking-wider font-mono">Fluxo</span></div>`;
                                    }
                                  }}
                                />
                              ) : (
                                <div className={`w-full h-full bg-gradient-to-tr ${getGradientForTitle(video.titulo)} flex flex-col items-center justify-center p-3`}>
                                  <VideoIcon className="w-6 h-6 text-white/50 mb-1" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-200">
                                <button 
                                  onClick={() => triggerPlayVideo(video, originalIndex)}
                                  className="w-10 h-10 bg-brand-green text-slate-950 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-all"
                                >
                                  <Play className="w-4 h-4 fill-slate-950 text-slate-950 translate-x-0.5" />
                                </button>
                              </div>
                            </div>

                            <div className="pt-3 space-y-1">
                              <h4 
                                onClick={() => triggerPlayVideo(video, originalIndex)}
                                className="font-display font-bold text-xs hover:text-brand-green transition-all line-clamp-2 cursor-pointer leading-snug h-9 pt-0.5"
                              >
                                {video.titulo}
                              </h4>
                              <div className="flex justify-between items-center text-[10px] text-slate-400 select-none pt-1">
                                <span>👁 {video.views} acessos</span>
                                <span className="text-[10px] font-mono font-bold text-emerald-500">Assistir ▶</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Official Registration Form Banner Section */}
            <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 text-left shadow-realistic-lg bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 border border-emerald-900/40 select-none">
              <div className="absolute top-[-20%] right-[-10%] w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
              <div className="relative z-10 space-y-4 max-w-2xl">
                <span className="text-[10px] font-black tracking-widest text-[#f59e0b] uppercase bg-amber-500/10 px-3 py-1 border border-amber-500/20 rounded-md">
                  Acesso ao Sistema
                </span>
                <h3 className="text-xl sm:text-3xl font-display font-black text-white leading-tight">
                  Formulário Oficial de Cadastro AGHUse
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                  Faça o download do formulário oficial de liberação de login de operador do hospital. Preencha seus dados cadastrais, colha a assinatura física do chefe responsável e encaminhe à TI para ativação do prontuário.
                </p>
                <div className="pt-2">
                  <a 
                    href="cadastro_aghuse/cadastro.html" 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#f59e0b] hover:bg-amber-400 font-display font-black text-xs sm:text-sm text-slate-950 rounded-xl transition shadow-lg shadow-amber-950/25 cursor-pointer hover:scale-[1.02]"
                  >
                    <FileSpreadsheet className="w-4.5 h-4.5" />
                    <span>Abrir Cadastro Online</span>
                  </a>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* --- EXPLICIT COMPONENT VIEW: VIDEOS CATALOGUE --- */}
        {activeMenu === 'videos' && (
          <div className="space-y-8 animate-fade-in text-left">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-white">
                Biblioteca de Vídeos de Treinamento
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl font-light">
                Assista a tutoriais passo a passo produzidos especificamente pelos especialistas em sistemas do hospital para auxiliar sua rotina médica e laboratorial.
              </p>
            </div>

            {/* In-view categories tags filtering list */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {[
                { id: 'TODOS', label: '🎛️ Todos Módulos' },
                { id: 'INTERNACAO', label: '🏥 Internação' },
                { id: 'EMERGENCIA', label: '🚨 Emergência' },
                { id: 'EXAMES', label: '🔬 Exames / SADT' },
                { id: 'AMBULATORIO', label: '📅 Ambulatório' },
                { id: 'ESTOQUE', label: '📦 Estoque' },
                { id: 'FATURAMENTO', label: '💰 Faturamento' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveModFilter(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${activeModFilter === cat.id ? 'bg-brand-green text-slate-950 font-black shadow shadow-brand-green/25' : theme === 'light-slate' ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-slate-900/50 text-slate-400 border border-slate-800 hover:text-white'}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {getFilteredVideos().length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {getFilteredVideos().map((video) => {
                  const originalIndex = videos.indexOf(video);
                  return (
                    <div 
                      key={originalIndex}
                      className={`rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.03] p-3 text-left group relative ${getCardBgClass()}`}
                    >
                      {isEditMode && (
                        <div className="absolute top-4 left-4 z-40 flex flex-col gap-1.5 select-none">
                          <button 
                            onClick={(e) => removeVideoItem(e, originalIndex)}
                            className="bg-red-655 bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] px-2.5 py-1 rounded-md shadow-lg cursor-pointer"
                          >
                            Excluir
                          </button>
                        </div>
                      )}

                      <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-850">
                        {video.capa ? (
                          <img 
                            src={`trumbnail/${video.capa}`} 
                            alt={video.titulo} 
                            className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                              const parent = (e.target as HTMLElement).parentElement;
                              if (parent) {
                                parent.innerHTML = `<div class="w-full h-full bg-gradient-to-tr ${getGradientForTitle(video.titulo)} flex flex-col items-center justify-center p-3 text-center"><i class="w-6 h-6 text-white/50 mb-1" data-lucide="video"></i></div>`;
                              }
                            }}
                          />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-tr ${getGradientForTitle(video.titulo)} flex flex-col items-center justify-center p-3`}>
                            <VideoIcon className="w-6 h-6 text-white/50 mb-1" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-200">
                          <button 
                            onClick={() => triggerPlayVideo(video, originalIndex)}
                            className="w-10 h-10 bg-brand-green text-slate-950 rounded-full flex items-center justify-center shadow-lg cursor-pointer"
                          >
                            <Play className="w-4.5 h-4.5 fill-slate-950 text-slate-950 translate-x-0.5" />
                          </button>
                        </div>
                      </div>

                      <div className="pt-3 space-y-1.5 text-left">
                        <span className={`inline-block px-2 py-0.5 text-[9px] rounded font-bold uppercase select-none ${getModColorBadge(video.modulo)}`}>
                          {getModNameLocalized(video.modulo)}
                        </span>
                        <h4 className="font-display font-bold text-xs text-white line-clamp-2 h-9 leading-snug">
                          {video.titulo}
                        </h4>
                        <div className="flex justify-between items-center text-[10px] text-slate-400 select-none pt-1">
                          <span>👁 {video.views} visualizações</span>
                          <span className="text-[10px] font-mono font-bold text-emerald-500">PLAY ▶</span>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20 space-y-3 rounded-2xl border border-dashed border-slate-750">
                <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="text-slate-400 text-sm">Nenhum treinamento localizado baseado na sua pesquisa de vídeos.</p>
              </div>
            )}
          </div>
        )}

        {/* --- EXPLICIT COMPONENT VIEW: MANUALS CATALOGUE --- */}
        {activeMenu === 'manuais' && (
          <div className="space-y-8 animate-fade-in text-left">
            <div className="space-y-2 text-left">
              <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-white">
                Procedimentos Operacionais e Manuais PDF
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl font-light">
                Consulte documentações técnicas, manuais esquematizados e apostilas operacionais completas para auxiliar os processos administrativos do hospital.
              </p>
            </div>

            {/* In-view categories tags filtering list */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {[
                { id: 'TODOS', label: '🎛️ Todos Manuais' },
                { id: 'INTERNACAO', label: '🏥 Internação' },
                { id: 'EMERGENCIA', label: '🚨 Emergência' },
                { id: 'EXAMES', label: '🔬 Exames / SADT' },
                { id: 'AMBULATORIO', label: '📅 Ambulatório' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveManualFilter(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${activeManualFilter === cat.id ? 'bg-[#f59e0b] text-slate-950 font-black shadow shadow-amber-500/25' : theme === 'light-slate' ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-slate-900/50 text-slate-400 border border-slate-800 hover:text-white'}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {getFilteredManuais().length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {getFilteredManuais().map((manual, idx) => {
                  const originalIndex = manuais.indexOf(manual);
                  return (
                    <div 
                      key={originalIndex}
                      onClick={() => triggerViewManual(manual, originalIndex)}
                      className={`rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.04] p-3 text-left group relative cursor-pointer ${getCardBgClass()}`}
                    >
                      {isEditMode && (
                        <div className="absolute top-4 left-4 z-40 select-none" onClick={(e) => e.stopPropagation()}>
                          <button 
                            onClick={(e) => removeManualItem(e, originalIndex)}
                            className="bg-red-650 hover:bg-red-700 text-white font-bold text-[10px] px-2 py-1 rounded-md shadow-lg"
                          >
                            Excluir
                          </button>
                        </div>
                      )}

                      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-950 border border-slate-850/40">
                        {manual.capa ? (
                          <img 
                            src={`trumbnail/${manual.capa}`} 
                            alt={manual.titulo} 
                            className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                              const parent = (e.target as HTMLElement).parentElement;
                              if (parent) {
                                parent.innerHTML = `<div class="w-full h-full bg-gradient-to-tr ${getGradientForTitle(manual.titulo)} flex flex-col items-center justify-center p-3 text-center"><i class="w-8 h-8 text-white/50 mb-1" data-lucide="file-text"></i></div>`;
                              }
                            }}
                          />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-tr ${getGradientForTitle(manual.titulo)} flex flex-col items-center justify-center p-3 text-center`}>
                            <FileText className="w-8 h-8 text-white/40 mb-1" />
                          </div>
                        )}
                        <div className="absolute top-2.5 right-2.5 bg-red-600 font-display font-black text-[9px] px-2 py-0.5 rounded shadow text-white">
                          PDF
                        </div>
                        <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-200">
                          <BookOpen className="w-8 h-8 text-amber-500 animate-bounce" />
                        </div>
                      </div>

                      <div className="pt-3 space-y-1">
                        <h4 className="font-display font-semibold text-[11px] leading-snug tracking-tight text-left text-slate-100 line-clamp-2 hover:underline h-8">
                          {manual.titulo}
                        </h4>
                        <div className="flex justify-between items-center text-[9px] text-[#f59e0b] font-black tracking-wide uppercase select-none pt-1">
                          <span>{manual.modulo}</span>
                          <span className="flex items-center gap-1 text-[10px] text-slate-400 font-medium lowercase">
                            <Eye className="w-3.5 h-3.5 text-slate-500" />
                            {manual.views || 0} acessos
                          </span>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20 space-y-3 rounded-2xl border border-dashed border-slate-750">
                <FileText className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="text-slate-400 text-sm">Nenhum documento ou guia PDF localizado para esta pesquisa.</p>
              </div>
            )}
          </div>
        )}

      </main>

      {/* FOOTER METRICS INFO */}
      <footer className="text-center py-8 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-800/10 dark:border-slate-800/40 select-none">
        <p>© 2026 AGHUse Play | Tecnologia, Inovação e Integração em Saúde Hospitalar</p>
      </footer>

      {/* --- MODAL DIALOGS CONTAINER --- */}
      
      {/* 1. PLAY VIDEO MODAL (W/ INTERACTIVE SIMULATION OPTION) */}
      {activePlayVideo && (
        <div 
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 bg-slate-950/95 backdrop-blur-md animate-fade-in text-left"
          onClick={() => setActivePlayVideo(null)}
        >
          <div 
            className="w-full max-w-4xl bg-[#0f172a] border border-slate-800 rounded-3xl overflow-hidden shadow-realistic-lg text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-950/60 select-none">
              <div className="flex items-center gap-2">
                <VideoIcon className="w-5 h-5 text-brand-green animate-pulse" />
                <h3 className="font-display font-extrabold text-sm sm:text-base text-white truncate max-w-md sm:max-w-xl">
                  Treinamento: <span className="text-brand-green">{activePlayVideo.video.titulo}</span>
                </h3>
              </div>
              <button 
                onClick={() => setActivePlayVideo(null)} 
                className="p-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-450 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Toggle tabs to switch between video play vs simulator simulation */}
            <div className="flex border-b border-slate-800/80 bg-slate-950 p-1.5 select-none gap-2">
              <button 
                onClick={() => setVideoPlayMode('video')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${videoPlayMode === 'video' ? 'bg-brand-green text-slate-950 font-black shadow-md shadow-brand-green/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'}`}
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Vídeo Demonstração MP4</span>
              </button>
              <button 
                onClick={() => { setVideoPlayMode('simulator'); setSimStep(0); }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${videoPlayMode === 'simulator' ? 'bg-brand-green text-slate-950 font-black shadow-md shadow-brand-green/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'}`}
              >
                <Bookmark className="w-4 h-4" />
                <span>Fazer Simulação Interativa</span>
              </button>
            </div>

            <div className="bg-slate-950 aspect-video relative flex flex-col items-center justify-center overflow-hidden">
              {videoPlayMode === 'video' ? (
                <div className="relative w-full h-full bg-black flex items-center justify-center animate-fade-in">
                  <video 
                    id="aghuse-real-video"
                    src={`videos/${activePlayVideo.video.arquivo}`}
                    controls 
                    autoPlay 
                    className="w-full h-full object-contain max-h-[500px]"
                    onError={(e) => {
                      const videoEl = e.currentTarget;
                      videoEl.style.display = 'none';
                      const parent = videoEl.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="text-center p-8 space-y-3">
                            <VideoOff class="w-12 h-12 text-slate-500 mx-auto" />
                            <p class="text-xs text-slate-300 font-bold max-w-sm mx-auto leading-relaxed">
                              O arquivo de vídeo <b class="text-amber-500 font-mono">${activePlayVideo.video.arquivo}</b> não está sincronizado no servidor local ainda. Use as ferramentas de administração ou clique na aba <b>"Fazer Simulação Interativa"</b> para guiar seu fluxo de passos!
                            </p>
                          </div>
                        `;
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="absolute inset-0 w-full h-full flex flex-col items-stretch justify-between bg-slate-900 z-10 select-none text-white animate-fade-in text-left">
                  <div className="bg-[#0c1322] px-5 py-2.5 flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800">
                    <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-ping"></span>
                      <span>MOMENTO SIMULACRO</span>
                    </span>
                    <span className="font-mono text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                      Etapa {simStep + 1} de {VIDEO_STEPS.length}
                    </span>
                  </div>

                  <div className="flex-1 flex flex-col md:flex-row items-stretch overflow-hidden">
                    
                    {/* Interactive center stage */}
                    <div className="flex-1 bg-slate-950 relative flex items-center justify-center p-6 sm:p-12 overflow-hidden text-left">
                      <div className="w-full max-w-md aspect-video rounded-xl bg-slate-900 border border-slate-800/80 p-5 shadow-realistic-lg text-left flex flex-col justify-between space-y-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 w-24 h-24 rounded-full bg-emerald-500/5 blur-xl"></div>
                        <div className="space-y-2 py-2 text-left relative z-10">
                          <label className="text-[10px] font-bold text-[#f59e0b] uppercase tracking-widest block">
                            AÇÃO DO FLUXO - PASSO {simStep + 1}
                          </label>
                          <p className="text-base font-bold text-white text-left">
                            {VIDEO_STEPS[simStep]?.title}
                          </p>
                          <p className="text-xs text-slate-450 leading-relaxed font-light text-left">
                            {VIDEO_STEPS[simStep]?.text}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Navigation buttons block for simulate */}
                    <div className="w-full md:w-64 bg-slate-900 px-6 py-6 border-t md:border-t-0 md:border-l border-slate-850 flex flex-col justify-between text-left shrink-0">
                      <div className="space-y-4">
                        <span className="text-[9px] uppercase tracking-widest font-black text-emerald-400 block">
                          ROTEIRO OPERACIONAL
                        </span>
                        <div className="space-y-2">
                          {VIDEO_STEPS.map((step, sIdx) => (
                            <div 
                              key={sIdx} 
                              onClick={() => setSimStep(sIdx)}
                              className={`p-2.5 rounded-lg text-xs leading-normal font-semibold border transition cursor-pointer ${simStep === sIdx ? 'bg-slate-800 text-white border-brand-green' : 'bg-slate-950/45 text-slate-500 border-transparent hover:text-slate-350'}`}
                            >
                              {sIdx + 1}. {step.title}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-6 select-none">
                        <button 
                          disabled={simStep === 0} 
                          onClick={() => setSimStep(prev => Math.max(0, prev - 1))}
                          className="flex-1 py-2 bg-slate-800 hover:bg-slate-750 disabled:opacity-30 disabled:pointer-events-none rounded-xl text-xs transition font-black cursor-pointer text-white"
                        >
                          Voltar
                        </button>
                        {simStep < VIDEO_STEPS.length - 1 ? (
                          <button 
                            onClick={() => setSimStep(prev => Math.min(VIDEO_STEPS.length - 1, prev + 1))}
                            className="flex-1 py-2 bg-brand-green text-slate-950 font-black rounded-xl text-xs hover:bg-emerald-400 transition cursor-pointer"
                          >
                            Avançar
                          </button>
                        ) : (
                          <button 
                            onClick={() => setVideoPlayMode('video')}
                            className="flex-1 py-2 bg-amber-500 text-slate-950 font-black rounded-xl text-xs hover:bg-amber-400 transition cursor-pointer"
                          >
                            Finalizar
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. SUGGESTIONS MODAL POPUP */}
      {showFeedbackModal && (
        <div 
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowFeedbackModal(false)}
        >
          <div 
            className="w-full max-w-md bg-[#111827] border border-slate-800 rounded-2xl p-6 text-left shadow-realistic-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-display font-extrabold text-base text-white flex items-center gap-1.5">
                <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500/20 animate-pulse" />
                <span>Enviar Sugestão / Feedback</span>
              </h3>
              <button 
                onClick={() => setShowFeedbackModal(false)}
                className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-black text-slate-400 block mb-1">Seu Nome completo</label>
                <input 
                  type="text" 
                  required 
                  value={feedNome} 
                  onChange={(e) => setFeedNome(e.target.value)}
                  placeholder="Nome do colaborador" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-white outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-black text-slate-400 block mb-1">Seu Setor de atuação</label>
                <input 
                  type="text" 
                  required 
                  value={feedSetor} 
                  onChange={(e) => setFeedSetor(e.target.value)}
                  placeholder="Ex: Bloco Cirúrgico, Posto 4ºAndar" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-white outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-black text-slate-400 block mb-1">Sugestão / Qual fluxo você precisa de uma aula?</label>
                <textarea 
                  rows={4} 
                  required 
                  value={feedTexto}
                  onChange={(e) => setFeedTexto(e.target.value)}
                  placeholder="Escreva quais manuais faltaram ou qual fluxo operacional você quer que a TI grave no AGHUse Play..." 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-white outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 resize-none text-left"
                ></textarea>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  className="w-full py-2.5 bg-amber-500 text-slate-950 font-black rounded-lg text-xs hover:bg-amber-450 transition cursor-pointer"
                >
                  Enviar Sugestão de Fluxo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. TI SUPPORT MODAL DIALOG */}
      {showSuporteModal && (
        <div 
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowSuporteModal(false)}
        >
          <div 
            className="w-full max-w-sm bg-[#111827] border border-slate-800 rounded-2xl p-6 text-left shadow-realistic-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-500">
                  <Phone className="w-5 h-5 fill-yellow-500/10 animate-shake" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-sm text-white text-center">Suporte Técnico TI & AGHUse</h3>
                  <p className="text-[10px] text-slate-500 font-mono uppercase text-center">Atendimento no Horário Comercial</p>
                </div>
              </div>
              <button 
                onClick={() => setShowSuporteModal(false)}
                className="p-1 rounded bg-slate-800 text-slate-450 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black block mb-1 text-center">Ramal Interno TI</p>
                <p className="text-base font-black text-white font-mono block text-center">3184-3950 / 3933 </p>
              </div>
              <div>
                  <h3 className="font-display font-extrabold text-sm text-white text-center">Se precisa de ajuda, depois de consultar nossos vídeos e manuais. Entrar nos canais abaixo:</h3>
                  
              </div>
            

              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
                <a
                  href="https://wa.me/5581994882732?text=Registro%20de%20chamado%20AGHUse%20TI%3A%20%5Bdescreva%20o%20problema%20aqui%5D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-slate-500 uppercase tracking-widest font-black block mb-1 text-center">
                  
                  <p >Clique para abrir o WhatsApp</p>
                  <p className="text-base font-black text-brand-green font-mono block text-center">(81) 9.9488-2732</p>
                </a>
              
              </div>
              

              <a
                href="https://wa.me/5581994882732?text=Registro%20de%20chamado%20AGHUse%20TI%3A%20%5Bdescreva%20o%20problema%20aqui%5D"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-amber-500 text-slate-950 font-black rounded-xl text-xs transition hover:bg-amber-400 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Registrar chamado
              </a>

              <button 
                onClick={() => setShowSuporteModal(false)} 
                className="w-full py-2 px-4 bg-slate-80s bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. ADMIN CONTROL PANEL MODAL */}
      {showAdminModal && (
        <div 
          className="fixed inset-0 z-[1000] flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowAdminModal(false)}
        >
          <div 
            className="w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl p-5 sm:p-7 bg-[#111827] border border-slate-800 shadow-realistic-lg relative text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setShowAdminModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {!isAdminAuthenticated ? (
              <div className="space-y-5 max-w-sm mx-auto py-8">
                <div className="space-y-2 text-center">
                  <span className="w-11 h-11 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green mx-auto mb-2">
                    <Lock className="w-5 h-5" />
                  </span>
                  <h3 className="font-display font-extrabold text-base text-white">Login Administrativo AGHUse Play</h3>
                  <p className="text-xs text-slate-455 text-slate-500">
                    Apenas para operadores de TI e faturamento hospitalar qualificados.
                  </p>
                </div>

                <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-black tracking-wider block mb-1">Nome de Usuário</label>
                    <input 
                      type="text" 
                      required 
                      value={adminUser}
                      onChange={(e) => setAdminUser(e.target.value)}
                      placeholder="admin" 
                      className="w-full bg-slate-955 bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-white focus:border-brand-green outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-black tracking-wider block mb-1">Senha de Segurança</label>
                    <input 
                      type="password" 
                      required 
                      value={adminPass}
                      onChange={(e) => setAdminPass(e.target.value)}
                      placeholder="••••••••" 
                      className="w-full bg-slate-955 bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-white focus:border-brand-green outline-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button 
                      type="submit" 
                      className="w-full py-2.5 bg-brand-green text-slate-950 font-black rounded-xl text-xs hover:bg-emerald-500 transition cursor-pointer"
                    >
                      Autenticar Credenciais
                    </button>
                  </div>
                </form>
                {/*<p className="text-[10px] text-slate-500 font-mono text-center pt-2">
                  DICA: Usuário: <b className="text-emerald-500">admin</b> / Senha: <b className="text-emerald-500">Sucesso.2026</b>
                </p>*/}
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Title area */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-800 gap-3">
                  <div>
                    <h3 className="text-lg sm:text-2xl font-display font-black text-white flex items-center gap-2">
                      <span>⚙️ Painel de Gestão e Admin</span>
                    </h3>
                    <p className="text-xs text-slate-500">Estatísticas consolidaddas em tempo real e adição de capacitações operacionais.</p>
                  </div>
                  <button 
                    onClick={() => { setIsAdminAuthenticated(false); setIsEditMode(false); }}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/25 transition cursor-pointer"
                  >
                    Efetuar Logout
                  </button>
                </div>

                {/* Dashboard counts widget */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 text-left">
                  <div className="p-3.5 rounded-xl border bg-slate-950/40 border-slate-800">
                    <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 mb-1 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span>AO VIVO</span>
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase font-black">Visitas de Operadores</div>
                    <div className="text-lg sm:text-2xl font-black mt-0.5 text-white">1.420</div>
                  </div>

                  <div className="p-3.5 rounded-xl border bg-slate-950/40 border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase font-black mb-1">Visualizações de Aulas</div>
                    <div className="text-lg sm:text-2xl font-black text-white mt-1">
                      {videos.reduce((total, v) => total + (v.views || 0), 0)}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border bg-slate-950/40 border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase font-black mb-1">Treinamentos no Ar</div>
                    <div className="text-lg sm:text-2xl font-black text-[#f59e0b] mt-1">
                      {videos.length} vídeos
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border bg-slate-950/40 border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase font-black mb-1">Manuais PDF Cadastrados</div>
                    <div className="text-lg sm:text-2xl font-black text-rose-400 mt-1">
                      {manuais.length} arquivos
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border col-span-2 sm:col-span-1 bg-slate-950/40 border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase font-black mb-1">Visualizações de PDFs</div>
                    <div className="text-lg sm:text-2xl font-black text-rose-500 mt-1">
                      {manuais.reduce((total, m) => total + (m.views || 0), 0)} acessos
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Left Column forms */}
                  <div className="space-y-6">
                    
                    {/* Add video form */}
                    <div className="p-4 rounded-xl border bg-slate-950/30 border-slate-800/80 space-y-3.5 text-left">
                      <div className="text-xs font-black uppercase text-brand-green tracking-wider">
                        🎬 Adicionar Vídeo de Treinamento
                      </div>
                      <form onSubmit={handleAddNewVideo} className="space-y-2.5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input 
                            type="text" 
                            required
                            value={nvTitulo}
                            onChange={(e) => setNvTitulo(e.target.value)}
                            placeholder="Título (Ex: Trocar Equipes)" 
                            className="p-2 text-xs rounded border bg-slate-950 border-slate-800 text-white focus:border-brand-green outline-none"
                          />
                          <input 
                            type="text" 
                            required
                            value={nvArquivo}
                            onChange={(e) => setNvArquivo(e.target.value)}
                            placeholder="Arquivo (Ex: trocarequipes.mp4)" 
                            className="p-2 text-xs rounded border bg-slate-950 border-slate-800 text-white focus:border-brand-green outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input 
                            type="text" 
                            value={nvCapa}
                            onChange={(e) => setNvCapa(e.target.value)}
                            placeholder="Capa Opcional (capa.png)" 
                            className="p-2 text-xs rounded border bg-slate-950 border-slate-800 text-white focus:border-brand-green outline-none"
                          />
                          <select 
                            value={nvModulo}
                            onChange={(e) => setNvModulo(e.target.value)}
                            className="p-2 text-xs rounded border bg-slate-950 border-slate-800 text-white focus:border-brand-green outline-none"
                          >
                            <option value="INTERNACAO">🏥 Internação</option>
                            <option value="EMERGENCIA">🚨 Emergência</option>
                            <option value="EXAMES">🔬 Exames</option>
                            <option value="AMBULATORIO">📅 Ambulatório</option>
                            <option value="ESTOQUE">📦 Estoque</option>
                            <option value="FATURAMENTO">💰 Faturamento</option>
                          </select>
                        </div>
                        <button 
                          type="submit" 
                          className="w-full py-2 bg-slate-850 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition border border-slate-750 cursor-pointer"
                        >
                          Publicar Vídeo de Treinamento
                        </button>
                      </form>
                    </div>

                    {/* Add Letreiro News and List of News */}
                    <div className="p-4 rounded-xl border bg-slate-950/30 border-slate-800/80 space-y-3.5 text-left">
                      <div className="text-xs font-black uppercase text-brand-green tracking-wider">
                        📢 Mural Informativo Letreiro Dinâmico
                      </div>
                      <form onSubmit={handleAddNewAviso} className="space-y-2">
                        <textarea 
                          value={newAviso}
                          required
                          onChange={(e) => setNewAviso(e.target.value)}
                          placeholder="Nova notícia ou letreiro do painel..." 
                          className="w-full p-2.5 text-xs rounded border h-16 bg-slate-950 border-slate-800 text-white focus:border-brand-green outline-none resize-none"
                        ></textarea>
                        <div className="flex gap-2">
                          <button 
                            type="submit" 
                            className="flex-1 py-1.5 bg-slate-850 border border-slate-750 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition"
                          >
                            Adicionar Letreiro
                          </button>
                          <button 
                            type="button" 
                            onClick={() => { if (confirm("Apagar todos as notícias?")) setNoticias([]); }}
                            className="px-3 py-1.5 bg-red-650/10 text-red-400 border border-red-500/20 hover:bg-red-650/20 text-xs font-bold rounded-lg transition"
                          >
                            Limpar Tudo
                          </button>
                        </div>
                      </form>

                      {/* Notícias list */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest block">Mensagens Ativas</span>
                        <div className="max-h-24 overflow-y-auto pr-1">
                          {noticias.map((not, index) => (
                            <div key={index} className="flex justify-between items-center text-xs p-2 rounded bg-slate-950/80 border border-slate-850 mb-1">
                              <span className="truncate pr-3">{not.texto}</span>
                              <button 
                                onClick={() => removeAvisoItem(index)}
                                className="text-red-500 hover:text-red-400 cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Direct Layout deletions mode toggler */}
                    <div className="p-4 rounded-xl border bg-slate-950/30 border-slate-800/80 space-y-2 text-left">
                      <div className="text-xs font-black uppercase text-slate-400 tracking-wider">
                        🛠️ Administração do Catálogo Direto
                      </div>
                      <button 
                        onClick={() => setIsEditMode(!isEditMode)}
                        className={`w-full py-2.5 font-bold text-xs rounded-lg cursor-pointer transition-all border ${isEditMode ? 'bg-red-600 border-red-500 text-white shadow-lg' : 'bg-slate-850 hover:bg-slate-800 text-slate-350 border-slate-750'}`}
                      >
                        {isEditMode ? "🔴 Desativar Modo Edição e Exclusão" : "⚙️ Ativar Modo Edição e Exclusão"}
                      </button>
                      <p className="text-[10px] text-slate-500 leading-normal">
                        Ao ligar o modo edição e fechar o painel, botões extras de <b>Exclusão</b> e <b>Edição</b> aparecerão sobre todos os cards de vídeos e manuais das páginas.
                      </p>
                    </div>

                  </div>

                  {/* Right Column details */}
                  <div className="space-y-6 text-left">
                    
                    {/* Add Technical Manual */}
                    <div className="p-4 rounded-xl border bg-slate-950/30 border-slate-800/80 space-y-3 text-left">
                      <div className="text-xs font-black uppercase text-brand-green tracking-wider">
                        📄 Adicionar Manual Técnico (PDF)
                      </div>
                      <form onSubmit={handleAddNewManual} className="space-y-2.5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input 
                            type="text" 
                            required
                            value={nmTitulo}
                            onChange={(e) => setNmTitulo(e.target.value)}
                            placeholder="Título do Manual" 
                            className="p-2 text-xs rounded border bg-slate-950 border-slate-800 text-white focus:border-brand-green outline-none"
                          />
                          <input 
                            type="text" 
                            required
                            value={nmArquivo}
                            onChange={(e) => setNmArquivo(e.target.value)}
                            placeholder="Arquivo (Manual-Internacao.pdf)" 
                            className="p-2 text-xs rounded border bg-slate-950 border-slate-800 text-white focus:border-brand-green outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input 
                            type="text" 
                            value={nmCapa}
                            onChange={(e) => setNmCapa(e.target.value)}
                            placeholder="Capa do Manual (grades.png)" 
                            className="p-2 text-xs rounded border bg-slate-950 border-slate-800 text-white focus:border-brand-green outline-none"
                          />
                          <select 
                            value={nmModulo}
                            onChange={(e) => setNmModulo(e.target.value)}
                            className="p-2 text-xs rounded border bg-slate-950 border-slate-800 text-white focus:border-brand-green outline-none"
                          >
                            <option value="AMBULATORIO">📅 Ambulatório</option>
                            <option value="INTERNACAO">🏥 Internação</option>
                            <option value="EMERGENCIA">🚨 Emergência</option>
                            <option value="EXAMES">🔬 Exames</option>
                          </select>
                        </div>
                        <button 
                          type="submit" 
                          className="w-full py-2 bg-slate-850 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition border border-slate-750 cursor-pointer"
                        >
                          Salvar Manual Técnico
                        </button>
                      </form>
                    </div>

                    {/* View Logs list */}
                    <div className="p-4 rounded-xl border bg-slate-950/30 border-slate-800/80 space-y-3 text-left">
                      <div className="text-xs font-black uppercase text-emerald-400 tracking-wider flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Eye className="w-4 h-4 text-emerald-400" />
                          <span>Registro Real de Visualizações</span>
                        </span>
                        <button 
                          onClick={() => { if (confirm("Limpar todo o registro de acessos?")) setViewLogs([]); }}
                          className="text-[9px] bg-red-655/10 bg-red-950/40 text-red-450 border border-red-500/20 px-1.5 py-0.5 rounded font-black cursor-pointer hover:bg-red-500/20 transition-all"
                        >
                          Limpar
                        </button>
                      </div>
                      <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                        {viewLogs.length > 0 ? (
                          viewLogs.map((log) => (
                            <div key={log.id} className="p-2.5 rounded-lg text-[11px] bg-slate-950 border border-slate-850 flex items-start gap-2.5 justify-between">
                              <div className="flex items-start gap-2 min-w-0">
                                <span className={`p-1 rounded mt-0.5 flex-shrink-0 ${log.type === 'video' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                  {log.type === 'video' ? <Play className="w-3 h-3 fill-current" /> : <FileText className="w-3 h-3" />}
                                </span>
                                <div className="min-w-0">
                                  <span className="font-bold text-white block truncate leading-tight">{log.title}</span>
                                  <span className="text-[9px] text-slate-500 uppercase font-bold">{log.module} • {log.type === 'video' ? 'Vídeo' : 'Manual PDF'}</span>
                                </div>
                              </div>
                              <span className="text-[9px] text-slate-400 font-mono whitespace-nowrap self-center">{log.date}</span>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-6 text-xs text-slate-500 italic">Nenhum acesso registrado ainda.</div>
                        )}
                      </div>
                    </div>

                    {/* Feedback Logs List */}
                    <div className="p-4 rounded-xl border bg-slate-950/30 border-slate-800/80 space-y-3 text-left">
                      <div className="text-xs font-black uppercase text-amber-500 tracking-wider flex items-center gap-1.5">
                        <MessageSquare className="w-4 h-4" />
                        <span>Sugestões Gravadas da TI</span>
                      </div>
                      <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1">
                        {feedbacks.length > 0 ? (
                          feedbacks.map((f, i) => (
                            <div key={f.id || i} className="p-3 rounded-lg text-xs bg-slate-950 border border-slate-850 space-y-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="font-bold text-brand-green block">{f.nome}</span>
                                  <span className="text-[10px] text-slate-500">Setor: {f.setor} | {f.data}</span>
                                </div>
                                <button 
                                  onClick={() => removeFeedbackLog(i)}
                                  className="text-[10px] text-slate-500 hover:text-red-400 font-bold hover:underline cursor-pointer"
                                >
                                  Remover
                                </button>
                              </div>
                              <p className="italic text-slate-300 font-light text-[11px] leading-relaxed pt-1 text-left">
                                "{f.texto}"
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-6 text-xs text-slate-500 italic">Nenhum feedback registrado até o momento.</div>
                        )}
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            )}
          </div>
        </div>
      )}

      {/* --- MOBILE ADAPTIVE BOTTOM NAVIGATION RAIL --- */}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 z-[500] border-t backdrop-blur-md flex items-center justify-around h-16 px-2 shadow-2xl select-none transition-all duration-500 ${theme === 'light-slate' ? 'bg-white/95 border-slate-250 text-slate-850 shadow-slate-300' : 'bg-[#0b0f17]/95 border-slate-850 text-slate-200'}`}>
        <button 
          onClick={() => { setActiveMenu('inicio'); setActiveModFilter('TODOS'); }}
          className={`flex flex-col items-center justify-center flex-1 h-full cursor-pointer transition ${activeMenu === 'inicio' ? 'text-brand-green scale-105' : 'text-slate-400'}`}
        >
          <Play className="w-5 h-5 fill-current" />
          <span className="text-[9px] font-bold mt-1">Início</span>
        </button>
        <button 
          onClick={() => setActiveMenu('videos')}
          className={`flex flex-col items-center justify-center flex-1 h-full cursor-pointer transition ${activeMenu === 'videos' ? 'text-brand-green scale-105' : 'text-slate-400'}`}
        >
          <VideoIcon className="w-5 h-5" />
          <span className="text-[9px] font-bold mt-1">Vídeos</span>
        </button>
        <button 
          onClick={() => setActiveMenu('manuais')}
          className={`flex flex-col items-center justify-center flex-1 h-full cursor-pointer transition ${activeMenu === 'manuais' ? 'text-brand-green scale-105' : 'text-slate-400'}`}
        >
          <FileText className="w-5 h-5" />
          <span className="text-[9px] font-bold mt-1">Manuais</span>
        </button>
        <button 
          onClick={() => setShowFeedbackModal(true)}
          className="flex flex-col items-center justify-center flex-1 h-full cursor-pointer text-amber-500"
        >
          <Sparkles className="w-5 h-5 fill-current/25" />
          <span className="text-[9px] font-bold mt-1">Sugerir</span>
        </button>
      </nav>

    </div>
  );
}
