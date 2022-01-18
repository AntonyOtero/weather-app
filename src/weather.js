
const search_input = document.querySelector(".search-input");
const search_enter = document.querySelector(".search-btn");
const temp = document.querySelector(".temp");
const condition = document.querySelector(".condition");
const feels_like = document.querySelector(".feels-like");
const icon = document.querySelector("img");

let G_CITY;
let G_COUNTRY;

const formatTemp = (temp, unit) => {
  const unit_sym = (unit == "imperial") ? `°F` : `°C`;
  const trimmed_temp = Math.round(temp);

  return trimmed_temp + unit_sym;
}

const formatCityName = (city_name) => {
  if (city_name.indexOf != -1) {
    let wordsArr = city_name.split(" ");
    return wordsArr.join("+");
  }
  return city_name;
}

async function getWeather(city_name, country_code, units) {
  const API_KEY = 'd70ad7a8d6049fc9dccd55e8dc57ff24';
  const URL = `https://api.openweathermap.org/data/2.5/weather?q=${formatCityName(city_name)},${country_code}&units=${units}&appid=${API_KEY}`;

  const response = await fetch(URL);
  const weatherData = await response.json();
  
  return weatherData;
}

async function getRequired(city_name, country_code, units) {
  const weatherData = await getWeather(city_name, country_code, units);
  const requiredData = {
    city: weatherData.name,
    country: weatherData.sys.country,
    condition: weatherData.weather[0].main,
    description: weatherData.weather[0].description,
    icon: weatherData.weather[0].icon,
    temp: weatherData.main.temp,
    feels_like: weatherData.main.feels_like
  };

  return requiredData;
}

async function displayWeather(city_name="New York", country_code="US", units="imperial") {
  const requiredData = await getRequired(city_name, country_code, units);
  const icon_code = requiredData.icon;

  temp.textContent = formatTemp(requiredData.temp, units);
  condition.textContent = requiredData.condition;
  feels_like.textContent = `Feels ` + formatTemp(requiredData.feels_like);
  icon.src = `http://openweathermap.org/img/wn/${icon_code}@2x.png`;

  G_CITY = city_name;
  G_COUNTRY = country_code;
}

search_input.value = "";
displayWeather();

temp.addEventListener("click", function() {
  let displayedTemp = this.textContent;
  let unitSym = displayedTemp.split('°')[1];
  (unitSym == 'F') ?
    displayWeather(G_CITY, G_COUNTRY, "metric") :
    displayWeather(G_CITY, G_COUNTRY);
});

search_enter.addEventListener("click", function() {
  if (search_input.value) {
    let inputArr = search_input.value.split(", ");
    let city = formatCityName(inputArr[0]);
    let country = inputArr[1];

    displayWeather(city, country);
  } 
  else {
    alert("A value must be entered formatted like the following example:\nLondon, GB");
  }
});