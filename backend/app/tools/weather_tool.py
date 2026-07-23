from pydantic import BaseModel, Field
from langchain_core.tools import tool

class WeatherInput(BaseModel):
    location: str = Field(..., description="City or enterprise office location to check weather for", example="San Francisco, CA")

class WeatherOutput(BaseModel):
    location: str
    temperature_celsius: float
    temperature_fahrenheit: float
    condition: str
    humidity: int
    wind_speed_kmh: float

@tool("get_weather", args_schema=WeatherInput)
def weather_tool(location: str) -> str:
    """
    Checks current weather and climate conditions for corporate offices and remote worker locations.
    """
    loc_lower = location.lower()
    temp_c = 21.5 if "san francisco" in loc_lower or "ca" in loc_lower else (28.0 if "austin" in loc_lower else 18.0)
    
    output = WeatherOutput(
        location=location,
        temperature_celsius=temp_c,
        temperature_fahrenheit=round(temp_c * 9/5 + 32, 1),
        condition="Partly Cloudy",
        humidity=58,
        wind_speed_kmh=12.4
    )
    return output.model_dump_json()
