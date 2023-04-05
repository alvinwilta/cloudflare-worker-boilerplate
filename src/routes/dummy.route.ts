import { Env } from "..";
import { path_url } from "../configuration";
import { DiscountedProducts, Products } from "../interfaces/currency.interface";

export async function getDummy(env: Env): Promise<Response> {
  try {
    // * Sample dummy fetch request
    const dummyRequestInit: RequestInit = {
      method: path_url.dummy[1],
      cf: { cacheEverything: true },
    };
    const dummyRequest = new Request(path_url.dummy[0], dummyRequestInit);
    const productsResponse = await fetch(dummyRequest);
    console.log(`Fetching [${path_url.dummy[1]}] ${path_url.dummy[0]}`);

    // * Parsing request result to interface
    const products = await gatherResponse<Products>(productsResponse);

    // * Process the data, or just return the response back
    // TODO: User-defined operations here
    const discountedProducts = getDiscountPrice(products);

    console.log(`Dummy fetched Successfully at ${new Date().toUTCString()}`);

    // * Return the response
    return new Response(JSON.stringify(discountedProducts), {
      status: 200,
      statusText: "Successfully fetched dummy",
    });
  } catch (err) {
    console.error(err);
    return new Response(null, {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
}

/**
 * getDiscountPrice calculates the price with its discount
 * @param {Products} products list of products from dummyjson API
 * @returns {DiscountedProducts} products with its price calculated according to discounts
 */
function getDiscountPrice(products: Products): DiscountedProducts {
  let discountedProducts: DiscountedProducts = { products: [] };
  products.products.forEach((product) => {
    discountedProducts.products.push({
      title: product.title,
      price: (product.price * (100 - product.discountPercentage)) / 100,
    });
  });
  return discountedProducts;
}

/**
 * gatherResponse awaits and returns a response body as a string.
 * Use await gatherResponse(..) in an async function to get the response body
 * @param {Response} response
 */
async function gatherResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw Error(await response.text());
  }
  const { headers } = response;
  const contentType = headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return await response.json();
  }
  return JSON.parse(await response.text());
}
