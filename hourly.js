//Instance variables
import API_KEY from './apikey.js';
const KELVIN = 273;
//API Key
const key = API_KEY;

//Select elements for 5 day / 3 hour forecast
const convertButtonElement = document.querySelector('.convertButton');
const locationElement = document.querySelector('.forecast');
const hourlyTempElement = document.querySelector('.temperature');
const windElement = document.querySelector('.wind');

//Forecast object that takes data from API
const forecast = {};
forecast.temperature = {
    unit: "celsius"
}
forecast.humidity = {
    unit: "celsius"
}

//Convert celsius to fahrenheit 
function celsiusToFahrenheit(temperature) {
    if (temperature < 0) {
        throw "Fahrenheit cannot be less than 0";
    } else {
        return (temperature * 9 / 5) + 32;
    }
}

//Convert KM/H to MP/H
function convertMetersToKiloMeters(meters) {
    if (meters < 0) {
        throw "Meters cannot be less than 0";
    } else {
        return (meters / 1000);
    }
}
function convertKMhToMPh(speed) {
    if (speed < 0) {
        throw "Speed cannot be less than 0";
    } else {
        return (speed / 1.609).toFixed(2);
    }
}

//Switch back and forth from Celsius to Fahrenheit, and KM/HR to MP/HR when user clicks on element
function convertBetweenImperialAndMetric() {
    let metric = document.querySelector(".convertButton");

    if (metric.innerHTML === "Convert to imperial") {
        metric.innerHTML = "Convert to metric";
        for (let i = 0; i < 16; i++) {
            document.querySelector('.temperature' + i).innerHTML = `${celsiusToFahrenheit(forecast.temp[i]).toFixed(0)} ° <span>F</span>`;
            document.querySelector('.wind' + i).innerHTML = `${convertKMhToMPh(forecast.wind[i])} mph`;
        }

    } else {
        metric.innerHTML = "Convert to imperial";
        for (let i = 0; i < 16; i++) {
            document.querySelector('.temperature' + i).innerHTML = `${forecast.temp[i].toFixed(0)}° <span>C</span>`;
            document.querySelector('.wind' + i).innerHTML = `${forecast.wind[i]} km/h`;
        }
    }
}

window.convertBetweenImperialAndMetric= convertBetweenImperialAndMetric;


//Convert Unix UTC to PST   
function convertUTCToPST(time) {
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

//Get the today's day in Date, Day, Month format
function displayDate() {
    let myDate = new Date();
    let year = myDate.getFullYear();
    if (year < 1000) {
        year += 1900;
    }
    let date = myDate.getDay();
    let month = myDate.getMonth();
    let day = myDate.getDate();
    let dayArray = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
    let monthArray = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");

    let fullDate = document.getElementById("dateone");
    fullDate.textContent = "" + dayArray[date] + " " + day + " " + monthArray[month] + " " + year;
    fullDate.innerText = "" + dayArray[date] + " " + day + " " + monthArray[month] + " " + year;
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


    getFiveDayforecast(latitude, longitude);
}

//Show error if there is a problem with geolocation services
function showError(error) {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`
}

//Get 5 day / 3 hour data using geolocation
function getFiveDayforecast(latitude, longitude) {
    let api = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${key}`;

    fetch(api)
        .then(function (response) {
            let data = response.json();
            return data;
        })
        .then(function (data) {
            let table = document.getElementById("main-table");
            forecast.city = data.city.name;
            forecast.country = data.city.country;

            forecast.temp = [];
            forecast.wind = [];

            for (let i = 0; i < 16; i++) {

                forecast.temp.push(data.list[i].main.temp - KELVIN);
                forecast.wind.push(data.list[i].wind.speed);
            }

            for (let i = 0; i < 16; i++) {
                let row = `<tr class="colorRowOne">                        
                    <td>${convertUTCToPST(data.list[i].dt)}</td>
                    <td class= ${"temperature" + i} style="text-align:center;">${(data.list[i].main.temp - KELVIN).toFixed(0)} ° <span>C</span></td>
                    <td><img class="hourlyweather-icon" src="icons/${data.list[i].weather[0].icon}.png"/><div id="text-description">${data.list[i].weather[0].description}</div></td>
                    <td class= "humidity">${data.list[i].main.humidity} %</td>
                    <td class= ${"wind" + i} style="text-align:center;">${data.list[i].wind.speed} km/h</td>
                   </tr>`;

                table.innerHTML += row;
            }
            locationElement.innerHTML = `48 Hour Forecast - ${forecast.city}, ${forecast.country}`;
        });
}




