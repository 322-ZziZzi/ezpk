(() => {
  const $ = (selector) => document.querySelector(selector);
  const cfg = window.EZPK_SUPABASE_CONFIG || {};
  const FUNCTION_NAME = "request-admin";
  const ADMIN_PASSWORD_SESSION_KEY = "ezpk_request_admin_password";

  function configured() {
    return Boolean(
      cfg.url &&
      cfg.publishableKey &&
      !cfg.publishableKey.includes("PASTE_")
    );
  }

  function esc(value = "") {
    return String(value).replace(/[&<>'"]/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    })[char]);
  }

  function apiHeaders() {
    return {
      apikey: cfg.publishableKey,
      Authorization: `Bearer ${cfg.publishableKey}`,
      "Content-Type": "application/json",
    };
  }

  function getAdminPassword() {
    const saved = sessionStorage.getItem(ADMIN_PASSWORD_SESSION_KEY);
    if (saved) return saved;

    const entered = window.prompt("Request Manager 관리자 비밀번호를 입력하세요.");
    if (!entered) return "";

    sessionStorage.setItem(ADMIN_PASSWORD_SESSION_KEY, entered);
    return entered;
  }

  function clearAdminPassword() {
    sessionStorage.removeItem(ADMIN_PASSWORD_SESSION_KEY);
  }

  async function invokeAdminFunction(payload) {
    const response = await fetch(
      `${cfg.url}/functions/v1/${FUNCTION_NAME}`,
      {
        method: "POST",
        headers: apiHeaders(),
        body: JSON.stringify(payload),
      }
    );

    let result = null;
    try {
      result = await response.json();
    } catch {
      result = null;
    }

    if (!response.ok || !result?.success) {
      const error = new Error(
        result?.message || `Edge Function 오류 (${response.status})`
      );
      error.status = response.status;
      throw error;
    }

    return result;
  }

  async function loadRequests() {
    const list = $("#requestAdminList");
    const status = $("#requestAdminStatus");
    if (!list || !status) return;

    if (!configured()) {
      status.textContent = "supabase-config.js에 Publishable Key를 입력하세요.";
      status.className = "status error";
      return;
    }

    status.textContent = "요청을 불러오는 중...";
    status.className = "status";

    try {
      const response = await fetch(
        `${cfg.url}/rest/v1/requests?select=id,nickname,message,admin_reply,created_at,reply_at&order=created_at.desc&limit=100`,
        { headers: apiHeaders() }
      );

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const rows = await response.json();

      list.innerHTML = rows.length
        ? rows.map((request) => `
          <article class="request-admin-item" data-id="${request.id}">
            <div class="request-admin-meta">
              <div>
                <strong>#${request.id} · ${esc(request.nickname)}</strong>
                <small>${esc(new Date(request.created_at).toLocaleString())}</small>
              </div>
              <span class="request-admin-state ${request.admin_reply ? "answered" : ""}">
                ${request.admin_reply ? "ANSWERED" : "WAITING"}
              </span>
            </div>

            <p class="request-admin-message">${esc(request.message)}</p>

            ${request.admin_reply ? `<blockquote>${esc(request.admin_reply)}</blockquote>` : ""}

            <label class="request-admin-reply-label">
              관리자 답변
              <textarea rows="3" maxlength="5000" placeholder="답변을 입력하세요.">${esc(request.admin_reply || "")}</textarea>
            </label>

            <div class="request-admin-actions">
              <button type="button" class="primary save-request-reply">답변 저장</button>
              <button type="button" class="danger delete-request-admin">요청 삭제</button>
            </div>

            <div class="request-item-status status" aria-live="polite"></div>
          </article>
        `).join("")
        : '<p class="help">등록된 요청이 없습니다.</p>';

      status.textContent = `${rows.length}개의 요청을 불러왔습니다.`;
      status.className = "status ok";
    } catch (error) {
      status.textContent = error.message || "요청 목록을 불러오지 못했습니다.";
      status.className = "status error";
    }
  }

  async function runAction(card, type) {
    const id = Number(card.dataset.id);
    const itemStatus = card.querySelector(".request-item-status");
    const actionButton = card.querySelector(
      type === "reply" ? ".save-request-reply" : ".delete-request-admin"
    );

    if (!Number.isInteger(id) || id <= 0) return;

    let adminPassword = getAdminPassword();
    if (!adminPassword) {
      itemStatus.textContent = "관리자 비밀번호 입력이 취소되었습니다.";
      itemStatus.className = "request-item-status status error";
      return;
    }

    const payload = {
      action: type === "reply" ? "reply" : "delete",
      requestId: id,
      adminPassword,
    };

    if (type === "reply") {
      const reply = card.querySelector("textarea")?.value.trim() || "";
      if (!reply) {
        itemStatus.textContent = "답변을 입력하세요.";
        itemStatus.className = "request-item-status status error";
        return;
      }
      payload.reply = reply;
    } else if (!window.confirm(`#${id} 요청을 영구적으로 삭제하시겠습니까?`)) {
      return;
    }

    actionButton.disabled = true;
    itemStatus.textContent = type === "reply" ? "답변을 저장하는 중..." : "요청을 삭제하는 중...";
    itemStatus.className = "request-item-status status";

    try {
      await invokeAdminFunction(payload);
      itemStatus.textContent = type === "reply"
        ? "답변이 저장되었습니다."
        : "요청이 삭제되었습니다.";
      itemStatus.className = "request-item-status status ok";
      await loadRequests();
    } catch (error) {
      if (error.status === 401) {
        clearAdminPassword();
        itemStatus.textContent = "관리자 비밀번호가 올바르지 않습니다. 다시 시도하세요.";
      } else {
        itemStatus.textContent = error.message || "처리하지 못했습니다.";
      }
      itemStatus.className = "request-item-status status error";
    } finally {
      actionButton.disabled = false;
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    $("#refreshRequests")?.addEventListener("click", loadRequests);

    document
      .querySelector('[data-panel="requestsPanel"]')
      ?.addEventListener("click", loadRequests);

    $("#requestAdminList")?.addEventListener("click", (event) => {
      const card = event.target.closest(".request-admin-item");
      if (!card) return;

      if (event.target.closest(".save-request-reply")) {
        runAction(card, "reply");
      }

      if (event.target.closest(".delete-request-admin")) {
        runAction(card, "delete");
      }
    });
  });
})();
