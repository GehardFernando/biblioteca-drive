// ==========================================================================
// ADMIN.JS — Painel de Controle de Membros & Convites OTP (Exclusivo Laptop)
// ==========================================================================
const ADMIN_MASTER_KEY = "lbr_master_gehard_8f93a1c72";
const GOOGLE_DRIVE_API_URL = "https://script.google.com/macros/s/AKfycbwGk2epbZ3thFo8ZJhHQDLUEZffTRobl657b6hGKMXNJUXUBtn9cSVUtgIDoHhzaW4rww/exec";
const BASE_SITE_URL = "https://gehardfernando.github.io/biblioteca-drive/";
const OTP_VALIDITY_MS = 5 * 60 * 1000; // Validade estrita de 5 minutos

// Elementos da Interface
const adminOtpNote = document.getElementById("adminOtpNote");
const adminGenerateOtpBtn = document.getElementById("adminGenerateOtpBtn");
const adminLatestOtpBox = document.getElementById("adminLatestOtpBox");
const adminLatestOtpCode = document.getElementById("adminLatestOtpCode");
const adminLatestOtpNote = document.getElementById("adminLatestOtpNote");
const copyLatestOtpBtn = document.getElementById("copyLatestOtpBtn");
const copyLatestLinkBtn = document.getElementById("copyLatestLinkBtn");
const otpCountdown = document.getElementById("otpCountdown");
const otpTimerBadge = document.getElementById("otpTimerBadge");
const refreshMembersBtn = document.getElementById("refreshMembersBtn");
const adminMembersList = document.getElementById("adminMembersList");
const activeMembersCount = document.getElementById("activeMembersCount");
const adminSyncDriveBtn = document.getElementById("adminSyncDriveBtn");
const toastNotification = document.getElementById("toastNotification");
const toastMessage = document.getElementById("toastMessage");

let otpTimerInterval = null;

const AUTH_STATUS_KEY = "lbr_club_auth_v13_locked";

// Bloqueio rigoroso: O painel de administração é exclusivo do laptop Linux do Gehard
function enforceAdminAccess() {
  const ua = navigator.userAgent || "";
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(ua);
  const isTouch = (typeof navigator.maxTouchPoints !== "undefined" && navigator.maxTouchPoints > 0);
  const isSmallScreen = (typeof window.screen !== "undefined" && (window.screen.width < 1024 || window.screen.height < 600));
  const isCoarse = (typeof window.matchMedia === "function" && window.matchMedia("(pointer: coarse)").matches);
  const isMobileDevice = isMobileUA || isSmallScreen || (isTouch && isCoarse);

  const isLinuxDesktop = (navigator.platform && navigator.platform.indexOf("Linux") !== -1) &&
                         (!isMobileDevice);
  const isLocal = window.location.hostname === "localhost" || 
                  window.location.hostname === "127.0.0.1" || 
                  window.location.protocol === "file:";
  const urlParams = new URLSearchParams(window.location.search);
  const hasMasterKey = urlParams.get("admin") === ADMIN_MASTER_KEY;

  if (isMobileDevice || (!isLocal && !isLinuxDesktop && !hasMasterKey)) {
    try {
      localStorage.removeItem("lbr_role");
      localStorage.removeItem("lbr_admin_key");
      localStorage.removeItem(AUTH_STATUS_KEY);
      localStorage.removeItem("lbr_club_auth_v12");
      localStorage.removeItem("lbr_auth_status");
    } catch (e) {}
    alert("Acesso Negado: O Painel de Administração é restrito exclusivamente ao laptop do administrador.");
    window.location.replace("entrar.html");
    return false;
  }

  try {
    localStorage.removeItem("lbr_auth_status");
    localStorage.removeItem("lbr_club_auth_v12");
  } catch (e) {}

  localStorage.setItem(AUTH_STATUS_KEY, "authorized");
  localStorage.setItem("lbr_role", "admin");
  localStorage.setItem("lbr_admin_key", ADMIN_MASTER_KEY);
  localStorage.setItem("lbr_device_id", "admin_laptop_gehard");
  return true;
}

// Exibir feedback tipo toast
function showToast(msg) {
  if (!toastNotification || !toastMessage) return;
  toastMessage.textContent = msg;
  toastNotification.classList.remove("hidden");
  setTimeout(() => {
    toastNotification.classList.add("hidden");
  }, 3000);
}

// Armazenamento local de convites
function getLocalOtpPool() {
  try {
    const raw = localStorage.getItem("lbr_otp_pool");
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [];
}

function saveLocalOtpPool(pool) {
  try {
    localStorage.setItem("lbr_otp_pool", JSON.stringify(pool));
  } catch (e) {}
}

// Copiar texto para o clipboard com feedback
async function copyTextWithFeedback(text, btnEl, successLabel = "Copiado! ✓") {
  if (!text) return;
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const tempInput = document.createElement("input");
      tempInput.value = text;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
    }

    if (btnEl) {
      const originalText = btnEl.innerHTML;
      btnEl.classList.add("copied");
      btnEl.innerHTML = `<span>${successLabel}</span>`;
      setTimeout(() => {
        btnEl.classList.remove("copied");
        btnEl.innerHTML = originalText;
      }, 2200);
    }
    showToast("Copiado para a área de transferência!");
  } catch (err) {
    showToast("Código pronto: " + text);
  }
}

// Iniciar contagem regressiva de 5 minutos
function startOtpCountdown(expiresAt) {
  if (otpTimerInterval) clearInterval(otpTimerInterval);

  function updateTimer() {
    const now = Date.now();
    const diff = expiresAt - now;

    if (diff <= 0) {
      clearInterval(otpTimerInterval);
      otpTimerInterval = null;
      if (otpCountdown) otpCountdown.textContent = "00:00";
      if (adminLatestOtpBox) adminLatestOtpBox.classList.add("expired");
      if (otpTimerBadge) {
        otpTimerBadge.innerHTML = '<span>⚠️ Código Expirado (5 min esgotados)</span>';
      }
      return;
    }

    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    if (adminLatestOtpBox) adminLatestOtpBox.classList.remove("expired");
    if (otpTimerBadge) {
      otpTimerBadge.innerHTML = `
        <span class="otp-timer-icon">⏱️</span>
        <span class="otp-timer-text">Válido por:</span>
        <span class="otp-countdown-val" id="otpCountdown">${timeStr}</span>
      `;
    }
  }

  updateTimer();
  otpTimerInterval = setInterval(updateTimer, 1000);
}

// Exibir o card de destaque do código gerado
function showOtpDisplayBox(otpCode, note, expiresAt) {
  if (!adminLatestOtpBox) return;
  adminLatestOtpBox.classList.remove("hidden");
  if (adminLatestOtpNote) adminLatestOtpNote.textContent = `Para: ${note}`;
  if (adminLatestOtpCode) {
    adminLatestOtpCode.textContent = `${otpCode.substring(0, 3)} ${otpCode.substring(3)}`;
  }

  const baseUrl = (typeof window !== "undefined" && window.location.hostname.includes("github.io"))
    ? window.location.origin + window.location.pathname.replace(/admin\.html.*$/, "") + "entrar.html"
    : `${BASE_SITE_URL}entrar.html`;

  const fullUrl = `${baseUrl}?otp=${otpCode}&exp=${expiresAt}&t=${Date.now()}`;

  if (copyLatestOtpBtn) {
    copyLatestOtpBtn.onclick = () => copyTextWithFeedback(otpCode, copyLatestOtpBtn, "OTP Copiado! ✓");
  }
  if (copyLatestLinkBtn) {
    copyLatestLinkBtn.onclick = () => copyTextWithFeedback(fullUrl, copyLatestLinkBtn, "Link Copiado! ✓");
  }

  startOtpCountdown(expiresAt);
}

// Restaurar código ativo se ainda estiver dentro dos 5 minutos
function restoreActiveOtp() {
  try {
    const raw = localStorage.getItem("lbr_active_otp");
    if (!raw) return;
    const active = JSON.parse(raw);
    if (active && active.expiresAt && Date.now() < active.expiresAt) {
      showOtpDisplayBox(active.code, active.note || "Convidado", active.expiresAt);
    }
  } catch (e) {}
}

// Renderizar a lista de membros e convites
function renderMembersList(invites = []) {
  if (!adminMembersList) return;
  adminMembersList.innerHTML = "";

  const activeCount = invites.filter(i => i.used).length;
  if (activeMembersCount) {
    activeMembersCount.textContent = `${activeCount} Membro(s) Ativo(s)`;
  }

  if (!invites || invites.length === 0) {
    adminMembersList.innerHTML = `
      <div class="members-empty-state">
        <p>Nenhum convite emitido ainda. Digite um nome acima e clique em <strong>"Gerar Código OTP"</strong> para criar o primeiro!</p>
      </div>
    `;
    return;
  }

  const now = Date.now();

  invites.forEach(item => {
    const card = document.createElement("div");
    card.className = "member-item-card";

    const isUsed = item.used;
    const expiresAt = item.expiresAt ? new Date(item.expiresAt).getTime() : 0;
    const isExpired = !isUsed && expiresAt > 0 && now > expiresAt;
    const remainingMins = !isUsed && expiresAt > now ? Math.ceil((expiresAt - now) / 60000) : 0;

    let badgeHtml = "";
    if (isUsed) {
      badgeHtml = `<span class="slot-badge badge-active">🟢 Ativo • Aparelho Vinculado</span>`;
    } else if (isExpired) {
      badgeHtml = `<span class="slot-badge badge-revoked">⚪ Expirado (5 min esgotados)</span>`;
    } else {
      badgeHtml = `<span class="slot-badge badge-pending">🟡 Válido (~${remainingMins}m restantes)</span>`;
    }

    const formattedCode = item.code.length === 6 
      ? `${item.code.substring(0, 3)} ${item.code.substring(3)}`
      : item.code;

    const baseUrl = (typeof window !== "undefined" && window.location.hostname.includes("github.io"))
      ? window.location.origin + window.location.pathname.replace(/admin\.html.*$/, "") + "entrar.html"
      : `${BASE_SITE_URL}entrar.html`;

    const fullLink = `${baseUrl}?otp=${item.code}&exp=${expiresAt}`;
    const dateFormatted = item.activatedAt 
      ? new Date(item.activatedAt).toLocaleDateString("pt-BR")
      : (item.createdAt ? new Date(item.createdAt).toLocaleDateString("pt-BR") : "Hoje");

    card.innerHTML = `
      <div class="member-item-info">
        <div class="member-item-title-row">
          <h4 class="member-item-name">${item.note || "Convidado"}</h4>
          ${badgeHtml}
        </div>
        <div class="member-item-meta">
          <span>Código OTP: <strong class="member-item-code">${formattedCode}</strong></span>
          <span>• ${isUsed ? "Vinculado em: " : "Criado em: "}${dateFormatted}</span>
        </div>
      </div>
      <div class="member-item-actions">
        <button class="btn-member-action copy-otp-item-btn" title="Copiar apenas o código de 6 dígitos">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <span>Copiar OTP</span>
        </button>
        <button class="btn-member-action copy-link-item-btn" title="Copiar link com código embutido">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
          <span>Copiar Link</span>
        </button>
        <button class="btn-member-action btn-member-revoke revoke-item-btn" title="Revogar este acesso">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          <span>Revogar</span>
        </button>
      </div>
    `;

    // Eventos
    const copyOtpBtn = card.querySelector(".copy-otp-item-btn");
    const copyLinkBtn = card.querySelector(".copy-link-item-btn");
    const revokeBtn = card.querySelector(".revoke-item-btn");

    if (copyOtpBtn) {
      copyOtpBtn.onclick = () => copyTextWithFeedback(item.code, copyOtpBtn, "Copiado!");
    }
    if (copyLinkBtn) {
      copyLinkBtn.onclick = () => copyTextWithFeedback(fullLink, copyLinkBtn, "Copiado!");
    }
    if (revokeBtn) {
      revokeBtn.onclick = () => revokeOtpOrMember(item.id || item.code);
    }

    adminMembersList.appendChild(card);
  });
}

// Revogar um membro ou convite
async function revokeOtpOrMember(targetId) {
  if (!confirm("Deseja realmente revogar o acesso deste membro / cancelar este código OTP?")) return;

  let pool = getLocalOtpPool();
  pool = pool.filter(inv => inv.id !== targetId && inv.code !== targetId);
  saveLocalOtpPool(pool);
  renderMembersList(pool);

  try {
    await fetch(`${GOOGLE_DRIVE_API_URL}?action=admin_revoke_invite&adminKey=${encodeURIComponent(ADMIN_MASTER_KEY)}&id=${encodeURIComponent(targetId)}`);
  } catch (err) {}

  showToast("Acesso / código revogado com sucesso!");
}

// Gerar novo código OTP de 6 dígitos com validade de 5 minutos
async function generateNewOtp() {
  const note = (adminOtpNote && adminOtpNote.value.trim()) || "Convidado";
  let otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const now = Date.now();
  const expiresAt = now + OTP_VALIDITY_MS;

  const newInvite = {
    id: "otp_" + now.toString(36) + Math.random().toString(36).substring(2, 6),
    code: otpCode,
    note: note,
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(expiresAt).toISOString(),
    used: false,
    deviceId: null,
    activatedAt: null
  };

  // Salva no código ativo com expiração de 5 minutos
  localStorage.setItem("lbr_active_otp", JSON.stringify({
    code: otpCode,
    note: note,
    createdAt: now,
    expiresAt: expiresAt
  }));

  // Salva no pool local
  const pool = getLocalOtpPool();
  pool.unshift(newInvite);
  saveLocalOtpPool(pool);

  // Exibe o card de destaque do código gerado com o contador regressivo de 5 minutos
  showOtpDisplayBox(otpCode, note, expiresAt);

  if (adminOtpNote) adminOtpNote.value = "";
  renderMembersList(pool);
  showToast("⚡ Novo código gerado! Válido por 5 minutos.");

  // Tenta sincronizar com Google Apps Script
  try {
    fetch(`${GOOGLE_DRIVE_API_URL}?action=admin_create_otp&adminKey=${encodeURIComponent(ADMIN_MASTER_KEY)}&note=${encodeURIComponent(note)}&code=${encodeURIComponent(otpCode)}&expiresAt=${encodeURIComponent(newInvite.expiresAt)}`).catch(() => {});
  } catch (err) {}
}

// Carregar lista da nuvem
async function fetchCloudInvites() {
  const localPool = getLocalOtpPool();
  renderMembersList(localPool);

  try {
    const res = await fetch(`${GOOGLE_DRIVE_API_URL}?action=admin_list_invites&adminKey=${encodeURIComponent(ADMIN_MASTER_KEY)}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.status === "success" && data.invites) {
        saveLocalOtpPool(data.invites);
        renderMembersList(data.invites);
      }
    }
  } catch (e) {}
}

// Sincronizar com Google Drive
async function syncGoogleDrive() {
  if (!adminSyncDriveBtn) return;
  adminSyncDriveBtn.classList.add("spinning");
  showToast("Sincronizando catálogo com o Google Drive...");

  try {
    const res = await fetch(`${GOOGLE_DRIVE_API_URL}?refresh=1`);
    if (res.ok) {
      showToast("✅ Catálogo sincronizado com o Google Drive!");
    }
  } catch (err) {
    showToast("Aviso: Sincronização em andamento na nuvem.");
  } finally {
    adminSyncDriveBtn.classList.remove("spinning");
  }
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  // 1. Verificação rígida de autoridade (apenas laptop)
  if (!enforceAdminAccess()) {
    return;
  }

  // 2. Restaura o OTP ativo e o cronômetro se ainda estiver nos 5 minutos
  restoreActiveOtp();

  // 3. Carrega convites
  fetchCloudInvites();

  if (adminGenerateOtpBtn) {
    adminGenerateOtpBtn.onclick = () => generateNewOtp();
  }

  if (adminOtpNote) {
    adminOtpNote.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        generateNewOtp();
      }
    });
  }

  if (refreshMembersBtn) {
    refreshMembersBtn.onclick = () => fetchCloudInvites();
  }

  if (adminSyncDriveBtn) {
    adminSyncDriveBtn.onclick = () => syncGoogleDrive();
  }
});
