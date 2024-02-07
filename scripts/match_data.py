from collections import defaultdict
from dataclasses import asdict
import json
import shutil
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
    all_data = []
    # Try to match up the Home Depot data with Energy Star
    hits = 0
    seen = defaultdict(int)
    for product in products:
        model_number = product["identifiers"]["modelNumber"]
        if model_number in model_number_keyed_data:
            seen[model_number] += 1
            hits += 1
            energy_star_row = model_number_keyed_data[model_number]
            if seen[model_number] == 1:
                all_data.append(
                    {
                        "energy_star_data": asdict(energy_star_row),
                        "raw_home_depot_product_response": product,
                        "energy_star_id": energy_star_row.pd_id,
                        "model_number": model_number,
                        "sku_data": asdict(sku_data_payload(energy_star_row, product)),
                    }
                )

    print(f"{hits} number of matches")
    print(f"Counts: {seen}")
    return all_data


# Function to write appliance data to a file
def dump_data_to_file(all_data: list):
    file_name = datetime.now().strftime("%Y_%m_%d-%I_%M_%S")
    file_path = f"./data/{file_name}.json"
    with open(file_path, "w") as f:
        payload = {"data": all_data, "metadata": {"time_generated": file_name}}
        f.write(json.dumps(payload))
    return file_path


## CLI entrypoint
def main(dump_data: bool = False, promote_to_app: bool = False):
    all_data = match_data()
    if dump_data:
        file_path = dump_data_to_file(all_data)
    # If set, promote this to live copy living in the Next app
    if promote_to_app:
        path_to_next_data_dir = "../web/green_save/src/app/api/data/products.json"
        shutil.copy(file_path, path_to_next_data_dir)


# Get CLI for free
if __name__ == "__main__":
    typer.run(main)
