import { ProductData } from "../utils/productData";

export async function GET(request: Request) {
  const instance = await ProductData.getInstance();
  const products = ProductData.getAllProducts();
  return new Response(JSON.stringify(products));
}
