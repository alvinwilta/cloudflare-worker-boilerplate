export const configuration = {
  //   host: '*',
  // * For CORS
  host: "https://example.com",
  referer: "https://example.com",
  methods: ["GET", "HEAD", "POST", "OPTIONS", "PATCH"],
};

// * List of APIs provided by the worker
export const list_api: { readonly [key: string]: string } = {
  home: "/",
  dummy: "/dummy",
  keyvalue: "/keyvalue",
  pages: "/pages",
};

/*
 * List of APIs for the worker to fetch
 * This constant is optional, useful for decluttering URL strings in the file
 */
export const path_url: { readonly [key: string]: string[] } = {
  dummy: ["https://dummyjson.com/products", "GET"],
};
