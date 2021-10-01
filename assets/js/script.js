// APi Key for OPENWEATHER
var apiKey = "54398bbe47b31861316a36fe21d00c0d";

// Variables
var searchFormEl = document.querySelector("#search-form");
var cityInput = document.querySelector("#city-input");
var searchedCitiesBtn = document.querySelector("#searched-cities-btn");
var cityWeatherInfo = document.querySelector("#city-weather-info");
var forecastInfo = document.querySelector("#city-forecast-container");

// Searched Cities Array
var searchedCitiesArr = [];

// City Weather Function
function searchCity(event) {
  event.preventDefault();
  var city = cityInput.value;
  getCurrentWeather(city);
  getForecastWeather(city);
  searchedCitiesArr.unshift(city);
  cityInput.value = "";
  saveLocalStorageData();
  addSearchedCity(city);
}

// save input data in local storage
function saveLocalStorageData() {
  localStorage.setItem("searched-cities", searchedCitiesArr);
}

function addSearchedCity(cityName) {
  var btnEl = document.createElement("button");
  btnEl.setAttribute("class", "list-group-item list-group-item-action");
  btnEl.setAttribute("id", cityName);
  btnEl.textContent = cityName;
  searchedCitiesBtn.prepend(btnEl);
}

function getCurrentWeather(city) {
  var currentUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=imperial&appid=" +
    apiKey;

  //   TEMP, WIND, HUMIDITY
  fetch(currentUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      cityWeatherInfo.textContent = "";
      var currentDate = new Date(data.dt * 1000);
      var currentDateString = "(" + currentDate.toLocaleDateString() + ")";
      var createCityName = document.createElement("h3");
      var imgWeather = document.createElement("img");
      imgWeather.setAttribute(
        "src",
        "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png"
      );
      var createCityTemp = document.createElement("p");
      var createCityWind = document.createElement("p");
      var createCityHumidity = document.createElement("p");

      createCityName.append(imgWeather);
      createCityTemp.textContent =
        "Temp: " + Math.floor(data.main.temp) + " °F";
      createCityWind.textContent = "Wind: " + data.wind.speed + " mph";
      createCityHumidity.textContent =
        "Humidity: " + Math.floor(data.main.humidity) + " %";

      cityWeatherInfo.append(createCityName);
      cityWeatherInfo.append(createCityTemp);
      cityWeatherInfo.append(createCityWind);
      cityWeatherInfo.append(createCityHumidity);

      getUvi(data.coord.lat, data.coord.lon);
    });
}


// UV INDEX
function getUvi(latitude, longitude) {
  var currentUviUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    latitude +
    "&lon=" +
    longitude +
    "&units=imperial&appid=" +
    apiKey;

  fetch(currentUviUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var uviData = data.current.uvi;

      var createCityUvi = document.createElement("p");
      createCityUvi.textContent = "UV Index: ";
      var uviDisplay = document.createElement("span");
      uviDisplay.textContent = uviData;
      createCityUvi.append(uviDisplay);
      uviDisplay.classList.add("rounded");
      uviDisplay.classList.add("px-2");
      uviDisplay.classList.add("text-white");

      if (uviData < 3) {
        uviDisplay.setAttribute("id", "uv-favorable");
      } else if (uviData < 8) {
        uviDisplay.setAttribute("id", "uv-moderate");
      } else if (uviData < 11) {
        uviDisplay.setAttribute("id", "uv-severe");
      } else if (uviData >= 11) {
        uviDisplay.setAttribute("id", "uv-dangerous");
      }
      cityWeatherInfo.append(createCityUvi);
    });
}
// 5 DAY FORECAST
function getForecastWeather(city) {
  var fiveDayUrl =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&units=imperial&appid=" +
    apiKey;
  fetch(fiveDayUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      console.log(typeof data);
      forecastInfo.textContent = "";
      var forecastDateArr = [];
      var forecastImgWeatherArr = [];
      var forecastTempArr = [];
      var forecastWindArr = [];
      var forecastHumidityArr = [];
      var forecastCardArr = [];
      for (let i = 1; i < 6; i++) {
        var forecastCard = document.createElement("div");
        forecastCard.setAttribute(
          "class",
          "col mx-2 p-2 bg-info rounded text-front text-white"
        );
        forecastCardArr.push(forecastCard);
        var forecastDateTime = new Date(data.list[i].dt * 1000);
        var forecastDateTimeString = forecastDateTime.toLocaleDateString();
        var forecastDate = document.createElement("p");
        forecastDate.setAttribute("style", "font-weight:bold");
        forecastDate.textContent = forecastDateTimeString;
        var forecastImgWeather = document.createElement("img");
        forecastImgWeather.setAttribute(
          "src",
          "http://openweathermap.org/img/wn/" +
            data.list[i].weather[0].icon +
            ".png"
        );
        var forecastTemp = document.createElement("p");
        forecastTemp.textContent =
          "Temp: " + Math.floor(data.list[i].main.temp) + " °F";
        var forecastWind = document.createElement("p");
        forecastWind.textContent = "Wind: " + data.list[i].wind.speed + " mph";
        var forecastHumidity = document.createElement("p");
        forecastHumidity.textContent =
          "Humidity: " + Math.floor(data.list[i].main.humidity) + " %";
        forecastDateArr.push(forecastDate);
        forecastImgWeatherArr.push(forecastImgWeather);
        forecastTempArr.push(forecastTemp);
        forecastWindArr.push(forecastWind);
        forecastHumidityArr.push(forecastHumidity);
      }
      for (let i = 0; i < forecastCardArr.length; i++) {
        forecastCardArr[i].append(forecastDateArr[i]);
        forecastCardArr[i].append(forecastImgWeatherArr[i]);
        forecastCardArr[i].append(forecastTempArr[i]);
        forecastCardArr[i].append(forecastWindArr[i]);
        forecastCardArr[i].append(forecastHumidityArr[i]);
      }
      for (let i = 0; i < forecastCardArr.length; i++) {
        $("#city-forecast-container").append(forecastCardArr[i]);
      }
    });
}
// DISPLAYS WEATHER
function displayPreviousCities(event) {
  var element = event.target;
  var previousCity = localStorage.getItem("searched-cities");
  var previousCityArr = previousCity.split(",");
  if (previousCityArr.includes(element.getAttribute("id"))) {
    var city = element.getAttribute("id");
    getCurrentWeather(city);
    getForecastWeather(city);
  }
}
searchFormEl.addEventListener("submit", searchCity);
searchedCitiesBtn.addEventListener("click", displayPreviousCities);
