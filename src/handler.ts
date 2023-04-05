import { Env } from ".";
import { configuration, list_api } from "./configuration";
import { getDummy } from "./routes/dummy.route";
import { updateKeyValue } from "./routes/keyvalue.route";

export async function handleRequest(
  request: Request,
  env: Env
): Promise<Response> {
  const requestURL = new URL(request.url);
  const requestPath = requestURL.pathname;

  //* Check target URL validity
  if (
    configuration.methods &&
    !configuration.methods.includes(request.method)
  ) {
    return new Response(null, {
      status: 405,
      statusText: "Method not allowed",
    });
  }

  //* Check for mobile url
  // const user_agent = request.headers.get("user-agent");
  // const is_mobile = isMobileUpstream(user_agent);

  /*
   * Handle Worker's URL Path
   * If you want to manage various URL path for your worker
   */
  switch (requestPath) {
    // TODO: Manage request path here, add additional condition for mobile if necessary.
    case list_api.home:
      return new Response(JSON.stringify({ msg: "Server up and running" }), {
        status: 200,
        statusText: "Server up and running",
      });
    case list_api.dummy:
      return getDummy(env);
    case list_api.keyvalue:
      return updateKeyValue(env);
    case list_api.pages:
      return new Response(null, {
        status: 404,
        statusText: "Not yet implemented",
      });
    default:
      // * You can return a HTML body for a 404 page
      return new Response(null, {
        status: 404,
        statusText: "Request path url not defined",
      });
  }
}

export async function handleOptions(request: Request): Promise<Response> {
  /*
   * Handle CORS pre-flight request.
   * If you want to check the requested method + headers you can do that here.
   */
  if (
    request.headers.get("Origin") !== null &&
    request.headers.get("Access-Control-Request-Method") !== null &&
    request.headers.get("Access-Control-Request-Headers") !== null
  ) {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": configuration.host,
        "Access-Control-Allow-Methods": configuration.methods.join(", "),
        "Access-Control-Allow-Headers": "Content-Type",
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
  env: Env
): Promise<Response> {
  const cron = parseCron(event.cron);

  /*
   * Handling specific event to trigger for a CRON trigger
   */
  if (cron === "0 7 * * *") {
    console.log("cron triggered!");
    return updateKeyValue(env);
  }
  console.log("no event triggered");
  return new Response(null, {
    status: 500,
    statusText: "Internal server error, cron not detected",
  });
}

/**
 * Normalize CRON string
 * @param cron
 * @returns {string}
 */
function parseCron(cron: string): string {
  cron = cron.replaceAll("/", "");
  if (cron.length > 9) {
    cron = cron.substring(cron.length - 9);
  }
  cron = cron.replaceAll("+", " ");
  return cron;
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
      if (user_agent.indexOf(element) > 0) {
        return true;
      }
    }
  }
  return false;
}
