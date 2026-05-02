import { Env } from ".";
import { configuration, list_api } from "./configuration";
import { getDummy } from "./routes/dummy.route";
import { updateKeyValue } from "./routes/keyvalue.route";

export async function handleRequest(
  request: Request,
  env: Env,
): Promise<Response> {
  const requestURL = new URL(request.url);
  const requestPath = requestURL.pathname;

  // TODO: check for user-agent specific logic
  const user_agent = request.headers.get("user-agent");
  const is_mobile = isMobileUpstream(user_agent);

  switch (requestPath) {
    // TODO: Manage request path here, add additional condition for mobile if necessary.
    case list_api.home:
      return new Response(JSON.stringify({ msg: "Server up and running" }), {
        status: 200,
        statusText: "Server up and running",
        headers: { "Content-Type": "application/json" },
      });
    case list_api.dummy:
      return getDummy(env);
    case list_api.keyvalue:
      return updateKeyValue(env);
    case list_api.pages:
      return new Response(JSON.stringify({ error: "Not yet implemented" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    default:
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
  }
}

export async function handleOptions(request: Request): Promise<Response> {
  /*
   * Handle CORS pre-flight request.
   * If you want to check the requested method + headers you can do that here.
   */
  const origin = request.headers.get("Origin");
  if (
    origin !== null &&
    request.headers.get("Access-Control-Request-Method") !== null &&
    request.headers.get("Access-Control-Request-Headers") !== null
  ) {
    const isAllowed = configuration.allowedOrigins.includes(origin);
    return new Response(null, {
      headers: {
        ...(isAllowed && { "Access-Control-Allow-Origin": origin }),
        "Access-Control-Allow-Methods": configuration.methods.join(", "),
        "Access-Control-Allow-Headers": "Content-Type",
        "Vary": "Origin",
      },
    });

    /*
     * Handle standard OPTIONS request.
     * If you want to allow other HTTP Methods, you can do that here.
     */
  } else {
    return new Response(null, {
      headers: {
        Allow: configuration.methods.join(", "),
      },
    });
  }
}

/*
 * Schedule handler
 * For handling requests made by Cloudflare's CRON trigger
 */
export async function handleSchedule(
  event: ScheduledEvent,
  env: Env,
): Promise<void> {
  /*
   * Handling specific event to trigger for a CRON trigger
   * Only use this if you need specific event to trigger for different CRON schedule
   */
  if (event.cron === "0 7 * * *") {
    console.log("cron triggered!");
    await updateKeyValue(env);
    return;
  }
  console.log("no event triggered");
}

/**
 * Check whether the request is from a mobile agent
 * @param user_agent Obtained from cloudflare agent
 * @returns true / false, identify if the request are from mobile or not
 */
function isMobileUpstream(user_agent: string | null): boolean {
  const agents = [
    "Android",
    "iPhone",
    "SymbianOS",
    "Windows Phone",
    "iPad",
    "iPod",
  ];
  if (user_agent !== null && user_agent !== undefined) {
    for (const element of agents) {
      if (user_agent.indexOf(element) >= 0) {
        return true;
      }
    }
  }
  return false;
}
