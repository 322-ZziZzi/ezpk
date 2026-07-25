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

      const adminMemberMatch = url.pathname.match(/^\/api\/admin\/members\/(\d+)(?:\/(memo|reset-password|history))?$/);
      if (adminMemberMatch) {
        const memberId = Number(adminMemberMatch[1]);
        const action = adminMemberMatch[2] || "";
        if (request.method === "GET" && !action) return handleAdminMemberDetail(request, memberId, env);
        if (request.method === "GET" && action === "history") return handleAdminMemberHistory(request, memberId, env);
        if (request.method === "PUT" && !action) return handleAdminMemberUpdate(request, memberId, env);
        if (request.method === "PUT" && action === "memo") return handleAdminMemberMemo(request, memberId, env);
        if (request.method === "POST" && action === "reset-password") return handleAdminMemberResetPassword(request, memberId, env);
        if (request.method === "DELETE" && !action) return handleAdminMemberDelete(request, memberId, env);
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

        case "PUT /api/member/password":
          return handlePasswordUpdate(request, env);

        case "GET /api/members":
          return handlePublicMembers(url, env);

        case "GET /api/admin/members":
          return handleAdminMembers(request, url, env);

        case "POST /api/admin/members/bulk":
          return handleAdminMembersBulk(request, env);

        case "GET /api/admin/content":
          return handleAdminContentGet(request, url, env);

        case "PUT /api/admin/content":
          return handleAdminContentPut(request, env);

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
  const power = toPositiveInteger(body.power);
  const industryLevel = String(body.industryLevel ?? "").toUpperCase();
  const memberRank = String(body.memberRank ?? "").toUpperCase();
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

  if (
    !nickname ||
    !power ||
    !isIndustryLevel(industryLevel) ||
    !isMemberRank(memberRank)
  ) {
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
        INSERT INTO member_specs (member_id)
        SELECT id FROM members WHERE login_id = ?
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
  "data/members.json"
]);
async function handleMemberContentGet(request, url, env) {
  const member = await requireMember(request, env.DB);
  if (member instanceof Response) return member;
  const path = String(url.searchParams.get("path") || "").trim();
  if (!MEMBER_CONTENT_PATHS.has(path)) return jsonError("CONTENT_PATH_NOT_ALLOWED", 400);
  const assetUrl = new URL(`/${path}`, url.origin);
  const assetResponse = await env.ASSETS.fetch(new Request(assetUrl, { method:"GET" }));
  if (!assetResponse.ok) return jsonError("CONTENT_NOT_FOUND", 404);
  let content;
  try { content = await assetResponse.json(); } catch (_) { return jsonError("CONTENT_INVALID", 500); }
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
        power: record.power,
        industryLevel: record.industry_level,
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
  const requestedRank = String(body.memberRank ?? "").toUpperCase();

  if (!power || !isIndustryLevel(industryLevel)) {
    return jsonError("VALIDATION_ERROR", 400);
  }

  // R5 is administrator-only. An administrator's own profile update must
  // never lower the stored rank because the public form only exposes R1-R4.
  const memberRank = member.role === "admin" ? "R5" : requestedRank;

  if (member.role !== "admin" && !isMemberRank(memberRank)) {
    return jsonError("VALIDATION_ERROR", 400);
  }

  await env.DB.prepare(`
    UPDATE members
    SET power = ?, industry_level = ?, member_rank = ?
    WHERE id = ?
  `).bind(power, industryLevel, memberRank, member.id).run();

  return json({
    ok: true,
    data: {
      profile: {
        power,
        industryLevel,
        memberRank,
        rankLocked: member.role === "admin",
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

async function handleSpecsUpdate(request, env) {
  const member = await requireMember(request, env.DB);
  if (member instanceof Response) return member;

  const body = await readJson(request);

  const vehicle1Class = nullableEnum(
    body.vehicle1Class,
    ["fighter", "shooter", "rider"],
  );
  const vehicle1PowerValue = nullablePositiveNumber(body.vehicle1PowerValue);
  const vehicle1PowerUnit = nullableEnum(body.vehicle1PowerUnit, ["M", "G"]);

  const vehicle2Class = nullableEnum(
    body.vehicle2Class,
    ["fighter", "shooter", "rider"],
  );
  const vehicle2PowerValue = nullablePositiveNumber(body.vehicle2PowerValue);
  const vehicle2PowerUnit = nullableEnum(body.vehicle2PowerUnit, ["M", "G"]);

  const seasonWarAvailable = nullableBoolean(body.seasonWarAvailable);
  const bgbAvailableHour = nullableHour(body.bgbAvailableHour);
  const discord = nullableCleanString(body.discord, 100);
  const telegram = nullableCleanString(body.telegram, 100);

  if (
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

  await env.DB.prepare(`
    INSERT INTO member_specs (
      member_id,
      vehicle1_class, vehicle1_power_value, vehicle1_power_unit,
      vehicle2_class, vehicle2_power_value, vehicle2_power_unit,
      season_war_available, bgb_available_hour,
      discord, telegram
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(member_id) DO UPDATE SET
      vehicle1_class = excluded.vehicle1_class,
      vehicle1_power_value = excluded.vehicle1_power_value,
      vehicle1_power_unit = excluded.vehicle1_power_unit,
      vehicle2_class = excluded.vehicle2_class,
      vehicle2_power_value = excluded.vehicle2_power_value,
      vehicle2_power_unit = excluded.vehicle2_power_unit,
      season_war_available = excluded.season_war_available,
      bgb_available_hour = excluded.bgb_available_hour,
      discord = excluded.discord,
      telegram = excluded.telegram
  `).bind(
    member.id,
    vehicle1Class,
    vehicle1PowerValue,
    vehicle1PowerUnit,
    vehicle2Class,
    vehicle2PowerValue,
    vehicle2PowerUnit,
    seasonWarAvailable,
    bgbAvailableHour,
    discord,
    telegram,
  ).run();

  return json({
    ok: true,
    data: {
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
    where.push("nickname LIKE ? ESCAPE '\\'");
    binds.push(`%${escapeLike(search)}%`);
  }

  const rank = url.searchParams.get("rank");
  if (rank && isAnyMemberRank(rank.toUpperCase())) {
    where.push("member_rank = ?");
    binds.push(rank.toUpperCase());
  }

  const industry = url.searchParams.get("industry");
  if (industry && isIndustryLevel(industry.toUpperCase())) {
    where.push("industry_level = ?");
    binds.push(industry.toUpperCase());
  }

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const sortMap = {
    power_desc: "power DESC, id ASC",
    power_asc: "power ASC, id ASC",
    nickname_asc: "nickname COLLATE NOCASE ASC, id ASC",
    nickname_desc: "nickname COLLATE NOCASE DESC, id ASC",
    joined_desc: "joined_at DESC, id ASC",
    updated_desc:
      "COALESCE(spec_updated_at, basic_updated_at) DESC, id ASC",
  };

  const sort =
    sortMap[url.searchParams.get("sort")] || sortMap.power_desc;

  const countResult = await env.DB.prepare(`
    SELECT COUNT(*) AS total
    FROM public_members
    ${whereSql}
  `).bind(...binds).first();

  const rows = await env.DB.prepare(`
    SELECT
      id,
      nickname,
      power,
      industry_level,
      member_rank,
      joined_at,
      basic_updated_at
    FROM public_members
    ${whereSql}
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
      industry_level, member_rank, role, status,
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
]);

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

async function handleAdminContentGet(request, url, env) {
  const admin = await requireAdmin(request, env.DB);
  if (admin instanceof Response) return admin;
  const path = assertAdminContentPath(url.searchParams.get("path"));
  return json({ ok: true, data: await readGithubJson(env, path) });
}

async function handleAdminContentPut(request, env) {
  const admin = await requireAdmin(request, env.DB);
  if (admin instanceof Response) return admin;
  const body = await readJson(request);
  const path = assertAdminContentPath(body.path);
  if (body.content === undefined || body.content === null) return jsonError("VALIDATION_ERROR", 400);
  return json({ ok: true, data: await writeGithubJson(env, path, body.content, body.message) });
}

async function requireAdmin(request, db) {
  const member = await requireMember(request, db);
  if (member instanceof Response) return member;
  if (member.role !== "admin" || member.member_rank !== "R5" || member.status !== "active") {
    return jsonError("FORBIDDEN", 403);
  }
  return member;
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
  const admin = await requireAdmin(request, env.DB);
  if (admin instanceof Response) return admin;

  const q = cleanString(url.searchParams.get("q"), 64);
  const rank = String(url.searchParams.get("rank") || "").toUpperCase();
  const industry = String(url.searchParams.get("industry") || "").toUpperCase();
  const sortKey = url.searchParams.get("sort") || "created_desc";
  const page = Math.max(1, Number(url.searchParams.get("page") || 1));
  const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit") || 50)));
  const offset = (page - 1) * limit;

  const where = [];
  const binds = [];
  if (q) { where.push("m.nickname LIKE ? COLLATE NOCASE"); binds.push(`%${q}%`); }
  if (isAnyMemberRank(rank)) { where.push("m.member_rank = ?"); binds.push(rank); }
  if (isIndustryLevel(industry)) { where.push("m.industry_level = ?"); binds.push(industry); }
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const sortMap = {
    created_desc: "m.created_at DESC",
    power_desc: "m.power DESC",
    power_asc: "m.power ASC",
    vehicle1_desc: "COALESCE(s.vehicle1_power_normalized,0) DESC",
    nickname_asc: "m.nickname COLLATE NOCASE ASC",
  };
  const orderBy = sortMap[sortKey] || sortMap.created_desc;

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
  const admin = await requireAdmin(request, env.DB);
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
  const admin = await requireAdmin(request, env.DB);
  if (admin instanceof Response) return admin;
  const rows=await env.DB.prepare(`
    SELECT old_nickname,new_nickname,changed_by,changed_at
    FROM member_nickname_history WHERE member_id=?
    ORDER BY changed_at DESC LIMIT 200
  `).bind(memberId).all();
  return json({ok:true,data:{items:rows.results||[]}});
}

async function handleAdminMemberUpdate(request, memberId, env) {
  const admin = await requireAdmin(request, env.DB);
  if (admin instanceof Response) return admin;
  const target = await env.DB.prepare("SELECT * FROM members WHERE id=?").bind(memberId).first();
  if (!target) return jsonError("MEMBER_NOT_FOUND",404);
  const body=await readJson(request);
  const nickname=cleanString(body.nickname,64);
  const power=toPositiveInteger(body.power);
  const industry=String(body.industryLevel||"").toUpperCase();
  const rank=String(body.memberRank||"").toUpperCase();
  const status=String(body.status||"");
  if(!nickname||!power||!isIndustryLevel(industry)||!isAnyMemberRank(rank)||!["active","suspended","left"].includes(status)) return jsonError("VALIDATION_ERROR",400);
  if(target.role==="admin" && (rank!=="R5" || status!=="active")) return jsonError("PRIMARY_ADMIN_PROTECTED",409);
  const dupe=await env.DB.prepare("SELECT id FROM members WHERE nickname=? COLLATE NOCASE AND id<>?").bind(nickname,memberId).first();
  if(dupe) return jsonError("NICKNAME_TAKEN",409);
  const batch=[];
  if(nickname!==target.nickname){
    batch.push(env.DB.prepare(`INSERT INTO member_nickname_history(member_id,old_nickname,new_nickname,changed_by,changed_by_member_id) VALUES(?,?,?,'admin',?)`).bind(memberId,target.nickname,nickname,admin.id));
  }
  batch.push(env.DB.prepare(`UPDATE members SET nickname=?,power=?,industry_level=?,member_rank=?,status=? WHERE id=?`).bind(nickname,power,industry,rank,status,memberId));
  await env.DB.batch(batch);
  return json({ok:true,data:{updated:true}});
}

async function handleAdminMemberMemo(request, memberId, env) {
  const admin=await requireAdmin(request,env.DB);
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
  const admin=await requireAdmin(request,env.DB);
  if(admin instanceof Response)return admin;
  const body=await readJson(request);
  const ids=Array.isArray(body.memberIds)?[...new Set(body.memberIds.map(Number).filter(Number.isInteger))]:[];
  if(!ids.length||ids.length>300)return jsonError("VALIDATION_ERROR",400);
  const field=String(body.field||"");
  const value=String(body.value||"").toUpperCase();
  const placeholders=ids.map(()=>"?").join(",");
  if(field==="memberRank"&&!isAnyMemberRank(value))return jsonError("VALIDATION_ERROR",400);
  if(field==="industryLevel"&&!isIndustryLevel(value))return jsonError("VALIDATION_ERROR",400);
  if(field==="status"&&!["ACTIVE","SUSPENDED","LEFT"].includes(value))return jsonError("VALIDATION_ERROR",400);
  const protectedRow=await env.DB.prepare(`SELECT id FROM members WHERE id IN (${placeholders}) AND role='admin' LIMIT 1`).bind(...ids).first();
  if(protectedRow)return jsonError("PRIMARY_ADMIN_PROTECTED",409);
  const column=field==="memberRank"?"member_rank":field==="industryLevel"?"industry_level":field==="status"?"status":null;
  if(!column)return jsonError("VALIDATION_ERROR",400);
  await env.DB.prepare(`UPDATE members SET ${column}=? WHERE id IN (${placeholders})`).bind(field==="status"?value.toLowerCase():value,...ids).run();
  return json({ok:true,data:{updated:ids.length}});
}

async function handleAdminMemberResetPassword(request, memberId, env) {
  const admin=await requireAdmin(request,env.DB);
  if(admin instanceof Response)return admin;
  if(!env.PASSWORD_PEPPER)return jsonError("PASSWORD_PEPPER_NOT_CONFIGURED",503);
  const target=await env.DB.prepare("SELECT role FROM members WHERE id=?").bind(memberId).first();
  if(!target)return jsonError("MEMBER_NOT_FOUND",404);
  if(target.role==="admin")return jsonError("PRIMARY_ADMIN_PROTECTED",409);
  const temporary=`EZ${randomHex(5)}9a`;
  const data=await hashPassword(temporary,env.PASSWORD_PEPPER);
  await env.DB.batch([
    env.DB.prepare(`UPDATE members SET password_hash=?,password_salt=?,password_iterations=?,must_change_password=1,password_changed_at=CURRENT_TIMESTAMP WHERE id=?`).bind(data.hash,data.salt,data.iterations,memberId),
    env.DB.prepare("DELETE FROM sessions WHERE member_id=?").bind(memberId)
  ]);
  return json({ok:true,data:{temporaryPassword:temporary}});
}

async function handleAdminMemberDelete(request, memberId, env) {
  const admin=await requireAdmin(request,env.DB);
  if(admin instanceof Response)return admin;
  const target=await env.DB.prepare("SELECT role FROM members WHERE id=?").bind(memberId).first();
  if(!target)return jsonError("MEMBER_NOT_FOUND",404);
  if(target.role==="admin")return jsonError("PRIMARY_ADMIN_PROTECTED",409);
  await env.DB.prepare("DELETE FROM members WHERE id=?").bind(memberId).run();
  return json({ok:true,data:{deleted:true}});
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

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    throw new HttpError("UNSUPPORTED_MEDIA_TYPE", 415);
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
  return {
    id: row.id,
    nickname: row.nickname,
    power: row.power,
    industryLevel: row.industry_level,
    memberRank: row.member_rank,
    joinedAt: row.joined_at,
    basicUpdatedAt: row.basic_updated_at,
  };
}
