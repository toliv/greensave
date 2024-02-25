from dataclasses import asdict
import json
import shutil
import typer
from energy_star.water_heaters import get_energystar_data, WaterHeater

from typing import List

from datetime import datetime


# Function to write appliance data to a file
def write_data_to_file(all_data):
    # First convert data to json
    file_name = datetime.now().strftime("%Y_%m_%d-%I_%M_%S")
    file_path = f"./data/{file_name}.json"
    with open(file_path, "w") as f:
        payload = {"data": all_data, "metadata": {"time_generated": file_name}}
        f.write(json.dumps(payload))
    return file_path


def generate_energystar_data_set():
    # Fetch data set from Energy Star data and extract relevant fields
    energy_star_data = get_energystar_data()
    print(energy_star_data[0])
    print(f"{len(energy_star_data)} water heaters found")
    return energy_star_data


## CLI entrypoint
def main(
    write_to_file: bool = False,
    promote_to_app: bool = False,
):
    all_data = generate_energystar_data_set()
    json_data = [asdict(water_heater) for water_heater in all_data]
    if write_to_file:
        file_path = write_data_to_file(json_data)
        print(f"New file stored {file_path}")
    if promote_to_app:
        path_to_next_data_dir = "../web/green_save/src/app/api/data/products.json"
        shutil.copy(file_path, path_to_next_data_dir)
        print("Promoted data file to live environment")


# Get CLI for free
if __name__ == "__main__":
    typer.run(main)
