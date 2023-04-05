import { Env } from "..";

export async function updateKeyValue(env: Env) {
  const time = new Date().toUTCString();
  await env.KV_KEYVALUE.put("TIME", time);
  const returnTime = await env.KV_KEYVALUE.get("TIME");
  if (time !== returnTime) {
    return new Response(null, {
      status: 500,
      statusText: "Failed to change KV Store",
    });
  }
  return new Response(null, {
    status: 200,
    statusText: "Successfully changed KV Store",
  });
}
