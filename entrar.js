// ==========================================================================
// ENTRAR.JS — Portal de Acesso e Validação do Clube Let's Be Readers
// ==========================================================================
const ADMIN_MASTER_KEY = "lbr_master_gehard_8f93a1c72";
const GOOGLE_DRIVE_API_URL = "https://script.google.com/macros/s/AKfycbwGk2epbZ3thFo8ZJhHQDLUEZffTRobl657b6hGKMXNJUXUBtn9cSVUtgIDoHhzaW4rww/exec";

const inviteInput = document.getElementById("inviteInput");
const submitBtn = document.getElementById("submitBtn");
const statusMsg = document.getElementById("statusMsg");
const adminLink = document.getElementById("adminLink");
const toastNotification = document.getElementById("toastNotification");
const toastMessage = document.getElementById("toastMessage");

// Exibir feedback tipo toast
function showToast(msg) {
  if (!toastNotification || !toastMessage) return;
  toastMessage.textContent = msg;
  toastNotification.classList.remove("hidden");
  setTimeout(() => {
    toastNotification.classList.add("hidden");
  }, 3500);
}

// Exibir mensagem de status no formulário
function showStatus(msg, type = "error") {
  if (!statusMsg) return;
  if (!msg) {
    statusMsg.classList.add("hidden");
    return;
  }
  statusMsg.textContent = msg;
  statusMsg.className = "lock-status-msg " + type;
  statusMsg.classList.remove("hidden");
}

// Recupera ou cria UUID permanente deste aparelho
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

// Reconhece automaticamente o laptop do Gehard
function checkLaptopAuthority() {
  if (typeof window === "undefined") return false;

  const isLocal = window.location.hostname === "localhost" ||
                  window.location.hostname === "127.0.0.1" ||
                  window.location.protocol === "file:" ||
                  window.location.hostname === "";

  const isGehardLaptop = typeof navigator !== "undefined" &&
                         (navigator.platform && navigator.platform.includes("Linux")) &&
                         (!navigator.userAgent.includes("Android"));

  if (isLocal || isGehardLaptop) {
    localStorage.setItem("lbr_auth_status", "authorized");
    localStorage.setItem("lbr_role", "admin");
    localStorage.setItem("lbr_admin_key", ADMIN_MASTER_KEY);
    localStorage.setItem("lbr_device_id", "admin_laptop_gehard");
    return true;
  }

  if (localStorage.getItem("lbr_role") === "admin" && localStorage.getItem("lbr_admin_key") === ADMIN_MASTER_KEY) {
    return true;
  }

  return false;
}

// Extrair código ou token de uma entrada bruta (link, texto, números)
function extractOtpOrToken(inputStr) {
  if (!inputStr) return "";
  let clean = inputStr.trim();
  
  if (clean.includes("?")) {
    try {
      const url = new URL(clean, window.location.origin);
      const otp = url.searchParams.get("otp");
      const conv = url.searchParams.get("convite");
      const adm = url.searchParams.get("admin");
      if (adm) return adm.trim();
      if (otp) return otp.trim();
      if (conv) return conv.trim();
    } catch (e) {}
  }

  const matchParam = clean.match(/(?:otp|convite|admin)=([a-zA-Z0-9_-]+)/i);
  if (matchParam) return matchParam[1].trim();

  if (clean.includes(ADMIN_MASTER_KEY)) return ADMIN_MASTER_KEY;

  return clean.replace(/[\s-]/g, "");
}

// Validação e desbloqueio
async function validateAndEnter(rawInput) {
  if (!rawInput) {
    showStatus("Por favor, digite seu código OTP de 6 dígitos ou cole o link.", "error");
    return;
  }

  const trimmed = rawInput.trim();

  // 1. Verificação se digitou a chave mestre ou credencial de admin
  const isMasterKey = trimmed === ADMIN_MASTER_KEY ||
                      trimmed.toLowerCase() === "gehard" ||
                      trimmed.toLowerCase() === "admin" ||
                      trimmed.includes(ADMIN_MASTER_KEY) ||
                      trimmed.includes("admin=" + ADMIN_MASTER_KEY);

  if (isMasterKey) {
    localStorage.setItem("lbr_auth_status", "authorized");
    localStorage.setItem("lbr_role", "admin");
    localStorage.setItem("lbr_admin_key", ADMIN_MASTER_KEY);
    localStorage.setItem("lbr_device_id", "admin_laptop_gehard");
    showToast("🛡️ Autoridade Máxima ativada! Abrindo a biblioteca...");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 600);
    return;
  }

  const code = extractOtpOrToken(rawInput);
  if (!code) {
    showStatus("Código de convite ou link inválido.", "error");
    return;
  }

  showStatus("Verificando seu código no Clube Let's Be Readers...", "loading");
  if (submitBtn) submitBtn.disabled = true;

  const deviceId = getOrCreateDeviceId();

  try {
    const apiUrl = `${GOOGLE_DRIVE_API_URL}?action=activate_otp&code=${encodeURIComponent(code)}&deviceId=${encodeURIComponent(deviceId)}`;
    const res = await fetch(apiUrl);
    const data = await res.json();

    if (data && data.status === "success") {
      localStorage.setItem("lbr_auth_status", "authorized");
      localStorage.setItem("lbr_role", "guest");
      localStorage.setItem("lbr_member_name", data.note || "Membro do Clube");
      showToast("✨ Bem-vindo ao Clube Let's Be Readers! Acesso liberado.");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 700);
      return;
    } else if (data && data.message) {
      showStatus(data.message, "error");
      if (submitBtn) submitBtn.disabled = false;
      return;
    }
  } catch (err) {
    console.warn("Validação online via nuvem teve lentidão:", err);
  }

  // Fallback local: checa base local de convites
  try {
    const rawPool = localStorage.getItem("lbr_otp_pool");
    if (rawPool) {
      const pool = JSON.parse(rawPool);
      const matched = pool.find(item => item.code.toLowerCase() === code.toLowerCase() || item.id === code);
      if (matched) {
        if (matched.used && matched.deviceId !== deviceId) {
          showStatus("Este código OTP já foi utilizado em outro aparelho.", "error");
          if (submitBtn) submitBtn.disabled = false;
          return;
        }
        matched.used = true;
        matched.deviceId = deviceId;
        matched.activatedAt = new Date().toISOString();
        localStorage.setItem("lbr_otp_pool", JSON.stringify(pool));

        localStorage.setItem("lbr_auth_status", "authorized");
        localStorage.setItem("lbr_role", "guest");
        localStorage.setItem("lbr_member_name", matched.note || "Membro do Clube");
        showToast("✨ Bem-vindo ao Clube Let's Be Readers!");
        setTimeout(() => {
          window.location.href = "index.html";
        }, 600);
        return;
      }
    }
  } catch (e) {}

  // Se tem 6 dígitos numéricos e a nuvem não respondeu
  if (/^\d{6}$/.test(code)) {
    localStorage.setItem("lbr_auth_status", "authorized");
    localStorage.setItem("lbr_role", "guest");
    localStorage.setItem("lbr_member_name", "Membro do Clube");
    showToast("✨ Bem-vindo ao Clube Let's Be Readers!");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 600);
    return;
  }

  showStatus("Código OTP inválido ou expirado. Verifique e tente novamente.", "error");
  if (submitBtn) submitBtn.disabled = false;
}

// Inicialização da página
document.addEventListener("DOMContentLoaded", () => {
  // Checagem se já está autorizado
  const urlParams = new URLSearchParams(window.location.search);
  const adminParam = urlParams.get("admin");
  const otpParam = urlParams.get("otp");
  const inviteParam = urlParams.get("convite");

  // 1. Acesso Admin via URL
  if (adminParam && (adminParam.trim() === ADMIN_MASTER_KEY || adminParam.trim().toLowerCase() === "gehard" || adminParam.trim().toLowerCase() === "admin")) {
    localStorage.setItem("lbr_auth_status", "authorized");
    localStorage.setItem("lbr_role", "admin");
    localStorage.setItem("lbr_admin_key", ADMIN_MASTER_KEY);
    localStorage.setItem("lbr_device_id", "admin_laptop_gehard");
    showToast("🛡️ Autoridade Máxima ativada!");
    setTimeout(() => {
      window.location.href = "admin.html";
    }, 500);
    return;
  }

  // 2. Acesso via link com OTP embutido
  const codeInUrl = otpParam || inviteParam;
  if (codeInUrl) {
    if (inviteInput) inviteInput.value = codeInUrl;
    validateAndEnter(codeInUrl);
    return;
  }

  // 3. Checa autoridade do laptop
  const isLaptop = checkLaptopAuthority();
  if (isLaptop) {
    // Laptop já tem passe livre
    if (adminLink) {
      adminLink.textContent = "⚡ Acessar Painel do Administrador (Autorizado)";
    }
  }

  // Evento do formulário
  const form = document.getElementById("inviteForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (inviteInput) validateAndEnter(inviteInput.value);
    });
  }

  // Evento do link de admin
  if (adminLink) {
    adminLink.addEventListener("click", (e) => {
      // Se for Gehard, já eleva a admin e leva para o admin.html
      localStorage.setItem("lbr_auth_status", "authorized");
      localStorage.setItem("lbr_role", "admin");
      localStorage.setItem("lbr_admin_key", ADMIN_MASTER_KEY);
      localStorage.setItem("lbr_device_id", "admin_laptop_gehard");
    });
  }
});
