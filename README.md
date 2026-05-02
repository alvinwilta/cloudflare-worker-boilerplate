# Simple Cloudflare Worker Boilerplate

## Overview

A boilerplate for Cloudflare's Edge Worker with request handler and CRON-triggered schedule handler.

### API Request Handler

- `/`: Returns an OK status response.
- `/pages`: Returns a 404 status response.
- `/dummy`: Calls an API from https://dummyjson.com/products and calculates its price with the discounts provided.
- `/keyvalue`: Uses Cloudflare's KV storage to store and retrieve the current time.

### CRON Trigger Handler

Setting a `0 7 * * *` CRON trigger will use Cloudflare's KV storage to store and retrieve the current time.

## Usage

To use this boilerplate, you will need a Cloudflare account and an active Workers subscription. Follow these steps to deploy the worker:

1. Clone the repository:

   ```
   git clone https://github.com/alvinwilta/cloudflare-worker-boilerplate.git
   ```

2. Install the required packages:

   ```
   npm install
   ```

3. Log in to your Cloudflare account:

   ```
   wrangler login
   ```

4. Create KV namespaces:

   ```
   wrangler kv namespace create <namespace_name>
   wrangler kv namespace create --preview <namespace_name>
   ```

5. Update `wrangler.jsonc` with your KV namespace IDs and worker name:

   ```jsonc
   {
     "name": "your-worker-name",
     "kv_namespaces": [
       {
         "binding": "KV_KEYVALUE",
         "preview_id": "<preview_id>",
         "id": "<production_id>",
       },
     ],
   }
   ```

6. Update `allowedOrigins` in [`src/configuration.ts`](./src/configuration.ts) with your allowed origins.

7. Copy `.dev.vars.example` to `.dev.vars` and fill in any required secrets for local development.

8. Deploy the worker:
   ```
   wrangler deploy
   ```

## File Descriptions

- `src/interfaces/`: TypeScript interface definitions.
- `src/routes/`: Route handlers invoked for each API request.
- [`src/configuration.ts`](./src/configuration.ts): Allowed origins, HTTP methods, and API path definitions.
- [`src/handler.ts`](./src/handler.ts): Request routing, [CORS preflight](https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request) handling, and scheduled event handler.
- [`src/index.ts`](./src/index.ts): Worker entry point. Validates methods, attaches CORS headers, and dispatches to handlers.
- [`src/index.test.ts`](./src/index.test.ts): Unit tests powered by [Vitest](https://vitejs.dev/).
- [`wrangler.jsonc`](./wrangler.jsonc): Configuration for [Wrangler](https://developers.cloudflare.com/workers/wrangler/) — KV bindings, cron triggers, observability.
- [`tsconfig.json`](./tsconfig.json): TypeScript configuration.
- `.dev.vars.example`: Template for local development secrets.

## Contributing

Anyone and everyone is welcome to contribute. You can start by checking out the list of [open issues](https://github.com/alvinwilta/cloudflare-worker-boilerplate/issues).

## License

Copyright © 2023-present by Alvin Wilta. This source code is licensed under the MIT license found in the [LICENSE](https://github.com/alvinwilta/cloudflare-worker-boilerplate/blob/main/LICENSE) file.
