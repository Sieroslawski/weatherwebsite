//Instance variables
import API_KEY from './apikey.js';
const KELVIN = 273;
//API Key
const key = API_KEY;

//onecall object
const onecall = {};


//Select elements for OneCall / 5 Day forcast
const locationElement = document.querySelector('.forecast');
const timeOfForecastedDataElement = document.querySelector('#caret');

//Check for geolocation support in browser
if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Browser does not support geolocation services</p>";
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
function convertKMhToMPh(speed) {
    if (speed < 0) {
        throw "Speed cannot be less than 0";
    } else {
        return (speed / 1.609).toFixed(2);
    }
}

//Set user's position
function setPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    getWeather(latitude, longitude);
    getFiveDayforecast(latitude, longitude);
    getIssuedForecast(latitude, longitude);
}

//Switch back and forth from Celsius to Fahrenheit
function convertBetweenImperialAndMetric() {
    let metric = document.querySelector(".convertButton");

    if (metric.innerHTML === "Convert to imperial") {
        metric.innerHTML = "Convert to metric";

        document.querySelector('.day1').innerHTML = `<img class="hourlyweather-icon" src="icons/${onecall.weather[0]}.png"/><br>${celsiusToFahrenheit(onecall.temp[0]).toFixed(0)} ° <span>F</span><br><br>Humidity: ${onecall.humidity[0]}%<br>${onecall.description[0]}</td>`;
        document.querySelector('.day2').innerHTML = `<img class="hourlyweather-icon" src="icons/${onecall.weather[1]}.png"/><br>${celsiusToFahrenheit(onecall.temp[1]).toFixed(0)} ° <span>F</span><br><br>Humidity: ${onecall.humidity[1]}%<br>${onecall.description[1]}</td>`;
        document.querySelector('.day3').innerHTML = `<img class="hourlyweather-icon" src="icons/${onecall.weather[2]}.png"/><br>${celsiusToFahrenheit(onecall.temp[2]).toFixed(0)} ° <span>F</span><br><br>Humidity: ${onecall.humidity[2]}%<br>${onecall.description[2]}</td>`;
        document.querySelector('.day4').innerHTML = `<img class="hourlyweather-icon" src="icons/${onecall.weather[3]}.png"/><br>${celsiusToFahrenheit(onecall.temp[3]).toFixed(0)} ° <span>F</span><br><br>Humidity: ${onecall.humidity[3]}%<br>${onecall.description[3]}</td>`;
        document.querySelector('.day5').innerHTML = `<img class="hourlyweather-icon" src="icons/${onecall.weather[4]}.png"/><br>${celsiusToFahrenheit(onecall.temp[4]).toFixed(0)} ° <span>F</span><br><br>Humidity: ${onecall.humidity[4]}%<br>${onecall.description[4]}</td>`;
        document.querySelector('.day6').innerHTML = `<img class="hourlyweather-icon" src="icons/${onecall.weather[5]}.png"/><br>${celsiusToFahrenheit(onecall.temp[5]).toFixed(0)} ° <span>F</span><br><br>Humidity: ${onecall.humidity[5]}%<br>${onecall.description[5]}</td>`;
        document.querySelector('.day7').innerHTML = `<img class="hourlyweather-icon" src="icons/${onecall.weather[6]}.png"/><br>${celsiusToFahrenheit(onecall.temp[6]).toFixed(0)} ° <span>F</span><br><br>Humidity: ${onecall.humidity[6]}%<br>${onecall.description[6]}</td>`;

        document.querySelector('.night1').innerHTML = `<img class="hourlyweather-icon" src="icons-night/${onecall.weather[0]}.png"/><br>${celsiusToFahrenheit(onecall.tempNight[0]).toFixed(0)} ° <span>F</span><br>${onecall.main[0]}</td>`
        document.querySelector('.night2').innerHTML = `<img class="hourlyweather-icon" src="icons-night/${onecall.weather[1]}.png"/><br>${celsiusToFahrenheit(onecall.tempNight[1]).toFixed(0)} ° <span>F</span><br>${onecall.main[1]}</td>`
        document.querySelector('.night3').innerHTML = `<img class="hourlyweather-icon" src="icons-night/${onecall.weather[2]}.png"/><br>${celsiusToFahrenheit(onecall.tempNight[2]).toFixed(0)} ° <span>F</span><br>${onecall.main[2]}</td>`
        document.querySelector('.night4').innerHTML = `<img class="hourlyweather-icon" src="icons-night/${onecall.weather[3]}.png"/><br>${celsiusToFahrenheit(onecall.tempNight[3]).toFixed(0)} ° <span>F</span><br>${onecall.main[3]}</td>`
        document.querySelector('.night5').innerHTML = `<img class="hourlyweather-icon" src="icons-night/${onecall.weather[4]}.png"/><br>${celsiusToFahrenheit(onecall.tempNight[4]).toFixed(0)} ° <span>F</span><br>${onecall.main[4]}</td>`
        document.querySelector('.night6').innerHTML = `<img class="hourlyweather-icon" src="icons-night/${onecall.weather[5]}.png"/><br>${celsiusToFahrenheit(onecall.tempNight[5]).toFixed(0)} ° <span>F</span><br>${onecall.main[5]}</td>`
        document.querySelector('.night7').innerHTML = `<img class="hourlyweather-icon" src="icons-night/${onecall.weather[6]}.png"/><br>${celsiusToFahrenheit(onecall.tempNight[6]).toFixed(0)} ° <span>F</span><br>${onecall.main[6]}</td>`

        document.querySelector('#bottomRowConvert').innerHTML = `${onecall.description[0]}. High of ${celsiusToFahrenheit(onecall.max[0].toFixed(0))} ° <span>F</span>. Humidex of ${celsiusToFahrenheit(onecall.feels[0]).toFixed(0)}. UV index of ${onecall.uvIndex[0]}`
        document.querySelector('#bottomRowConvertTwo').innerHTML = `${onecall.description[0]}. Low of ${celsiusToFahrenheit(onecall.min[0].toFixed(0))} ° <span>F</span>. Humidex of ${celsiusToFahrenheit(onecall.feels[0]).toFixed(0)}. UV index of ${onecall.uvIndex[0]}`;

        for (let i = 0; i < 5; i++) {
            document.querySelector("#forecast" + i).innerHTML = `${onecall.description[i]}. High of ${celsiusToFahrenheit(onecall.max[i].toFixed(0))} ° <span>F</span>.`;
            document.querySelector("#forecastOne" + i).innerHTML = `${onecall.description[i]}. Low of ${celsiusToFahrenheit(onecall.min[i].toFixed(0))} ° <span>F</span>.`;
        }

    } else {
        metric.innerHTML = "Convert to imperial";

        document.querySelector('.day1').innerHTML = `<img class="hourlyweather-icon" src="icons/${onecall.weather[0]}.png"/><br>${(onecall.temp[0]).toFixed(0)} ° <span>C</span><br><br>Humidity: ${onecall.humidity[0]}%<br>${onecall.description[0]}</td>`;
        document.querySelector('.day2').innerHTML = `<img class="hourlyweather-icon" src="icons/${onecall.weather[1]}.png"/><br>${(onecall.temp[1]).toFixed(0)} ° <span>C</span><br><br>Humidity: ${onecall.humidity[1]}%<br>${onecall.description[1]}</td>`;
        document.querySelector('.day3').innerHTML = `<img class="hourlyweather-icon" src="icons/${onecall.weather[2]}.png"/><br>${(onecall.temp[2]).toFixed(0)} ° <span>C</span><br><br>Humidity: ${onecall.humidity[2]}%<br>${onecall.description[2]}</td>`;
        document.querySelector('.day4').innerHTML = `<img class="hourlyweather-icon" src="icons/${onecall.weather[3]}.png"/><br>${(onecall.temp[3]).toFixed(0)} ° <span>C</span><br><br>Humidity: ${onecall.humidity[3]}%<br>${onecall.description[3]}</td>`;
        document.querySelector('.day5').innerHTML = `<img class="hourlyweather-icon" src="icons/${onecall.weather[4]}.png"/><br>${(onecall.temp[4]).toFixed(0)} ° <span>C</span><br><br>Humidity: ${onecall.humidity[4]}%<br>${onecall.description[4]}</td>`;
        document.querySelector('.day6').innerHTML = `<img class="hourlyweather-icon" src="icons/${onecall.weather[5]}.png"/><br>${(onecall.temp[5]).toFixed(0)} ° <span>C</span><br><br>Humidity: ${onecall.humidity[5]}%<br>${onecall.description[5]}</td>`;
        document.querySelector('.day7').innerHTML = `<img class="hourlyweather-icon" src="icons/${onecall.weather[6]}.png"/><br>${(onecall.temp[6]).toFixed(0)} ° <span>C</span><br><br>Humidity: ${onecall.humidity[6]}%<br>${onecall.description[6]}</td>`;

        document.querySelector('.night1').innerHTML = `<img class="hourlyweather-icon" src="icons-night/${onecall.weather[0]}.png"/><br>${(onecall.tempNight[0]).toFixed(0)} ° <span>C</span><br>${onecall.main[0]}</td>`;
        document.querySelector('.night2').innerHTML = `<img class="hourlyweather-icon" src="icons-night/${onecall.weather[1]}.png"/><br>${(onecall.tempNight[1]).toFixed(0)} ° <span>C</span><br>${onecall.main[1]}</td>`;
        document.querySelector('.night3').innerHTML = `<img class="hourlyweather-icon" src="icons-night/${onecall.weather[2]}.png"/><br>${(onecall.tempNight[2]).toFixed(0)} ° <span>C</span><br>${onecall.main[2]}</td>`;
        document.querySelector('.night4').innerHTML = `<img class="hourlyweather-icon" src="icons-night/${onecall.weather[3]}.png"/><br>${(onecall.tempNight[3]).toFixed(0)} ° <span>C</span><br>${onecall.main[3]}</td>`;
        document.querySelector('.night5').innerHTML = `<img class="hourlyweather-icon" src="icons-night/${onecall.weather[4]}.png"/><br>${(onecall.tempNight[4]).toFixed(0)} ° <span>C</span><br>${onecall.main[4]}</td>`;
        document.querySelector('.night6').innerHTML = `<img class="hourlyweather-icon" src="icons-night/${onecall.weather[5]}.png"/><br>${(onecall.tempNight[5]).toFixed(0)} ° <span>C</span><br>${onecall.main[5]}</td>`;
        document.querySelector('.night7').innerHTML = `<img class="hourlyweather-icon" src="icons-night/${onecall.weather[6]}.png"/><br>${(onecall.tempNight[6]).toFixed(0)} ° <span>C</span><br>${onecall.main[6]}</td>`;

        document.querySelector('#bottomRowConvert').innerHTML = `${onecall.description[0]}. High of ${(onecall.max[0].toFixed(0))} ° <span>C</span>. Humidex of ${(onecall.feels[0]).toFixed(0)}. UV index of ${onecall.uvIndex[0]}`
        document.querySelector('#bottomRowConvertTwo').innerHTML = `${onecall.description[0]}. Low of ${(onecall.min[0].toFixed(0))} ° <span>C</span>. Humidex of ${(onecall.feels[0]).toFixed(0)}. UV index of ${onecall.uvIndex[0]}`;

        for (let i = 0; i < 5; i++) {
            document.querySelector("#forecast" + i).innerHTML = `${onecall.description[i]}. High of ${(onecall.max[i].toFixed(0))} ° <span>C</span>.`;
            document.querySelector("#forecastOne" + i).innerHTML = `${onecall.description[i]}. Low of ${(onecall.min[i].toFixed.toFixed(0))} ° <span>C</span>.`;
        }
    }
}

window.convertBetweenImperialAndMetric= convertBetweenImperialAndMetric;

//Convert UTC to date and day
function convertUTCToPST(time) {
    let dt = new Date(time * 1000);
    let day = dt.getDay();
    let dayArray = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
    let date = dt.getDate();
    let month = dt.getMonth();
    let monthArray = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
    return `${dayArray[day]} <br> 
    ${date} ${monthArray[month]}`;
}

function convertUTCToPSTTwo(time) {
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

function convertUTCToPSTThree(time) {
    let dt = new Date(time * 1000);
    let month = dt.getMonth();
    let date = dt.getDay();
    let day = dt.getDate();
    let dayArray = new Array("Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat");
    let monthArray = new Array("Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec");

    return dayArray[date] + "," + " " + [day] + " " + monthArray[month];
}

//Show error
function showError(error) {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`
}

//Get the 7 day weather using the API and iterate into table
function getWeather(latitude, longitude) {
    let api = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${key}`;

    fetch(api)
        .then(function (response) {
            let data = response.json();
            return data;
        })
        .then(function (data) {
            let table = document.getElementById("myTable");

            onecall.weather = []
            onecall.temp = [];
            onecall.humidity = [];
            onecall.description = [];
            onecall.tempNight = [];
            onecall.main = [];
            onecall.dt = [];
            onecall.max = [];
            onecall.min = [];
            onecall.feels = [];
            onecall.uvIndex = [];


            for (let i = 0; i < 7; i++) {

                onecall.weather.push(data.daily[i].weather[0].icon);
                onecall.temp.push(data.daily[i].temp.day - KELVIN);
                onecall.humidity.push(data.daily[i].humidity);
                onecall.description.push(data.daily[i].weather[0].description);
                onecall.tempNight.push(data.daily[i].temp.night - KELVIN);
                onecall.main.push(data.daily[i].weather[0].main);
                onecall.dt.push(data.daily[i].dt);
                onecall.max.push(data.daily[i].temp.max - KELVIN);

                onecall.feels.push(data.daily[i].feels_like.day - KELVIN);
                onecall.uvIndex.push(data.daily[0].uvi);
                onecall.min.push(data.daily[i].temp.min - KELVIN);
            }

            let row = `<table>
	                        <tbody>
		                        <tr style="text-align:center;" class= "dates">
			                    <td>${convertUTCToPST(data.daily[0].dt)}</td>
			                    <td>${convertUTCToPST(data.daily[1].dt)}</td>
			                    <td>${convertUTCToPST(data.daily[2].dt)}</td>
			                    <td>${convertUTCToPST(data.daily[3].dt)}</td>
                                <td>${convertUTCToPST(data.daily[4].dt)}</td>
                                <td>${convertUTCToPST(data.daily[5].dt)}</td>
                                <td>${convertUTCToPST(data.daily[6].dt)}</td>
                                </tr>
                                <tr style="text-align:center;">
                                <td class=${"day1"}><img class="hourlyweather-icon" src="icons/${data.daily[0].weather[0].icon}.png"/><br>${(data.daily[0].temp.day - KELVIN).toFixed(0)} ° <span>C</span><br><br>Humidity: ${data.daily[0].humidity}%<br>${data.daily[0].weather[0].description}</td>
                                <td class=${"day2"}><img class="hourlyweather-icon" src="icons/${data.daily[1].weather[0].icon}.png"/><br>${(data.daily[1].temp.day - KELVIN).toFixed(0)} ° <span>C</span><br><br>Humidity: ${data.daily[1].humidity}%<br>${data.daily[1].weather[0].description}</td>
                                <td class=${"day3"}><img class="hourlyweather-icon" src="icons/${data.daily[2].weather[0].icon}.png"/><br>${(data.daily[2].temp.day - KELVIN).toFixed(0)} ° <span>C</span><br><br>Humidity: ${data.daily[2].humidity}%<br>${data.daily[2].weather[0].description}</td>
                                <td class=${"day4"}><img class="hourlyweather-icon" src="icons/${data.daily[3].weather[0].icon}.png"/><br>${(data.daily[3].temp.day - KELVIN).toFixed(0)} ° <span>C</span><br><br>Humidity: ${data.daily[3].humidity}%<br>${data.daily[3].weather[0].description}</td>
                                <td class=${"day5"}><img class="hourlyweather-icon" src="icons/${data.daily[4].weather[0].icon}.png"/><br>${(data.daily[4].temp.day - KELVIN).toFixed(0)} ° <span>C</span><br><br>Humidity: ${data.daily[4].humidity}%<br>${data.daily[4].weather[0].description}</td>
                                <td class=${"day6"}><img class="hourlyweather-icon" src="icons/${data.daily[5].weather[0].icon}.png"/><br>${(data.daily[5].temp.day - KELVIN).toFixed(0)} ° <span>C</span><br><br>Humidity: ${data.daily[5].humidity}%<br>${data.daily[5].weather[0].description}</td>
                                <td class=${"day7"}><img class="hourlyweather-icon" src="icons/${data.daily[6].weather[0].icon}.png"/><br>${(data.daily[6].temp.day - KELVIN).toFixed(0)} ° <span>C</span><br><br>Humidity: ${data.daily[6].humidity}%<br>${data.daily[6].weather[0].description}</td>
                                </tr>
                                <tr style="text-align:center;" class= "dates">
                                <td>Tonight</td>
                                <td>Night</td>
                                <td>Night</td>
                                <td>Night</td>
                                <td>Night</td>
                                <td>Night</td>
                                <td>Night</td>                              
                                </tr>
                                <tr style="text-align:center;">
                                <td class=${"night1"}><img class="hourlyweather-icon" src="icons-night/${data.daily[0].weather[0].icon}.png"/><br>${(data.daily[0].temp.night - KELVIN).toFixed(0)} ° <span>C</span><br>${data.daily[0].weather[0].main}</td>
                                <td class=${"night2"}><img class="hourlyweather-icon" src="icons-night/${data.daily[1].weather[0].icon}.png"/><br>${(data.daily[1].temp.night - KELVIN).toFixed(0)} ° <span>C</span><br>${data.daily[1].weather[0].main}</td>
                                <td class=${"night3"}><img class="hourlyweather-icon" src="icons-night/${data.daily[2].weather[0].icon}.png"/><br>${(data.daily[2].temp.night - KELVIN).toFixed(0)} ° <span>C</span><br>${data.daily[2].weather[0].main}</td>
                                <td class=${"night4"}><img class="hourlyweather-icon" src="icons-night/${data.daily[3].weather[0].icon}.png"/><br>${(data.daily[3].temp.night - KELVIN).toFixed(0)} ° <span>C</span><br>${data.daily[3].weather[0].main}</td>
                                <td class=${"night5"}><img class="hourlyweather-icon" src="icons-night/${data.daily[4].weather[0].icon}.png"/><br>${(data.daily[4].temp.night - KELVIN).toFixed(0)} ° <span>C</span><br>${data.daily[4].weather[0].main}</td>
                                <td class=${"night6"}><img class="hourlyweather-icon" src="icons-night/${data.daily[5].weather[0].icon}.png"/><br>${(data.daily[5].temp.night - KELVIN).toFixed(0)} ° <span>C</span><br>${data.daily[5].weather[0].main}</td>
                                <td class=${"night7"}><img class="hourlyweather-icon" src="icons-night/${data.daily[6].weather[0].icon}.png"/><br>${(data.daily[6].temp.night - KELVIN).toFixed(0)} ° <span>C</span><br>${data.daily[6].weather[0].main}</td>
                                </tr>     		
	                        </tbody>
                          </table>`;

            table.innerHTML += row;
        });
}

//Get the 5 day weather API to get location - other api doesn't support location
function getFiveDayforecast(latitude, longitude) {
    let api = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${key}`;

    fetch(api)
        .then(function (response) {
            let data = response.json();
            return data;
        })
        .then(function (data) {
            locationElement.innerHTML = `7 Day Forecast - ${data.city.name}, ${data.city.country}`;
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
                collapseButton.innerHTML = `<b>▶ View issued forecast</b>`;
            } else {
                content.style.display = "block";
                content.style.maxHeight = content.scrollHeight + "px";
                collapseButton.innerHTML = `<b>▼ Forecast issued: ${convertUTCToPSTTwo(onecall.dt[0])}</b>`;
            }
        });
    }
}

tableCollapse();


//Display written forecast after tableCollapse() is pressed
function getIssuedForecast(latitude, longitude) {
    let api = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${key}`;

    fetch(api)
        .then(function (response) {
            let data = response.json();
            return data;
        })
        .then(function (data) {
            let table = document.querySelector('.table-body');

            //Written forecast if cloudiness > 30%
            if (data.daily[0].clouds > 30) {
                let sunnyWeather = `<tr class="rowOne">
           <td class="topRow"><a href="hourly.html" class="firstRow">Today</a></td>
           <td class="bottomRow" id= 'bottomRowConvert'>${data.daily[0].weather[0].description}. High of ${(data.daily[0].temp.max - KELVIN).toFixed(0)} ° <span>C</span>. Humidex of ${(data.daily[0].feels_like.day - KELVIN).toFixed(0)}. UV index of ${data.daily[0].uvi}.</td>
           </tr>
           <tr>
           <td class="topRow"><a href="hourly.html" class="firstRow">Tonight</a></td>
           <td class="bottomRow" id= 'bottomRowConvertTwo'>${data.daily[0].weather[0].description}. Low of ${(data.daily[0].temp.min - KELVIN).toFixed(0)} ° <span>C</span>. ${data.daily[0].clouds} percent chance of clouds, with ${data.daily[0].rain} mm of precipitation.</td></td>
           </tr>
           `;
                table.innerHTML += sunnyWeather;
                //Written forecast if cloudiness <= 30%        
            } else if (data.daily[0].clouds <= 30) {
                let rainyWeather = `<tr class="rowOne">
           <td class="topRow"><a href="hourly.html" class="firstRow">Today</a></td>
           <td class="bottomRow" id= 'bottomRowConvert'>${data.daily[0].weather[0].description}. High of ${(data.daily[0].temp.max - KELVIN).toFixed(0)} ° <span>C</span>. Humidex of ${(data.daily[0].feels_like.day - KELVIN).toFixed(0)}. UV index of ${data.daily[0].uvi}.</td>
           </tr>
           <tr>
           <td class="topRow"><a href="hourly.html" class="firstRow">Tonight</a></td>
           <td class="bottomRow" id= 'bottomRowConvertTwo'>${data.daily[0].weather[0].description}. Low of ${(data.daily[0].temp.min - KELVIN).toFixed(0)} ° <span>C</span>.</td></td>
           </tr>
           `;
                table.innerHTML += rainyWeather;
            }

            for (let i = 0; i < 5; i++) {
                //Written forecast if chance of precipitation is > 30%
                if (data.daily[i].pop < 30) {
                    let sunnyWeatherBottom = `<tr class="rowOne">
            <td class="leftRow" id="timeOfDay">${convertUTCToPSTThree(data.daily[i].dt)}</td>
            <td class="bottomRow" id=${"forecast" + i}>${data.daily[i].weather[0].description}. High of ${(data.daily[i].temp.max - KELVIN).toFixed(0)} ° <span>C</span>.</td>
            </tr>
            <tr>
            <td class="leftRow">Night</td>
            <td class="bottomRow" id=${"forecastOne" + i}>${data.daily[i].weather[0].description}. Low of ${(data.daily[i].temp.min - KELVIN).toFixed(0)} ° <span>C</span>.</td>
            </tr>    
                `;
                    table.innerHTML += sunnyWeatherBottom;
                } else if (data.daily[i].pop >= 30) {
                    let rainyWeatherBottom = `<tr class="rowOne">
            <td class="leftRow">${convertUTCToPSTThree(data.daily[i].dt)}</td>
            <td class="bottomRow" id=${"forecast" + i}>${data.daily[i].weather[0].description}. High of ${(data.daily[i].temp.max - KELVIN).toFixed(0)} ° <span>C</span> ${data.daily[i].pop} percent of precipitation.</td>
            </tr>
            <tr>
            <td class="leftRow">Night</td>
            <td class="bottomRow" id=${"forecastOne" + i}>${data.daily[i].weather[0].description}. Low of ${(data.daily[i].temp.min - KELVIN).toFixed(0)} ° <span>C</span>.</td>
            </tr>    
                `;
                    table.innerHTML += rainyWeatherBottom;
                }

            }
        });
}
