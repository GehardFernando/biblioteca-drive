/**
 * Let's Be Readers - Interatividade do Protótipo
 * Dados mockados e controle de filtros, busca, modal e visualização
 */

// Dados mockados de livros simulando o que virá do Google Drive
const mockBooks = [
  {
    id: "drive-1",
    title: "O Guia do Mochileiro das Galáxias",
    author: "Douglas Adams",
    category: "Ficção Científica",
    format: "EPUB",
    size: "1.8 MB",
    sizeBytes: 1887436,
    pages: 208,
    dateAdded: "15/09/2026",
    cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
    synopsis: "As hilárias desventuras de Arthur Dent, um britânico comum resgatado da destruição da Terra por seu amigo Ford Prefect, um pesquisador de campo alienígena disfarçado.",
    driveUrl: "https://drive.google.com"
  },
  {
    id: "drive-2",
    title: "Clean Architecture: O Guia do Artesão",
    author: "Robert C. Martin (Uncle Bob)",
    category: "Tecnologia",
    format: "PDF",
    size: "6.4 MB",
    sizeBytes: 6710886,
    pages: 432,
    dateAdded: "12/09/2026",
    cover: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80",
    synopsis: "Princípios universais de arquitetura e design de software aplicáveis a qualquer linguagem, ajudando a criar sistemas robustos, manuteníveis e testáveis ao longo do tempo.",
    driveUrl: "https://drive.google.com"
  },
  {
    id: "drive-3",
    title: "Meditações",
    author: "Marco Aurélio",
    category: "Filosofia",
    format: "EPUB",
    size: "950 KB",
    sizeBytes: 972800,
    pages: 192,
    dateAdded: "10/09/2026",
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80",
    synopsis: "Uma série de reflexões pessoais do imperador romano Marco Aurélio sobre estoicismo, autocontrole, virtude, justiça e a busca de paz interior em meio às adversidades.",
    driveUrl: "https://drive.google.com"
  },
  {
    id: "drive-4",
    title: "Hábitos Atômicos",
    author: "James Clear",
    category: "Produtividade",
    format: "EPUB",
    size: "2.4 MB",
    sizeBytes: 2516582,
    pages: 320,
    dateAdded: "08/09/2026",
    cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80",
    synopsis: "Um método comprovado e simples para criar bons hábitos e se livrar dos maus. Descubra como pequenas mudanças diárias podem gerar resultados monumentais.",
    driveUrl: "https://drive.google.com"
  },
  {
    id: "drive-5",
    title: "Duna (Crônicas de Duna Vol. 1)",
    author: "Frank Herbert",
    category: "Ficção Científica",
    format: "EPUB",
    size: "3.2 MB",
    sizeBytes: 3355443,
    pages: 680,
    dateAdded: "05/09/2026",
    cover: "https://images.unsplash.com/photo-1506466010722-395aa2bef877?w=600&auto=format&fit=crop&q=80",
    synopsis: "Em um planeta deserto onde a água é a mercadoria mais preciosa e a especiaria Melange move o império, o jovem Paul Atreides enfrenta intrigas políticas e seu próprio destino cósmico.",
    driveUrl: "https://drive.google.com"
  },
  {
    id: "drive-6",
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    category: "Tecnologia",
    format: "PDF",
    size: "14.2 MB",
    sizeBytes: 14889779,
    pages: 616,
    dateAdded: "01/09/2026",
    cover: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80",
    synopsis: "O guia definitivo para entender a fundo sistemas distribuídos, processamento de dados, escalabilidade, consistência, replicação e tolerância a falhas na engenharia de software.",
    driveUrl: "https://drive.google.com"
  },
  {
    id: "drive-7",
    title: "Neuromancer",
    author: "William Gibson",
    category: "Ficção Científica",
    format: "EPUB",
    size: "1.4 MB",
    sizeBytes: 1468006,
    pages: 320,
    dateAdded: "28/08/2026",
    cover: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
    synopsis: "O romance pioneiro do Cyberpunk que cunhou o termo ciberespaço. Acompanhe Case, um ex-hacker decadente recrutado para um último e colossal golpe na matriz.",
    driveUrl: "https://drive.google.com"
  },
  {
    id: "drive-8",
    title: "Sobre a Brevidade da Vida",
    author: "Sêneca",
    category: "Filosofia",
    format: "PDF",
    size: "1.1 MB",
    sizeBytes: 1153433,
    pages: 112,
    dateAdded: "24/08/2026",
    cover: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&auto=format&fit=crop&q=80",
    synopsis: "Uma carta reflexiva de Sêneca demonstrando que a vida não é curta por natureza, mas sim que desperdiçamos a maior parte dela com preocupações supérfluas e tarefas vazias.",
    driveUrl: "https://drive.google.com"
  },
  {
    id: "drive-9",
    title: "Deep Work: Regras para o Sucesso Focado",
    author: "Cal Newport",
    category: "Produtividade",
    format: "EPUB",
    size: "2.1 MB",
    sizeBytes: 2202009,
    pages: 304,
    dateAdded: "20/08/2026",
    cover: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&auto=format&fit=crop&q=80",
    synopsis: "A habilidade de se concentrar sem distrações em tarefas cognitivamente exigentes tornou-se rara e valiosa. Um guia prático para cultivar a concentração profunda na era da distração digital.",
    driveUrl: "https://drive.google.com"
  },
  {
    id: "drive-10",
    title: "Refactoring: Aperfeiçoando o Design de Código",
    author: "Martin Fowler",
    category: "Tecnologia",
    format: "PDF",
    size: "8.9 MB",
    sizeBytes: 9332326,
    pages: 448,
    dateAdded: "15/08/2026",
    cover: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80",
    synopsis: "Como melhorar o design de código existente sem alterar seu comportamento externo. Um catálogo indispensável de técnicas de refatoração passo a passo com exemplos práticos.",
    driveUrl: "https://drive.google.com"
  },
  {
    id: "drive-11",
    title: "Fahrenheit 451",
    author: "Ray Bradbury",
    category: "Ficção Científica",
    format: "EPUB",
    size: "1.6 MB",
    sizeBytes: 1677721,
    pages: 256,
    dateAdded: "10/08/2026",
    cover: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&auto=format&fit=crop&q=80",
    synopsis: "Num futuro totalitário onde a leitura é proibida por lei, Guy Montag trabalha como bombeiro queimando livros clandestinos — até começar a questionar o propósito do seu trabalho.",
    driveUrl: "https://drive.google.com"
  },
  {
    id: "drive-12",
    title: "A Arte da Guerra",
    author: "Sun Tzu",
    category: "Filosofia",
    format: "PDF",
    size: "1.3 MB",
    sizeBytes: 1363148,
    pages: 160,
    dateAdded: "05/08/2026",
    cover: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=600&auto=format&fit=crop&q=80",
    synopsis: "O tratado militar clássico chinês com lições atemporais sobre estratégia, planejamento, liderança, adaptabilidade e resolução de conflitos sem o uso desnecessário da força.",
    driveUrl: "https://drive.google.com"
  }
];

// ==========================================================================
// Configuração de Integração com o Google Drive
// Cole abaixo a URL do seu App da Web gerada no Google Apps Script (script.google.com)
// Exemplo: "https://script.google.com/macros/s/AKfycbx.../exec"
// ==========================================================================
const GOOGLE_DRIVE_API_URL = "https://script.google.com/macros/s/AKfycbwGk2epbZ3thFo8ZJhHQDLUEZffTRobl657b6hGKMXNJUXUBtn9cSVUtgIDoHhzaW4rww/exec";

// Estado da Aplicação
let currentCategory = "all";
let currentSearch = "";
let currentSort = "recent";
let isListView = false;

// Paginação fluida para alto desempenho com coleções grandes
const PAGE_SIZE = 36;
let visibleCount = PAGE_SIZE;

// Chave de versão de cache local (invalida automaticamente caches de versões antigas garantindo 100% das capas atualizadas)
const CACHE_KEY = "drive_books_cache_v13";

// Expurgar proativamente caches legados corrompidos (mobile/desktop)
if (typeof window !== "undefined") {
  try {
    ["drive_books_cache", "drive_books_cache_v1", "drive_books_cache_v2", "drive_books_cache_v3", "drive_books_cache_v4", "drive_books_cache_v5", "drive_books_cache_v6", "drive_books_cache_v7", "drive_books_cache_v8", "drive_books_cache_v9"].forEach(k => {
      localStorage.removeItem(k);
    });
  } catch (e) {}
}

// Normalizador de chaves para casamento resiliente de capas (ignora acentos, pontuação e extensões)
function normalizeCoverKey(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\.epub$|\.pdf$/i, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

// Mapa de capas locais pré-indexadas (para reutilizar capas de alta definição nos livros do Drive)
const localCoversMap = new Map();
if (typeof window !== "undefined" && Array.isArray(window.REAL_BOOKS)) {
  window.REAL_BOOKS.forEach(b => {
    if (b.cover) {
      if (b.title) {
        localCoversMap.set(b.title.toLowerCase().trim(), b.cover);
        localCoversMap.set(normalizeCoverKey(b.title), b.cover);
      }
      if (b.fileName) {
        localCoversMap.set(b.fileName.toLowerCase().trim(), b.cover);
        localCoversMap.set(normalizeCoverKey(b.fileName), b.cover);
      }
    }
  });
}

// Catálogo ativo (com suporte a cache do Drive, dados locais ou fallback mock)
let allBooks = (() => {
  if (typeof window !== "undefined") {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    if (window.REAL_BOOKS && window.REAL_BOOKS.length > 0) {
      return window.REAL_BOOKS;
    }
  }
  return mockBooks;
})();

// Gerador de capas visuais elegantes para livros adicionados ao Drive sem capa local
function generateDynamicCoverSvg(title, author, format) {
  const safeTitle = (title || "Sem Título").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const safeAuthor = (author || "Autor Desconhecido").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const isPdf = (format || "").toUpperCase() === "PDF";
  const gradStart = isPdf ? "%23dc2626" : "%234f46e5";
  const gradEnd = isPdf ? "%23991b1b" : "%231e1b4b";

  return `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='420' viewBox='0 0 300 420'><defs><linearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'><stop offset='0%25' stop-color='${gradStart}'/><stop offset='100%25' stop-color='${gradEnd}'/></linearGradient></defs><rect width='300' height='420' fill='url(%23g)'/><rect x='10' y='10' width='280' height='400' rx='8' fill='none' stroke='%23ffffff' stroke-opacity='0.15' stroke-width='1.5'/><circle cx='150' cy='130' r='36' fill='%23ffffff' fill-opacity='0.1'/><path d='M140 140v-20a2 2 0 0 1 2-2h16v22h-16a2 2 0 0 1-2-2Z' fill='%23ffffff' fill-opacity='0.8'/><text x='150' y='210' font-family='system-ui, -apple-system, sans-serif' font-size='16' font-weight='800' fill='%23ffffff' text-anchor='middle'>${encodeURIComponent(safeTitle.substring(0, 32))}</text><text x='150' y='250' font-family='system-ui, -apple-system, sans-serif' font-size='12' font-weight='500' fill='%23cbd5e1' text-anchor='middle'>${encodeURIComponent(safeAuthor.substring(0, 26))}</text><rect x='115' y='320' width='70' height='24' rx='12' fill='%23ffffff' fill-opacity='0.15'/><text x='150' y='336' font-family='system-ui, -apple-system, sans-serif' font-size='10' font-weight='700' fill='%23ffffff' text-anchor='middle'>${format || 'EPUB'}</text></svg>`;
}

// Fallback visual para capas com erro de carregamento
const defaultFallbackCover = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='420' viewBox='0 0 300 420'><rect width='300' height='420' fill='%23111726'/><rect x='12' y='12' width='276' height='396' rx='8' fill='%230f1422' stroke='%236366f1' stroke-width='1.5' stroke-dasharray='4 4'/><circle cx='150' cy='175' r='40' fill='%236366f1' fill-opacity='0.15'/><path d='M138 185v-20a2 2 0 0 1 2-2h20v22h-20a2 2 0 0 1-2-2Z' fill='%236366f1'/><text x='150' y='240' font-family='sans-serif' font-size='14' font-weight='700' fill='%23ffffff' text-anchor='middle'>Let%27s Be Readers</text><text x='150' y='265' font-family='sans-serif' font-size='11' fill='%2394a3b8' text-anchor='middle'>Capa indispon%C3%ADvel</text></svg>";

function handleCoverError(imgElement) {
  imgElement.onerror = null;
  imgElement.src = defaultFallbackCover;
}

// Classificação Indicativa Recomendada para cada Livro (Faixa Etária)
function detectAgeRating(book) {
  if (!book) return "Livre";
  if (book.ageRating) return book.ageRating;

  const title = book.title || "";
  const author = book.author || "";
  const category = book.category || "";
  const synopsis = book.synopsis || "";
  const text = `${title} ${author} ${category} ${synopsis}`.toLowerCase();

  // 18+ (Adulto / Erótico / Conteúdo Explícito)
  const adult18 = /\b(sexo|sexual|erótic[ao]|cinquenta tons|kam[as] sutra|sadis|orgasm|sensual|prostitut|bdsm|porn[oô]|ninfeta|putaria|adult[ao]s?)\b/i;
  if (adult18.test(text)) return "18+";

  // 16+ (Terror Pesado, Violência Gráfica, Serial Killers)
  const mature16 = /\b(serial killer|psicopata|tortura|canibal|estupr|chacina|homic[ií]dio|necrom|terror psicol|stephen king|clive barker|thomas harris|exorcism)\b/i;
  if (mature16.test(text)) return "16+";

  // 14+ (Distopias, Temas Jurídicos, Políticos, Filosofia Complexa, Conflitos)
  const teen14 = /\b(direito|penal|crime|guerra|holocausto|ditadura|revolu[cç][aã]o|distopia|1984|maquiavel|nietzsche|freud|marx|admir[aá]vel mundo|suic[ií]di|trai[cç][aã]o|duna)\b/i;
  if (teen14.test(text)) return "14+";

  // 12+ (Ficção Científica, Fantasia, Negócios, Romance)
  if (category === "Ficção Científica" || category === "Fantasia & Aventura" || category === "Desenvolvimento Pessoal & Negócios" || category === "Romance") {
    return "12+";
  }
  const teen12 = /\b(magia|brux|drag[aã]o|espada|h[aá]bito|neg[oó]cios|investiment|finan[cç]|lideran[cç]|carreira|harry potter|tolkien)\b/i;
  if (teen12.test(text)) return "12+";

  if (category === "Suspense & Mistério") return "14+";
  if (category === "Filosofia & História") return "12+";

  return "Livre";
}

// Elementos DOM
const booksContainer = document.getElementById("booksContainer");
const bookCount = document.getElementById("bookCount");
const searchInput = document.getElementById("searchInput");
const categoryPillsContainer = document.getElementById("categoryPills");
const sortSelect = document.getElementById("sortSelect");
const gridModeBtn = document.getElementById("gridModeBtn");
const listModeBtn = document.getElementById("listModeBtn");
const emptyState = document.getElementById("emptyState");
const clearFiltersBtn = document.getElementById("clearFiltersBtn");
const loadMoreContainer = document.getElementById("loadMoreContainer");
const loadMoreBtn = document.getElementById("loadMoreBtn");
const loadMoreCounter = document.getElementById("loadMoreCounter");

// Elementos do Modal
const bookModal = document.getElementById("bookModal");
const modalCloseBtn = document.getElementById("modalCloseBtn");
const modalCover = document.getElementById("modalCover");
const modalFormatBadge = document.getElementById("modalFormatBadge");
const modalGenre = document.getElementById("modalGenre");
const modalSize = document.getElementById("modalSize");
const modalTitle = document.getElementById("modalTitle");
const modalAuthor = document.getElementById("modalAuthor");
const modalSynopsis = document.getElementById("modalSynopsis");
const modalFormat = document.getElementById("modalFormat");
const modalAddedDate = document.getElementById("modalAddedDate");
const modalAgeRating = document.getElementById("modalAgeRating");
const modalDownloadBtn = document.getElementById("modalDownloadBtn");
const modalKindleBtn = document.getElementById("modalKindleBtn");
const headerKindleBtn = document.getElementById("headerKindleBtn");

// Elementos do Modal Assistente do Kindle
const kindleModal = document.getElementById("kindleModal");
const kindleModalCloseBtn = document.getElementById("kindleModalCloseBtn");
const kindleBookTitle = document.getElementById("kindleBookTitle");
const kindleBookAuthor = document.getElementById("kindleBookAuthor");
const kindleBookMeta = document.getElementById("kindleBookMeta");
const kindleAmazonRegion = document.getElementById("kindleAmazonRegion");
const kindleAutoSendBtn = document.getElementById("kindleAutoSendBtn");
const kindleEmailInput = document.getElementById("kindleEmailInput");
const kindleSaveEmailBtn = document.getElementById("kindleSaveEmailBtn");
const kindleEmailSendBtn = document.getElementById("kindleEmailSendBtn");
let currentKindleBook = null;

// Toast
const toastNotification = document.getElementById("toastNotification");
const toastMessage = document.getElementById("toastMessage");
let toastTimeout;

// ==========================================================================
// SEGURANÇA & CONTROLE DE ACESSO (3 SLOTS RESTRITOS)
// ==========================================================================
const ADMIN_MASTER_KEY = "lbr_master_gehard_8f93a1c72";

// Botão de acesso ao Painel Admin e Botão de Logout no cabeçalho
const adminPanelBtn = document.getElementById("adminPanelBtn");
const logoutBtn = document.getElementById("logoutBtn");

// Gera ou recupera o identificador único permanente deste aparelho (UUID)
function getOrCreateDeviceId() {
  let id = localStorage.getItem("lbr_device_id");
  if (!id) {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      id = "dev_" + crypto.randomUUID().replace(/-/g, "").substring(0, 16);
    } else {
      id = "dev_" + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
    }
    localStorage.setItem("lbr_device_id", id);
  }
  return id;
}

const AUTH_STATUS_KEY = "lbr_club_auth_v13_locked";

// Reconhecer este computador/laptop como Autoridade Máxima permanente
function checkLaptopAuthority() {
  if (typeof window === "undefined") return false;

  const ua = navigator.userAgent || "";
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(ua);
  const isTouch = (typeof navigator.maxTouchPoints !== "undefined" && navigator.maxTouchPoints > 0);
  const isSmallScreen = (typeof window.screen !== "undefined" && (window.screen.width < 1024 || window.screen.height < 600));
  const isCoarse = (typeof window.matchMedia === "function" && window.matchMedia("(pointer: coarse)").matches);

  const isMobileDevice = isMobileUA || isSmallScreen || (isTouch && isCoarse);

  // Celulares e tablets NUNCA são considerados autoridade máxima
  if (isMobileDevice) {
    try {
      localStorage.removeItem("lbr_role");
      localStorage.removeItem("lbr_admin_key");
      localStorage.removeItem("lbr_club_auth_v12");
      localStorage.removeItem("lbr_auth_status");
    } catch(e) {}
    return false;
  }

  const isLocal = window.location.hostname === "localhost" ||
                  window.location.hostname === "127.0.0.1" ||
                  window.location.protocol === "file:" ||
                  window.location.hostname === "";

  // Detecção estrita do computador Linux desktop do Gehard (Ubuntu / Mint x86_64)
  const isGehardLaptop = typeof navigator !== "undefined" &&
                         (navigator.platform && navigator.platform.includes("Linux")) &&
                         (!isMobileDevice);

  if (isLocal || isGehardLaptop) {
    localStorage.setItem(AUTH_STATUS_KEY, "authorized");
    localStorage.setItem("lbr_role", "admin");
    localStorage.setItem("lbr_admin_key", ADMIN_MASTER_KEY);
    localStorage.setItem("lbr_device_id", "admin_laptop_gehard");
    return true;
  }

  return false;
}

// Checagem de acesso à biblioteca (redireciona para entrar.html se não autorizado)
function checkLibraryAccess() {
  // Limpeza de autorizações legadas que possam ter ficado no cache do celular
  try {
    localStorage.removeItem("lbr_auth_status");
    localStorage.removeItem("lbr_club_auth_v12");
  } catch(e) {}

  const ua = navigator.userAgent || "";
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(ua);
  const isTouch = (typeof navigator.maxTouchPoints !== "undefined" && navigator.maxTouchPoints > 0);
  const isSmallScreen = (typeof window.screen !== "undefined" && (window.screen.width < 1024 || window.screen.height < 600));
  const isCoarse = (typeof window.matchMedia === "function" && window.matchMedia("(pointer: coarse)").matches);
  const isMobileDevice = isMobileUA || isSmallScreen || (isTouch && isCoarse);

  // 1. Checa se o laptop é o do Gehard (acesso livre e imediato)
  if (checkLaptopAuthority()) {
    if (adminPanelBtn) adminPanelBtn.classList.remove("hidden");
    if (logoutBtn) logoutBtn.classList.add("hidden");
    return true;
  }

  // Celulares nunca exibem botão de admin
  if (isMobileDevice && adminPanelBtn) {
    adminPanelBtn.classList.add("hidden");
  }

  // 2. Parâmetro admin na URL (apenas desktop)
  const urlParams = new URLSearchParams(window.location.search);
  const adminParam = urlParams.get("admin");
  if (!isMobileDevice && adminParam && (adminParam.trim() === ADMIN_MASTER_KEY || adminParam.trim().toLowerCase() === "gehard")) {
    localStorage.setItem(AUTH_STATUS_KEY, "authorized");
    localStorage.setItem("lbr_role", "admin");
    localStorage.setItem("lbr_admin_key", ADMIN_MASTER_KEY);
    localStorage.setItem("lbr_device_id", "admin_laptop_gehard");
    window.history.replaceState({}, document.title, window.location.pathname);
    if (adminPanelBtn) adminPanelBtn.classList.remove("hidden");
    if (logoutBtn) logoutBtn.classList.add("hidden");
    return true;
  }

  // 3. Se visitante no celular ou outro aparelho já ativou OTP válido v13
  const isAuthorized = localStorage.getItem(AUTH_STATUS_KEY) === "authorized";
  if (isAuthorized) {
    if (!isMobileDevice && localStorage.getItem("lbr_role") === "admin" && adminPanelBtn) {
      adminPanelBtn.classList.remove("hidden");
      if (logoutBtn) logoutBtn.classList.add("hidden");
    } else {
      if (adminPanelBtn) adminPanelBtn.classList.add("hidden");
      if (logoutBtn) logoutBtn.classList.remove("hidden");
    }
    return true;
  }

  // 4. Se não estiver autorizado (ex: celular sem OTP), redireciona imediatamente para entrar.html
  const currentSearch = window.location.search;
  window.location.replace("entrar.html" + currentSearch);
  return false;
}

// Verifica em segundo plano se o acesso deste aparelho foi revogado pelo admin
async function checkDeviceRevocation() {
  if (typeof window === "undefined") return;
  const isMaster = checkLaptopAuthority();
  if (isMaster) return; // Computador do Gehard é imune

  const deviceId = getOrCreateDeviceId();
  if (!GOOGLE_DRIVE_API_URL || !deviceId) return;

  try {
    const res = await fetch(`${GOOGLE_DRIVE_API_URL}?action=validate_device&deviceId=${encodeURIComponent(deviceId)}`);
    if (res.ok) {
      const data = await res.json();
      if (data && (data.status === "unauthorized" || data.authorized === false)) {
        localStorage.removeItem(AUTH_STATUS_KEY);
        localStorage.removeItem("lbr_role");
        localStorage.removeItem("lbr_member_name");
        alert("⚠️ Seu acesso ao Clube Let's Be Readers foi revogado pelo administrador.");
        window.location.replace("entrar.html");
      }
    }
  } catch (e) {
    // Falhas de rede temporárias não bloqueiam offline
  }
}

// Configura botão de desconectar / revogar este aparelho
function setupLogoutButton() {
  if (!logoutBtn) return;
  logoutBtn.onclick = () => {
    if (confirm("Deseja realmente sair e desconectar este aparelho do Clube Let's Be Readers?\n\nPara acessar a biblioteca novamente, será necessário um novo código OTP emitido pelo administrador.")) {
      const deviceId = getOrCreateDeviceId();
      try {
        if (GOOGLE_DRIVE_API_URL && deviceId) {
          fetch(`${GOOGLE_DRIVE_API_URL}?action=guest_logout&deviceId=${encodeURIComponent(deviceId)}`).catch(() => {});
        }
      } catch (e) {}

      localStorage.removeItem(AUTH_STATUS_KEY);
      localStorage.removeItem("lbr_role");
      localStorage.removeItem("lbr_member_name");
      window.location.replace("entrar.html");
    }
  };
}

// Inicialização da Aplicação
document.addEventListener("DOMContentLoaded", async () => {
  setupEventListeners();
  setupLogoutButton();

  // Executa validação de autoridade e segurança
  const canAccess = checkLibraryAccess();
  if (!canAccess) {
    return;
  }

  // Checagem em background de revogação de aparelho (convidados)
  checkDeviceRevocation();

  // Render inicial com os dados disponíveis
  buildCategoryPills();
  renderBooks();

  // Sincronização em tempo real com o Google Drive
  if (GOOGLE_DRIVE_API_URL && GOOGLE_DRIVE_API_URL.trim() !== "") {
    syncWithGoogleDrive();
  } else if (allBooks === mockBooks) {
    try {
      const res = await fetch("books.json");
      if (res.ok) {
        const jsonBooks = await res.json();
        if (Array.isArray(jsonBooks) && jsonBooks.length > 0) {
          allBooks = jsonBooks;
          buildCategoryPills();
          renderBooks();
        }
      }
    } catch (e) {}
  }
});

// Sincronizar catálogo diretamente com a pasta do Google Drive
async function syncWithGoogleDrive(forceRefresh = false) {
  try {
    const url = forceRefresh ? `${GOOGLE_DRIVE_API_URL}?refresh=1` : GOOGLE_DRIVE_API_URL;
    const res = await fetch(url);
    if (!res.ok) return;

    const data = await res.json();
    if (data && data.status === "success" && Array.isArray(data.books)) {
      // Processar livros conectando com capas já conhecidas
      const syncedBooks = data.books.map(driveBook => {
        const titleKey = (driveBook.title || "").toLowerCase().trim();
        const fileKey = (driveBook.fileName || "").toLowerCase().trim();
        const normTitle = normalizeCoverKey(driveBook.title);
        const normFile = normalizeCoverKey(driveBook.fileName);
        
        // Tenta encontrar capa já extraída localmente de alta qualidade
        const matchedCover = localCoversMap.get(titleKey) || 
                             localCoversMap.get(fileKey) || 
                             localCoversMap.get(normTitle) || 
                             localCoversMap.get(normFile);
        const cover = matchedCover || driveBook.thumbnailUrl || generateDynamicCoverSvg(driveBook.title, driveBook.author, driveBook.format);

        return {
          ...driveBook,
          cover: cover
        };
      });

      if (syncedBooks.length > 0) {
        allBooks = syncedBooks;
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(syncedBooks));
        } catch (e) {}

        buildCategoryPills();
        renderBooks();
        showToast(`Catálogo atualizado! (${syncedBooks.length} livros)`);
      }
    }
  } catch (err) {
    console.warn("Aviso na sincronização com o Google Drive:", err);
  }
}

// Construir os Pills de Categorias com base nos dados reais
function buildCategoryPills() {
  if (!categoryPillsContainer) return;

  // Contar livros por formato e por categoria
  const formats = new Set();
  const catCounts = {};

  allBooks.forEach(b => {
    if (b.format) formats.add(b.format.toUpperCase());
    if (b.category) {
      catCounts[b.category] = (catCounts[b.category] || 0) + 1;
    }
  });

  // Ordenar categorias pelas mais frequentes
  const sortedCategories = Object.keys(catCounts).sort((a, b) => catCounts[b] - catCounts[a]);

  let htmlPills = `<button class="pill ${currentCategory === 'all' ? 'active' : ''}" data-category="all">Todos (${allBooks.length})</button>`;

  // Formatos (EPUB, PDF)
  formats.forEach(fmt => {
    const active = currentCategory === fmt ? "active" : "";
    htmlPills += `<button class="pill ${active}" data-category="${fmt}">${fmt}</button>`;
  });

  htmlPills += `<span class="pill-divider"></span>`;

  // Categorias
  sortedCategories.forEach(cat => {
    const active = currentCategory === cat ? "active" : "";
    htmlPills += `<button class="pill ${active}" data-category="${cat}">${cat}</button>`;
  });

  categoryPillsContainer.innerHTML = htmlPills;

  // Reatrelar cliques nas pills
  categoryPillsContainer.querySelectorAll(".pill").forEach(pill => {
    pill.addEventListener("click", () => {
      categoryPillsContainer.querySelectorAll(".pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      currentCategory = pill.getAttribute("data-category");
      visibleCount = PAGE_SIZE; // reset paginação
      renderBooks();
    });
  });
}

// Renderização dos Livros
function renderBooks() {
  const filteredBooks = getFilteredAndSortedBooks();

  // Atualizar contador no header
  bookCount.textContent = `${filteredBooks.length} livro${filteredBooks.length === 1 ? '' : 's'}`;

  // Se não houver livros encontrados
  if (filteredBooks.length === 0) {
    booksContainer.innerHTML = "";
    emptyState.classList.remove("hidden");
    if (loadMoreContainer) loadMoreContainer.classList.add("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  // Livros paginados a exibir
  const booksToDisplay = filteredBooks.slice(0, visibleCount);

  // Renderizar cards
  booksContainer.innerHTML = booksToDisplay.map(book => {
    const formatClass = (book.format || "epub").toLowerCase();
    const coverSrc = book.cover || defaultFallbackCover;
    
    return `
      <article class="book-card" data-id="${book.id}" onclick="handleCardClick(event, '${book.id}')" role="button" tabindex="0" aria-label="Ver detalhes de ${book.title}">
        <div class="book-card-cover-wrapper">
          <img class="book-card-cover" src="${coverSrc}" alt="Capa de ${book.title}" loading="lazy" onerror="handleCoverError(this)" />
          <span class="format-badge ${formatClass}">${book.format}</span>
        </div>

        <div class="book-card-content">
          <div class="book-meta-primary">
            <span class="book-genre-tag">${book.category}</span>
            <h3 class="book-card-title" title="${book.title}">${book.title}</h3>
            <p class="book-card-author">${book.author}</p>
          </div>

          <div class="book-card-footer">
            <span class="book-card-size">${book.size}</span>
            <button class="btn-download-quick" data-download-id="${book.id}" onclick="handleQuickDownload(event, '${book.id}')" title="Baixar ${book.title}">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </button>
          </div>
        </div>
      </article>
    `;
  }).join("");

  attachCardEvents();
  updatePagination(filteredBooks.length);
}

// Atualizar botão Carregar Mais
function updatePagination(totalResults) {
  if (!loadMoreContainer || !loadMoreCounter) return;

  if (visibleCount >= totalResults) {
    loadMoreContainer.classList.add("hidden");
  } else {
    loadMoreContainer.classList.remove("hidden");
    loadMoreCounter.textContent = `(exibindo ${visibleCount} de ${totalResults})`;
  }
}

// Filtros e Ordenação
function getFilteredAndSortedBooks() {
  return allBooks
    .filter(book => {
      // Filtro de Busca
      const matchesSearch = 
        book.title.toLowerCase().includes(currentSearch) ||
        book.author.toLowerCase().includes(currentSearch) ||
        book.category.toLowerCase().includes(currentSearch) ||
        (book.fileName && book.fileName.toLowerCase().includes(currentSearch));

      // Filtro de Categoria / Formato
      let matchesCategory = true;
      if (currentCategory !== "all") {
        if (currentCategory === "EPUB" || currentCategory === "PDF") {
          matchesCategory = (book.format || "").toUpperCase() === currentCategory.toUpperCase();
        } else {
          matchesCategory = (book.category || "") === currentCategory;
        }
      }

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (currentSort === "title-asc") return a.title.localeCompare(b.title);
      if (currentSort === "title-desc") return b.title.localeCompare(a.title);
      if (currentSort === "author-asc") return a.author.localeCompare(b.author);
      if (currentSort === "size-desc") return (b.sizeBytes || 0) - (a.sizeBytes || 0);
      return 0; // "recent" mantém a ordem padrão
    });
}

// Manipulador direto e infalível de clique nos cards (Mobile e Desktop)
window.handleCardClick = function(event, bookId) {
  if (event && event.target && event.target.closest(".btn-download-quick")) {
    return;
  }
  openBookModal(bookId);
};

window.handleQuickDownload = function(event, bookId) {
  if (event) {
    event.stopPropagation();
  }
  triggerDownload(bookId);
};

// Eventos de Cards
function attachCardEvents() {
  document.querySelectorAll(".book-card").forEach(card => {
    card.onclick = (e) => {
      if (e.target && e.target.closest(".btn-download-quick")) {
        e.stopPropagation();
        return;
      }
      const bookId = card.getAttribute("data-id");
      if (bookId) openBookModal(bookId);
    };
  });
}

// Abrir Modal
function openBookModal(bookId) {
  try {
    const idStr = String(bookId).trim();
    const book = allBooks.find(b => String(b.id).trim() === idStr);
    if (!book) {
      console.warn("Livro não localizado no catálogo:", bookId);
      return;
    }

    modalCover.onerror = () => handleCoverError(modalCover);
    modalCover.src = book.cover || defaultFallbackCover;
    modalCover.alt = `Capa de ${book.title || "Livro"}`;
    modalFormatBadge.textContent = book.format || "EPUB";
    modalFormatBadge.className = `modal-format-badge format-badge ${(book.format || "epub").toLowerCase()}`;
    
    modalGenre.textContent = book.category || "Literatura";
    modalSize.textContent = book.size || "--";
    modalTitle.textContent = book.title || "Sem título";
    modalAuthor.textContent = book.author ? `Por ${book.author}` : "Autor não informado";
    modalSynopsis.textContent = book.synopsis || "Sinopse não disponível para esta obra.";

    modalFormat.textContent = book.format || "EPUB";
    modalAddedDate.textContent = book.dateAdded || "Recente";

    // Classificação Indicativa Recomendada
    const age = detectAgeRating(book);
    if (modalAgeRating) {
      modalAgeRating.textContent = age;
      modalAgeRating.className = `info-value age-badge age-${age.replace("+", "plus").toLowerCase()}`;
    }

    // Configurar ação de download no modal
    modalDownloadBtn.onclick = (e) => {
      e.stopPropagation();
      triggerDownload(book.id);
    };

    // Configurar ação do Kindle no modal
    if (modalKindleBtn) {
      modalKindleBtn.onclick = (e) => {
        e.stopPropagation();
        openKindleModal(book.id);
      };
    }

    bookModal.classList.remove("hidden");
    document.body.classList.add("modal-open");
    document.body.style.overflow = "hidden"; // trava rolagem de fundo
  } catch (err) {
    console.error("Erro ao abrir modal de detalhes:", err);
  }
}

// Fechar Modal
function closeBookModal() {
  bookModal.classList.add("hidden");
  document.body.classList.remove("modal-open");
  document.body.style.overflow = "";
}

// Abrir Modal Assistente do Kindle
function openKindleModal(bookId) {
  let book = allBooks.find(b => String(b.id).trim() === String(bookId).trim());
  if (!book && allBooks.length > 0) book = allBooks[0];
  if (!book) return;

  currentKindleBook = book;
  if (kindleBookTitle) kindleBookTitle.textContent = book.title || "Sem título";
  if (kindleBookAuthor) kindleBookAuthor.textContent = book.author ? `Por ${book.author}` : "Autor não informado";
  if (kindleBookMeta) kindleBookMeta.textContent = `${book.format || "EPUB"} • ${book.size || ""}`;

  // Restaurar preferências salvas do usuário
  const savedRegion = localStorage.getItem("kindle_amazon_region");
  if (savedRegion && kindleAmazonRegion) {
    kindleAmazonRegion.value = savedRegion;
  }
  const savedEmail = localStorage.getItem("kindle_email");
  if (savedEmail && kindleEmailInput) {
    kindleEmailInput.value = savedEmail;
  }

  if (kindleModal) {
    kindleModal.classList.remove("hidden");
    document.body.classList.add("modal-open");
    document.body.style.overflow = "hidden";
  }
}

// Fechar Modal Assistente do Kindle
function closeKindleModal() {
  if (kindleModal) kindleModal.classList.add("hidden");
  if (bookModal && bookModal.classList.contains("hidden")) {
    document.body.classList.remove("modal-open");
    document.body.style.overflow = "";
  }
}

// Executar Envio Automático para o Kindle Web (Download + Abertura da Amazon)
async function executeKindleWebSend() {
  if (!currentKindleBook) return;
  const regionUrl = (kindleAmazonRegion && kindleAmazonRegion.value) || "https://www.amazon.com.br/sendtokindle";
  localStorage.setItem("kindle_amazon_region", regionUrl);

  showToast(`Baixando "${currentKindleBook.title}" para o Kindle...`);
  await triggerDownload(currentKindleBook.id);

  setTimeout(() => {
    window.open(regionUrl, "_blank");
    showToast("Página da Amazon aberta! Arraste o arquivo baixado nela.");
  }, 1000);
}

// Salvar E-mail do Kindle
function saveKindleEmail() {
  const email = (kindleEmailInput && kindleEmailInput.value) ? kindleEmailInput.value.trim() : "";
  if (!email) {
    showToast("Por favor, digite um e-mail.");
    return;
  }
  if (!email.includes("@")) {
    showToast("E-mail inválido. Deve ser no formato seu-kindle@kindle.com");
    return;
  }
  localStorage.setItem("kindle_email", email);
  showToast("E-mail do Kindle salvo com sucesso!");
}

// Executar Envio por E-mail do Kindle
async function executeKindleEmailSend() {
  if (!currentKindleBook) return;
  const email = (kindleEmailInput && kindleEmailInput.value) ? kindleEmailInput.value.trim() : "";
  if (!email) {
    showToast("Informe o e-mail do seu Kindle (@kindle.com) antes de enviar.");
    if (kindleEmailInput) kindleEmailInput.focus();
    return;
  }
  localStorage.setItem("kindle_email", email);

  // Baixa o arquivo para o usuário anexar
  await triggerDownload(currentKindleBook.id);

  const subject = encodeURIComponent(`Livro: ${currentKindleBook.title}`);
  const body = encodeURIComponent(
    `Olá! Segue em anexo o livro "${currentKindleBook.title}" (${currentKindleBook.author || "Autor"}) para o seu dispositivo Kindle.\n\n` +
    `Lembre-se de anexar o arquivo "${currentKindleBook.fileName || currentKindleBook.title + '.epub'}" baixado agora no seu aparelho.\n`
  );
  const mailtoUrl = `mailto:${encodeURIComponent(email)}?subject=${subject}&body=${body}`;

  setTimeout(() => {
    window.location.href = mailtoUrl;
    showToast("Cliente de e-mail aberto! Anexe o livro baixado e envie.");
  }, 1000);
}

// Conversor otimizado de Base64 para Blob (alocação única de memória)
function base64ToBlob(base64, mimeType) {
  const bin = atob(base64);
  const len = bin.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = bin.charCodeAt(i);
  }
  return new Blob([bytes.buffer], { type: mimeType });
}

// Disparar Download Direto no Aparelho (sem abrir Google Drive ou pedir seleção de conta)
async function triggerDownload(bookId) {
  const book = allBooks.find(b => String(b.id).trim() === String(bookId).trim());
  if (!book) return;

  const fileName = book.fileName || `${book.title}.${(book.format || "epub").toLowerCase()}`;
  showToast(`Baixando direto: ${book.title}...`);

  // 1. Tentar download direto via CDN do Google Drive com Fetch + Blob
  // O endpoint drive.usercontent.google.com possui cabeçalho CORS 'access-control-allow-origin: *',
  // permitindo que o navegador baixe os bytes em alta velocidade em segundo plano para um Blob em memória,
  // sem redirecionar para o app do Google Drive no Android e sem pedir seleção de conta!
  if (book.driveFileId) {
    const directUrl = `https://drive.usercontent.google.com/download?id=${book.driveFileId}&export=download`;
    try {
      const res = await fetch(directUrl);
      if (res.ok) {
        const contentType = res.headers.get("content-type") || "";
        // Se a resposta for o arquivo real (e não uma página HTML intermediária)
        if (!contentType.includes("text/html")) {
          const blob = await res.blob();
          if (blob && blob.size > 500) {
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = blobUrl;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(blobUrl), 30000);
            showToast(`Download concluído: ${book.title}!`);
            return;
          }
        }
      }
    } catch (directErr) {
      console.warn("Download via CDN direto encontrou restrição, usando proxy Apps Script:", directErr);
    }

    // 2. Fallback de contingência via proxy Apps Script
    if (GOOGLE_DRIVE_API_URL) {
      try {
        const devId = getOrCreateDeviceId();
        const admKey = localStorage.getItem("lbr_admin_key") || "";
        const res = await fetch(`${GOOGLE_DRIVE_API_URL}?action=download&fileId=${book.driveFileId}&deviceId=${encodeURIComponent(devId)}&adminKey=${encodeURIComponent(admKey)}`);
        if (res.ok) {
          const json = await res.json();
          if (json.status === "success" && json.data) {
            const blob = base64ToBlob(json.data, json.mimeType || "application/octet-stream");
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = blobUrl;
            a.download = json.fileName || fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(blobUrl), 30000);
            showToast(`Download concluído: ${book.title}!`);
            return;
          } else if (json.downloadUrl) {
            // Se o arquivo exceder o limite do Base64, baixa pelo link direto
            const a = document.createElement("a");
            a.href = json.downloadUrl;
            a.download = json.fileName || fileName;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => { if (document.body.contains(a)) document.body.removeChild(a); }, 1000);
            return;
          }
        }
      } catch (proxyErr) {
        console.warn("Proxy Apps Script indisponível:", proxyErr);
      }
    }
  }

  // 3. Fallback para arquivos locais ou links diretos
  const downloadUrl = book.downloadUrl || (book.fileName ? `livros/${encodeURIComponent(book.fileName)}` : null);
  if (downloadUrl) {
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      if (document.body.contains(a)) document.body.removeChild(a);
    }, 1000);
    showToast(`Download iniciado: ${book.title}`);
  }
}

// Notificação Toast
function showToast(message) {
  toastMessage.textContent = message;
  toastNotification.classList.remove("hidden");

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toastNotification.classList.add("hidden");
  }, 3500);
}

// Configurar Event Listeners Globais
function setupEventListeners() {
  // Busca em tempo real
  searchInput.addEventListener("input", (e) => {
    currentSearch = e.target.value.toLowerCase().trim();
    visibleCount = PAGE_SIZE; // reset paginação na busca
    renderBooks();
  });

  // Atalho de teclado para a busca: barra "/"
  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
    }
    if (e.key === "Escape" && !bookModal.classList.contains("hidden")) {
      closeBookModal();
    }
  });

  // Ordenação
  sortSelect.addEventListener("change", (e) => {
    currentSort = e.target.value;
    visibleCount = PAGE_SIZE;
    renderBooks();
  });

  // Alternador de Visualização (Grade / Lista)
  gridModeBtn.addEventListener("click", () => {
    gridModeBtn.classList.add("active");
    listModeBtn.classList.remove("active");
    booksContainer.classList.remove("list-view");
    isListView = false;
  });

  listModeBtn.addEventListener("click", () => {
    listModeBtn.classList.add("active");
    gridModeBtn.classList.remove("active");
    booksContainer.classList.add("list-view");
    isListView = true;
  });

  // Botão Carregar Mais
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", () => {
      visibleCount += PAGE_SIZE;
      renderBooks();
    });
  }

  // Botão de limpar filtros no estado vazio
  clearFiltersBtn.addEventListener("click", () => {
    currentSearch = "";
    currentCategory = "all";
    searchInput.value = "";
    visibleCount = PAGE_SIZE;
    if (categoryPillsContainer) {
      categoryPillsContainer.querySelectorAll(".pill").forEach(p => {
        p.classList.toggle("active", p.getAttribute("data-category") === "all");
      });
    }
    renderBooks();
  });

  // Acessibilidade via teclado nos cards
  booksContainer.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && e.target.classList.contains("book-card")) {
      e.preventDefault();
      const bookId = e.target.getAttribute("data-id");
      if (bookId) openBookModal(bookId);
    }
  });

  // Fechar Modal
  modalCloseBtn.onclick = closeBookModal;
  bookModal.onclick = (e) => {
    if (e.target === bookModal) {
      closeBookModal();
    }
  };

  // Fechar Modal do Kindle
  if (kindleModalCloseBtn) kindleModalCloseBtn.onclick = closeKindleModal;
  if (kindleModal) {
    kindleModal.onclick = (e) => {
      if (e.target === kindleModal) closeKindleModal();
    };
  }

  // Ações do Modal do Kindle
  if (kindleAutoSendBtn) kindleAutoSendBtn.onclick = executeKindleWebSend;
  if (kindleSaveEmailBtn) kindleSaveEmailBtn.onclick = saveKindleEmail;
  if (kindleEmailSendBtn) kindleEmailSendBtn.onclick = executeKindleEmailSend;
  if (kindleAmazonRegion) {
    kindleAmazonRegion.onchange = () => {
      localStorage.setItem("kindle_amazon_region", kindleAmazonRegion.value);
    };
  }

  // Botão do Header: Atalho direto para o Send to Kindle Web
  if (headerKindleBtn) {
    headerKindleBtn.addEventListener("click", () => {
      // Se um livro estiver selecionado no modal, abre o assistente dele
      if (currentKindleBook && !bookModal.classList.contains("hidden")) {
        openKindleModal(currentKindleBook.id);
      } else {
        const regionUrl = localStorage.getItem("kindle_amazon_region") || "https://www.amazon.com.br/sendtokindle";
        window.open(regionUrl, "_blank");
        showToast("Abrindo Amazon Send to Kindle Web...");
      }
    });
  }

  // Botão de Sincronizar com o Google Drive
  const syncDriveBtn = document.getElementById("syncDriveBtn");
  if (syncDriveBtn) {
    syncDriveBtn.addEventListener("click", async () => {
      syncDriveBtn.classList.add("spinning");
      showToast("Atualizando catálogo...");
      await syncWithGoogleDrive(true);
      syncDriveBtn.classList.remove("spinning");
    });
  }
}
