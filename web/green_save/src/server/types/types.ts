import { WaterHeater, WaterHeaterPriceRecord } from "@prisma/client";

export type WaterHeaterWithPriceRecord = WaterHeater & {
  priceRecord: WaterHeaterPriceRecord;
};
