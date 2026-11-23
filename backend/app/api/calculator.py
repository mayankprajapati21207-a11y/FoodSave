from fastapi import APIRouter
from app.schemas.schemas import WasteCalculatorInput, WasteCalculatorResult

router = APIRouter(prefix="/calculator", tags=["Smart Calculator"])

FACTORS = {
    "cooked_meals": {"co2_per_kg": 2.8, "water_l_per_kg": 3200, "cost_per_kg": 220.0},
    "bakery": {"co2_per_kg": 1.9, "water_l_per_kg": 1600, "cost_per_kg": 140.0},
    "fresh_produce": {"co2_per_kg": 1.4, "water_l_per_kg": 950, "cost_per_kg": 60.0},
    "dairy": {"co2_per_kg": 3.2, "water_l_per_kg": 3800, "cost_per_kg": 240.0},
    "mixed": {"co2_per_kg": 2.5, "water_l_per_kg": 2400, "cost_per_kg": 160.0},
}

@router.post("/calculate", response_model=WasteCalculatorResult)
def calculate_waste_impact(data: WasteCalculatorInput):
    factor = FACTORS.get(data.waste_type, FACTORS["mixed"])
    total_waste_kg = round(data.quantity_kg_per_week * data.weeks, 2)
    
    co2_kg = round(total_waste_kg * factor["co2_per_kg"], 2)
    water_liters = round(total_waste_kg * factor["water_l_per_kg"], 1)
    financial_loss = round(total_waste_kg * factor["cost_per_kg"], 2)
    meals_saved = int(total_waste_kg / 0.4) # avg meal = 400 grams
    trees_equivalent = round(co2_kg / 21.77, 1) # one tree absorbs ~22kg CO2/year

    return {
        "annual_waste_kg": total_waste_kg,
        "annual_co2_kg": co2_kg,
        "annual_water_liters": water_liters,
        "annual_financial_loss": financial_loss,
        "potential_meals_saved": meals_saved,
        "trees_equivalent": trees_equivalent
    }
