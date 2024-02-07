import path from "path";
import { promises as fs } from "fs";

// External facing types
export type Product = {
  energyStarData: object;
  rawHomeDepotProductResponse: object;
  energyStarId: string;
  modelNumber: string;
  skuData: SkuData;
};

export type ImageLink = {
  url: string;
  type: string;
  subType: string;
  sizes: string[];
};

export type MediaJson = {
  images: ImageLink[];
};

export type SkuData = {
  brandName: string;
  mediaJson: MediaJson; // This is actually JSON,
  modelName: string;
  powerSource: string;
  priceInCents: number;
  productType: string;
};

// Internal types only used for reading in from file
type RawProducts = {
  data: RawProductData[];
};

type RawProductData = {
  energy_star_data: object;
  raw_home_depot_product_response: object;
  energy_star_id: string;
  model_number: string;
  sku_data: RawSkuData;
};

type RawSkuData = {
  brand_name: string;
  media_json: string; // This is actually JSON, need to convert
  model_name: string;
  power_source: string;
  price_in_cents: number;
  product_type: string;
};

export class ProductData {
  private static instance: ProductData;
  private static productData: RawProducts | undefined = undefined;
  private static keyedProductData: Map<string, Product> = new Map();
  private constructor() {}

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
          skuData: {
            brandName: product.sku_data.brand_name,
            mediaJson: JSON.parse(product.sku_data.media_json),
            modelName: product.sku_data.model_name,
            powerSource: product.sku_data.power_source,
            priceInCents: product.sku_data.price_in_cents,
            productType: product.sku_data.product_type,
          },
        });
      });
    }
  }

  public static getAllProducts(): Product[] {
    // return all the parsed values from the
    return Array.from(ProductData.keyedProductData.values());
  }

  public static getProduct(id: string): Product | undefined {
    return ProductData.keyedProductData.get(id);
  }

  private static async loadProductDataFromFile() {
    // process.cwd() -> root dir
    const jsonDirectory = path.join(process.cwd(), "src/app/api/data");
    const fileContents = await fs.readFile(
      jsonDirectory + "/2024_02_05-01_06_53.json",
      "utf8",
    );
    return JSON.parse(fileContents);
  }
}
