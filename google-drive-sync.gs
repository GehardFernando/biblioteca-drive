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

function detectAgeRating(title, author, category) {
  const text = ((title || "") + " " + (author || "") + " " + (category || "")).toLowerCase();

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

// ==========================================================================
// SEGURANÇA & CONTROLE DE ACESSO (CLUBE LET'S BE READERS - OTP DINÂMICO)
// ==========================================================================
const ADMIN_MASTER_KEY = "lbr_master_gehard_8f93a1c72";
const BASE_SITE_URL = "https://gehardfernando.github.io/biblioteca-drive/";

function getSecurityState() {
  const props = PropertiesService.getScriptProperties();
  const stateJson = props.getProperty("LBR_SECURITY_STATE_V2");
  if (!stateJson) {
    const initialState = {
      invites: [], // Lista de { id, code, note, createdAt, used, deviceId, activatedAt }
      devices: {}  // Mapa de { [deviceId]: { role, code, note, activatedAt } }
    };
    props.setProperty("LBR_SECURITY_STATE_V2", JSON.stringify(initialState));
    return initialState;
  }
  try {
    const parsed = JSON.parse(stateJson);
    if (!parsed.invites) parsed.invites = [];
    if (!parsed.devices) parsed.devices = {};
    return parsed;
  } catch (err) {
    return { invites: [], devices: {} };
  }
}

function saveSecurityState(state) {
  const props = PropertiesService.getScriptProperties();
  props.setProperty("LBR_SECURITY_STATE_V2", JSON.stringify(state));
}

function isDeviceAuthorized(deviceId, adminKey) {
  if (adminKey === ADMIN_MASTER_KEY) return { authorized: true, role: "admin" };
  if (!deviceId) return { authorized: false };
  if (deviceId === "admin_laptop_gehard") return { authorized: true, role: "admin" };

  const state = getSecurityState();
  if (state.devices && state.devices[deviceId]) {
    const dev = state.devices[deviceId];
    return { authorized: true, role: dev.role || "guest", note: dev.note };
  }
  return { authorized: false };
}

function doGet(e) {
  try {
    const p = (e && e.parameter) ? e.parameter : {};
    const action = p.action || "list";

    // 1. ENDPOINTS DE ADMINISTRAÇÃO (Exigem ADMIN_MASTER_KEY)
    if (action === "admin_list_invites" || action === "admin_get_slots") {
      if (p.adminKey !== ADMIN_MASTER_KEY) {
        return jsonOutput({ status: "error", message: "Chave mestre inválida." });
      }
      const state = getSecurityState();
      return jsonOutput({
        status: "success",
        invites: state.invites,
        devices: state.devices,
        baseUrl: BASE_SITE_URL
      });
    }

    if (action === "admin_create_otp") {
      if (p.adminKey !== ADMIN_MASTER_KEY) {
        return jsonOutput({ status: "error", message: "Chave mestre inválida." });
      }
      const state = getSecurityState();
      // Gerar OTP de 6 dígitos único
      let otpCode = "";
      do {
        otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      } while (state.invites.some(inv => inv.code === otpCode && !inv.used));

      const newInvite = {
        id: "otp_" + Utilities.getUuid().replace(/-/g, "").substring(0, 12),
        code: otpCode,
        note: (p.note || "Convidado").trim(),
        createdAt: new Date().toISOString(),
        used: false,
        deviceId: null,
        activatedAt: null
      };

      state.invites.unshift(newInvite);
      saveSecurityState(state);

      return jsonOutput({
        status: "success",
        invite: newInvite,
        otpCode: otpCode,
        inviteUrl: BASE_SITE_URL + "?otp=" + otpCode
      });
    }

    if (action === "admin_revoke_invite" || action === "admin_revoke_slot") {
      if (p.adminKey !== ADMIN_MASTER_KEY) {
        return jsonOutput({ status: "error", message: "Chave mestre inválida." });
      }
      const targetId = p.id || p.code || p.slotKey;
      const state = getSecurityState();

      let revoked = false;
      state.invites = state.invites.filter(inv => {
        if (inv.id === targetId || inv.code === targetId) {
          if (inv.deviceId && state.devices[inv.deviceId]) {
            delete state.devices[inv.deviceId];
          }
          revoked = true;
          return false;
        }
        return true;
      });

      if (p.deviceId && state.devices[p.deviceId]) {
        delete state.devices[p.deviceId];
        revoked = true;
      }

      saveSecurityState(state);
      return jsonOutput({ status: "success", revoked: revoked, message: "Acesso/convite revogado." });
    }

    // 2. ATIVAÇÃO DE CONVITE / OTP
    if (action === "activate_otp" || action === "activate_invite") {
      const codeOrToken = (p.code || p.otp || p.inviteToken || "").trim();
      const deviceId = p.deviceId;

      if (!codeOrToken || !deviceId) {
        return jsonOutput({ status: "error", message: "Código OTP ou identificador de dispositivo ausente." });
      }

      const state = getSecurityState();
      const matched = state.invites.find(inv => 
        inv.code.toLowerCase() === codeOrToken.toLowerCase() || 
        inv.id === codeOrToken
      );

      if (!matched) {
        return jsonOutput({ status: "error", message: "Código de convite ou OTP inválido ou não encontrado." });
      }

      if (matched.used && matched.deviceId !== deviceId) {
        return jsonOutput({ status: "error", message: "Este código OTP já foi utilizado em outro dispositivo." });
      }

      // Vincular dispositivo permanentemente
      matched.used = true;
      matched.deviceId = deviceId;
      matched.activatedAt = new Date().toISOString();

      state.devices[deviceId] = {
        role: "guest",
        code: matched.code,
        note: matched.note,
        activatedAt: matched.activatedAt
      };

      saveSecurityState(state);

      return jsonOutput({
        status: "success",
        authorized: true,
        message: "Bem-vindo ao Clube Let's Be Readers!",
        role: "guest",
        note: matched.note
      });
    }

    // 3. VALIDAÇÃO DE DISPOSITIVO (Checa se o aparelho atual tem passe livre)
    if (action === "validate_device") {
      const auth = isDeviceAuthorized(p.deviceId, p.adminKey);
      if (auth.authorized) {
        return jsonOutput({
          status: "success",
          authorized: true,
          role: auth.role,
          name: auth.name || "Administrador"
        });
      }
      return jsonOutput({ status: "unauthorized", authorized: false, message: "Dispositivo não autorizado." });
    }

    // 4. DOWNLOAD DIRETO PROTEGIDO
    if (action === "download" && p.fileId) {
      const auth = isDeviceAuthorized(p.deviceId, p.adminKey);
      if (!auth.authorized) {
        return jsonOutput({ status: "unauthorized", message: "Download bloqueado: dispositivo não autorizado." });
      }

      const file = DriveApp.getFileById(p.fileId);
      const fileSize = file.getSize();

      if (fileSize <= 12 * 1024 * 1024) {
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
          downloadUrl: "https://drive.usercontent.google.com/download?id=" + p.fileId + "&export=download",
          fileName: file.getName()
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }

    // 5. LISTAGEM COMPLETA DO GOOGLE DRIVE (PROTEGIDA)
    const authCheck = isDeviceAuthorized(p.deviceId, p.adminKey);
    if (!authCheck.authorized) {
      return jsonOutput({
        status: "unauthorized",
        message: "Acesso restrito. Dispositivo não autorizado.",
        total: 0,
        books: []
      });
    }

    const folder = DriveApp.getFolderById(FOLDER_ID);
    try {
      folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (permErr) {}

    const files = folder.getFiles();
    const books = [];

    while (files.hasNext()) {
      const file = files.next();
      const name = file.getName();
      const lower = name.toLowerCase();
      
      let format = null;
      if (lower.endsWith(".epub")) format = "EPUB";
      else if (lower.endsWith(".pdf")) format = "PDF";
      else if (lower.endsWith(".mobi")) format = "MOBI";

      if (format) {
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
          ageRating: detectAgeRating(parsed.title, parsed.author, category),
          dateAdded: dateAdded,
          synopsis: "Obra '" + parsed.title + "', de " + parsed.author + ". Disponível na sua biblioteca pessoal para leitura e download.",
          fileName: name,
          driveUrl: "https://drive.google.com/file/d/" + fileId + "/view?usp=sharing",
          downloadUrl: "https://drive.usercontent.google.com/download?id=" + fileId + "&export=download",
          thumbnailUrl: "https://drive.google.com/thumbnail?id=" + fileId + "&sz=w600"
        });
      }
    }

    books.sort(function(a, b) {
      return b.sizeBytes - a.sizeBytes;
    });

    return jsonOutput({
      status: "success",
      total: books.length,
      lastSync: new Date().toISOString(),
      books: books
    });

  } catch (err) {
    return jsonOutput({
      status: "error",
      message: err.toString()
    });
  }
}

function jsonOutput(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
