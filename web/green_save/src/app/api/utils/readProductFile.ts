import path from 'path';
import { promises as fs } from 'fs';

export class ProductData {
  private static instance: ProductData;
  private productData: object = {};
  private constructor(){}

  public static getInstance(): ProductData {
    if (!ProductData.instance) {
        ProductData.instance = new ProductData();
    }
    return ProductData.instance;
  }

  public async setup(){
    this.productData = await this.loadProductDataFromFile();
  }

  public getProductData(){
    return this.productData;
  }

  private async loadProductDataFromFile() {
    // process.cwd() -> root dir
    const jsonDirectory = path.join(process.cwd(), 'src/app/api/data');
    const fileContents = await fs.readFile(jsonDirectory + '/2024_02_05-01_06_53.json', 'utf8');
    return JSON.parse(fileContents);
  }
}