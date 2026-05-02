import { configuration } from "./configuration";
import { handleRequest, handleOptions, handleSchedule } from "./handler";

export interface Env {
  /**
   * IF you defined more env on .dev.vars or .env, don't forget to update this interface
   */
  // API_KEY: string;
  KV_KEYVALUE: KVNamespace;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const isMethodAllowed = configuration.methods.includes(request.method);

    if (!isMethodAllowed)
      return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });

    const response =
      request.method === "OPTIONS"
        ? await handleOptions(request)
        : await handleRequest(request, env);

    const headers = new Headers(response.headers);
    const origin = request.headers.get("Origin");
    if (origin && configuration.allowedOrigins.includes(origin)) {
      headers.set("Access-Control-Allow-Origin", origin);
    }
    headers.set("Vary", "Origin");
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(handleSchedule(event, env));
  },
};
