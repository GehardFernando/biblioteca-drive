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

// Mapa de capas locais pré-indexadas (para reutilizar capas de alta definição nos livros do Drive)
const localCoversMap = new Map();
if (typeof window !== "undefined" && Array.isArray(window.REAL_BOOKS)) {
  window.REAL_BOOKS.forEach(b => {
    if (b.title && b.cover) {
      localCoversMap.set(b.title.toLowerCase().trim(), b.cover);
      if (b.fileName) localCoversMap.set(b.fileName.toLowerCase().trim(), b.cover);
    }
  });
}

// Catálogo ativo (com suporte a cache do Drive, dados locais ou fallback mock)
let allBooks = (() => {
  if (typeof window !== "undefined") {
    const cached = localStorage.getItem("drive_books_cache");
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
const modalPages = document.getElementById("modalPages");
const modalDownloadBtn = document.getElementById("modalDownloadBtn");

// Toast
const toastNotification = document.getElementById("toastNotification");
const toastMessage = document.getElementById("toastMessage");
let toastTimeout;

// Inicialização
document.addEventListener("DOMContentLoaded", async () => {
  // Render inicial com os dados disponíveis (cache ou locais)
  buildCategoryPills();
  renderBooks();
  setupEventListeners();

  // Sincronização em tempo real com o Google Drive
  if (GOOGLE_DRIVE_API_URL && GOOGLE_DRIVE_API_URL.trim() !== "") {
    syncWithGoogleDrive();
  } else if (allBooks === mockBooks) {
    // Fallback de desenvolvimento caso esteja sem Drive e sem books-data.js
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
        
        // Tenta encontrar capa já extraída localmente
        const matchedCover = localCoversMap.get(titleKey) || localCoversMap.get(fileKey);
        const cover = matchedCover || driveBook.thumbnailUrl || generateDynamicCoverSvg(driveBook.title, driveBook.author, driveBook.format);

        return {
          ...driveBook,
          cover: cover
        };
      });

      if (syncedBooks.length > 0) {
        allBooks = syncedBooks;
        try {
          localStorage.setItem("drive_books_cache", JSON.stringify(syncedBooks));
        } catch (e) {}

        buildCategoryPills();
        renderBooks();
        showToast(`Sincronizado com o Google Drive! (${syncedBooks.length} livros)`);
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
      <article class="book-card" data-id="${book.id}">
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
            <button class="btn-download-quick" data-download-id="${book.id}" title="Baixar ${book.title}">
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
        book.category.toLowerCase().includes(currentSearch);

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

// Eventos de Cards
function attachCardEvents() {
  document.querySelectorAll(".book-card").forEach(card => {
    card.addEventListener("click", (e) => {
      // Se clicou no botão de download rápido, dispara o download
      if (e.target.closest(".btn-download-quick")) {
        e.stopPropagation();
        const bookId = card.getAttribute("data-id");
        triggerDownload(bookId);
        return;
      }

      // Caso contrário, abre o modal de detalhes
      const bookId = card.getAttribute("data-id");
      openBookModal(bookId);
    });
  });
}

// Abrir Modal
function openBookModal(bookId) {
  const book = allBooks.find(b => b.id === bookId);
  if (!book) return;

  modalCover.onerror = () => handleCoverError(modalCover);
  modalCover.src = book.cover || defaultFallbackCover;
  modalCover.alt = `Capa de ${book.title}`;
  modalFormatBadge.textContent = book.format || "EPUB";
  modalFormatBadge.className = `modal-format-badge format-badge ${(book.format || "epub").toLowerCase()}`;
  
  modalGenre.textContent = book.category;
  modalSize.textContent = book.size;
  modalTitle.textContent = book.title;
  modalAuthor.textContent = `Por ${book.author}`;
  modalSynopsis.textContent = book.synopsis;

  modalFormat.textContent = book.format || "EPUB";
  modalAddedDate.textContent = book.dateAdded || "Recente";
  modalPages.textContent = `${book.pages} págs`;

  // Configurar ação de download no modal
  modalDownloadBtn.onclick = () => {
    triggerDownload(book.id);
  };

  bookModal.classList.remove("hidden");
  document.body.style.overflow = "hidden"; // trava rolagem de fundo
}

// Fechar Modal
function closeBookModal() {
  bookModal.classList.add("hidden");
  document.body.style.overflow = "";
}

// Conversor de Base64 para Blob eficiente em memória
function base64ToBlob(base64, mimeType) {
  const byteCharacters = atob(base64);
  const byteArrays = [];
  const sliceSize = 1024;
  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    byteArrays.push(new Uint8Array(byteNumbers));
  }
  return new Blob(byteArrays, { type: mimeType });
}

// Disparar Download Direto no Aparelho (sem abrir Google Drive ou pedir seleção de conta)
async function triggerDownload(bookId) {
  const book = allBooks.find(b => b.id === bookId);
  if (!book) return;

  // 1. Se for um livro do Google Drive e a API estiver ativa:
  // Baixamos os bytes diretamente pelo Apps Script e geramos um arquivo local (Blob) no navegador.
  // Isso impede que o Android ou iOS exibam a tela de "Selecionar Conta do Google Drive"!
  if (book.driveFileId && GOOGLE_DRIVE_API_URL) {
    showToast(`Baixando direto: ${book.title}...`);
    try {
      const res = await fetch(`${GOOGLE_DRIVE_API_URL}?action=download&fileId=${book.driveFileId}`);
      if (res.ok) {
        const json = await res.json();
        if (json.status === "success" && json.data) {
          const blob = base64ToBlob(json.data, json.mimeType || "application/octet-stream");
          const blobUrl = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = blobUrl;
          a.download = json.fileName || book.fileName || `${book.title}.${(book.format || 'epub').toLowerCase()}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(blobUrl), 15000);
          showToast(`Download concluído: ${book.title}!`);
          return;
        }
      }
    } catch (err) {
      console.warn("Fallback de download para arquivo externo:", err);
    }
  }

  // 2. Fallback para arquivos locais ou links diretos
  const downloadUrl = book.downloadUrl || (book.fileName ? `livros/${encodeURIComponent(book.fileName)}` : null);
  if (downloadUrl) {
    showToast(`Baixando: ${book.title} (${book.format})`);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = book.fileName || `${book.title}.${(book.format || "epub").toLowerCase()}`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      if (document.body.contains(a)) document.body.removeChild(a);
    }, 1000);
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

  // Fechar Modal
  modalCloseBtn.addEventListener("click", closeBookModal);
  bookModal.addEventListener("click", (e) => {
    if (e.target === bookModal) {
      closeBookModal();
    }
  });

  // Botão de Sincronizar com o Google Drive
  const syncDriveBtn = document.getElementById("syncDriveBtn");
  if (syncDriveBtn) {
    syncDriveBtn.addEventListener("click", async () => {
      syncDriveBtn.classList.add("spinning");
      showToast("Sincronizando com o Google Drive...");
      await syncWithGoogleDrive(true);
      syncDriveBtn.classList.remove("spinning");
    });
  }
}
