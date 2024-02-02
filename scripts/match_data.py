from home_depot.tank_water_heaters import get_tank_water_heaters
from home_depot.all_water_heaters_energy_star import get_all_products
from energy_star.water_heaters import get_energystar_data

# Energy Star data
energy_star_data = get_energystar_data()

# Home Depot data
products = get_all_products()

# Convert these into k-v map keyed on manufacturer and model name
model_number_keyed_data = {}
for e_heater in energy_star_data:
    model_number_keyed_data[e_heater.model_number] = e_heater

# Try to match up the Home Depot data with Energy Star
hits = 0
for product in products:
    model_number = product['identifiers']['modelNumber']
    if model_number in model_number_keyed_data:
        hits += 1
        print(str(model_number_keyed_data[model_number]))
        print(f"Cost: {product['pricing']['value']}")

print(f"{hits} number of matches")