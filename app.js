//Instance variables
import API_KEY from './apikey.js';

const KELVIN = 273;
//API Key
const key = API_KEY;

//Select elements for OneCall / 5 Day forcast
const locationElement = document.querySelector('.forecast');

//Weather and Forecast objects that takes data from API
const onecall = {};
const forecast = {};

//Convert celsius to fahrenheit 
function celsiusToFahrenheit(temperature) {
    if (temperature < 0) {
        throw "Fahrenheit cannot be less than 0";
    } else {
        return (temperature * 9 / 5) + 32;
    }
}

//Switch back and forth from Celsius to Fahrenheit when user clicks on button
function convertBetweenImperialAndMetric() {
    let metric = document.querySelector(".convertButton");

    if (metric.innerHTML === "Convert to imperial") {
        metric.innerHTML = "Convert to metric";
        document.querySelector('.rowOne').innerHTML = `<img class="hourlyweather-icon" src="icons/${onecall.icon}.png"/><br><div id="temperature">${celsiusToFahrenheit(onecall.temp).toFixed(0)} ° <span>F</span><br></div>${onecall.description}<br><br>Night: ${celsiusToFahrenheit(onecall.tempNight).toFixed(0)} ° <span>F</span>`;
        document.querySelector('#rowThree').innerHTML = `Feels like: ${celsiusToFahrenheit(onecall.feelsLike).toFixed(0)} ° <span>F</span><br><br>Dew point: ${celsiusToFahrenheit(onecall.dewpoint).toFixed(0)} ° <span>F</span><br><br>Humidity: ${onecall.humidity} %`;
        document.querySelector('#rowFour').innerHTML = `Cloudiness: ${onecall.clouds} %<br><br>Visibility: ${convertKMhToMPh(onecall.visibility).toFixed(0)} miles<br><br>Wind speed: ${convertKMhToMPhTwo(onecall.windspeed).toFixed(1)} mp/h`;
        for (let i = 0; i < 12; i++) {
            document.querySelector('#temp' + i).innerHTML = `${celsiusToFahrenheit(onecall.tempOne[i]).toFixed(0)} ° <span>F</span>`;
            document.querySelector('.wind' + i).innerHTML = `${convertKMhToMPhTwo(onecall.windOne[i]).toFixed(2)} mph</td>`;
        }


    } else {
        metric.innerHTML = "Convert to imperial";
        document.querySelector('.rowOne').innerHTML = `<img class="hourlyweather-icon" src="icons/${onecall.icon}.png"/><br><div id="temperature">${Math.round((onecall.temp))} ° <span>C</span><br></div>${onecall.description}<br><br>Night: ${(Math.round(onecall.tempNight))} ° <span>C</span>`;
        document.querySelector('#rowThree').innerHTML = `Feels like: ${Math.round(onecall.feelsLike)} ° <span>C</span><br><br>Dew point: ${Math.round(onecall.dewpoint)} ° <span>C</span><br><br>Humidity: ${onecall.humidity} %`;
        document.querySelector('#rowFour').innerHTML = `Cloudiness: ${onecall.clouds} %<br><br>Visibility: ${convertMetersToKiloMeters(onecall.visibility).toFixed(0)} km<br><br>Wind speed: ${onecall.windspeed} km/h`
        for (let i = 0; i < 12; i++) {
            document.querySelector('#temp' + i).innerHTML = `${(onecall.tempOne[i]).toFixed(0)} ° <span>C</span>`;
            document.querySelector('.wind' + i).innerHTML = `${onecall.windOne[i].toFixed(1)} km/h</td>`;
        }
    }
}

//Convert Unix UTC to PST   
function convertUTCToPST(time) {
    let dt = new Date(time * 1000);
    let year = dt.getFullYear();
    let month = dt.getMonth();
    let date = dt.getDay();
    let day = dt.getDate();
    let hours = dt.getHours();
    let dayArray = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
    let monthArray = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
    let minutes = "0" + dt.getMinutes();
    return hours + ':' + minutes.substr(-2) + " " + "PDT" + " " + dayArray[date] + " " + [day] + " " + monthArray[month] + " " + year;
}

//Second Unix UTC to PST conversion for lower table
function convertUTCToPSTTwo(time) {
    let dt = new Date(time * 1000);
    let day = dt.getDay();
    let dayArray = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
    let date = dt.getDate();
    let month = dt.getMonth();
    let monthArray = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
    let hours = dt.getHours();
    let minutes = "0" + dt.getMinutes();
    return dayArray[day] + " " + date + " " + monthArray[month] + " " + hours + ':' + minutes.substr(-2);
}

//Convert Unix UTC to PST to return hours and minutes
function convertUTCSunSetSunRise(time) {
    let dt = new Date(time * 1000);
    let hours = dt.getHours();
    let minutes = "0" + dt.getMinutes();
    return hours + ':' + minutes.substr(-2);
}

//Convert meters to kilometers
function convertMetersToKiloMeters(meters) {
    if (meters < 0) {
        throw "Meters cannot be less than 0";
    } else {
        return (meters / 1000);
    }
}

//Add a decimal point to a number
function insertDecimal(number) {
    if (number != null) {
        return (number / 10).toFixed(1);
    } else {
        throw "Cannot be null";
    }
}

//Convert KM/H to MP/H
function convertKMhToMPh(speed) {
    if (speed < 0) {
        throw "Speed cannot be less than 0";
    } else {
        return ((speed / 1.609) / 1000);
    }
}

function convertKMhToMPhTwo(speed) {
    if (speed < 0) {
        throw "Speed cannot be less than 0";
    } else {
        return (speed / 1.609);
    }
}

//Check for geolocation support in browser
if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Browser does not support geolocation services</p>";
}

//Set user's position
function setPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    getWeather(latitude, longitude);
    getHourlyForecast(latitude, longitude);
    getFiveDayForecast(latitude, longitude);
}

//Show error if there is a problem with geolocation services
function showError(error) {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

//Get current weather data using the API
function getWeather(latitude, longitude) {
    let api = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${key}`;

    fetch(api)
        .then(function (response) {
            let data = response.json();
            return data;
        })
        .then(function (data) {
            let table = document.querySelector('.weather-data');

            onecall.icon = [];
            onecall.temp = [];
            onecall.description = [];
            onecall.humidity = [];
            onecall.clouds = [];
            onecall.tempNight = [];
            onecall.feelsLike = [];
            onecall.dewpoint = [];
            onecall.visibility = [];
            onecall.windspeed = [];

            onecall.icon.push(data.current.weather[0].icon);
            onecall.temp.push(data.current.temp - KELVIN);
            onecall.description.push(data.current.weather[0].main);
            onecall.tempNight.push(data.daily[0].temp.night - KELVIN);
            onecall.humidity.push(data.current.humidity);
            onecall.feelsLike.push(data.daily[0].feels_like.day - KELVIN);
            onecall.dewpoint.push(data.daily[0].dew_point - KELVIN);
            onecall.clouds.push(data.current.clouds);
            onecall.visibility.push(data.current.visibility);
            onecall.windspeed.push(data.current.wind_speed);


            let row = `
          <table>

          <tbody>
          <tr>
              <td rowspan="3" id="rowOne" style="text-align:center;" class=${"rowOne"}><img class="hourlyweather-icon" src="icons/${data.current.weather[0].icon}.png"/><br><div id="temperature">${(data.current.temp - KELVIN).toFixed(0)} ° <span>C</span><br></div>${data.current.weather[0].main}<br><br>Night: ${(data.daily[0].temp.night - KELVIN).toFixed(0)} ° <span>C</span></td>
              <td colspan="3" id="rowTwo">Date:&nbsp;${convertUTCToPST(data.current.dt)}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Sunrise: ${convertUTCSunSetSunRise(data.current.sunrise)}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Sunset: ${convertUTCSunSetSunRise(data.current.sunset)}</td>
              
          </tr>
          <tr>
              <td rowspan="2" class="weather-details" style="text-align:center;">Condition: ${data.current.weather[0].description}<br><br>Pressure: ${insertDecimal(data.daily[0].pressure)} kPa<br><br>UV Index: ${data.daily[0].uvi}</td>
              <td rowspan="2" class="weather-details" style="text-align:center;" id="rowThree">Feels like: ${(data.daily[0].feels_like.day - KELVIN).toFixed(0)} ° <span>C</span><br><br>Dew point: ${(data.daily[0].dew_point - KELVIN).toFixed(0)} ° <span>C</span><br><br>Humidity: ${data.current.humidity} %</td>
              <td rowspan="2" class="weather-details" style="text-align:center;" id="rowFour">Cloudiness: ${data.current.clouds} %<br><br>Visibility: ${convertMetersToKiloMeters(data.current.visibility).toFixed(0)} km<br><br>Wind speed: ${data.current.wind_speed} km/h</td>
              
          </tr>
          </tbody>
          </table>`;

            table.innerHTML += row;
        });
}

//Get the 5 day weather  API to get location - other api doesn't support location
function getFiveDayForecast(latitude, longitude) {
    let api = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${key}`;

    fetch(api)
        .then(function (response) {
            let data = response.json();
            return data;
        })
        .then(function (data) {
            locationElement.innerHTML = `Current Weather Forecast - ${data.city.name}, ${data.city.country}`;
        });
}
//Collapse the button to reveal the 12 hour weather data
function tableCollapse() {
    let collapse = document.getElementsByClassName("collapsible");
    let collapseButton = document.querySelector("#caret");

    for (let i = 0; i < collapse.length; i++) {
        collapse[i].addEventListener("click", function () {
            this.classList.toggle("active");
            let content = this.nextElementSibling;
            if (content.style.display === "block" && content.style.maxHeight) {
                content.style.display = "none";
                content.style.maxHeight = null;
                collapseButton.innerHTML = "<b>▶ View 12 hour forecast</b>";
            } else {
                content.style.display = "block";
                content.style.maxHeight = content.scrollHeight + "px";
                collapseButton.innerHTML = "<b>▼ View 12 hour forecast</b>";
            }
        });
    }
}
tableCollapse();

//Display the hourly data when the collapsible button is pressed
function getHourlyForecast(latitude, longitude) {
    let api = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${key}`;

    fetch(api)
        .then(function (response) {
            let data = response.json();
            return data;
        })
        .then(function (data) {
            let tableHeader = document.querySelector('.table-body');

            onecall.tempOne = [];
            onecall.windOne = [];

            for (let i = 0; i < 12; i++) {

                onecall.tempOne.push(data.hourly[i].temp - KELVIN);
                onecall.windOne.push(data.hourly[i].wind_speed);
            }

            for (let i = 0; i < 12; i++) {
                let rowOne = `<tr class="colorRowOne">                        
                    <td class="time">${convertUTCToPSTTwo(data.hourly[i].dt)}</td>
                    <td class= "temperature" id=${"temp" + i} style="text-align:center;">${(data.hourly[i].temp - KELVIN).toFixed(0)} ° <span>C</span></td>
                    <td class="conditions"><img class="hourlyweather-iconOne" src="icons/${data.hourly[i].weather[0].icon}.png"/><div id="text-description">${data.hourly[i].weather[0].description}</div></td>
                    <td class= "humidity" style="text-align:center;">${data.hourly[i].humidity} %</td>
                    <td class= ${"wind" + i} style="text-align:center;">${data.hourly[i].wind_speed} km/h</td>
                   </tr>`;
                tableHeader.innerHTML += rowOne;
            }
        });
}




