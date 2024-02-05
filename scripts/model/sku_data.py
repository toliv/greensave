from dataclasses import dataclass
from energy_star.water_heaters import WaterHeater
import json

# V0 of payload
@dataclass
class SkuDataPayload:
    brand_name: str
    model_name: str
    product_type: str
    price_in_cents: int
    media_json: str # includes things like link, size etc
    power_source: str


def sku_data_payload(water_heater: WaterHeater, home_depot_product: dict):
    return SkuDataPayload(
        brand_name=water_heater.brand_name,
        model_name = water_heater.model_name,
        product_type=water_heater.heater_type,
        price_in_cents=int(home_depot_product['pricing']['value']*100),
        media_json=json.dumps(home_depot_product['media']),
        power_source=water_heater.fuel_type,
    )