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
      return new Response(null, {
        status: 405,
        statusText: "Method Not Allowed",
      });

    const response =
      request.method === "OPTIONS"
        ? await handleOptions(request)
        : await handleRequest(request, env);

    // Attach CORS header to every response
    const headers = new Headers(response.headers);
    headers.set("Access-Control-Allow-Origin", configuration.host);
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
