import path from 'path';
import { promises as fs } from 'fs';

type RawProductData = {
  energy_star_data: object;
  raw_home_depot_product_response: object;
  energy_star_id: string;
  model_number: string;
  sku_data: object;
}

export type Product = {
  energyStarData: object;
  rawHomeDepotProductResponse: object;
  energyStarId: string;
  modelNumber: string;
  skuData: object;
}

export type Products = {
  data: RawProductData[];
}


export class ProductData {
  private static instance: ProductData;
  private static productData: Products | undefined = undefined;
  private static keyedProductData: Map<string, Product> = new Map();
  private constructor() { }

  public static async getInstance(): Promise<ProductData> {
    if (!ProductData.instance) {
      ProductData.instance = new ProductData();
    }
    await ProductData.setup();
    return ProductData.instance;
  }

  private static async setup() {
    if (!ProductData.productData) {
      ProductData.productData = await ProductData.loadProductDataFromFile();
    }
    if (ProductData.productData) {
      const products = ProductData.productData.data;
      products.forEach((product) => {
        ProductData.keyedProductData.set(product.energy_star_id, {
          energyStarData: product.energy_star_data,
          rawHomeDepotProductResponse: product.raw_home_depot_product_response,
          energyStarId: product.energy_star_id,
          modelNumber: product.model_number,
          skuData: product.sku_data,
        });
      });
    }
  }

  public static getAllProducts() {
    return ProductData.productData;
  }

  public static getProduct(id: string) {
    return ProductData.keyedProductData.get(id);
  }

  private static async loadProductDataFromFile() {
    // process.cwd() -> root dir
    const jsonDirectory = path.join(process.cwd(), 'src/app/api/data');
    const fileContents = await fs.readFile(jsonDirectory + '/2024_02_05-01_06_53.json', 'utf8');
    return JSON.parse(fileContents);
  }
}