import { Env } from "..";

export async function updateKeyValue(env: Env) {
  const time = new Date().toUTCString();
  await env.KV_KEYVALUE.put("TIME", time);
  const returnTime = await env.KV_KEYVALUE.get("TIME");
  if (time !== returnTime) {
    return new Response(JSON.stringify({ error: "Failed to change KV Store" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
  return new Response(JSON.stringify({ msg: "Successfully changed KV Store" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
