from dataclasses import dataclass
from dotenv import dotenv_values
from home_depot.tank_water_heaters import get_tank_water_heaters
import requests

config = dotenv_values(".env")

ENERGY_STAR_APP_TOKEN = config["ENERGY_STAR_APP_TOKEN"]
ENERGY_STAR_SECRET = config["ENERGY_STAR_SECRET"]
ENERGY_STAR_API_BASE_URL = "https://data.energystar.gov/resource/"

WATER_HEATERS_FILE_NAME = "pbpq-swnu.json"

### Data found in a row, source: https://dev.socrata.com/foundry/data.energystar.gov/pbpq-swnu
@dataclass
class WaterHeater:
    pd_id: int
    brand_name: str
    model_name: str
    model_number: str
    tax_credit_eligible: str

    @classmethod
    def from_dict(cls, d: dict):
        return WaterHeater(d['pd_id'], d['brand_name'], d['model_name'], d['model_number'], d['tax_credit_eligible'])

    def __str__(self):
        return f"{self.brand_name} - {self.model_name} - {self.model_number}"

def get_energystar_data():
    # List of rows of water heaters
    raw_data = requests.get(ENERGY_STAR_API_BASE_URL + WATER_HEATERS_FILE_NAME).json()
    structured_data = [WaterHeater.from_dict(row) for row in raw_data]
    print(f"{len(structured_data)} structured Energy Star water heaters")
    return structured_data

