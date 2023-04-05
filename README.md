# Simple Cloudflare Worker Boilerplate

## Overview

A boilerplate for Cloudflare's Edge Worker with request handler and CRON-triggered schedule handler.

### API Request Handler

- `/`: Returns an OK status response.
- `/pages`: Returns a 404 status response.
- `/dummy`: Calls an API from https://dummyjson.com/products and calculates its price with the discounts provided.
- `/keyvalue`: Uses Cloudflare's KV storage to store and retrieve the current time.

### CRON Trigger Handler

Setting a `0 7 * * *` CRON Trigger in Cloudflare's Dashboard will use Cloudflare's KV storage to store and retrieve current time.

## Usage

To use this boilerplate, you will need a Cloudflare account and an active Workers subscription. Follow these steps to deploy the worker:

1. Clone the repository:
   ```
   git clone https://github.com/alvinwilta/cloudflare-worker-boilerplate.git
   ```
2. Install the Cloudflare Workers CLI:
   ```
   npm install -g @cloudflare/wrangler
   ```
3. Install the required packages:
   ```
   npm i
   ```
4. Log in to your Cloudflare account:
   ```
   wrangler login
   ```
5. Run the command:

   ```
   wrangler kv:namespace create <namespace_name>
   wrangler kv:namespace create --preview <namespace_name>
   ```

   where `<namespace_name>` is the name you want to give your KV store.

6. Adjust deployment configuration accordingly in `wrangler.toml`

   ```toml
   name = "example"
   main = "src/index.ts"
   compatibility_date = "2023-03-10"
   account_id = "$CLOUDFLARE_ACCOUNT_ID"
   route = "$APP_HOSTNAME"
   # Put your generated KV id here
   kv_namespaces = [{ binding = "$KV_NAME", preview_id = "$PREVIEW_ID", id = "$PRODUCTION_ID" }]

   [vars]
   APP_ENV = "$APP_ENV"
   APP_HOSTNAME = "$APP_HOSTNAME"

   # Optional
   [triggers]
   crons = ["* * * * *"]
   ```

7. Add CRON Trigger from your Cloudflare Dashboard in `Workers > Services > Triggers > Cron Triggers`.

8. Deploy the worker:

   ```
   wrangler publish
   ```

## File Descriptions

- `interfaces/`: interface definitions used in this project.
- `routes/`: route services that are invoked for each API request.
- [`configuration.ts`](./src/configuration.ts): define all API requests provided by the worker.
- [`handler.ts`](./src/handler.ts): handle request, option request for [CORS Preflight](https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request), and scheduled request.
- [`index.test.ts`](./src/index.test.ts): unit test powered by [Vitest](https://vitejs.dev/).
- [`wrangler.toml`](./wrangler.toml): configuration file for [Wrangler](https://developers.cloudflare.com/workers/wrangler/) to run and publish the worker.
- [`tsconfig.json`](./tsconfig.json): [Typescript](https://www.typescriptlang.org/) configuration file.
- `.dev.vars.example`: wrangler env file for local development.

## Contributing

Anyone and everyone is welcome to contribute. You can start by checking out the list of [open issues](https://github.com/alvinwilta/cloudflare-worker-boilerplate/issues).

## License

Copyright © 2023-present by Alvin Wilta. This source code is licensed under the MIT license found in the [LICENSE](https://github.com/alvinwilta/cloudflare-worker-boilerplate/blob/main/LICENSE) file.
