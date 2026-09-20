// ==========================================================================
// ENTRAR.JS — Portal de Acesso e Validação do Clube Let's Be Readers
// ==========================================================================
const ADMIN_MASTER_KEY = "lbr_master_gehard_8f93a1c72";
const GOOGLE_DRIVE_API_URL = "https://script.google.com/macros/s/AKfycbwGk2epbZ3thFo8ZJhHQDLUEZffTRobl657b6hGKMXNJUXUBtn9cSVUtgIDoHhzaW4rww/exec";
const OTP_VALIDITY_MS = 5 * 60 * 1000; // 5 minutos de validade estrita
const AUTH_STATUS_KEY = "lbr_club_auth_v15_locked";

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

// Reconhece estritamente o computador/laptop do Gehard
function checkLaptopAuthority() {
  if (typeof window === "undefined") return false;

  const ua = navigator.userAgent || "";
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(ua);
  const isTouch = (typeof navigator.maxTouchPoints !== "undefined" && navigator.maxTouchPoints > 0);
  const isSmallScreen = (typeof window.screen !== "undefined" && (window.screen.width < 1024 || window.screen.height < 600));
  const isCoarse = (typeof window.matchMedia === "function" && window.matchMedia("(pointer: coarse)").matches);
  const isMobileDevice = isMobileUA || isSmallScreen || (isTouch && isCoarse);
  
  // Celulares são terminantemente proibidos de receber autoridade máxima
  if (isMobileDevice) {
    try {
      localStorage.removeItem("lbr_role");
      localStorage.removeItem("lbr_admin_key");
      localStorage.removeItem(AUTH_STATUS_KEY);
      localStorage.removeItem("lbr_club_auth_v13_locked");
      localStorage.removeItem("lbr_club_auth_v12");
      localStorage.removeItem("lbr_auth_status");
    } catch(e) {}
    return false;
  }

  const isLocal = window.location.hostname === "localhost" ||
                  window.location.hostname === "127.0.0.1" ||
                  window.location.protocol === "file:" ||
                  window.location.hostname === "";

  const isLinuxDesktop = typeof navigator !== "undefined" &&
                         (navigator.platform && navigator.platform.includes("Linux")) &&
                         (!isMobileDevice);

  if (isLocal || isLinuxDesktop) {
    localStorage.setItem(AUTH_STATUS_KEY, "authorized");
    localStorage.setItem("lbr_role", "admin");
    localStorage.setItem("lbr_admin_key", ADMIN_MASTER_KEY);
    localStorage.setItem("lbr_device_id", "admin_laptop_gehard");
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
    showStatus("Por favor, digite seu código OTP de 6 dígitos.", "error");
    return;
  }

  const trimmed = rawInput.trim();

  // 1. Verificação se digitou a chave mestre em computador desktop
  const isMasterKey = trimmed === ADMIN_MASTER_KEY ||
                      trimmed.toLowerCase() === "gehard" ||
                      trimmed.includes(ADMIN_MASTER_KEY);

  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(navigator.userAgent || "");
  const isTouch = (typeof navigator.maxTouchPoints !== "undefined" && navigator.maxTouchPoints > 0);
  const isSmallScreen = (typeof window.screen !== "undefined" && (window.screen.width < 1024 || window.screen.height < 600));
  const isCoarse = (typeof window.matchMedia === "function" && window.matchMedia("(pointer: coarse)").matches);
  const isMobileDevice = isMobileUA || isSmallScreen || (isTouch && isCoarse);

  if (isMasterKey && !isMobileDevice) {
    localStorage.setItem(AUTH_STATUS_KEY, "authorized");
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
    showStatus("Código OTP inválido.", "error");
    return;
  }

  // 2. Checagem de expiração no link URL (se veio com exp ou t)
  const urlParams = new URLSearchParams(window.location.search);
  const expParam = urlParams.get("exp");
  const tParam = urlParams.get("t");
  const now = Date.now();

  if (expParam && now > parseInt(expParam)) {
    showStatus("❌ Este código OTP expirou (a validade de 5 minutos foi excedida). Peça um novo código ao administrador.", "error");
    return;
  }
  if (tParam && (now - parseInt(tParam)) > OTP_VALIDITY_MS) {
    showStatus("❌ Este código OTP expirou (a validade de 5 minutos foi excedida). Peça um novo código ao administrador.", "error");
    return;
  }

  showStatus("Verificando seu código no Clube Let's Be Readers...", "loading");
  if (submitBtn) submitBtn.disabled = true;

  const deviceId = getOrCreateDeviceId();

  // 3. Validação online com Google Apps Script
  try {
    const apiUrl = `${GOOGLE_DRIVE_API_URL}?action=activate_otp&code=${encodeURIComponent(code)}&deviceId=${encodeURIComponent(deviceId)}`;
    const res = await fetch(apiUrl);
    const data = await res.json();

    // Requer resposta autêntica de ativação de OTP (não aceita a lista de livros padrão)
    if (data && data.status === "success" && data.authorized === true && !data.books) {
      localStorage.setItem(AUTH_STATUS_KEY, "authorized");
      localStorage.setItem("lbr_role", "guest");
      localStorage.setItem("lbr_member_name", data.note || "Membro do Clube");
      showToast("✨ Bem-vindo ao Clube Let's Be Readers! Acesso liberado.");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 700);
      return;
    } else if (data && data.message && (data.message.includes("expirou") || data.message.includes("utilizado") || data.message.includes("inválido"))) {
      showStatus(data.message, "error");
      if (submitBtn) submitBtn.disabled = false;
      return;
    }
  } catch (err) {
    console.warn("Validação online via nuvem teve lentidão:", err);
  }

  // 4. Verificação no banco local de convites (com verificação estrita de 5 minutos)
  try {
    // Checa active_otp gerado
    const rawActive = localStorage.getItem("lbr_active_otp");
    if (rawActive) {
      const active = JSON.parse(rawActive);
      if (active && active.code === code) {
        if (now > active.expiresAt) {
          showStatus("❌ Este código OTP expirou (a validade de 5 minutos foi excedida). Peça um novo código ao administrador.", "error");
          if (submitBtn) submitBtn.disabled = false;
          return;
        }
        localStorage.setItem(AUTH_STATUS_KEY, "authorized");
        localStorage.setItem("lbr_role", "guest");
        localStorage.setItem("lbr_member_name", active.note || "Membro do Clube");
        showToast("✨ Bem-vindo ao Clube Let's Be Readers!");
        setTimeout(() => {
          window.location.href = "index.html";
        }, 600);
        return;
      }
    }

    // Checa pool de convites
    const rawPool = localStorage.getItem("lbr_otp_pool");
    if (rawPool) {
      const pool = JSON.parse(rawPool);
      const matched = pool.find(item => item.code.toLowerCase() === code.toLowerCase() || item.id === code);
      if (matched) {
        const expTime = matched.expiresAt ? new Date(matched.expiresAt).getTime() : 0;
        if (expTime > 0 && now > expTime) {
          showStatus("❌ Este código OTP expirou (a validade de 5 minutos foi excedida). Peça um novo código ao administrador.", "error");
          if (submitBtn) submitBtn.disabled = false;
          return;
        }

        if (matched.used && matched.deviceId !== deviceId) {
          showStatus("❌ Este código OTP já foi utilizado em outro aparelho.", "error");
          if (submitBtn) submitBtn.disabled = false;
          return;
        }

        matched.used = true;
        matched.deviceId = deviceId;
        matched.activatedAt = new Date().toISOString();
        localStorage.setItem("lbr_otp_pool", JSON.stringify(pool));

        localStorage.setItem(AUTH_STATUS_KEY, "authorized");
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

  // Se o código não foi encontrado ou não é válido
  showStatus("❌ Código OTP inválido ou expirado. Peça um novo convite ao administrador.", "error");
  if (submitBtn) submitBtn.disabled = false;
}

// Inicialização da página
document.addEventListener("DOMContentLoaded", () => {
  // Limpeza de tokens legados residuais
  try {
    localStorage.removeItem("lbr_auth_status");
  } catch(e) {}

  const urlParams = new URLSearchParams(window.location.search);
  const adminParam = urlParams.get("admin");
  const otpParam = urlParams.get("otp");
  const inviteParam = urlParams.get("convite");
  const ua = navigator.userAgent || "";
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(ua);
  const isTouch = (typeof navigator.maxTouchPoints !== "undefined" && navigator.maxTouchPoints > 0);
  const isSmallScreen = (typeof window.screen !== "undefined" && (window.screen.width < 1024 || window.screen.height < 600));
  const isCoarse = (typeof window.matchMedia === "function" && window.matchMedia("(pointer: coarse)").matches);
  const isMobileDevice = isMobileUA || isSmallScreen || (isTouch && isCoarse);

  // 1. Acesso Admin via URL (Apenas em computadores/laptops, NUNCA em celulares)
  if (!isMobileDevice && adminParam && (adminParam.trim() === ADMIN_MASTER_KEY || adminParam.trim().toLowerCase() === "gehard")) {
    localStorage.setItem(AUTH_STATUS_KEY, "authorized");
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

  // 3. Checa autoridade do laptop (mostra botão admin SOMENTE no laptop)
  const isLaptop = checkLaptopAuthority();
  if (isLaptop && adminLink) {
    adminLink.classList.remove("hidden");
  } else if (adminLink) {
    adminLink.classList.add("hidden");
  }

  // Evento do formulário
  const form = document.getElementById("inviteForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (inviteInput) validateAndEnter(inviteInput.value);
    });
  }
});
