from dataclasses import asdict
import json
import typer
from home_depot.all_water_heaters_energy_star import get_all_products
from energy_star.water_heaters import get_energystar_data
from model.sku_data import sku_data_payload

from datetime import datetime


def match_data():
    # Energy Star data
    energy_star_data = get_energystar_data()
    # Home Depot data
    products = get_all_products()
    # Convert these into k-v map keyed on manufacturer and model name
    model_number_keyed_data = {}
    for e_heater in energy_star_data:
        model_number_keyed_data[e_heater.model_number] = e_heater
    all_data=[]
    # Try to match up the Home Depot data with Energy Star
    hits = 0
    for product in products:
        model_number = product['identifiers']['modelNumber']
        if model_number in model_number_keyed_data:
            hits += 1
            energy_star_row = model_number_keyed_data[model_number]
            print(energy_star_row)
            print(f"Cost: {product['pricing']['value']}")
            all_data.append({
                "energy_star_data": asdict(energy_star_row),
                "raw_home_depot_product_response": product,
                "energy_star_id": energy_star_row.pd_id,
                "model_number": model_number,
                "sku_data": asdict(sku_data_payload(energy_star_row, product)),
            })

    print(f"{hits} number of matches")
    return all_data

# Function to write appliance data to a file
def dump_data_to_file(all_data:list):
    file_name = datetime.now().strftime("%Y_%m_%d-%I_%M_%S")
    with open(f"./data/{file_name}.json", 'w') as f:
        payload = {
            "data": all_data
        }
        f.write(json.dumps(payload))

## CLI entrypoint
def main(dump_data:bool = False):
    all_data = match_data()
    if dump_data:
        dump_data_to_file(all_data)

# Get CLI for free
if __name__=="__main__":
    typer.run(main)

