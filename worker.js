export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/db-test") {
      const result = await env.DB
        .prepare("SELECT key, value FROM settings ORDER BY key")
        .all();

      return Response.json({
        ok: true,
        settings: result.results
      });
    }

    return env.ASSETS.fetch(request);
  }
};
