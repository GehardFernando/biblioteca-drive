/**
 * Let's Be Readers — Google Apps Script API
 * 
 * Conecta a sua pasta do Google Drive diretamente à sua biblioteca digital.
 * Qualquer livro novo adicionado na pasta aparecerá automaticamente no site!
 * 
 * COMO IMPLANTAR (Leva apenas 1 minuto):
 * 1. Acesse: https://script.google.com
 * 2. Clique em "+ Novo projeto"
 * 3. Cole este código inteiro substituindo o código existente
 * 4. Clique em "Implantar" (Deploy) > "Nova implantação" (New deployment)
 * 5. Tipo: Selecione "App da Web" (ícone de engrenagem)
 * 6. Configurações:
 *    - Executar como: "Eu" (seu e-mail)
 *    - Quem tem acesso: "Qualquer pessoa" (Anyone)
 * 7. Clique em "Implantar" e copie a "URL do app da Web" gerada.
 * 8. Cole essa URL no arquivo app.js na constante GOOGLE_DRIVE_API_URL!
 */

const FOLDER_ID = "1Cm-w4noHBr2FeF9ypnzgM6lAKvPob9Of";

// Regras heurísticas de classificação por gênero
const GENRE_PATTERNS = [
  { genre: "Ficção Científica", keywords: ["asimov", "clarke", "dick", "gibson", "duna", "verne", "wells", "matrix", "neuromancer", "fundacao", "galaxia", "interestelar", "alien", "futuro", "cyberpunk", "distopia", "fahrenheit", "1984", "orwell"] },
  { genre: "Suspense & Mistério", keywords: ["agatha christie", "sherlock", "doyle", "stephen king", "dexter", "dan brown", "coben", "assassinato", "misterio", "crime", "policial", "sangue", "hitchcock", "suspense", "enigma"] },
  { genre: "Fantasia & Aventura", keywords: ["tolkien", "aneis", "hobbit", "martin", "thrones", "gelo", "rangers", "riordan", "percy jackson", "potter", "dragao", "feiticeiro", "mago", "apocalipse", "spohr", "cornwell", "arthur"] },
  { genre: "Clássicos da Literatura", keywords: ["machado", "shakespeare", "dante", "homero", "dostoievski", "tolstoi", "kafka", "alencar", "azevedo", "camoes", "barreto", "lispector", "poe", "wilde", "casmurro", "memorias", "cortico"] },
  { genre: "Desenvolvimento Pessoal & Negócios", keywords: ["jobs", "habitos", "cury", "hill", "carnegie", "kiyosaki", "pai rico", "produtividade", "sucesso", "lideranca", "riqueza", "mindset", "foco", "vendas", "negocios", "gestao", "dinheiro", "motivacao", "comunicacao"] },
  { genre: "Filosofia & História", keywords: ["seneca", "aurelio", "platao", "aristoteles", "nietzsche", "maquiavel", "sun tzu", "guerra", "laurentino", "1808", "1822", "1889", "historia", "filosofia", "socrates", "kant", "descartes", "etica", "politica"] },
  { genre: "Romance", keywords: ["sparks", "cabot", "green", "moyes", "coelho", "hoover", "amor", "paixao", "casamento", "coracao", "namoro", "crepusculo"] }
];

function detectGenre(title, author) {
  const text = (title + " " + author).toLowerCase();
  for (let i = 0; i < GENRE_PATTERNS.length; i++) {
    const item = GENRE_PATTERNS[i];
    for (let k = 0; k < item.keywords.length; k++) {
      if (text.indexOf(item.keywords[k]) !== -1) {
        return item.genre;
      }
    }
  }
  return "Literatura Geral";
}

function parseFilename(filename) {
  let baseName = filename.replace(/\.[^/.]+$/, "");
  baseName = baseName.replace(/_[a-zA-Z0-9\._]+$/, "");
  const parts = baseName.split(" - ");
  if (parts.length >= 2) {
    const author = parts[parts.length - 1].trim();
    const title = parts.slice(0, -1).join(" - ").trim();
    return { title: title, author: author };
  }
  return {
    title: baseName.replace(/_/g, " ").trim(),
    author: "Autor Desconhecido"
  };
}

function formatBytes(bytes) {
  if (bytes < 1024 * 1024) {
    return Math.round(bytes / 1024) + " KB";
  }
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function doGet(e) {
  try {
    // 1. Download Direto via API (Evita a tela do Google Drive de selecionar conta no celular)
    if (e && e.parameter && e.parameter.action === "download" && e.parameter.fileId) {
      const file = DriveApp.getFileById(e.parameter.fileId);
      const fileSize = file.getSize();

      // Entrega o arquivo em base64 diretamente para o navegador do celular salvar na memória
      if (fileSize <= 35 * 1024 * 1024) {
        const blob = file.getBlob();
        return ContentService.createTextOutput(JSON.stringify({
          status: "success",
          fileName: file.getName(),
          mimeType: blob.getContentType() || "application/octet-stream",
          data: Utilities.base64Encode(blob.getBytes())
        })).setMimeType(ContentService.MimeType.JSON);
      } else {
        return ContentService.createTextOutput(JSON.stringify({
          status: "direct",
          downloadUrl: "https://drive.usercontent.google.com/download?id=" + e.parameter.fileId + "&export=download",
          fileName: file.getName()
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }

    // 2. Listagem de Livros
    const folder = DriveApp.getFolderById(FOLDER_ID);
    
    // Tenta garantir que a pasta esteja visível para leitura com link
    try {
      folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (permErr) {}

    const files = folder.getFiles();
    const books = [];
    let count = 0;

    while (files.hasNext()) {
      const file = files.next();
      const name = file.getName();
      const lower = name.toLowerCase();
      
      let format = null;
      if (lower.endsWith(".epub")) format = "EPUB";
      else if (lower.endsWith(".pdf")) format = "PDF";
      else if (lower.endsWith(".mobi")) format = "MOBI";

      if (format) {
        count++;
        const parsed = parseFilename(name);
        const size = file.getSize();
        const dateAdded = Utilities.formatDate(file.getDateCreated(), "America/Sao_Paulo", "dd/MM/yyyy");
        const category = detectGenre(parsed.title, parsed.author);
        const fileId = file.getId();

        books.push({
          id: "drive-" + fileId,
          driveFileId: fileId,
          title: parsed.title,
          author: parsed.author,
          category: category,
          format: format,
          size: formatBytes(size),
          sizeBytes: size,
          pages: Math.max(60, Math.min(1200, Math.round(size / 4500))),
          dateAdded: dateAdded,
          synopsis: "Obra '" + parsed.title + "', de " + parsed.author + ". Disponível na sua biblioteca pessoal conectada ao Google Drive.",
          fileName: name,
          driveUrl: "https://drive.google.com/file/d/" + fileId + "/view?usp=sharing",
          downloadUrl: "https://drive.usercontent.google.com/download?id=" + fileId + "&export=download",
          // Thumbnail oficial do Google Drive para pré-visualização (útil para PDFs)
          thumbnailUrl: "https://drive.google.com/thumbnail?id=" + fileId + "&sz=w600"
        });
      }
    }

    // Ordenar livros por data de adição (mais recentes primeiro)
    books.sort(function(a, b) {
      return b.sizeBytes - a.sizeBytes;
    });

    const result = {
      status: "success",
      total: books.length,
      lastSync: new Date().toISOString(),
      books: books
    };

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    const errorResponse = {
      status: "error",
      message: err.toString()
    };
    return ContentService.createTextOutput(JSON.stringify(errorResponse))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
