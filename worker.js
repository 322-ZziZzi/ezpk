const SESSION_COOKIE = "__Host-ezpk_session";
const FREE_PLAN_PBKDF2_ITERATIONS = 10000;
const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    try {
      if (!url.pathname.startsWith("/api/")) {
        if (request.method === "GET" && url.pathname === "/data/accounts.json") {
          return handlePublicPersistentAsset(url, env);
        }
        if (request.method === "GET" && (url.pathname === "/data/bgb.json" || url.pathname === "/data/season6-teams.json" || url.pathname === "/data/capital-war.json")) {
          return handleConditionalStrategyAsset(request, url, env);
        }
        if (request.method === "GET" && /^\/logo\/(?:Legacy|Royal)%20Edition\.webp$/i.test(url.pathname)) {
          const member = await requireMember(request, env.DB);
          if (member instanceof Response) return member;
          if (member.status !== "active") return jsonError("FORBIDDEN", 403);
          return env.ASSETS.fetch(request);
        }
        return env.ASSETS.fetch(request);
      }

      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: {
            "allow": "GET, POST, PUT, DELETE, OPTIONS",
            "access-control-allow-origin": url.origin,
            "access-control-allow-credentials": "true",
            "access-control-allow-headers": "content-type",
            "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
            "vary": "Origin",
          },
        });
      }

      enforceSameOrigin(request, url);

      const route = `${request.method} ${url.pathname}`;

      const voteRespondMatch = url.pathname.match(/^\/api\/votes\/(\d+)\/respond$/);
      if (voteRespondMatch && request.method === "POST") return handleVoteRespond(request, Number(voteRespondMatch[1]), env);
      const adminVoteMatch = url.pathname.match(/^\/api\/admin\/votes\/(\d+)(?:\/(end|results))?$/);
      if (adminVoteMatch) {
        const voteId = Number(adminVoteMatch[1]);
        const action = adminVoteMatch[2] || "";
        if (request.method === "GET" && action === "results") return handleAdminVoteResults(request, voteId, env);
        if (request.method === "POST" && action === "end") return handleAdminVoteEnd(request, voteId, env);
        if (request.method === "PUT" && !action) return handleAdminVoteUpdate(request, voteId, env);
        if (request.method === "DELETE" && !action) return handleAdminVoteDelete(request, voteId, env);
      }
      const voteExclusionMatch = url.pathname.match(/^\/api\/admin\/votes\/exclusions\/(\d+)$/);
      if (voteExclusionMatch && request.method === "PUT") return handleVoteExclusion(request, Number(voteExclusionMatch[1]), env);


      const adminMemberMatch = url.pathname.match(/^\/api\/admin\/members\/(\d+)(?:\/(memo|reset-password|history|specs|permissions))?$/);
      if (adminMemberMatch) {
        const memberId = Number(adminMemberMatch[1]);
        const action = adminMemberMatch[2] || "";
        if (request.method === "GET" && !action) return handleAdminMemberDetail(request, memberId, env);
        if (request.method === "GET" && action === "history") return handleAdminMemberHistory(request, memberId, env);
        if (request.method === "PUT" && !action) return handleAdminMemberUpdate(request, memberId, env);
        if (request.method === "PUT" && action === "memo") return handleAdminMemberMemo(request, memberId, env);
        if (request.method === "PUT" && action === "specs") return handleAdminMemberSpecsUpdate(request, memberId, env);
        if (request.method === "DELETE" && action === "specs") return handleAdminMemberSpecsReset(request, memberId, env);
        if (request.method === "PUT" && action === "permissions") return handleAdminMemberPermissions(request, memberId, env);
        if (request.method === "POST" && action === "reset-password") return handleAdminMemberResetPassword(request, memberId, env);
        if (request.method === "DELETE" && !action) return handleAdminMemberDelete(request, memberId, env);
      }

      const requestMatch = url.pathname.match(/^\/api\/requests\/(\d+)$/);
      if (requestMatch) {
        const requestId = Number(requestMatch[1]);
        if (request.method === "PUT") return handleRequestUpdate(request, requestId, env);
        if (request.method === "DELETE") return handleRequestDelete(request, requestId, env);
      }

      const adminRequestMatch = url.pathname.match(/^\/api\/admin\/requests\/(\d+)(?:\/(answer))?$/);
      if (adminRequestMatch) {
        const requestId = Number(adminRequestMatch[1]);
        const action = adminRequestMatch[2] || "";
        if (request.method === "PUT" && action === "answer") return handleAdminRequestAnswer(request, requestId, env);
        if (request.method === "PUT" && !action) return handleAdminRequestUpdate(request, requestId, env);
        if (request.method === "DELETE" && !action) return handleAdminRequestDelete(request, requestId, env);
      }

      switch (route) {
        case "GET /api/db-test":
          return handleDbTest(env);

        case "POST /api/setup/admin":
          return handleSetupAdmin(request, env, url);

        case "POST /api/auth/signup":
          return handleSignup(request, env, url);

        case "POST /api/auth/login":
          return handleLogin(request, env, url);

        case "POST /api/auth/logout":
          return handleLogout(request, env);

        case "GET /api/auth/me":
          return handleAuthMe(request, env);

        case "GET /api/public/strategy-access":
          return handlePublicStrategyAccess(env, url);

        case "GET /api/member/me":
          return handleMemberMe(request, env);

        case "GET /api/member/content":
          return handleMemberContentGet(request, url, env);

        case "PUT /api/member/profile":
          return handleProfileUpdate(request, env);

        case "PUT /api/member/nickname":
          return handleNicknameUpdate(request, env);

        case "PUT /api/member/specs":
          return handleSpecsUpdate(request, env);

        case "DELETE /api/member/specs":
          return handleSpecsReset(request, env);

        case "PUT /api/member/password":
          return handlePasswordUpdate(request, env);

        case "GET /api/events":
          return handleEventsGet(request, env);

        case "GET /api/admin/events":
          return handleAdminEventsGet(request, env);

        case "PUT /api/admin/events":
          return handleAdminEventsPut(request, env);

        case "GET /api/votes":
          return handleMemberVotes(request, env);
        case "GET /api/votes/active":
          return handleActiveVotes(request, env);
        case "GET /api/admin/votes":
          return handleAdminVotes(request, env);
        case "POST /api/admin/votes":
          return handleAdminVoteCreate(request, env);
        case "GET /api/members":
          return handlePublicMembers(url, env);

        case "GET /api/admin/members":
          return handleAdminMembers(request, url, env);
        case "GET /api/admin/logs":
          return handleAdminLogs(request, url, env);
        case "GET /api/admin/my-permissions":
          return handleAdminMyPermissionsGet(request, env);
        case "GET /api/admin/menu-permissions":
          return handleAdminMenuPermissionsGet(request, env);
        case "PUT /api/admin/menu-permissions":
          return handleAdminMenuPermissionsPut(request, env);

        case "POST /api/admin/members/bulk":
          return handleAdminMembersBulk(request, env);

        case "GET /api/admin/content":
          return handleAdminContentGet(request, url, env);

        case "PUT /api/admin/content":
          return handleAdminContentPut(request, env);

        case "GET /api/requests":
          return handleRequestsList(request, url, env);

        case "POST /api/requests":
          return handleRequestCreate(request, env);

        case "GET /api/admin/requests":
          return handleAdminRequestsList(request, url, env);

        default:
          return jsonError("NOT_FOUND", 404);
      }
    } catch (error) {
      if (error instanceof HttpError) {
        return jsonError(error.code, error.status);
      }
      console.error("EZPK API error:", error);
      return jsonError("INTERNAL_ERROR", 500);
    }
  },
};

// -----------------------------------------------------------------------------
// API handlers
// -----------------------------------------------------------------------------

async function handleDbTest(env) {
  const result = await env.DB
    .prepare("SELECT key, value FROM settings ORDER BY key")
    .all();

  return json({
    ok: true,
    data: { settings: result.results ?? [] },
  });
}

async function handleSetupAdmin(request, env, url) {
  if (!env.ADMIN_SETUP_KEY) {
    return jsonError("SETUP_NOT_CONFIGURED", 503);
  }
  if (!env.PASSWORD_PEPPER) {
    return jsonError("PASSWORD_PEPPER_NOT_CONFIGURED", 503);
  }

  const body = await readJson(request);
  const setupKey = cleanString(body.setupKey, 256);
  const password = String(body.password ?? "");
  const passwordConfirm = String(body.passwordConfirm ?? "");
  const nickname = cleanString(body.nickname, 64);
  const power = toPositiveInteger(body.power);
  const industryLevel = String(body.industryLevel ?? "").toUpperCase();

  if (!setupKey || !constantTimeEqual(setupKey, env.ADMIN_SETUP_KEY)) {
    return jsonError("INVALID_SETUP_KEY", 403);
  }

  if (!nickname || !power || !isIndustryLevel(industryLevel)) {
    return jsonError("VALIDATION_ERROR", 400);
  }

  const passwordError = validatePassword(password, passwordConfirm);
  if (passwordError) return jsonError(passwordError, 400);

  const adminLoginId =
    (await getSetting(env.DB, "primary_admin_login_id")) || "ezpk_admin";

  const existing = await env.DB
    .prepare("SELECT id FROM members WHERE login_id = ? LIMIT 1")
    .bind(adminLoginId)
    .first();

  if (existing) {
    return jsonError("ADMIN_ALREADY_EXISTS", 409);
  }

  const passwordData = await hashPassword(password, env.PASSWORD_PEPPER);
  const session = await createSessionData(env.DB);

  await env.DB.batch([
    env.DB.prepare(`
      INSERT INTO members (
        login_id, password_hash, password_salt,
        password_algorithm, password_iterations,
        nickname, power, industry_level, member_rank,
        role, status, must_change_password,
        nickname_updated_at, password_changed_at
      )
      VALUES (?, ?, ?, 'pbkdf2-sha256', ?, ?, ?, ?, 'R5',
              'admin', 'active', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(
      adminLoginId,
      passwordData.hash,
      passwordData.salt,
      passwordData.iterations,
      nickname,
      power,
      industryLevel,
    ),

    env.DB.prepare(`
      INSERT INTO member_specs (member_id)
      SELECT id FROM members WHERE login_id = ?
    `).bind(adminLoginId),

    env.DB.prepare(`
      INSERT INTO sessions (
        member_id, token_hash, expires_at, user_agent
      )
      SELECT id, ?, ?, ?
      FROM members
      WHERE login_id = ?
    `).bind(
      session.tokenHash,
      session.expiresAt,
      cleanUserAgent(request),
      adminLoginId,
    ),
  ]);

  const member = await getMemberByLoginId(env.DB, adminLoginId);

  return json(
    {
      ok: true,
      data: {
        member: publicAuthenticatedMember(member),
      },
    },
    201,
    { "set-cookie": buildSessionCookie(session.token, session.maxAge) },
  );
}

async function handleSignup(request, env, url) {
  if (!env.PASSWORD_PEPPER) {
    return jsonError("PASSWORD_PEPPER_NOT_CONFIGURED", 503);
  }

  const signupEnabled = await getSetting(env.DB, "member_signup_enabled");
  if (signupEnabled !== "1") {
    return jsonError("SIGNUP_DISABLED", 403);
  }

  const body = await readJson(request);
  const loginId = normalizeLoginId(body.loginId);
  const password = String(body.password ?? "");
  const passwordConfirm = String(body.passwordConfirm ?? "");
  const nickname = cleanString(body.nickname, 64);
  // v226: Power and industry level are registered later from My Page.
  // NULL is the canonical unregistered state.
  const power = null;
  const industryLevel = null;
  // v220: New members always start at R1. Client-provided rank values are ignored.
  const memberRank = "R1";
  const allianceCode = cleanString(body.allianceCode, 100);

  if (!isLoginId(loginId)) {
    return jsonError("INVALID_LOGIN_ID", 400);
  }

  const reservedAdminId =
    (await getSetting(env.DB, "primary_admin_login_id")) || "ezpk_admin";

  if (loginId === reservedAdminId.toLowerCase()) {
    return jsonError("LOGIN_ID_RESERVED", 409);
  }

  const passwordError = validatePassword(password, passwordConfirm);
  if (passwordError) return jsonError(passwordError, 400);

  if (!nickname) {
    return jsonError("VALIDATION_ERROR", 400);
  }

  const savedAllianceCode = await getSetting(env.DB, "alliance_join_code");
  if (!savedAllianceCode || !constantTimeEqual(allianceCode, savedAllianceCode)) {
    return jsonError("INVALID_ALLIANCE_CODE", 403);
  }

  const duplicate = await env.DB
    .prepare("SELECT id FROM members WHERE login_id = ? LIMIT 1")
    .bind(loginId)
    .first();

  if (duplicate) {
    return jsonError("LOGIN_ID_TAKEN", 409);
  }

  const duplicateNickname = await env.DB
    .prepare("SELECT id FROM members WHERE nickname = ? COLLATE NOCASE LIMIT 1")
    .bind(nickname)
    .first();

  if (duplicateNickname) {
    return jsonError("NICKNAME_TAKEN", 409);
  }

  const passwordData = await hashPassword(password, env.PASSWORD_PEPPER);
  const session = await createSessionData(env.DB);

  try {
    await env.DB.batch([
      env.DB.prepare(`
        INSERT INTO members (
          login_id, password_hash, password_salt,
          password_algorithm, password_iterations,
          nickname, power, industry_level, member_rank,
          role, status, must_change_password,
          nickname_updated_at, password_changed_at
        )
        VALUES (?, ?, ?, 'pbkdf2-sha256', ?, ?, ?, ?, ?,
                'member', 'active', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `).bind(
        loginId,
        passwordData.hash,
        passwordData.salt,
        passwordData.iterations,
        nickname,
        power,
        industryLevel,
        memberRank,
      ),

      env.DB.prepare(`
        INSERT INTO member_specs (member_id, profile_specs_registered)
        SELECT id, 0 FROM members WHERE login_id = ?
      `).bind(loginId),

      env.DB.prepare(`
        INSERT INTO sessions (
          member_id, token_hash, expires_at, user_agent
        )
        SELECT id, ?, ?, ?
        FROM members
        WHERE login_id = ?
      `).bind(
        session.tokenHash,
        session.expiresAt,
        cleanUserAgent(request),
        loginId,
      ),
    ]);
  } catch (error) {
    if (String(error).toLowerCase().includes("unique")) {
      return jsonError("LOGIN_ID_TAKEN", 409);
    }
    throw error;
  }

  const member = await getMemberByLoginId(env.DB, loginId);

  return json(
    {
      ok: true,
      data: { member: publicAuthenticatedMember(member) },
    },
    201,
    { "set-cookie": buildSessionCookie(session.token, session.maxAge) },
  );
}

async function handleLogin(request, env, url) {
  const body = await readJson(request);
  const loginId = normalizeLoginId(body.loginId);
  const password = String(body.password ?? "");

  if (!isLoginId(loginId) || !password) {
    return jsonError("INVALID_LOGIN", 401);
  }

  const member = await env.DB.prepare(`
    SELECT
      id, login_id, password_hash, password_salt,
      password_algorithm, password_iterations,
      nickname, power, industry_level, member_rank,
      role, status, must_change_password,
      nickname_change_count, nickname_updated_at, created_at, updated_at,
      last_login_at, password_changed_at
    FROM members
    WHERE login_id = ?
    LIMIT 1
  `).bind(loginId).first();

  if (!member) return jsonError("INVALID_LOGIN", 401);
  if (member.status === "suspended") {
    return jsonError("ACCOUNT_SUSPENDED", 403);
  }
  if (member.status === "left") {
    return jsonError("ACCOUNT_LEFT", 403);
  }

  if (!env.PASSWORD_PEPPER) return jsonError("PASSWORD_PEPPER_NOT_CONFIGURED", 503);
  const passwordValid = await verifyPassword(password, member, env.PASSWORD_PEPPER);
  if (!passwordValid) return jsonError("INVALID_LOGIN", 401);

  const session = await createSessionData(env.DB);

  await env.DB.batch([
    env.DB.prepare(
      "DELETE FROM sessions WHERE expires_at <= CURRENT_TIMESTAMP",
    ),
    env.DB.prepare(`
      INSERT INTO sessions (
        member_id, token_hash, expires_at, user_agent
      )
      VALUES (?, ?, ?, ?)
    `).bind(
      member.id,
      session.tokenHash,
      session.expiresAt,
      cleanUserAgent(request),
    ),
    env.DB.prepare(`
      UPDATE members
      SET last_login_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(member.id),
  ]);

  member.last_login_at = new Date().toISOString();

  return json(
    {
      ok: true,
      data: { member: publicAuthenticatedMember(member) },
    },
    200,
    { "set-cookie": buildSessionCookie(session.token, session.maxAge) },
  );
}

async function handleLogout(request, env) {
  const token = getCookie(request, SESSION_COOKIE);

  if (token) {
    const tokenHash = await sha256Hex(token);
    await env.DB
      .prepare("DELETE FROM sessions WHERE token_hash = ?")
      .bind(tokenHash)
      .run();
  }

  return json(
    { ok: true, data: { loggedOut: true } },
    200,
    { "set-cookie": clearSessionCookie() },
  );
}


function validAssignedName(value) {
  const name = typeof value === "string"
    ? value.trim()
    : value && typeof value === "object"
      ? String(value.nickname ?? value.name ?? value.player ?? "").trim()
      : "";
  if (!name) return false;
  return !new Set(["-", "tbd", "none", "empty", "coming soon", "준비중", "준비 중"]).has(name.toLowerCase());
}

function bgbAssignmentCount(data) {
  const teams = data?.teams || {};
  const names = [];
  for (const key of ["A", "B"]) {
    const team = teams[key] || {};
    if (Array.isArray(team.members)) names.push(...team.members);
    if (team.locations && typeof team.locations === "object") {
      for (const list of Object.values(team.locations)) if (Array.isArray(list)) names.push(...list);
    }
  }
  return names.filter(validAssignedName).length;
}

function season6AssignmentCount(data) {
  const teams = data?.teams || {};
  return ["attack", "defense", "support"]
    .flatMap((key) => Array.isArray(teams[key]) ? teams[key] : [])
    .filter(validAssignedName).length;
}

const D1_STRATEGY_PATHS = new Map([
  ["data/capital-war.json", "capital-war"],
  ["data/season6-teams.json", "season6-teams"],
  ["data/bgb.json", "bgb"],
  ["data/accounts.json", "accounts"],
]);

function strategyContentKey(path) {
  return D1_STRATEGY_PATHS.get(String(path || "").replace(/^\/+/, "")) || "";
}

async function readStrategyAssetFallback(env, origin, path) {
  const response = await env.ASSETS.fetch(new Request(new URL(`/${path}`, origin), { method:"GET" }));
  if (!response.ok) throw new HttpError(404, "CONTENT_NOT_FOUND");
  try { return await response.json(); }
  catch (_) { throw new HttpError(500, "CONTENT_INVALID"); }
}

async function readStrategyContentD1(env, origin, path, options = {}) {
  const key = strategyContentKey(path);
  if (!key) return readStrategyAssetFallback(env, origin, path);
  const row = await env.DB.prepare(
    "SELECT content_json, updated_at FROM strategy_content WHERE content_key = ?"
  ).bind(key).first();
  if (row?.content_json) {
    try { return { content: JSON.parse(row.content_json), updatedAt: row.updated_at || "", source: "d1" }; }
    catch (_) { throw new HttpError(500, "CONTENT_INVALID"); }
  }

  let content = null;
  try {
    const github = await readGithubJson(env, path);
    if (github?.content) content = github.content;
  } catch (_) {}
  if (!content) content = await readStrategyAssetFallback(env, origin, path);
  await env.DB.prepare(`
    INSERT INTO strategy_content(content_key, content_json, updated_at)
    VALUES(?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(content_key) DO NOTHING
  `).bind(key, JSON.stringify(content)).run();
  return { content, updatedAt: new Date().toISOString(), source: "fallback" };
}

async function writeStrategyContentD1(env, path, content) {
  const key = strategyContentKey(path);
  if (!key) throw new HttpError(400, "CONTENT_PATH_NOT_ALLOWED");
  await env.DB.prepare(`
    INSERT INTO strategy_content(content_key, content_json, updated_at)
    VALUES(?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(content_key) DO UPDATE SET
      content_json = excluded.content_json,
      updated_at = CURRENT_TIMESTAMP
  `).bind(key, JSON.stringify(content)).run();
  return { sha: "d1", storage: "d1" };
}

async function readStrategyAsset(env, origin, path) {
  return (await readStrategyContentD1(env, origin, path)).content;
}

async function strategyAccessState(env, origin) {
  const [bgb, season6] = await Promise.all([
    readStrategyAsset(env, origin, "data/bgb.json"),
    readStrategyAsset(env, origin, "data/season6-teams.json"),
  ]);
  const bgbAssignedCount = bgbAssignmentCount(bgb);
  const season6AssignedCount = season6AssignmentCount(season6);
  return {
    bgbAssignedCount,
    season6AssignedCount,
    // v330: BGB is an alliance-member feature even before assignments exist.
    bgbLocked: true,
    season6Locked: season6AssignedCount > 0,
    capitalWarLocked: true,
  };
}

async function handlePublicStrategyAccess(env, url) {
  const state = await strategyAccessState(env, url.origin);
  return json({ ok:true, data:state });
}

async function handlePublicPersistentAsset(url, env) {
  const path = url.pathname.replace(/^\//, "");
  const stored = await readStrategyContentD1(env, url.origin, path);
  return json(stored.content, 200, { "cache-control": "no-store" });
}

async function handleConditionalStrategyAsset(request, url, env) {
  const isBgb = url.pathname === "/data/bgb.json";
  const isCapitalWar = url.pathname === "/data/capital-war.json";
  const state = await strategyAccessState(env, url.origin);
  const locked = (isCapitalWar || isBgb) ? true : state.season6Locked;
  if (locked) {
    const member = await requireMember(request, env.DB);
    if (member instanceof Response) return member;
    if (isCapitalWar && member.status !== "active") return jsonError("FORBIDDEN", 403);
  }
  const path = url.pathname.replace(/^\//, "");
  const stored = await readStrategyContentD1(env, url.origin, path);
  return json(stored.content, 200, { "cache-control": "no-store" });
}

async function handleAuthMe(request, env) {
  const member = await requireOptionalMember(request, env.DB);

  if (!member) {
    return json({
      ok: true,
      data: { authenticated: false },
    });
  }

  return json({
    ok: true,
    data: {
      authenticated: true,
      member: publicAuthenticatedMember(member),
    },
  });
}


const MEMBER_CONTENT_PATHS = new Set([
  "data/season6-teams.json",
  "data/bgb.json",
  "data/members.json",
  "data/capital-war.json"
]);
async function handleMemberContentGet(request, url, env) {
  const member = await requireMember(request, env.DB);
  if (member instanceof Response) return member;
  const path = String(url.searchParams.get("path") || "").trim();
  if (!MEMBER_CONTENT_PATHS.has(path)) return jsonError("CONTENT_PATH_NOT_ALLOWED", 400);
  if (path === "data/capital-war.json" && member.status !== "active") return jsonError("FORBIDDEN", 403);
  let content;
  if (strategyContentKey(path)) {
    content = (await readStrategyContentD1(env, url.origin, path)).content;
  } else {
    const assetUrl = new URL(`/${path}`, url.origin);
    const assetResponse = await env.ASSETS.fetch(new Request(assetUrl, { method:"GET" }));
    if (!assetResponse.ok) return jsonError("CONTENT_NOT_FOUND", 404);
    try { content = await assetResponse.json(); } catch (_) { return jsonError("CONTENT_INVALID", 500); }
  }
  return json({ ok:true, data:{ content } });
}

async function handleMemberMe(request, env) {
  const member = await requireMember(request, env.DB);
  if (member instanceof Response) return member;

  const record = await env.DB.prepare(`
    SELECT
      m.id,
      m.login_id,
      m.nickname,
      m.power,
      m.industry_level,
      m.member_rank,
      m.role,
      m.admin_level,
      m.status,
      m.must_change_password,
      m.nickname_change_count,
      m.nickname_updated_at,
      m.created_at,
      m.updated_at,
      m.last_login_at,
      m.password_changed_at,

      s.vehicle1_class,
      s.vehicle1_power_value,
      s.vehicle1_power_unit,
      s.vehicle1_power_normalized,
      s.vehicle2_class,
      s.vehicle2_power_value,
      s.vehicle2_power_unit,
      s.vehicle2_power_normalized,
      s.season_war_available,
      s.bgb_available_hour,
      s.discord,
      s.telegram,
      COALESCE(s.profile_specs_registered, 1) AS profile_specs_registered,
      s.created_at AS spec_created_at,
      s.updated_at AS spec_updated_at
    FROM members AS m
    LEFT JOIN member_specs AS s
      ON s.member_id = m.id
    WHERE m.id = ?
    LIMIT 1
  `).bind(member.id).first();

  const cooldownDays = Number(
    (await getSetting(env.DB, "nickname_change_days")) || "7",
  );
  const nicknameChangeCount = Number(record.nickname_change_count ?? 0);
  const firstNicknameChangeFree = nicknameChangeCount === 0;

  return json({
    ok: true,
    data: {
      member: {
        id: record.id,
        loginId: record.login_id,
        nickname: record.nickname,
        power: record.power ?? null,
        industryLevel: record.industry_level ?? null,
        profileSpecsRegistered: record.power !== null && record.industry_level !== null,
        memberRank: record.member_rank,
        role: record.role,
        status: record.status,
        mustChangePassword: Boolean(record.must_change_password),
        nicknameUpdatedAt: record.nickname_updated_at,
        nicknameChangeCount,
        firstNicknameChangeFree,
        nicknameChangeAvailableAt: firstNicknameChangeFree
          ? null
          : addDaysIso(record.nickname_updated_at, cooldownDays),
        createdAt: record.created_at,
        updatedAt: record.updated_at,
        lastLoginAt: record.last_login_at,
        passwordChangedAt: record.password_changed_at,
      },
      specs: specsResponse(record),
    },
  });
}

async function handleProfileUpdate(request, env) {
  const member = await requireMember(request, env.DB);
  if (member instanceof Response) return member;

  const body = await readJson(request);
  const power = toPositiveInteger(body.power);
  const industryLevel = String(body.industryLevel ?? "").toUpperCase();

  if (!power || !isIndustryLevel(industryLevel)) {
    return jsonError("VALIDATION_ERROR", 400);
  }

  // v220: Member rank is read-only on My Page. Rank changes are allowed only
  // through the R5-only admin member manager, so any client-provided rank is ignored.
  await env.DB.prepare(`
    UPDATE members
    SET power = ?, industry_level = ?
    WHERE id = ?
  `).bind(power, industryLevel, member.id).run();

  return json({
    ok: true,
    data: {
      profile: {
        power,
        industryLevel,
        memberRank: member.member_rank,
        rankLocked: true,
      },
    },
  });
}

async function handleNicknameUpdate(request, env) {
  const member = await requireMember(request, env.DB);
  if (member instanceof Response) return member;

  const body = await readJson(request);
  const nickname = cleanString(body.nickname, 64);

  if (!nickname) return jsonError("VALIDATION_ERROR", 400);
  if (nickname === member.nickname) {
    return jsonError("NICKNAME_UNCHANGED", 400);
  }

  const duplicateNickname = await env.DB
    .prepare("SELECT id FROM members WHERE nickname = ? COLLATE NOCASE AND id <> ? LIMIT 1")
    .bind(nickname, member.id)
    .first();

  if (duplicateNickname) {
    return jsonError("NICKNAME_TAKEN", 409);
  }

  const cooldownDays = Number(
    (await getSetting(env.DB, "nickname_change_days")) || "7",
  );
  const nicknameChangeCount = Number(member.nickname_change_count ?? 0);
  const firstNicknameChangeFree = nicknameChangeCount === 0;

  if (!firstNicknameChangeFree) {
    const availableAt = addDaysIso(member.nickname_updated_at, cooldownDays);
    if (Date.now() < Date.parse(availableAt)) {
      return jsonError("NICKNAME_CHANGE_COOLDOWN", 409, {
        availableAt,
        nicknameChangeCount,
      });
    }
  }

  await env.DB.batch([
    env.DB.prepare(`
      INSERT INTO member_nickname_history (
        member_id, old_nickname, new_nickname,
        changed_by, changed_by_member_id
      )
      VALUES (?, ?, ?, 'member', ?)
    `).bind(member.id, member.nickname, nickname, member.id),

    env.DB.prepare(`
      UPDATE members
      SET
        nickname = ?,
        nickname_updated_at = CURRENT_TIMESTAMP,
        nickname_change_count = nickname_change_count + 1
      WHERE id = ?
    `).bind(nickname, member.id),
  ]);

  return json({
    ok: true,
    data: {
      nickname,
      nicknameChangeCount: nicknameChangeCount + 1,
      firstChangeWasFree: firstNicknameChangeFree,
      nextChangeAvailableAt: addDaysIso(
        new Date().toISOString(),
        cooldownDays,
      ),
    },
  });
}


async function handleSpecsReset(request, env) {
  const member = await requireMember(request, env.DB);
  if (member instanceof Response) return member;

  try {
    await env.DB.batch([
      env.DB.prepare(`
        UPDATE members
        SET power = NULL, industry_level = NULL
        WHERE id = ?
      `).bind(member.id),
      env.DB.prepare(`
        INSERT INTO member_specs (member_id, profile_specs_registered)
        VALUES (?, 0)
        ON CONFLICT(member_id) DO UPDATE SET
          profile_specs_registered = 0,
          vehicle1_class = NULL,
          vehicle1_power_value = NULL,
          vehicle1_power_unit = NULL,
          vehicle1_power_normalized = NULL,
          vehicle2_class = NULL,
          vehicle2_power_value = NULL,
          vehicle2_power_unit = NULL,
          vehicle2_power_normalized = NULL,
          season_war_available = NULL,
          bgb_available_hour = NULL,
          discord = NULL,
          telegram = NULL
      `).bind(member.id),
    ]);
  } catch (error) {
    console.error("SPEC_RESET_DB_ERROR", { memberId: member.id, error });
    return jsonError("SPEC_RESET_DB_ERROR", 500);
  }

  return json({ok:true,data:{profile:{power:null,industryLevel:null,profileSpecsRegistered:false},specs:{}}});
}

async function handleSpecsUpdate(request, env) {
  const member = await requireMember(request, env.DB);
  if (member instanceof Response) return member;

  const body = await readJson(request);

  const power = toPositiveInteger(body.power);
  const industryLevel = String(body.industryLevel ?? "").toUpperCase();

  const vehicle1Class = nullableEnum(
    body.vehicle1Class,
    ["fighter", "shooter", "rider"],
  );
  const vehicle1PowerValue = nullableVehiclePowerValue(body.vehicle1PowerValue);
  const vehicle1PowerUnit = nullableEnum(body.vehicle1PowerUnit, ["M", "G"]);

  const vehicle2Class = nullableEnum(
    body.vehicle2Class,
    ["fighter", "shooter", "rider"],
  );
  const vehicle2PowerValue = nullableVehiclePowerValue(body.vehicle2PowerValue);
  const vehicle2PowerUnit = nullableEnum(body.vehicle2PowerUnit, ["M", "G"]);

  const seasonWarAvailable = nullableBoolean(body.seasonWarAvailable);
  const bgbAvailableHour = nullableHour(body.bgbAvailableHour);
  const discord = nullableCleanString(body.discord, 100);
  const telegram = nullableCleanString(body.telegram, 100);

  if (
    !power ||
    !isIndustryLevel(industryLevel) ||
    vehicle1Class === INVALID ||
    vehicle1PowerValue === INVALID ||
    vehicle1PowerUnit === INVALID ||
    vehicle2Class === INVALID ||
    vehicle2PowerValue === INVALID ||
    vehicle2PowerUnit === INVALID ||
    seasonWarAvailable === INVALID ||
    bgbAvailableHour === INVALID ||
    discord === INVALID ||
    telegram === INVALID
  ) {
    return jsonError("VALIDATION_ERROR", 400);
  }

  if (
    !vehicleGroupValid(
      vehicle1Class,
      vehicle1PowerValue,
      vehicle1PowerUnit,
    ) ||
    !vehicleGroupValid(
      vehicle2Class,
      vehicle2PowerValue,
      vehicle2PowerUnit,
    )
  ) {
    return jsonError("VALIDATION_ERROR", 400);
  }

  const vehicle1PowerNormalized = vehicle1PowerValue === null
    ? null
    : vehicle1PowerValue * (vehicle1PowerUnit === "G" ? 1000 : 1);
  const vehicle2PowerNormalized = vehicle2PowerValue === null
    ? null
    : vehicle2PowerValue * (vehicle2PowerUnit === "G" ? 1000 : 1);

  // v274: Store normalized vehicle values explicitly. D1 triggers remain as a
  // secondary safeguard, but correct sorting no longer depends on them.
  await env.DB.batch([
    env.DB.prepare(`
      UPDATE members
      SET power = ?, industry_level = ?
      WHERE id = ?
    `).bind(power, industryLevel, member.id),
    env.DB.prepare(`
      INSERT INTO member_specs (
        member_id, profile_specs_registered,
        vehicle1_class, vehicle1_power_value, vehicle1_power_unit, vehicle1_power_normalized,
        vehicle2_class, vehicle2_power_value, vehicle2_power_unit, vehicle2_power_normalized,
        season_war_available, bgb_available_hour,
        discord, telegram
      )
      VALUES (?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(member_id) DO UPDATE SET
        profile_specs_registered = 1,
        vehicle1_class = excluded.vehicle1_class,
        vehicle1_power_value = excluded.vehicle1_power_value,
        vehicle1_power_unit = excluded.vehicle1_power_unit,
        vehicle1_power_normalized = excluded.vehicle1_power_normalized,
        vehicle2_class = excluded.vehicle2_class,
        vehicle2_power_value = excluded.vehicle2_power_value,
        vehicle2_power_unit = excluded.vehicle2_power_unit,
        vehicle2_power_normalized = excluded.vehicle2_power_normalized,
        season_war_available = excluded.season_war_available,
        bgb_available_hour = excluded.bgb_available_hour,
        discord = excluded.discord,
        telegram = excluded.telegram
    `).bind(
      member.id,
      vehicle1Class,
      vehicle1PowerValue,
      vehicle1PowerUnit,
      vehicle1PowerNormalized,
      vehicle2Class,
      vehicle2PowerValue,
      vehicle2PowerUnit,
      vehicle2PowerNormalized,
      seasonWarAvailable,
      bgbAvailableHour,
      discord,
      telegram,
    ),
  ]);

  return json({
    ok: true,
    data: {
      profile: {
        power,
        industryLevel,
        memberRank: member.member_rank,
        rankLocked: true,
      },
      specs: {
        vehicle1Class,
        vehicle1PowerValue,
        vehicle1PowerUnit,
        vehicle2Class,
        vehicle2PowerValue,
        vehicle2PowerUnit,
        seasonWarAvailable:
          seasonWarAvailable === null
            ? null
            : Boolean(seasonWarAvailable),
        bgbAvailableHour,
        discord,
        telegram,
      },
    },
  });
}

async function handlePasswordUpdate(request, env) {
  const member = await requireMember(request, env.DB, true);
  if (member instanceof Response) return member;

  const body = await readJson(request);
  const currentPassword = String(body.currentPassword ?? "");
  const newPassword = String(body.newPassword ?? "");
  const newPasswordConfirm = String(body.newPasswordConfirm ?? "");

  if (!currentPassword) {
    return jsonError("CURRENT_PASSWORD_INCORRECT", 400);
  }

  if (!env.PASSWORD_PEPPER) return jsonError("PASSWORD_PEPPER_NOT_CONFIGURED", 503);
  const valid = await verifyPassword(currentPassword, member, env.PASSWORD_PEPPER);
  if (!valid) return jsonError("CURRENT_PASSWORD_INCORRECT", 403);

  const passwordError = validatePassword(
    newPassword,
    newPasswordConfirm,
  );
  if (passwordError) return jsonError(passwordError, 400);

  if (currentPassword === newPassword) {
    return jsonError("PASSWORD_UNCHANGED", 400);
  }

  const passwordData = await hashPassword(newPassword, env.PASSWORD_PEPPER);

  await env.DB.batch([
    env.DB.prepare(`
      UPDATE members
      SET
        password_hash = ?,
        password_salt = ?,
        password_algorithm = 'pbkdf2-sha256',
        password_iterations = ?,
        password_changed_at = CURRENT_TIMESTAMP,
        must_change_password = 0
      WHERE id = ?
    `).bind(
      passwordData.hash,
      passwordData.salt,
      passwordData.iterations,
      member.id,
    ),
    env.DB.prepare(
      "DELETE FROM sessions WHERE member_id = ?",
    ).bind(member.id),
  ]);

  return json(
    {
      ok: true,
      data: { reauthenticationRequired: true },
    },
    200,
    { "set-cookie": clearSessionCookie() },
  );
}

async function handlePublicMembers(url, env) {
  const page = clampInteger(url.searchParams.get("page"), 1, 100000, 1);
  const limit = clampInteger(url.searchParams.get("limit"), 1, 100, 30);
  const offset = (page - 1) * limit;

  const where = [];
  const binds = [];

  const search = cleanString(url.searchParams.get("search"), 64);
  if (search) {
    where.push("m.nickname LIKE ? ESCAPE '\\'");
    binds.push(`%${escapeLike(search)}%`);
  }

  const rank = url.searchParams.get("rank");
  if (rank && isAnyMemberRank(rank.toUpperCase())) {
    where.push("m.member_rank = ?");
    binds.push(rank.toUpperCase());
  }

  const industry = url.searchParams.get("industry");
  if (industry && isIndustryLevel(industry.toUpperCase())) {
    where.push("m.industry_level = ?");
    binds.push(industry.toUpperCase());
  }

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const sortMap = {
    power_desc: "CASE WHEN m.power IS NULL THEN 1 ELSE 0 END ASC, m.power DESC, m.id ASC",
    power_asc: "CASE WHEN m.power IS NULL THEN 1 ELSE 0 END ASC, m.power ASC, m.id ASC",
    nickname_asc: "m.nickname COLLATE NOCASE ASC, m.id ASC",
    nickname_desc: "m.nickname COLLATE NOCASE DESC, m.id ASC",
    joined_desc: "m.created_at DESC, m.id ASC",
    updated_desc: "COALESCE(s.updated_at, m.updated_at) DESC, m.id ASC",
  };

  const sort =
    sortMap[url.searchParams.get("sort")] || sortMap.power_desc;

  const countResult = await env.DB.prepare(`
    SELECT COUNT(*) AS total
    FROM members m
    LEFT JOIN member_specs s ON s.member_id = m.id
    ${whereSql ? whereSql + " AND m.status = 'active'" : "WHERE m.status = 'active'"}
  `).bind(...binds).first();

  const rows = await env.DB.prepare(`
    SELECT
      m.id AS id,
      m.nickname AS nickname,
      m.power AS power,
      m.industry_level AS industry_level,
      m.member_rank AS member_rank,
      m.created_at AS joined_at,
      m.updated_at AS basic_updated_at,
      COALESCE(s.profile_specs_registered, 1) AS profile_specs_registered,
      s.vehicle1_class AS vehicle1_class,
      s.vehicle1_power_value AS vehicle1_power_value,
      s.vehicle1_power_unit AS vehicle1_power_unit,
      s.vehicle1_power_normalized AS vehicle1_power_normalized,
      s.vehicle2_class AS vehicle2_class,
      s.vehicle2_power_value AS vehicle2_power_value,
      s.vehicle2_power_unit AS vehicle2_power_unit,
      s.vehicle2_power_normalized AS vehicle2_power_normalized
    FROM members m
    LEFT JOIN member_specs s ON s.member_id = m.id
    ${whereSql ? whereSql + " AND m.status = 'active'" : "WHERE m.status = 'active'"}
    ORDER BY ${sort}
    LIMIT ? OFFSET ?
  `).bind(...binds, limit, offset).all();

  const total = Number(countResult?.total ?? 0);

  return json({
    ok: true,
    data: {
      items: (rows.results ?? []).map(publicMemberRow),
      pagination: {
        page,
        limit,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / limit),
      },
    },
  });
}


// -----------------------------------------------------------------------------
// v190-b Request Board handlers
// -----------------------------------------------------------------------------

function requestRow(row, viewerId = 0, isAdmin = false) {
  return {
    id: Number(row.id),
    title: row.title || "",
    message: row.message || "",
    authorNickname: row.current_nickname || row.author_nickname_snapshot || "Former member",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    answer: row.admin_answer || "",
    answeredAt: row.answered_at,
    answeredBy: row.answered_by_nickname || "",
    answered: Boolean(row.admin_answer),
    canEdit: isAdmin || Number(row.member_id) === Number(viewerId),
    canDelete: isAdmin || Number(row.member_id) === Number(viewerId),
    legacy: Boolean(row.is_legacy),
  };
}

async function handleRequestsList(request, url, env) {
  const member = await requireMember(request, env.DB);
  if (member instanceof Response) return member;
  const page = Math.max(1, Math.floor(Number(url.searchParams.get("page") || 1)));
  const limit = Math.max(1, Math.min(50, Math.floor(Number(url.searchParams.get("limit") || 15))));
  const mine = url.searchParams.get("mine") === "1";
  const where = mine ? "WHERE r.member_id = ?" : "";
  const binds = mine ? [member.id] : [];
  const totalRow = await env.DB.prepare(`SELECT COUNT(*) AS total FROM member_requests r ${where}`).bind(...binds).first();
  const rows = await env.DB.prepare(`
    SELECT r.*, m.nickname AS current_nickname, a.nickname AS answered_by_nickname
    FROM member_requests r
    LEFT JOIN members m ON m.id = r.member_id
    LEFT JOIN members a ON a.id = r.answered_by_member_id
    ${where}
    ORDER BY datetime(r.created_at) DESC, r.id DESC
    LIMIT ? OFFSET ?
  `).bind(...binds, limit, (page - 1) * limit).all();
  const total = Number(totalRow?.total || 0);
  return json({ok:true,data:{items:(rows.results||[]).map(r=>requestRow(r,member.id,member.role==="admin")),pagination:{page,limit,total,totalPages:total?Math.ceil(total/limit):0}}});
}

async function handleRequestCreate(request, env) {
  const member = await requireMember(request, env.DB);
  if (member instanceof Response) return member;
  const body = await readJson(request);
  const title = cleanString(body.title, 120);
  const message = cleanString(body.message, 3000);
  if (!title || !message) return jsonError("VALIDATION_ERROR", 400);
  const result = await env.DB.prepare(`
    INSERT INTO member_requests(member_id, author_nickname_snapshot, title, message)
    VALUES(?,?,?,?)
  `).bind(member.id, member.nickname, title, message).run();
  return json({ok:true,data:{id:Number(result.meta?.last_row_id || 0)}},201);
}

async function getRequestRecord(db, id) {
  return db.prepare(`SELECT * FROM member_requests WHERE id=? LIMIT 1`).bind(id).first();
}

async function handleRequestUpdate(request, requestId, env) {
  const member = await requireMember(request, env.DB);
  if (member instanceof Response) return member;
  const row = await getRequestRecord(env.DB, requestId);
  if (!row) return jsonError("REQUEST_NOT_FOUND",404);
  if (member.role !== "admin" && Number(row.member_id)!==Number(member.id)) return jsonError("FORBIDDEN",403);
  const body=await readJson(request);
  const title=cleanString(body.title,120), message=cleanString(body.message,3000);
  if(!title||!message)return jsonError("VALIDATION_ERROR",400);
  await env.DB.prepare(`UPDATE member_requests SET title=?,message=?,updated_at=CURRENT_TIMESTAMP WHERE id=?`).bind(title,message,requestId).run();
  return json({ok:true});
}

async function handleRequestDelete(request, requestId, env) {
  const member = await requireMember(request, env.DB);
  if (member instanceof Response) return member;
  const row=await getRequestRecord(env.DB,requestId);
  if(!row)return jsonError("REQUEST_NOT_FOUND",404);
  if(member.role!=="admin"&&Number(row.member_id)!==Number(member.id))return jsonError("FORBIDDEN",403);
  await env.DB.prepare(`DELETE FROM member_requests WHERE id=?`).bind(requestId).run();
  return json({ok:true});
}

async function handleAdminRequestsList(request, url, env) {
  const admin=await requireAdminMenuPermission(request,env.DB,"requests");
  if(admin instanceof Response)return admin;
  const page=Math.max(1,Math.floor(Number(url.searchParams.get("page")||1)));
  const limit=Math.max(1,Math.min(50,Math.floor(Number(url.searchParams.get("limit")||15))));
  const totalRow=await env.DB.prepare(`SELECT COUNT(*) AS total FROM member_requests`).first();
  const rows=await env.DB.prepare(`
    SELECT r.*,m.nickname AS current_nickname,a.nickname AS answered_by_nickname
    FROM member_requests r LEFT JOIN members m ON m.id=r.member_id
    LEFT JOIN members a ON a.id=r.answered_by_member_id
    ORDER BY datetime(r.created_at) DESC,r.id DESC LIMIT ? OFFSET ?
  `).bind(limit,(page-1)*limit).all();
  const total=Number(totalRow?.total||0);
  return json({ok:true,data:{items:(rows.results||[]).map(r=>requestRow(r,admin.id,true)),pagination:{page,limit,total,totalPages:total?Math.ceil(total/limit):0}}});
}

async function handleAdminRequestAnswer(request, requestId, env) {
  const admin=await requireAdminMenuPermission(request,env.DB,"requests");
  if(admin instanceof Response)return admin;
  const row=await getRequestRecord(env.DB,requestId);if(!row)return jsonError("REQUEST_NOT_FOUND",404);
  const body=await readJson(request);const answer=cleanString(body.answer,5000);
  if(!answer)return jsonError("VALIDATION_ERROR",400);
  await env.DB.prepare(`UPDATE member_requests SET admin_answer=?,answered_at=CURRENT_TIMESTAMP,answered_by_member_id=?,updated_at=CURRENT_TIMESTAMP WHERE id=?`).bind(answer,admin.id,requestId).run();
  await writeAdminLog(env,request,{actor:admin,category:"request",action:"request_answered",targetType:"request",targetId:requestId,targetName:row.title||row.subject||`요청 #${requestId}`,after:{answered:true}});
  return json({ok:true});
}

async function handleAdminRequestUpdate(request, requestId, env) {
  const admin=await requireAdminMenuPermission(request,env.DB,"requests");
  if(admin instanceof Response)return admin;
  return handleRequestUpdate(request,requestId,env);
}
async function handleAdminRequestDelete(request, requestId, env) {
  const admin=await requireAdminMenuPermission(request,env.DB,"requests");
  if(admin instanceof Response)return admin;
  return handleRequestDelete(request,requestId,env);
}

// -----------------------------------------------------------------------------
// Authentication and database helpers
// -----------------------------------------------------------------------------

async function requireOptionalMember(request, db, includePassword = false) {
  const token = getCookie(request, SESSION_COOKIE);
  if (!token) return null;

  const tokenHash = await sha256Hex(token);
  const passwordFields = includePassword
    ? `,
       m.password_hash,
       m.password_salt,
       m.password_algorithm,
       m.password_iterations`
    : "";

  const member = await db.prepare(`
    SELECT
      m.id,
      m.login_id,
      m.nickname,
      m.power,
      m.industry_level,
      m.member_rank,
      m.role,
      m.status,
      m.must_change_password,
      m.nickname_change_count,
      m.nickname_updated_at,
      m.created_at,
      m.updated_at,
      m.last_login_at,
      m.password_changed_at
      ${passwordFields}
    FROM sessions AS s
    INNER JOIN members AS m
      ON m.id = s.member_id
    WHERE s.token_hash = ?
      AND s.expires_at > CURRENT_TIMESTAMP
      AND m.status = 'active'
    LIMIT 1
  `).bind(tokenHash).first();

  if (!member) return null;

  await db.prepare(`
    UPDATE sessions
    SET last_used_at = CURRENT_TIMESTAMP
    WHERE token_hash = ?
  `).bind(tokenHash).run();

  return member;
}

async function requireMember(request, db, includePassword = false) {
  const member = await requireOptionalMember(
    request,
    db,
    includePassword,
  );
  return member || jsonError("UNAUTHORIZED", 401);
}

async function getMemberByLoginId(db, loginId) {
  return db.prepare(`
    SELECT
      id, login_id, nickname, power,
      industry_level, member_rank, role, admin_level, status,
      must_change_password, nickname_change_count, nickname_updated_at,
      created_at, updated_at, last_login_at,
      password_changed_at
    FROM members
    WHERE login_id = ?
    LIMIT 1
  `).bind(loginId).first();
}

async function getSetting(db, key) {
  const row = await db
    .prepare("SELECT value FROM settings WHERE key = ? LIMIT 1")
    .bind(key)
    .first();
  return row?.value ?? null;
}

async function createSessionData(db) {
  const durationDays = Number(
    (await getSetting(db, "session_duration_days")) || "30",
  );
  const safeDays =
    Number.isFinite(durationDays) && durationDays > 0
      ? Math.min(durationDays, 365)
      : 30;

  const token = randomHex(32);
  return {
    token,
    tokenHash: await sha256Hex(token),
    expiresAt: new Date(
      Date.now() + safeDays * 86400000,
    ).toISOString(),
    maxAge: safeDays * 86400,
  };
}



const ADMIN_CONTENT_PATHS = new Set([
  "data/bgb.json",
  "data/season6-teams.json",
  "data/events.json",
  "data/accounts.json",
  "data/capital-war.json",
]);

function adminContentPermissionKey(path) {
  if (path === "data/bgb.json") return "bgb";
  if (path === "data/capital-war.json") return "capitalWar";
  if (path === "data/season6-teams.json") return "season";
  if (path === "data/accounts.json") return "accounts";
  if (path === "data/events.json") return "events";
  throw new HttpError(400, "CONTENT_PATH_NOT_ALLOWED");
}

function getGithubConfig(env) {
  return {
    token: String(env.GITHUB_TOKEN || ""),
    owner: String(env.GITHUB_OWNER || ""),
    repo: String(env.GITHUB_REPO || ""),
    branch: String(env.GITHUB_BRANCH || "main"),
  };
}

function assertAdminContentPath(value) {
  const path = String(value || "").trim();
  if (!ADMIN_CONTENT_PATHS.has(path)) throw new HttpError(400, "CONTENT_PATH_NOT_ALLOWED");
  return path;
}

function githubHeaders(config, withJson = false) {
  return {
    accept: "application/vnd.github+json",
    authorization: `Bearer ${config.token}`,
    "x-github-api-version": "2022-11-28",
    "user-agent": "EZPK-Worker",
    ...(withJson ? { "content-type": "application/json" } : {}),
  };
}

function decodeBase64Utf8(value) {
  const binary = atob(String(value || "").replace(/\n/g, ""));
  return new TextDecoder().decode(Uint8Array.from(binary, char => char.charCodeAt(0)));
}

function encodeBase64Utf8(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

async function readGithubJson(env, path) {
  const config = getGithubConfig(env);
  if (!config.token || !config.owner || !config.repo) throw new HttpError(503, "GITHUB_NOT_CONFIGURED");
  const endpoint = `https://api.github.com/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repo)}/contents/${path}?ref=${encodeURIComponent(config.branch)}`;
  const response = await fetch(endpoint, { headers: githubHeaders(config) });
  if (response.status === 404) return { sha: "", content: null };
  if (!response.ok) throw new HttpError(502, "GITHUB_READ_FAILED");
  const body = await response.json();
  try {
    return { sha: body.sha || "", content: JSON.parse(decodeBase64Utf8(body.content)) };
  } catch (_) {
    throw new HttpError(502, "INVALID_JSON_CONTENT");
  }
}

async function writeGithubJson(env, path, content, message) {
  const config = getGithubConfig(env);
  if (!config.token || !config.owner || !config.repo) throw new HttpError(503, "GITHUB_NOT_CONFIGURED");
  const endpoint = `https://api.github.com/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repo)}/contents/${path}`;
  const send = async sha => {
    const body = {
      message: cleanString(message, 120) || `Update ${path}`,
      content: encodeBase64Utf8(JSON.stringify(content, null, 2)),
      branch: config.branch,
    };
    if (sha) body.sha = sha;
    return fetch(endpoint, { method: "PUT", headers: githubHeaders(config, true), body: JSON.stringify(body) });
  };
  let latest = await readGithubJson(env, path);
  let response = await send(latest.sha);
  if (response.status === 409 || response.status === 422) {
    latest = await readGithubJson(env, path);
    response = await send(latest.sha);
  }
  if (!response.ok) throw new HttpError(502, "GITHUB_WRITE_FAILED");
  const result = await response.json();
  return { sha: result?.content?.sha || latest.sha || "" };
}


function blankEventSchedulePayload() {
  return {
    lastUpdated: "",
    timezone: "UTC-02:00",
    timezoneLabel: "ST",
    events: Array.from({ length: 9 }, () => ({
      title: "", start: "", end: "", enabled: false, important: false,
    })),
  };
}

async function readEventScheduleFromD1(db) {
  const [meta, rows] = await Promise.all([
    db.prepare("SELECT last_updated, timezone, timezone_label FROM event_schedule_meta WHERE id = 1").first(),
    db.prepare("SELECT slot_no, title, starts_at, ends_at, enabled, important FROM events ORDER BY slot_no ASC").all(),
  ]);
  const payload = blankEventSchedulePayload();
  if (meta) {
    payload.lastUpdated = meta.last_updated || "";
    payload.timezone = meta.timezone || "UTC-02:00";
    payload.timezoneLabel = meta.timezone_label || "ST";
  }
  for (const row of rows.results || []) {
    const index = Number(row.slot_no) - 1;
    if (index < 0 || index >= 9) continue;
    payload.events[index] = {
      title: row.title || "",
      start: row.starts_at || "",
      end: row.ends_at || "",
      enabled: Boolean(row.enabled),
      important: Boolean(row.important),
    };
  }
  return payload;
}

function normalizeAdminEventSchedule(body) {
  const payload = blankEventSchedulePayload();
  payload.lastUpdated = cleanString(body?.lastUpdated, 32);
  payload.timezone = cleanString(body?.timezone, 32) || "UTC-02:00";
  payload.timezoneLabel = cleanString(body?.timezoneLabel, 16) || "ST";
  const source = Array.isArray(body?.events) ? body.events : [];
  for (let i = 0; i < 9; i += 1) {
    const item = source[i] || {};
    const event = {
      title: cleanString(item.title, 60),
      start: cleanString(item.start, 40),
      end: cleanString(item.end, 40),
      enabled: Boolean(item.enabled),
      important: Boolean(item.important),
    };
    if (event.enabled) {
      if (!event.title || !event.start || !event.end) throw new HttpError(400, "VALIDATION_ERROR");
      const startMs = Date.parse(event.start);
      const endMs = Date.parse(event.end);
      if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || endMs <= startMs) {
        throw new HttpError(400, "INVALID_EVENT_TIME");
      }
    }
    payload.events[i] = event;
  }
  return payload;
}

async function handleEventsGet(request, env) {
  const member = await requireMember(request, env.DB);
  if (member instanceof Response) return member;
  const payload = await readEventScheduleFromD1(env.DB);
  return json({ ok: true, data: payload }, 200, { "cache-control": "no-store" });
}

async function handleAdminEventsGet(request, env) {
  const admin = await requireAdminMenuPermission(request, env.DB, "events");
  if (admin instanceof Response) return admin;
  return json({ ok: true, data: await readEventScheduleFromD1(env.DB) });
}

async function handleAdminEventsPut(request, env) {
  const admin = await requireAdminMenuPermission(request, env.DB, "events");
  if (admin instanceof Response) return admin;
  const payload = normalizeAdminEventSchedule(await readJson(request));
  const statements = [
    env.DB.prepare(`
      INSERT INTO event_schedule_meta(id,last_updated,timezone,timezone_label,updated_at)
      VALUES(1,?,?,?,CURRENT_TIMESTAMP)
      ON CONFLICT(id) DO UPDATE SET
        last_updated=excluded.last_updated,
        timezone=excluded.timezone,
        timezone_label=excluded.timezone_label,
        updated_at=CURRENT_TIMESTAMP
    `).bind(payload.lastUpdated, payload.timezone, payload.timezoneLabel),
  ];
  payload.events.forEach((event, index) => {
    statements.push(env.DB.prepare(`
      INSERT INTO events(slot_no,title,starts_at,ends_at,enabled,important,updated_at)
      VALUES(?,?,?,?,?,?,CURRENT_TIMESTAMP)
      ON CONFLICT(slot_no) DO UPDATE SET
        title=excluded.title,
        starts_at=excluded.starts_at,
        ends_at=excluded.ends_at,
        enabled=excluded.enabled,
        important=excluded.important,
        updated_at=CURRENT_TIMESTAMP
    `).bind(index + 1, event.title, event.start, event.end, event.enabled ? 1 : 0, event.important ? 1 : 0));
  });
  await env.DB.batch(statements);
  await writeAdminLog(env,request,{actor:admin,category:"event",action:"events_saved",targetType:"event_schedule",targetId:"schedule",targetName:"이벤트 일정",after:{lastUpdated:payload.lastUpdated,eventCount:payload.events.length}});
  return json({ ok: true, data: payload });
}

async function handleAdminContentGet(request, url, env) {
  const path = assertAdminContentPath(url.searchParams.get("path"));
  const admin = await requireAdminMenuPermission(request, env.DB, adminContentPermissionKey(path));
  if (admin instanceof Response) return admin;
  if (strategyContentKey(path)) {
    const stored = await readStrategyContentD1(env, url.origin, path, { preferGithub: true });
    return json({ ok: true, data: { sha: "d1", content: stored.content, storage: "d1" } });
  }
  return json({ ok: true, data: await readGithubJson(env, path) });
}

async function handleAdminContentPut(request, env) {
  const body = await readJson(request);
  const path = assertAdminContentPath(body.path);
  const admin = await requireAdminMenuPermission(request, env.DB, adminContentPermissionKey(path));
  if (admin instanceof Response) return admin;
  if (body.content === undefined || body.content === null) return jsonError("VALIDATION_ERROR", 400);
  let saved;
  if (strategyContentKey(path)) saved=await writeStrategyContentD1(env,path,body.content);
  else saved=await writeGithubJson(env,path,body.content,body.message);
  const category=path.includes("bgb")?"bgb":path.includes("capital-war")?"capital_war":path.includes("season")?"season":path.includes("account")?"account":"content";
  await writeAdminLog(env,request,{actor:admin,category,action:"content_saved",targetType:"content",targetId:path,targetName:path,after:{path}});
  return json({ok:true,data:saved});
}

async function requireAdmin(request, db) {
  const member = await requireMember(request, db);
  if (member instanceof Response) return member;
  const level = member.admin_level || (member.role === "admin" ? "super" : null);
  if (member.role !== "admin" || !["super","sub"].includes(level) || member.status !== "active") {
    return jsonError("FORBIDDEN", 403);
  }
  member.admin_level = level;
  return member;
}

async function requireSuperAdmin(request, db) {
  const member = await requireAdmin(request, db);
  if (member instanceof Response) return member;
  if (member.admin_level !== "super") return jsonError("SUPER_ADMIN_REQUIRED", 403);
  return member;
}

async function loadAdminMenuPermissions(db, member) {
  if (member.admin_level === "super") return normalizeAdminMenuPermissions({});
  const row = await db.prepare("SELECT * FROM admin_menu_permissions WHERE member_id=?").bind(member.id).first();
  return normalizeAdminMenuPermissions(row || {});
}

async function requireAdminMenuPermission(request, db, permissionKey) {
  const member = await requireAdmin(request, db);
  if (member instanceof Response) return member;
  if (member.admin_level === "super") return member;
  if (!ADMIN_MENU_PERMISSION_KEYS.includes(permissionKey)) return jsonError("INVALID_ADMIN_PERMISSION", 500);
  const permissions = await loadAdminMenuPermissions(db, member);
  if (!permissions[permissionKey]) return jsonError("ADMIN_MENU_FORBIDDEN", 403);
  member.menu_permissions = permissions;
  return member;
}

async function requireAnyAdminMenuPermission(request, db, permissionKeys) {
  const member = await requireAdmin(request, db);
  if (member instanceof Response) return member;
  if (member.admin_level === "super") return member;
  const permissions = await loadAdminMenuPermissions(db, member);
  if (!permissionKeys.some(key => permissions[key])) return jsonError("ADMIN_MENU_FORBIDDEN", 403);
  member.menu_permissions = permissions;
  return member;
}

function isProtectedAdminTarget(actor, target) {
  const level = target.admin_level || (target.role === "admin" ? "super" : null);
  return actor.admin_level !== "super" && target.role === "admin" && ["super","sub"].includes(level);
}

async function writeAdminLog(env, request, data) {
  try {
    await env.DB.prepare(`INSERT INTO admin_activity_logs
      (actor_member_id,actor_login_id,actor_nickname,actor_admin_level,category,action,target_type,target_id,target_name,before_data,after_data,result,failure_reason,ip_address,user_agent,request_id)
      VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
      .bind(data.actor?.id||null,data.actor?.login_id||null,data.actor?.nickname||'unknown',data.actor?.admin_level||'sub',data.category,data.action,data.targetType||null,data.targetId==null?null:String(data.targetId),data.targetName||null,data.before?JSON.stringify(data.before):null,data.after?JSON.stringify(data.after):null,data.result||'success',data.failureReason||null,request.headers.get('CF-Connecting-IP')||null,request.headers.get('User-Agent')||null,request.headers.get('cf-ray')||null).run();
  } catch (error) { console.error('[ADMIN_LOG_FAILED]', error); }
}

function adminMemberRow(row) {
  return {
    id: row.id,
    loginId: row.login_id,
    nickname: row.nickname,
    power: row.power,
    industryLevel: row.industry_level,
    memberRank: row.member_rank,
    role: row.role,
    adminLevel: row.admin_level || (row.role === "admin" ? "super" : null),
    status: row.status,
    approvalStatus: row.approval_status || "approved",
    mustChangePassword: Boolean(row.must_change_password),
    nicknameChangeCount: Number(row.nickname_change_count || 0),
    nicknameUpdatedAt: row.nickname_updated_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastLoginAt: row.last_login_at,
    passwordChangedAt: row.password_changed_at,
    vehicle1Class: row.vehicle1_class,
    vehicle1PowerValue: row.vehicle1_power_value,
    vehicle1PowerUnit: row.vehicle1_power_unit,
    vehicle1PowerNormalized: row.vehicle1_power_normalized,
    vehicle2Class: row.vehicle2_class,
    vehicle2PowerValue: row.vehicle2_power_value,
    vehicle2PowerUnit: row.vehicle2_power_unit,
    vehicle2PowerNormalized: row.vehicle2_power_normalized,
    seasonWarAvailable: row.season_war_available === null ? null : Boolean(row.season_war_available),
    bgbAvailableHour: row.bgb_available_hour,
    discord: row.discord,
    telegram: row.telegram,
    adminMemo: row.admin_memo || "",
    memoUpdatedAt: row.memo_updated_at,
  };
}

async function handleAdminMembers(request, url, env) {
  const admin = await requireAnyAdminMenuPermission(request, env.DB, ["members","bgb","capitalWar","season"]);
  if (admin instanceof Response) return admin;

  const q = cleanString(url.searchParams.get("q"), 64);
  const rank = String(url.searchParams.get("rank") || "").toUpperCase();
  const industry = String(url.searchParams.get("industry") || "").toUpperCase();
  const sortKey = url.searchParams.get("sort") || "default";
  const page = Math.max(1, Number(url.searchParams.get("page") || 1));
  const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit") || 50)));
  const offset = (page - 1) * limit;

  const where = [];
  const binds = [];
  if (q) { where.push("m.nickname LIKE ? COLLATE NOCASE"); binds.push(`%${q}%`); }
  if (isAnyMemberRank(rank)) { where.push("m.member_rank = ?"); binds.push(rank); }
  if (isIndustryLevel(industry)) { where.push("m.industry_level = ?"); binds.push(industry); }
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const rankOrderSql = "CASE m.member_rank WHEN 'R5' THEN 5 WHEN 'R4' THEN 4 WHEN 'R3' THEN 3 WHEN 'R2' THEN 2 WHEN 'R1' THEN 1 ELSE 0 END";
  const industryOrderSql = "CAST(REPLACE(UPPER(COALESCE(m.industry_level,'')),'I','') AS INTEGER)";
  const missingSpecCountSql = "((CASE WHEN m.industry_level IS NULL OR TRIM(m.industry_level)='' THEN 1 ELSE 0 END) + (CASE WHEN m.power IS NULL OR m.power<=0 THEN 1 ELSE 0 END) + (CASE WHEN s.vehicle1_power_normalized IS NULL OR s.vehicle1_power_normalized<=0 THEN 1 ELSE 0 END) + (CASE WHEN s.vehicle2_power_normalized IS NULL OR s.vehicle2_power_normalized<=0 THEN 1 ELSE 0 END))";
  const sortMap = {
    default: `${rankOrderSql} DESC, CASE WHEN s.vehicle1_power_normalized IS NULL OR s.vehicle1_power_normalized<=0 THEN 1 ELSE 0 END ASC, s.vehicle1_power_normalized DESC, CASE WHEN s.vehicle2_power_normalized IS NULL OR s.vehicle2_power_normalized<=0 THEN 1 ELSE 0 END ASC, s.vehicle2_power_normalized DESC, CASE WHEN m.industry_level IS NULL OR TRIM(m.industry_level)='' THEN 1 ELSE 0 END ASC, ${industryOrderSql} DESC, m.nickname COLLATE NOCASE ASC`,
    vehicle1_desc: "CASE WHEN s.vehicle1_power_normalized IS NULL OR s.vehicle1_power_normalized<=0 THEN 1 ELSE 0 END ASC, s.vehicle1_power_normalized DESC, m.id ASC",
    vehicle2_desc: "CASE WHEN s.vehicle2_power_normalized IS NULL OR s.vehicle2_power_normalized<=0 THEN 1 ELSE 0 END ASC, s.vehicle2_power_normalized DESC, m.id ASC",
    industry_desc: `CASE WHEN m.industry_level IS NULL OR TRIM(m.industry_level)='' THEN 1 ELSE 0 END ASC, ${industryOrderSql} DESC, m.id ASC`,
    power_desc: "CASE WHEN m.power IS NULL OR m.power<=0 THEN 1 ELSE 0 END ASC, m.power DESC, m.id ASC",
    nickname_asc: "m.nickname COLLATE NOCASE ASC, m.id ASC",
    created_desc: "m.created_at DESC, m.id DESC",
    spec_missing_desc: `${missingSpecCountSql} DESC, m.id ASC`,
  };
  const orderBy = sortMap[sortKey] || sortMap.default;

  const countRow = await env.DB.prepare(`SELECT COUNT(*) AS total FROM members m ${whereSql}`)
    .bind(...binds).first();
  const stats = await env.DB.prepare(`
    SELECT COUNT(*) AS total,
      SUM(CASE WHEN status='active' THEN 1 ELSE 0 END) AS active,
      SUM(CASE WHEN status='suspended' THEN 1 ELSE 0 END) AS suspended,
      SUM(CASE WHEN status='left' THEN 1 ELSE 0 END) AS left_count
    FROM members
  `).first();

  const rows = await env.DB.prepare(`
    SELECT m.*, s.vehicle1_class, s.vehicle1_power_value, s.vehicle1_power_unit,
      s.vehicle1_power_normalized, s.vehicle2_class, s.vehicle2_power_value,
      s.vehicle2_power_unit, s.vehicle2_power_normalized, s.season_war_available,
      s.bgb_available_hour, s.discord, s.telegram,
      am.memo AS admin_memo, am.updated_at AS memo_updated_at
    FROM members m
    LEFT JOIN member_specs s ON s.member_id=m.id
    LEFT JOIN member_admin_memos am ON am.member_id=m.id
    ${whereSql}
    ORDER BY ${orderBy}
    LIMIT ? OFFSET ?
  `).bind(...binds, limit, offset).all();

  return json({ok:true,data:{
    items:(rows.results||[]).map(adminMemberRow),
    stats:{total:Number(stats?.total||0),active:Number(stats?.active||0),suspended:Number(stats?.suspended||0),left:Number(stats?.left_count||0)},
    pagination:{page,limit,total:Number(countRow?.total||0),totalPages:Math.ceil(Number(countRow?.total||0)/limit)}
  }});
}

async function handleAdminMemberDetail(request, memberId, env) {
  const admin = await requireAdminMenuPermission(request, env.DB, "members");
  if (admin instanceof Response) return admin;
  const row = await env.DB.prepare(`
    SELECT m.*, s.vehicle1_class, s.vehicle1_power_value, s.vehicle1_power_unit,
      s.vehicle1_power_normalized, s.vehicle2_class, s.vehicle2_power_value,
      s.vehicle2_power_unit, s.vehicle2_power_normalized, s.season_war_available,
      s.bgb_available_hour, s.discord, s.telegram,
      am.memo AS admin_memo, am.updated_at AS memo_updated_at
    FROM members m
    LEFT JOIN member_specs s ON s.member_id=m.id
    LEFT JOIN member_admin_memos am ON am.member_id=m.id
    WHERE m.id=? LIMIT 1
  `).bind(memberId).first();
  if (!row) return jsonError("MEMBER_NOT_FOUND",404);
  const history = await env.DB.prepare(`
    SELECT old_nickname,new_nickname,changed_by,changed_at
    FROM member_nickname_history WHERE member_id=?
    ORDER BY changed_at DESC LIMIT 100
  `).bind(memberId).all();
  return json({ok:true,data:{member:adminMemberRow(row),nicknameHistory:history.results||[]}});
}

async function handleAdminMemberHistory(request, memberId, env) {
  const admin = await requireAdminMenuPermission(request, env.DB, "members");
  if (admin instanceof Response) return admin;
  const rows=await env.DB.prepare(`
    SELECT old_nickname,new_nickname,changed_by,changed_at
    FROM member_nickname_history WHERE member_id=?
    ORDER BY changed_at DESC LIMIT 200
  `).bind(memberId).all();
  return json({ok:true,data:{items:rows.results||[]}});
}

async function handleAdminMemberUpdate(request, memberId, env) {
  const admin = await requireAdminMenuPermission(request, env.DB, "members");
  if (admin instanceof Response) return admin;
  const target = await env.DB.prepare("SELECT * FROM members WHERE id=?").bind(memberId).first();
  if (!target) return jsonError("MEMBER_NOT_FOUND",404);
  const body=await readJson(request);
  const nickname=cleanString(body.nickname,64);
  const rank=String(body.memberRank||"").toUpperCase();
  const status=String(body.status||"");
  const currentAdminLevel=target.admin_level || (target.role==="admin"?"super":null);
  const hasAdminLevel=Object.prototype.hasOwnProperty.call(body,"adminLevel");
  const requestedAdminLevel=!hasAdminLevel?currentAdminLevel:(body.adminLevel===null||body.adminLevel==="member"?null:String(body.adminLevel||""));
  if(!nickname||!isAnyMemberRank(rank)||!["active","suspended","left"].includes(status)) return jsonError("VALIDATION_ERROR",400);
  if(hasAdminLevel&&![null,"sub"].includes(requestedAdminLevel)) return jsonError("VALIDATION_ERROR",400);
  if(hasAdminLevel&&admin.admin_level!=="super") return jsonError("SUPER_ADMIN_REQUIRED",403);
  if(currentAdminLevel==="super"&&hasAdminLevel&&requestedAdminLevel!=="super") return jsonError("PRIMARY_ADMIN_PROTECTED",409);
  if (requestedAdminLevel === "sub" && currentAdminLevel !== "sub") {
    const existingSub = await env.DB.prepare("SELECT id,nickname FROM members WHERE role='admin' AND admin_level='sub' AND id<>? LIMIT 1").bind(memberId).first();
    if (existingSub) return jsonError("SUB_ADMIN_ALREADY_EXISTS", 409);
  }
  if(isProtectedAdminTarget(admin,target)) return jsonError("ADMIN_ACCOUNT_PROTECTED",403);
  if(currentAdminLevel==="super" && (rank!==target.member_rank || status!=="active")) return jsonError("PRIMARY_ADMIN_PROTECTED",409);
  if(target.role!=="admin" && !["R1","R2","R3","R4","R5"].includes(rank)) return jsonError("VALIDATION_ERROR",400);
  const dupe=await env.DB.prepare("SELECT id FROM members WHERE nickname=? COLLATE NOCASE AND id<>?").bind(nickname,memberId).first();
  if(dupe) return jsonError("NICKNAME_TAKEN",409);
  const permissionChanged=hasAdminLevel&&requestedAdminLevel!==currentAdminLevel;
  const nextRole=permissionChanged?(requestedAdminLevel?"admin":"member"):target.role;
  const nextLevel=permissionChanged?requestedAdminLevel:target.admin_level;
  const batch=[];
  if(nickname!==target.nickname){
    batch.push(env.DB.prepare(`INSERT INTO member_nickname_history(member_id,old_nickname,new_nickname,changed_by,changed_by_member_id) VALUES(?,?,?,'admin',?)`).bind(memberId,target.nickname,nickname,admin.id));
  }
  batch.push(env.DB.prepare(`UPDATE members SET nickname=?,member_rank=?,status=?,role=?,admin_level=?,updated_at=CURRENT_TIMESTAMP WHERE id=?`).bind(nickname,rank,status,nextRole,nextLevel,memberId));
  if(permissionChanged) batch.push(env.DB.prepare("DELETE FROM sessions WHERE member_id=?").bind(memberId));
  await env.DB.batch(batch);
  await writeAdminLog(env,request,{actor:admin,category:"member",action:"member_update",targetType:"member",targetId:memberId,targetName:nickname,before:{nickname:target.nickname,memberRank:target.member_rank,status:target.status,role:target.role,adminLevel:currentAdminLevel},after:{nickname,memberRank:rank,status,role:nextRole,adminLevel:nextLevel}});
  if(permissionChanged){
    await writeAdminLog(env,request,{actor:admin,category:"admin_permission",action:requestedAdminLevel?"admin_role_granted":"admin_role_revoked",targetType:"member",targetId:memberId,targetName:nickname,before:{role:target.role,adminLevel:currentAdminLevel},after:{role:nextRole,adminLevel:nextLevel}});
  }
  return json({ok:true,data:{updated:true,role:nextRole,adminLevel:nextLevel}});
}

async function handleAdminMemberSpecsUpdate(request, memberId, env) {
  const admin = await requireAdminMenuPermission(request, env.DB, "members");
  if (admin instanceof Response) return admin;
  const target=await env.DB.prepare("SELECT id,role,admin_level,nickname FROM members WHERE id=?").bind(memberId).first();
  if(!target)return jsonError("MEMBER_NOT_FOUND",404);
  if(isProtectedAdminTarget(admin,target))return jsonError("ADMIN_ACCOUNT_PROTECTED",403);
  const body=await readJson(request);
  const power=toPositiveInteger(body.power);
  const industryLevel=String(body.industryLevel??"").toUpperCase();
  const vehicle1Class=nullableEnum(body.vehicle1Class,["fighter","shooter","rider"]);
  const vehicle1PowerValue=nullableVehiclePowerValue(body.vehicle1PowerValue);
  const vehicle1PowerUnit=nullableEnum(body.vehicle1PowerUnit,["M","G"]);
  const vehicle2Class=nullableEnum(body.vehicle2Class,["fighter","shooter","rider"]);
  const vehicle2PowerValue=nullableVehiclePowerValue(body.vehicle2PowerValue);
  const vehicle2PowerUnit=nullableEnum(body.vehicle2PowerUnit,["M","G"]);
  const seasonWarAvailable=nullableBoolean(body.seasonWarAvailable);
  const bgbAvailableHour=nullableHour(body.bgbAvailableHour);
  const discord=nullableCleanString(body.discord,100);
  const telegram=nullableCleanString(body.telegram,100);
  if(!power||!isIndustryLevel(industryLevel)||vehicle1Class===INVALID||vehicle1PowerValue===INVALID||vehicle1PowerUnit===INVALID||vehicle2Class===INVALID||vehicle2PowerValue===INVALID||vehicle2PowerUnit===INVALID||seasonWarAvailable===INVALID||bgbAvailableHour===INVALID||discord===INVALID||telegram===INVALID||!vehicleGroupValid(vehicle1Class,vehicle1PowerValue,vehicle1PowerUnit)||!vehicleGroupValid(vehicle2Class,vehicle2PowerValue,vehicle2PowerUnit)) return jsonError("VALIDATION_ERROR",400);
  const n1=vehicle1PowerValue===null?null:vehicle1PowerValue*(vehicle1PowerUnit==="G"?1000:1);
  const n2=vehicle2PowerValue===null?null:vehicle2PowerValue*(vehicle2PowerUnit==="G"?1000:1);
  await env.DB.batch([
    env.DB.prepare(`UPDATE members SET power=?,industry_level=? WHERE id=?`).bind(power,industryLevel,memberId),
    env.DB.prepare(`INSERT INTO member_specs(member_id,profile_specs_registered,vehicle1_class,vehicle1_power_value,vehicle1_power_unit,vehicle1_power_normalized,vehicle2_class,vehicle2_power_value,vehicle2_power_unit,vehicle2_power_normalized,season_war_available,bgb_available_hour,discord,telegram)
      VALUES(?,1,?,?,?,?,?,?,?,?,?,?,?,?)
      ON CONFLICT(member_id) DO UPDATE SET profile_specs_registered=1,vehicle1_class=excluded.vehicle1_class,vehicle1_power_value=excluded.vehicle1_power_value,vehicle1_power_unit=excluded.vehicle1_power_unit,vehicle1_power_normalized=excluded.vehicle1_power_normalized,vehicle2_class=excluded.vehicle2_class,vehicle2_power_value=excluded.vehicle2_power_value,vehicle2_power_unit=excluded.vehicle2_power_unit,vehicle2_power_normalized=excluded.vehicle2_power_normalized,season_war_available=excluded.season_war_available,bgb_available_hour=excluded.bgb_available_hour,discord=excluded.discord,telegram=excluded.telegram`)
      .bind(memberId,vehicle1Class,vehicle1PowerValue,vehicle1PowerUnit,n1,vehicle2Class,vehicle2PowerValue,vehicle2PowerUnit,n2,seasonWarAvailable,bgbAvailableHour,discord,telegram)
  ]);
  return json({ok:true,data:{updated:true}});
}

async function handleAdminMemberSpecsReset(request, memberId, env) {
  const admin = await requireAdminMenuPermission(request, env.DB, "members");
  if (admin instanceof Response) return admin;
  const target=await env.DB.prepare("SELECT id,role,admin_level,nickname FROM members WHERE id=?").bind(memberId).first();
  if(!target)return jsonError("MEMBER_NOT_FOUND",404);
  if(isProtectedAdminTarget(admin,target))return jsonError("ADMIN_ACCOUNT_PROTECTED",403);
  await env.DB.batch([
    env.DB.prepare(`UPDATE members SET power=NULL,industry_level=NULL WHERE id=?`).bind(memberId),
    env.DB.prepare(`INSERT INTO member_specs(member_id,profile_specs_registered) VALUES(?,0)
      ON CONFLICT(member_id) DO UPDATE SET profile_specs_registered=0,vehicle1_class=NULL,vehicle1_power_value=NULL,vehicle1_power_unit=NULL,vehicle1_power_normalized=NULL,vehicle2_class=NULL,vehicle2_power_value=NULL,vehicle2_power_unit=NULL,vehicle2_power_normalized=NULL,season_war_available=NULL,bgb_available_hour=NULL,discord=NULL,telegram=NULL`).bind(memberId)
  ]);
  return json({ok:true,data:{reset:true}});
}

async function handleAdminMemberMemo(request, memberId, env) {
  const admin=await requireAdminMenuPermission(request,env.DB,"members");
  if(admin instanceof Response)return admin;
  const body=await readJson(request);
  const memo=String(body.memo??"").trim();
  if(memo.length>1000)return jsonError("VALIDATION_ERROR",400);
  await env.DB.prepare(`
    INSERT INTO member_admin_memos(member_id,memo,updated_at,updated_by_member_id)
    VALUES(?,?,CURRENT_TIMESTAMP,?)
    ON CONFLICT(member_id) DO UPDATE SET memo=excluded.memo,updated_at=CURRENT_TIMESTAMP,updated_by_member_id=excluded.updated_by_member_id
  `).bind(memberId,memo,admin.id).run();
  return json({ok:true,data:{memo}});
}

async function handleAdminMembersBulk(request, env) {
  const admin=await requireAdminMenuPermission(request,env.DB,"members");
  if(admin instanceof Response)return admin;
  const body=await readJson(request);
  const ids=Array.isArray(body.memberIds)?[...new Set(body.memberIds.map(Number).filter(Number.isInteger))]:[];
  if(!ids.length||ids.length>300)return jsonError("VALIDATION_ERROR",400);
  const field=String(body.field||"");
  const value=String(body.value||"").toUpperCase();
  const placeholders=ids.map(()=>"?").join(",");
  if(field==="memberRank"&&!["R1","R2","R3","R4"].includes(value))return jsonError("VALIDATION_ERROR",400);
  if(field==="status"&&!["ACTIVE","SUSPENDED","LEFT"].includes(value))return jsonError("VALIDATION_ERROR",400);
  const protectedRow=await env.DB.prepare(`SELECT id FROM members WHERE id IN (${placeholders}) AND role='admin' LIMIT 1`).bind(...ids).first();
  if(protectedRow)return jsonError("PRIMARY_ADMIN_PROTECTED",409);
  const column=field==="memberRank"?"member_rank":field==="status"?"status":null;
  if(!column)return jsonError("VALIDATION_ERROR",400);
  await env.DB.prepare(`UPDATE members SET ${column}=? WHERE id IN (${placeholders})`).bind(field==="status"?value.toLowerCase():value,...ids).run();
  return json({ok:true,data:{updated:ids.length}});
}

async function handleAdminMemberResetPassword(request, memberId, env) {
  const admin=await requireAdminMenuPermission(request,env.DB,"members");
  if(admin instanceof Response)return admin;
  if(!env.PASSWORD_PEPPER)return jsonError("PASSWORD_PEPPER_NOT_CONFIGURED",503);
  const target=await env.DB.prepare("SELECT id,role,admin_level,nickname FROM members WHERE id=?").bind(memberId).first();
  if(!target)return jsonError("MEMBER_NOT_FOUND",404);
  if(target.role==="admin")return jsonError("ADMIN_ACCOUNT_PROTECTED",409);
  const temporary=`EZ${randomHex(5)}9a`;
  const data=await hashPassword(temporary,env.PASSWORD_PEPPER);
  await env.DB.batch([
    env.DB.prepare(`UPDATE members SET password_hash=?,password_salt=?,password_iterations=?,must_change_password=1,password_changed_at=CURRENT_TIMESTAMP WHERE id=?`).bind(data.hash,data.salt,data.iterations,memberId),
    env.DB.prepare("DELETE FROM sessions WHERE member_id=?").bind(memberId)
  ]);
  return json({ok:true,data:{temporaryPassword:temporary}});
}

async function handleAdminMemberDelete(request, memberId, env) {
  const admin=await requireAdminMenuPermission(request,env.DB,"members");
  if(admin instanceof Response)return admin;
  const target=await env.DB.prepare("SELECT id,role,admin_level,nickname FROM members WHERE id=?").bind(memberId).first();
  if(!target)return jsonError("MEMBER_NOT_FOUND",404);
  if(target.role==="admin")return jsonError("ADMIN_ACCOUNT_PROTECTED",409);
  await env.DB.prepare("DELETE FROM members WHERE id=?").bind(memberId).run();
  return json({ok:true,data:{deleted:true}});
}

async function handleAdminMemberPermissions(request, memberId, env) {
  const admin=await requireSuperAdmin(request,env.DB);
  if(admin instanceof Response)return admin;
  const target=await env.DB.prepare("SELECT id,login_id,nickname,role,admin_level,status FROM members WHERE id=?").bind(memberId).first();
  if(!target)return jsonError("MEMBER_NOT_FOUND",404);
  const current=target.admin_level || (target.role==="admin"?"super":null);
  if(current==="super")return jsonError("PRIMARY_ADMIN_PROTECTED",409);
  const body=await readJson(request);
  const next=body.adminLevel===null||body.adminLevel==="member"?null:String(body.adminLevel||"");
  if(![null,"sub"].includes(next))return jsonError("VALIDATION_ERROR",400);
  if(next === "sub" && current !== "sub"){
    const existingSub=await env.DB.prepare("SELECT id,nickname FROM members WHERE role='admin' AND admin_level='sub' AND id<>? LIMIT 1").bind(memberId).first();
    if(existingSub)return jsonError("SUB_ADMIN_ALREADY_EXISTS",409);
  }
  await env.DB.batch([
    env.DB.prepare("UPDATE members SET role=?,admin_level=?,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(next?"admin":"member",next,memberId),
    env.DB.prepare("DELETE FROM sessions WHERE member_id=?").bind(memberId)
  ]);
  await writeAdminLog(env,request,{actor:admin,category:"admin_permission",action:next?"admin_role_granted":"admin_role_revoked",targetType:"member",targetId:memberId,targetName:target.nickname,before:{role:target.role,adminLevel:current},after:{role:next?"admin":"member",adminLevel:next}});
  return json({ok:true,data:{adminLevel:next,role:next?"admin":"member"}});
}

const ADMIN_MENU_PERMISSION_KEYS=["members","events","vote","bgb","capitalWar","season","requests","accounts"];

function normalizeAdminMenuPermissions(source={}){
  return {
    members:Boolean(source.members ?? true),
    events:Boolean(source.events ?? true),
    vote:Boolean(source.vote ?? true),
    bgb:Boolean(source.bgb ?? true),
    capitalWar:Boolean(source.capitalWar ?? source.capital_war ?? true),
    season:Boolean(source.season ?? true),
    requests:Boolean(source.requests ?? true),
    accounts:Boolean(source.accounts ?? true)
  };
}

async function findCurrentSubAdmin(db){
  return db.prepare(`SELECT id,login_id,nickname,member_rank,admin_level,status,updated_at
    FROM members WHERE role='admin' AND admin_level='sub' ORDER BY updated_at DESC,id ASC LIMIT 1`).first();
}

async function handleAdminMyPermissionsGet(request,env){
  const admin=await requireAdmin(request,env.DB);
  if(admin instanceof Response)return admin;
  const permissions=await loadAdminMenuPermissions(env.DB,admin);
  return json({ok:true,data:{adminLevel:admin.admin_level,permissions}});
}

async function handleAdminMenuPermissionsGet(request,env){
  const admin=await requireSuperAdmin(request,env.DB);
  if(admin instanceof Response)return admin;
  const subAdmin=await findCurrentSubAdmin(env.DB);
  if(!subAdmin)return json({ok:true,data:{subAdmin:null,permissions:null}});
  const row=await env.DB.prepare('SELECT * FROM admin_menu_permissions WHERE member_id=?').bind(subAdmin.id).first();
  return json({ok:true,data:{subAdmin:{id:subAdmin.id,loginId:subAdmin.login_id,nickname:subAdmin.nickname,memberRank:subAdmin.member_rank,adminLevel:subAdmin.admin_level,status:subAdmin.status,appointedAt:subAdmin.updated_at},permissions:normalizeAdminMenuPermissions(row||{})}});
}

async function handleAdminMenuPermissionsPut(request,env){
  const admin=await requireSuperAdmin(request,env.DB);
  if(admin instanceof Response)return admin;
  const subAdmin=await findCurrentSubAdmin(env.DB);
  if(!subAdmin)return jsonError('SUB_ADMIN_NOT_FOUND',404);
  const body=await readJson(request);
  const permissions=normalizeAdminMenuPermissions(body?.permissions||{});
  const values=ADMIN_MENU_PERMISSION_KEYS.map(key=>permissions[key]?1:0);
  const beforeRow=await env.DB.prepare('SELECT * FROM admin_menu_permissions WHERE member_id=?').bind(subAdmin.id).first();
  await env.DB.prepare(`INSERT INTO admin_menu_permissions
    (member_id,members,events,vote,bgb,capital_war,season,requests,accounts,updated_at) VALUES(?,?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP)
    ON CONFLICT(member_id) DO UPDATE SET members=excluded.members,events=excluded.events,vote=excluded.vote,bgb=excluded.bgb,capital_war=excluded.capital_war,season=excluded.season,requests=excluded.requests,accounts=excluded.accounts,updated_at=CURRENT_TIMESTAMP`)
    .bind(subAdmin.id,...values).run();
  await env.DB.prepare('DELETE FROM sessions WHERE member_id=?').bind(subAdmin.id).run();
  await writeAdminLog(env,request,{actor:admin,category:'admin_permission',action:'menu_permissions_saved',targetType:'member',targetId:subAdmin.id,targetName:subAdmin.nickname,before:beforeRow?normalizeAdminMenuPermissions(beforeRow):null,after:permissions});
  return json({ok:true,data:{subAdmin:{id:subAdmin.id,nickname:subAdmin.nickname},permissions}});
}

async function handleAdminLogs(request,url,env){
  const admin=await requireSuperAdmin(request,env.DB);
  if(admin instanceof Response)return admin;
  const q=cleanString(url.searchParams.get("q"),64);
  const category=cleanString(url.searchParams.get("category"),40);
  const actorLevel=cleanString(url.searchParams.get("actorLevel"),12);
  const result=cleanString(url.searchParams.get("result"),16);
  const dateFrom=cleanString(url.searchParams.get("dateFrom"),10);
  const dateTo=cleanString(url.searchParams.get("dateTo"),10);
  const page=Math.max(1,Number(url.searchParams.get("page")||1));
  const limit=Math.min(100,Math.max(10,Number(url.searchParams.get("limit")||30)));
  const where=[],binds=[];
  if(q){where.push("(actor_nickname LIKE ? COLLATE NOCASE OR target_name LIKE ? COLLATE NOCASE OR action LIKE ? COLLATE NOCASE)");binds.push(`%${q}%`,`%${q}%`,`%${q}%`);}
  if(category){where.push("category=?");binds.push(category);}
  if(["super","sub"].includes(actorLevel)){where.push("actor_admin_level=?");binds.push(actorLevel);}
  if(["success","failure"].includes(result)){where.push("result=?");binds.push(result);}
  if(/^\d{4}-\d{2}-\d{2}$/.test(dateFrom)){where.push("date(created_at)>=date(?)");binds.push(dateFrom);}
  if(/^\d{4}-\d{2}-\d{2}$/.test(dateTo)){where.push("date(created_at)<=date(?)");binds.push(dateTo);}
  const ws=where.length?`WHERE ${where.join(" AND ")}`:"";
  const count=await env.DB.prepare(`SELECT COUNT(*) total FROM admin_activity_logs ${ws}`).bind(...binds).first();
  const rows=await env.DB.prepare(`SELECT * FROM admin_activity_logs ${ws} ORDER BY created_at DESC,id DESC LIMIT ? OFFSET ?`).bind(...binds,limit,(page-1)*limit).all();
  return json({ok:true,data:{items:rows.results||[],pagination:{page,limit,total:Number(count?.total||0),totalPages:Math.ceil(Number(count?.total||0)/limit)}}});
}

// -----------------------------------------------------------------------------
// Password and crypto helpers
// -----------------------------------------------------------------------------

async function hashPassword(password, pepper) {
  const saltBytes = crypto.getRandomValues(new Uint8Array(16));
  const salt = bytesToHex(saltBytes);
  const iterations = FREE_PLAN_PBKDF2_ITERATIONS;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(`${password}${pepper}`),
    "PBKDF2",
    false,
    ["deriveBits"],
  );

  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: saltBytes,
      iterations,
    },
    key,
    256,
  );

  return {
    hash: bytesToHex(new Uint8Array(bits)),
    salt,
    iterations,
  };
}

async function verifyPassword(password, member, pepper) {
  if (member.password_algorithm !== "pbkdf2-sha256") return false;

  const saltBytes = hexToBytes(member.password_salt);
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(`${password}${pepper}`),
    "PBKDF2",
    false,
    ["deriveBits"],
  );

  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: saltBytes,
      iterations: Number(member.password_iterations),
    },
    key,
    256,
  );

  return constantTimeEqual(
    bytesToHex(new Uint8Array(bits)),
    member.password_hash,
  );
}

async function sha256Hex(value) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );
  return bytesToHex(new Uint8Array(digest));
}

// -----------------------------------------------------------------------------
// Request, response, cookie and validation helpers
// -----------------------------------------------------------------------------

function enforceSameOrigin(request, url) {
  if (!["POST", "PUT", "PATCH", "DELETE"].includes(request.method)) return;

  const origin = request.headers.get("origin");
  if (origin && origin !== url.origin) {
    throw new HttpError("FORBIDDEN", 403);
  }

  // v227: only methods that are expected to carry a JSON request body
  // require Content-Type: application/json. Body-less DELETE requests are valid.
  if (["POST", "PUT", "PATCH"].includes(request.method)) {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.toLowerCase().startsWith("application/json")) {
      throw new HttpError("UNSUPPORTED_MEDIA_TYPE", 415);
    }
  }
}

async function readJson(request) {
  const length = Number(request.headers.get("content-length") || "0");
  if (length > 32768) throw new HttpError("PAYLOAD_TOO_LARGE", 413);

  try {
    return await request.json();
  } catch {
    throw new HttpError("INVALID_JSON", 400);
  }
}

function json(payload, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...JSON_HEADERS,
      ...extraHeaders,
    },
  });
}

function jsonError(code, status, extra = {}) {
  return json(
    {
      ok: false,
      code,
      ...extra,
    },
    status,
  );
}

class HttpError extends Error {
  constructor(code, status) {
    super(code);
    this.code = code;
    this.status = status;
  }
}

function getCookie(request, name) {
  const cookieHeader = request.headers.get("cookie") || "";
  for (const part of cookieHeader.split(";")) {
    const [rawName, ...rest] = part.trim().split("=");
    if (rawName === name) {
      return decodeURIComponent(rest.join("="));
    }
  }
  return null;
}

function buildSessionCookie(token, maxAge) {
  return [
    `${SESSION_COOKIE}=${encodeURIComponent(token)}`,
    "Path=/",
    `Max-Age=${maxAge}`,
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
  ].join("; ");
}

function clearSessionCookie() {
  return [
    `${SESSION_COOKIE}=`,
    "Path=/",
    "Max-Age=0",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
  ].join("; ");
}

function cleanUserAgent(request) {
  return cleanString(request.headers.get("user-agent"), 500);
}

function normalizeLoginId(value) {
  return String(value ?? "").trim().toLowerCase();
}

function isLoginId(value) {
  return /^(?=.{4,32}$)[a-z0-9](?:[a-z0-9._-]*[a-z0-9])?$/.test(value);
}

function validatePassword(password, passwordConfirm) {
  if (password !== passwordConfirm) return "PASSWORD_CONFIRM_MISMATCH";
  if (password.length < 8 || password.length > 128) {
    return "INVALID_PASSWORD";
  }
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return "INVALID_PASSWORD";
  }
  return null;
}

function isIndustryLevel(value) {
  return /^I(?:10|[1-9])$/.test(value);
}

function isMemberRank(value) {
  return /^R[1-4]$/.test(value);
}

function isAnyMemberRank(value) {
  return /^R[1-5]$/.test(value);
}

function toPositiveInteger(value) {
  if (
    typeof value === "string" &&
    !/^\d+$/.test(value.trim())
  ) {
    return null;
  }

  const number = Number(value);
  return Number.isSafeInteger(number) && number > 0
    ? number
    : null;
}

function cleanString(value, maxLength) {
  if (value === null || value === undefined) return "";
  const result = String(value).trim();
  if (!result || result.length > maxLength) return "";
  return result;
}

function nullableCleanString(value, maxLength) {
  if (value === null || value === undefined || value === "") return null;
  const result = String(value).trim();
  if (result.length > maxLength) return INVALID;
  return result || null;
}

const INVALID = Symbol("INVALID");

function nullableEnum(value, allowed) {
  if (value === null || value === undefined || value === "") return null;
  const normalized = String(value);
  return allowed.includes(normalized) ? normalized : INVALID;
}

function nullablePositiveNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : INVALID;
}

function nullableVehiclePowerValue(value) {
  if (value === null || value === undefined || value === "") return null;
  const text = String(value).trim();
  if (!/^\d+(?:\.\d{1,2})?$/.test(text)) return INVALID;
  const number = Number(text);
  return Number.isFinite(number) && number > 0 ? number : INVALID;
}

function nullableBoolean(value) {
  if (value === null || value === undefined || value === "") return null;
  if (value === true || value === 1 || value === "1") return 1;
  if (value === false || value === 0 || value === "0") return 0;
  return INVALID;
}

function nullableHour(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isInteger(number) && number >= 0 && number <= 23
    ? number
    : INVALID;
}

function vehicleGroupValid(vehicleClass, powerValue, powerUnit) {
  const values = [vehicleClass, powerValue, powerUnit];
  return values.every((value) => value === null) ||
    values.every((value) => value !== null);
}

function clampInteger(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isInteger(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function addDaysIso(dateValue, days) {
  const base = Date.parse(dateValue);
  const safeBase = Number.isFinite(base) ? base : Date.now();
  return new Date(safeBase + days * 86400000).toISOString();
}


// -----------------------------------------------------------------------------
// v216 VOTE system
// -----------------------------------------------------------------------------
async function requireVoteAdmin(request, env) {
  return requireAdminMenuPermission(request, env.DB, "vote");
}
function voteStatus(row, now = new Date()) {
  if (row.status === "ended") return "ended";
  if (row.starts_at && new Date(row.starts_at) > now) return "scheduled";
  if (row.ends_at && new Date(row.ends_at) <= now) return "ended";
  return "active";
}
async function loadVoteOptions(db, voteId) {
  const rows = await db.prepare("SELECT id,label,description,sort_order FROM vote_options WHERE vote_id=? ORDER BY sort_order,id").bind(voteId).all();
  return rows.results || [];
}
async function loadMemberVoteView(db, row, member, status) {
  const options = await loadVoteOptions(db, row.id);
  const answerRows = status === "active" ? await db.prepare("SELECT vro.option_id FROM vote_responses vr JOIN vote_response_options vro ON vro.response_id=vr.id WHERE vr.vote_id=? AND vr.member_id=?").bind(row.id, member.id).all() : {results:[]};
  const countRows = await db.prepare("SELECT vro.option_id,COUNT(DISTINCT vr.member_id) votes FROM vote_response_options vro JOIN vote_responses vr ON vr.id=vro.response_id WHERE vr.vote_id=? GROUP BY vro.option_id").bind(row.id).all();
  const countMap = new Map((countRows.results||[]).map(x=>[x.option_id,Number(x.votes||0)]));
  const respondedRows = await db.prepare("SELECT DISTINCT m.id,m.nickname FROM vote_responses vr JOIN members m ON m.id=vr.member_id WHERE vr.vote_id=? AND EXISTS(SELECT 1 FROM vote_response_options x WHERE x.response_id=vr.id) ORDER BY m.nickname COLLATE NOCASE").bind(row.id).all();
  const participants = (respondedRows.results||[]).map(x=>({id:x.id,nickname:x.nickname}));
  let eligibleRows;
  if (status === "ended") {
    const snap = await db.prepare("SELECT m.id,m.nickname FROM vote_eligible_members vem JOIN members m ON m.id=vem.member_id WHERE vem.vote_id=? ORDER BY m.nickname COLLATE NOCASE").bind(row.id).all();
    eligibleRows = (snap.results||[]).length ? snap : await db.prepare("SELECT id,nickname FROM members WHERE status='active' ORDER BY nickname COLLATE NOCASE").all();
  } else {
    eligibleRows = await db.prepare("SELECT id,nickname FROM members WHERE status='active' ORDER BY nickname COLLATE NOCASE").all();
  }
  const participantIds = new Set(participants.map(x=>x.id));
  const missing = (eligibleRows.results||[]).filter(x=>!participantIds.has(x.id)).map(x=>({id:x.id,nickname:x.nickname}));
  return {
    id:row.id,title:row.title,description:row.description,voteType:row.vote_type,status,
    startsAt:row.starts_at,endsAt:row.ends_at,endedAt:row.ended_at,resultsVisible:Boolean(row.show_results),
    myAnswers:(answerRows.results||[]).map(x=>x.option_id),participantCount:participants.length,missingCount:missing.length,
    participants:participants.map(x=>x.nickname),missing:missing.map(x=>x.nickname),
    options:options.map(o=>({id:o.id,label:o.label,description:o.description,votes:Number(countMap.get(o.id)||0)}))
  };
}
async function handleMemberVotes(request, env) {
  const member = await requireMember(request, env.DB); if (member instanceof Response) return member;
  const rows = await env.DB.prepare("SELECT * FROM votes ORDER BY COALESCE(ended_at,ends_at,created_at) DESC, id DESC").all();
  const activeVotes=[], endedVotes=[];
  for (const row of rows.results||[]) {
    const status = voteStatus(row);
    if (status === "scheduled") continue;
    const item = await loadMemberVoteView(env.DB,row,member,status);
    if (status === "active") activeVotes.push(item); else endedVotes.push(item);
  }
  return json({ok:true,data:{activeVotes,recentEnded:endedVotes.slice(0,3),olderEnded:endedVotes.slice(3)}});
}

async function handleActiveVotes(request, env) {
  const member = await requireOptionalMember(request, env.DB);
  const rows = await env.DB.prepare("SELECT * FROM votes WHERE status <> 'ended' ORDER BY created_at DESC").all();
  const votes=[];
  for (const row of rows.results||[]) {
    const status=voteStatus(row); if(status!=="active") continue;
    const options=await loadVoteOptions(env.DB,row.id);
    let answers=[];
    if(member){const a=await env.DB.prepare("SELECT vro.option_id FROM vote_responses vr JOIN vote_response_options vro ON vro.response_id=vr.id WHERE vr.vote_id=? AND vr.member_id=?").bind(row.id,member.id).all();answers=(a.results||[]).map(x=>x.option_id)}
    let totalVoters=0, counts=new Map();
    if(row.show_results){const c=await env.DB.prepare("SELECT vro.option_id,COUNT(*) votes FROM vote_response_options vro JOIN vote_responses vr ON vr.id=vro.response_id WHERE vr.vote_id=? GROUP BY vro.option_id").bind(row.id).all();for(const x of c.results||[])counts.set(x.option_id,x.votes);const t=await env.DB.prepare("SELECT COUNT(*) total FROM vote_responses WHERE vote_id=?").bind(row.id).first();totalVoters=Number(t?.total||0)}
    votes.push({id:row.id,title:row.title,description:row.description,voteType:row.vote_type,status,startsAt:row.starts_at,endsAt:row.ends_at,showResults:Boolean(row.show_results),myAnswers:answers,totalVoters,options:options.map(o=>({id:o.id,label:o.label,description:o.description,votes:Number(counts.get(o.id)||0)}))});
  }
  return json({ok:true,data:{authenticated:Boolean(member),votes}});
}
async function handleVoteRespond(request, voteId, env) {
  const member=await requireMember(request,env.DB); if(member instanceof Response)return member; const body=await readJson(request); const ids=[...new Set((Array.isArray(body.voteAnswers)?body.voteAnswers:[]).map(Number).filter(Number.isInteger))];
  const vote=await env.DB.prepare("SELECT * FROM votes WHERE id=?").bind(voteId).first(); if(!vote)throw new HttpError(404,"VOTE_NOT_FOUND"); if(voteStatus(vote)!=="active")throw new HttpError(409,"VOTE_NOT_ACTIVE");
  const valid=await env.DB.prepare("SELECT id FROM vote_options WHERE vote_id=?").bind(voteId).all(); const set=new Set((valid.results||[]).map(x=>x.id)); if(ids.some(id=>!set.has(id)))throw new HttpError(400,"INVALID_VOTE_OPTION"); if(vote.vote_type==='single'&&ids.length>1)throw new HttpError(400,"SINGLE_CHOICE_ONLY");
  await env.DB.prepare("INSERT INTO vote_responses(vote_id,member_id) VALUES(?,?) ON CONFLICT(vote_id,member_id) DO UPDATE SET updated_at=CURRENT_TIMESTAMP").bind(voteId,member.id).run(); const response=await env.DB.prepare("SELECT id FROM vote_responses WHERE vote_id=? AND member_id=?").bind(voteId,member.id).first(); await env.DB.prepare("DELETE FROM vote_response_options WHERE response_id=?").bind(response.id).run(); for(const id of ids)await env.DB.prepare("INSERT INTO vote_response_options(response_id,option_id) VALUES(?,?)").bind(response.id,id).run();
  return json({ok:true,data:{voteId,voteAnswers:ids}});
}
function normalizeVoteBody(body){const type=body.voteType==='multiple'?'multiple':'single';const options=(Array.isArray(body.options)?body.options:[]).map((o,i)=>({label:String(o.label||'').trim().slice(0,80),description:String(o.description||'').trim().slice(0,160),sortOrder:i})).filter(o=>o.label);if(!String(body.title||'').trim()||options.length<2)throw new HttpError(400,"INVALID_VOTE");return{title:String(body.title).trim().slice(0,120),description:String(body.description||'').trim().slice(0,400),voteType:type,startsAt:body.startsAt||null,endsAt:body.endsAt||null,showResults:body.showResults?1:0,options}}
async function handleAdminVotes(request, env){const admin=await requireVoteAdmin(request,env);if(admin instanceof Response)return admin;const rows=await env.DB.prepare("SELECT v.*,(SELECT COUNT(*) FROM vote_responses r WHERE r.vote_id=v.id) response_count FROM votes v ORDER BY v.created_at DESC").all();const votes=[];for(const r of rows.results||[])votes.push({id:r.id,title:r.title,description:r.description,voteType:r.vote_type,status:voteStatus(r),startsAt:r.starts_at,endsAt:r.ends_at,showResults:Boolean(r.show_results),responseCount:Number(r.response_count||0),options:await loadVoteOptions(env.DB,r.id)});const current=votes.find(v=>v.status==='active');let currentMissing=0;if(current){const total=await env.DB.prepare("SELECT COUNT(*) total FROM members WHERE status='active'").first();currentMissing=Math.max(0,Number(total?.total||0)-current.responseCount)}const risk=await env.DB.prepare("SELECT COUNT(*) total FROM vote_member_states WHERE consecutive_missed_votes>=3").first();return json({ok:true,data:{votes,summary:{active:votes.filter(v=>v.status==='active').length,ended:votes.filter(v=>v.status==='ended').length,currentMissing,risk:Number(risk?.total||0)}}})}
async function replaceVoteOptions(db,voteId,options){await db.prepare("DELETE FROM vote_options WHERE vote_id=?").bind(voteId).run();for(const o of options)await db.prepare("INSERT INTO vote_options(vote_id,label,description,sort_order) VALUES(?,?,?,?)").bind(voteId,o.label,o.description,o.sortOrder).run()}
async function handleAdminVoteCreate(request,env){const admin=await requireVoteAdmin(request,env);if(admin instanceof Response)return admin;const v=normalizeVoteBody(await readJson(request));const status=v.startsAt&&new Date(v.startsAt)>new Date()?'scheduled':'active';const r=await env.DB.prepare("INSERT INTO votes(title,description,vote_type,status,starts_at,ends_at,show_results,created_by) VALUES(?,?,?,?,?,?,?,?)").bind(v.title,v.description,v.voteType,status,v.startsAt,v.endsAt,v.showResults,admin.id).run();await replaceVoteOptions(env.DB,r.meta.last_row_id,v.options);return json({ok:true,data:{id:r.meta.last_row_id}})}
async function handleAdminVoteUpdate(request,voteId,env){const admin=await requireVoteAdmin(request,env);if(admin instanceof Response)return admin;const v=normalizeVoteBody(await readJson(request));const old=await env.DB.prepare("SELECT status FROM votes WHERE id=?").bind(voteId).first();if(!old)throw new HttpError(404,"VOTE_NOT_FOUND");await env.DB.prepare("UPDATE votes SET title=?,description=?,vote_type=?,starts_at=?,ends_at=?,show_results=?,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(v.title,v.description,v.voteType,v.startsAt,v.endsAt,v.showResults,voteId).run();const count=await env.DB.prepare("SELECT COUNT(*) total FROM vote_responses WHERE vote_id=?").bind(voteId).first();if(Number(count?.total||0)===0)await replaceVoteOptions(env.DB,voteId,v.options);return json({ok:true,data:{id:voteId}})}
async function handleAdminVoteEnd(request,voteId,env){const admin=await requireVoteAdmin(request,env);if(admin instanceof Response)return admin;const vote=await env.DB.prepare("SELECT * FROM votes WHERE id=?").bind(voteId).first();if(!vote)throw new HttpError(404,"VOTE_NOT_FOUND");if(vote.status==='ended')return json({ok:true,data:{id:voteId}});const eligible=await env.DB.prepare("SELECT id FROM members WHERE status='active'").all();for(const m of eligible.results||[])await env.DB.prepare("INSERT OR IGNORE INTO vote_eligible_members(vote_id,member_id) VALUES(?,?)").bind(voteId,m.id).run();const responded=await env.DB.prepare("SELECT member_id FROM vote_responses WHERE vote_id=? AND EXISTS(SELECT 1 FROM vote_response_options x WHERE x.response_id=vote_responses.id)").bind(voteId).all();const resp=new Set((responded.results||[]).map(x=>x.member_id));const excluded=await env.DB.prepare("SELECT member_id FROM vote_member_exclusions WHERE excluded=1").all();const exc=new Set((excluded.results||[]).map(x=>x.member_id));for(const m of eligible.results||[]){if(exc.has(m.id))continue;if(resp.has(m.id))await env.DB.prepare("INSERT INTO vote_member_states(member_id,consecutive_missed_votes,last_vote_id,last_vote_status) VALUES(?,0,?,'voted') ON CONFLICT(member_id) DO UPDATE SET consecutive_missed_votes=0,last_vote_id=excluded.last_vote_id,last_vote_status='voted',updated_at=CURRENT_TIMESTAMP").bind(m.id,voteId).run();else await env.DB.prepare("INSERT INTO vote_member_states(member_id,consecutive_missed_votes,last_vote_id,last_vote_status) VALUES(?,1,?,'missed') ON CONFLICT(member_id) DO UPDATE SET consecutive_missed_votes=consecutive_missed_votes+1,last_vote_id=excluded.last_vote_id,last_vote_status='missed',updated_at=CURRENT_TIMESTAMP").bind(m.id,voteId).run()}
await env.DB.prepare("UPDATE votes SET status='ended',ended_at=CURRENT_TIMESTAMP,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(voteId).run();return json({ok:true,data:{id:voteId}})}
async function handleAdminVoteDelete(request,voteId,env){const admin=await requireVoteAdmin(request,env);if(admin instanceof Response)return admin;await env.DB.prepare("DELETE FROM votes WHERE id=?").bind(voteId).run();return json({ok:true,data:{id:voteId}})}
async function handleAdminVoteResults(request,voteId,env){const admin=await requireVoteAdmin(request,env);if(admin instanceof Response)return admin;const vote=await env.DB.prepare("SELECT * FROM votes WHERE id=?").bind(voteId).first();if(!vote)throw new HttpError(404,"VOTE_NOT_FOUND");const opts=await loadVoteOptions(env.DB,voteId);const options=[];for(const o of opts){const rows=await env.DB.prepare("SELECT m.id,m.nickname,m.member_rank,vr.updated_at,COALESCE(e.excluded,0) excluded FROM vote_response_options vro JOIN vote_responses vr ON vr.id=vro.response_id JOIN members m ON m.id=vr.member_id LEFT JOIN vote_member_exclusions e ON e.member_id=m.id WHERE vr.vote_id=? AND vro.option_id=? ORDER BY m.member_rank DESC,m.nickname").bind(voteId,o.id).all();options.push({id:o.id,label:o.label,description:o.description,members:(rows.results||[]).map(x=>({id:x.id,nickname:x.nickname,memberRank:x.member_rank,updatedAt:x.updated_at,excluded:Boolean(x.excluded)}))})}
const eligible=await env.DB.prepare("SELECT m.id,m.nickname,m.member_rank,COALESCE(s.consecutive_missed_votes,0) consecutive_missed_votes,COALESCE(e.excluded,0) excluded FROM members m LEFT JOIN vote_member_states s ON s.member_id=m.id LEFT JOIN vote_member_exclusions e ON e.member_id=m.id WHERE m.status='active' ORDER BY consecutive_missed_votes DESC,m.nickname").all();const responded=await env.DB.prepare("SELECT member_id FROM vote_responses WHERE vote_id=? AND EXISTS(SELECT 1 FROM vote_response_options x WHERE x.response_id=vote_responses.id)").bind(voteId).all();const set=new Set((responded.results||[]).map(x=>x.member_id));const mapped=(eligible.results||[]).map(x=>({id:x.id,nickname:x.nickname,memberRank:x.member_rank,consecutiveMissedVotes:Number(x.consecutive_missed_votes||0),excluded:Boolean(x.excluded)}));return json({ok:true,data:{vote:{id:vote.id,title:vote.title,status:voteStatus(vote)},options,missing:mapped.filter(x=>!set.has(x.id)),streaks:mapped}})}
async function handleVoteExclusion(request,memberId,env){const admin=await requireVoteAdmin(request,env);if(admin instanceof Response)return admin;const b=await readJson(request);const excluded=b.excluded?1:0;if(excluded)await env.DB.prepare("INSERT INTO vote_member_exclusions(member_id,excluded,reason) VALUES(?,?,?) ON CONFLICT(member_id) DO UPDATE SET excluded=excluded.excluded,reason=excluded.reason,updated_at=CURRENT_TIMESTAMP").bind(memberId,1,String(b.reason||'')).run();else await env.DB.prepare("DELETE FROM vote_member_exclusions WHERE member_id=?").bind(memberId).run();return json({ok:true,data:{memberId,excluded:Boolean(excluded)}})}

function randomHex(byteLength) {
  return bytesToHex(
    crypto.getRandomValues(new Uint8Array(byteLength)),
  );
}

function bytesToHex(bytes) {
  return [...bytes]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function hexToBytes(hex) {
  if (!/^[0-9a-f]+$/i.test(hex) || hex.length % 2 !== 0) {
    throw new Error("Invalid hex input");
  }

  const bytes = new Uint8Array(hex.length / 2);
  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = Number.parseInt(
      hex.slice(index * 2, index * 2 + 2),
      16,
    );
  }
  return bytes;
}

function constantTimeEqual(left, right) {
  const a = new TextEncoder().encode(String(left));
  const b = new TextEncoder().encode(String(right));
  const length = Math.max(a.length, b.length);
  let difference = a.length ^ b.length;

  for (let index = 0; index < length; index += 1) {
    difference |= (a[index] ?? 0) ^ (b[index] ?? 0);
  }

  return difference === 0;
}

function escapeLike(value) {
  return value
    .replaceAll("\\", "\\\\")
    .replaceAll("%", "\\%")
    .replaceAll("_", "\\_");
}

// -----------------------------------------------------------------------------
// Response mapping
// -----------------------------------------------------------------------------

function publicAuthenticatedMember(member) {
  return {
    id: member.id,
    loginId: member.login_id,
    nickname: member.nickname,
    power: member.power,
    industryLevel: member.industry_level,
    memberRank: member.member_rank,
    role: member.role,
    adminLevel: member.admin_level || (member.role === "admin" ? "super" : null),
    status: member.status,
    mustChangePassword: Boolean(member.must_change_password),
    nicknameChangeCount: Number(member.nickname_change_count ?? 0),
    firstNicknameChangeFree: Number(member.nickname_change_count ?? 0) === 0,
    nicknameUpdatedAt: member.nickname_updated_at,
    createdAt: member.created_at,
    updatedAt: member.updated_at,
    lastLoginAt: member.last_login_at,
    passwordChangedAt: member.password_changed_at,
  };
}

function specsResponse(row) {
  const completed = Boolean(
    row.vehicle1_class &&
      row.vehicle1_power_value !== null &&
      row.vehicle1_power_unit &&
      row.vehicle2_class &&
      row.vehicle2_power_value !== null &&
      row.vehicle2_power_unit &&
      row.season_war_available !== null &&
      row.bgb_available_hour !== null,
  );

  return {
    profileSpecsRegistered: row.power !== null && row.industry_level !== null,
    vehicle1Class: row.vehicle1_class,
    vehicle1PowerValue: row.vehicle1_power_value,
    vehicle1PowerUnit: row.vehicle1_power_unit,
    vehicle1PowerNormalized: row.vehicle1_power_normalized,
    vehicle2Class: row.vehicle2_class,
    vehicle2PowerValue: row.vehicle2_power_value,
    vehicle2PowerUnit: row.vehicle2_power_unit,
    vehicle2PowerNormalized: row.vehicle2_power_normalized,
    seasonWarAvailable:
      row.season_war_available === null
        ? null
        : Boolean(row.season_war_available),
    bgbAvailableHour: row.bgb_available_hour,
    discord: row.discord,
    telegram: row.telegram,
    createdAt: row.spec_created_at,
    updatedAt: row.spec_updated_at,
    completed,
  };
}

function publicMemberRow(row) {
  const registered = row.power !== null && row.industry_level !== null;
  return {
    id: row.id,
    nickname: row.nickname,
    power: row.power ?? null,
    industryLevel: row.industry_level ?? null,
    profileSpecsRegistered: registered,
    memberRank: row.member_rank,
    vehicle1Class: row.vehicle1_class ?? null,
    vehicle1PowerValue: row.vehicle1_power_value ?? null,
    vehicle1PowerUnit: row.vehicle1_power_unit ?? null,
    vehicle1PowerNormalized: row.vehicle1_power_normalized ?? null,
    vehicle2Class: row.vehicle2_class ?? null,
    vehicle2PowerValue: row.vehicle2_power_value ?? null,
    vehicle2PowerUnit: row.vehicle2_power_unit ?? null,
    vehicle2PowerNormalized: row.vehicle2_power_normalized ?? null,
    joinedAt: row.joined_at,
    basicUpdatedAt: row.basic_updated_at,
  };
}
