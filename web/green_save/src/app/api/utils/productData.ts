import path from "path";
import { promises as fs } from "fs";

// Internal types only used for reading in from file
type RawWaterHeaters = {
  data: RawWaterHeater[];
};

// External type describing WaterHeater
export type WaterHeater = {
  id: string;
  brandName: string;
  modelName: string;
  taxCreditEligible: string;
  heaterType: string;
  fuelTypes: string[];
  ventType: string;
  firstHourRating: number | null;
  maximumGallonsPerMinute: number | null;
  inputVoltsForHpwh: number | null;
  tankHeightInches: number | null;
  tankDiameterInches: number | null;
}

// This reflects the WaterHeater class from Python
type RawWaterHeater = {
  pd_id: string;
  brand_name: string;
  model_name: string;
  tax_credit_eligible: string;
  heater_type: string;
  fuel_types: string[];
  vent_type: string;
  first_hour_rating: number | null;
  maximum_gallons_per_minute: number | null;
  input_volts_for_hpwh: number | null;
  tank_height_inches: number | null;
  tank_diameter_inches: number | null;
}

export class ProductData {
  private static instance: ProductData;
  private static productData: RawWaterHeaters | undefined = undefined;
  private static keyedProductData: Map<string, WaterHeater> = new Map();
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
      products.forEach((waterHeater) => {
        ProductData.keyedProductData.set(waterHeater.pd_id, {
          id: waterHeater.pd_id,
          brandName: waterHeater.brand_name,
          modelName: waterHeater.model_name,
          taxCreditEligible: waterHeater.tax_credit_eligible,
          heaterType: waterHeater.heater_type,
          fuelTypes: waterHeater.fuel_types,
          ventType: waterHeater.vent_type,
          firstHourRating: waterHeater.first_hour_rating,
          maximumGallonsPerMinute: waterHeater.maximum_gallons_per_minute,
          inputVoltsForHpwh: waterHeater.input_volts_for_hpwh,
          tankHeightInches: waterHeater.tank_height_inches,
          tankDiameterInches: waterHeater.tank_diameter_inches,
        });
      });
    }
  }

  public static getAllProducts(): WaterHeater[] {
    // return all the parsed values from the
    return Array.from(ProductData.keyedProductData.values());
  }

  public static getProduct(id: string): WaterHeater | undefined {
    return ProductData.keyedProductData.get(id);
  }

  private static async loadProductDataFromFile() {
    // process.cwd() -> root dir
    const jsonDirectory = path.join(process.cwd(), "src/app/api/data");
    const fileContents = await fs.readFile(
      jsonDirectory + "/products.json",
      "utf8",
    );
    return JSON.parse(fileContents);
  }
}
