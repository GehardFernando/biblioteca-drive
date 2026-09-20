// ==========================================================================
// ADMIN.JS — Painel de Controle de Membros & Convites OTP
// ==========================================================================
const ADMIN_MASTER_KEY = "lbr_master_gehard_8f93a1c72";
const GOOGLE_DRIVE_API_URL = "https://script.google.com/macros/s/AKfycbwGk2epbZ3thFo8ZJhHQDLUEZffTRobl657b6hGKMXNJUXUBtn9cSVUtgIDoHhzaW4rww/exec";
const BASE_SITE_URL = "https://gehardfernando.github.io/biblioteca-drive/";

// Elementos da Interface
const adminOtpNote = document.getElementById("adminOtpNote");
const adminGenerateOtpBtn = document.getElementById("adminGenerateOtpBtn");
const adminLatestOtpBox = document.getElementById("adminLatestOtpBox");
const adminLatestOtpCode = document.getElementById("adminLatestOtpCode");
const adminLatestOtpNote = document.getElementById("adminLatestOtpNote");
const copyLatestOtpBtn = document.getElementById("copyLatestOtpBtn");
const copyLatestLinkBtn = document.getElementById("copyLatestLinkBtn");
const refreshMembersBtn = document.getElementById("refreshMembersBtn");
const adminMembersList = document.getElementById("adminMembersList");
const activeMembersCount = document.getElementById("activeMembersCount");
const adminSyncDriveBtn = document.getElementById("adminSyncDriveBtn");
const toastNotification = document.getElementById("toastNotification");
const toastMessage = document.getElementById("toastMessage");

// Auto-elevar laptop do Gehard para Autoridade Máxima
function ensureLaptopAdmin() {
  localStorage.setItem("lbr_auth_status", "authorized");
  localStorage.setItem("lbr_role", "admin");
  localStorage.setItem("lbr_admin_key", ADMIN_MASTER_KEY);
  localStorage.setItem("lbr_device_id", "admin_laptop_gehard");
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

// Armazenamento local de convites para agilidade e modo offline
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

  invites.forEach(item => {
    const card = document.createElement("div");
    card.className = "member-item-card";

    const isUsed = item.used;
    const badgeHtml = isUsed 
      ? `<span class="slot-badge badge-active">Ativo • Aparelho Vinculado</span>`
      : `<span class="slot-badge badge-pending">Pendente (Aguardando Ativação)</span>`;

    const formattedCode = item.code.length === 6 
      ? `${item.code.substring(0, 3)} ${item.code.substring(3)}`
      : item.code;

    // Link para a página dedicada de entrada
    const fullLink = `${BASE_SITE_URL}entrar.html?otp=${item.code}`;
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

// Gerar novo código OTP de 6 dígitos
async function generateNewOtp() {
  const note = (adminOtpNote && adminOtpNote.value.trim()) || "Convidado";
  let otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const newInvite = {
    id: "otp_" + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
    code: otpCode,
    note: note,
    createdAt: new Date().toISOString(),
    used: false,
    deviceId: null,
    activatedAt: null
  };

  // Tenta criar na nuvem (Google Apps Script)
  try {
    const res = await fetch(`${GOOGLE_DRIVE_API_URL}?action=admin_create_otp&adminKey=${encodeURIComponent(ADMIN_MASTER_KEY)}&note=${encodeURIComponent(note)}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.status === "success" && data.otpCode) {
        otpCode = data.otpCode;
        newInvite.code = data.otpCode;
        if (data.invite && data.invite.id) newInvite.id = data.invite.id;
      }
    }
  } catch (err) {
    console.warn("Sincronização em nuvem teve latência:", err);
  }

  // Salva no pool local
  const pool = getLocalOtpPool();
  pool.unshift(newInvite);
  saveLocalOtpPool(pool);

  // Exibe o card de destaque do código gerado
  if (adminLatestOtpBox) {
    adminLatestOtpBox.classList.remove("hidden");
    if (adminLatestOtpNote) adminLatestOtpNote.textContent = `Para: ${note}`;
    if (adminLatestOtpCode) {
      adminLatestOtpCode.textContent = `${otpCode.substring(0, 3)} ${otpCode.substring(3)}`;
    }

    const fullUrl = `${BASE_SITE_URL}entrar.html?otp=${otpCode}`;
    if (copyLatestOtpBtn) {
      copyLatestOtpBtn.onclick = () => copyTextWithFeedback(otpCode, copyLatestOtpBtn, "OTP Copiado! ✓");
    }
    if (copyLatestLinkBtn) {
      copyLatestLinkBtn.onclick = () => copyTextWithFeedback(fullUrl, copyLatestLinkBtn, "Link Copiado! ✓");
    }
  }

  if (adminOtpNote) adminOtpNote.value = "";
  renderMembersList(pool);
  showToast("⚡ Novo código OTP gerado com sucesso!");
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
  ensureLaptopAdmin();

  // Carrega convites locais e busca atualização
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
