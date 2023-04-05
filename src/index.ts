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

    if (request.method === "OPTIONS") {
      return handleOptions(request);
    } else {
      return handleRequest(request, env);
    }
  },
  async scheduled(
    event: ScheduledEvent,
    env: Env,
    ctx: EventContext<Env, any, any>
  ) {
    ctx.waitUntil(handleSchedule(event, env));
  },
};
