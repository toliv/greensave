import { ProductData } from "../../utils/readProductFile";

export async function GET(request: Request) {
  const splitted = request.url.split("/");
  const idSegment = splitted[splitted.length - 1];
  await ProductData.getInstance();
  const product = ProductData.getProduct(idSegment);
  return new Response(JSON.stringify(product));
}
