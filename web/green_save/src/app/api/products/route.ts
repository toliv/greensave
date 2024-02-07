import { ProductData } from "../utils/readProductFile";

export async function GET(request: Request) {
  const instance = await ProductData.getInstance();
  const products = ProductData.getAllProducts();
  return new Response(JSON.stringify(products));
}
