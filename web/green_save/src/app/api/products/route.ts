import { ProductData } from "../utils/readProductFile";

export async function GET(request: Request) {
  const instance = ProductData.getInstance()
  await instance.setup();
  const products = instance.getProductData();
  return new Response(JSON.stringify(products));
}