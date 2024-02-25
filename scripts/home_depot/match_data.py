from collections import defaultdict
from dataclasses import asdict
from home_depot.all_water_heaters_energy_star import get_all_products
from energy_star.water_heaters import get_energystar_data
from model.sku_data import sku_data_payload

import re

## Deprecated functions used when matching Home Depot API data to Energy Star data
## Ignoring Home Depot data for now, but saving this in case we need to resurrect it


def match_data_with_regexes():
    energy_star_data = regex_match_data()
    # Home Depot data
    products = get_all_products()
    matched = 0
    for product in products:
        model_number = product["identifiers"]["modelNumber"]
        for regex in energy_star_data:
            if regex.match(model_number):
                matched += 1
                print(f"Found a match: {model_number} - {regex}")

    print(f"Matched: {matched}")


def generate_regex_pattern(input_string):
    # Replace "*" with a regex pattern to match any characters (except newline) between them,
    # without necessarily requiring the string to end with "1"
    regex_pattern = input_string.replace("*", r".*?") + r"(?:1|$)"
    return regex_pattern


def regex_match_data():
    energy_star_data = get_energystar_data()
    with_star = 0
    without_star = 0
    all_regexes = []

    for e_heater in energy_star_data:
        model_number = e_heater.model_number
        if "*" in model_number:
            with_star += 1
            regex = re.compile(generate_regex_pattern(model_number))
            all_regexes.append(regex)
        else:
            without_star += 1
            escaped_model_number = re.escape(model_number)
            # Create regex pattern to match exactly the input string
            regex = f"^{escaped_model_number}$"
            all_regexes.append(re.compile(regex))

    return all_regexes


def match_data():
    # Energy Star data
    energy_star_data = get_energystar_data()
    # Home Depot data
    products = get_all_products()
    d = defaultdict(int)
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
        d[model_number] += 1
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

    return all_data
