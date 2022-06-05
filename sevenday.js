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

       for(let i = 0; i < 7; i++) {        
        document.querySelector('.day'+i).innerHTML = `<img class="hourlyweather-icon" src="icons/${onecall.weather[i]}.png"/><br>${celsiusToFahrenheit(onecall.temp[i]).toFixed(0)} ° <span>F</span><br><br>Humidity: ${onecall.humidity[i]}%<br>${onecall.description[0]}</td>`;
        document.querySelector('.night'+i).innerHTML = `<img class="hourlyweather-icon" src="icons-night/${onecall.weather[i]}.png"/><br>${celsiusToFahrenheit(onecall.tempNight[i]).toFixed(0)} ° <span>F</span><br>${onecall.main[i]}</td>`
       }
            

        document.querySelector('#bottomRowConvert').innerHTML = `${onecall.description[0]}. High of ${celsiusToFahrenheit(onecall.max[0].toFixed(0))} ° <span>F</span>. Humidex of ${celsiusToFahrenheit(onecall.feels[0]).toFixed(0)}. UV index of ${onecall.uvIndex[0]}`
        document.querySelector('#bottomRowConvertTwo').innerHTML = `${onecall.description[0]}. Low of ${celsiusToFahrenheit(onecall.min[0].toFixed(0))} ° <span>F</span>. Humidex of ${celsiusToFahrenheit(onecall.feels[0]).toFixed(0)}. UV index of ${onecall.uvIndex[0]}`;

        for (let i = 0; i < 5; i++) {
            document.querySelector("#forecast" + i).innerHTML = `${onecall.description[i]}. High of ${celsiusToFahrenheit(onecall.max[i].toFixed(0))} ° <span>F</span>.`;
            document.querySelector("#forecastOne" + i).innerHTML = `${onecall.description[i]}. Low of ${celsiusToFahrenheit(onecall.min[i].toFixed(0))} ° <span>F</span>.`;
        }

    } else {
        metric.innerHTML = "Convert to imperial";

        for(let i = 0; i < 7; i++) {
            document.querySelector('.day'+i).innerHTML = `<img class="hourlyweather-icon" src="icons/${onecall.weather[i]}.png"/><br>${(onecall.temp[i]).toFixed(0)} ° <span>C</span><br><br>Humidity: ${onecall.humidity[0]}%<br>${onecall.description[i]}</td>`;
            document.querySelector('.night'+i).innerHTML = `<img class="hourlyweather-icon" src="icons-night/${onecall.weather[i]}.png"/><br>${(onecall.tempNight[i]).toFixed(0)} ° <span>C</span><br>${onecall.main[i]}</td>`;
        }      

        document.querySelector('#bottomRowConvert').innerHTML = `${onecall.description[0]}. High of ${(onecall.max[0].toFixed(0))} ° <span>C</span>. Humidex of ${(onecall.feels[0]).toFixed(0)}. UV index of ${onecall.uvIndex[0]}`
        document.querySelector('#bottomRowConvertTwo').innerHTML = `${onecall.description[0]}. Low of ${(onecall.min[0].toFixed(0))} ° <span>C</span>. Humidex of ${(onecall.feels[0]).toFixed(0)}. UV index of ${onecall.uvIndex[0]}`;

        for (let i = 0; i < 5; i++) {
            document.querySelector("#forecast" + i).innerHTML = `${onecall.description[i]}. High of ${(onecall.max[i].toFixed(0))} ° <span>C</span>.`;
            document.querySelector("#forecastOne" + i).innerHTML = `${onecall.description[i]}. Low of ${(onecall.min[i].toFixed(0))} ° <span>C</span>.`;
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

          function addDates() {
              let string = ""
              for(let i = 0; i <= 6; i++) {
                string += `<td>${convertUTCToPST(data.daily[i].dt)}</td>`               
            }
            return string
          } 
            
          function addDayRow() {
              let string = "";
              for(let i = 0; i <= 6; i++) {
                  string += `<td class=${"day"+i}><img class="hourlyweather-icon" src="icons/${data.daily[i].weather[0].icon}.png"/><br>${(data.daily[i].temp.day - KELVIN).toFixed(0)} ° <span>C</span><br><br>Humidity: ${data.daily[i].humidity}%<br>${data.daily[i].weather[0].description}</td>`                  
              }
              return string;
          }
          
          function addNightRow() {
            let string = ""
            for(let i = 0; i <= 6; i++) {
              string += ` <td class=${"night"+i}><img class="hourlyweather-icon" src="icons-night/${data.daily[i].weather[0].icon}.png"/><br>${(data.daily[i].temp.night - KELVIN).toFixed(0)} ° <span>C</span><br>${data.daily[i].weather[0].main}</td>`              
          }
          return string
          }
                var row = `<table>
                <tbody>
                    <tr style="text-align:center;" class= "dates">
                    ${addDates()}       	                                      
                    </tr>
                    <tr style="text-align:center;">                                
                    ${addDayRow()}
                    </tr>                   
                    <tr style="text-align:center;" class="dates">
                    <td>Tonight</td>
                    <td>Night</td>
                    <td>Night</td>
                    <td>Night</td>
                    <td>Night</td>
                    <td>Night</td>
                    <td>Night</td>                              
                    </tr>
                    <tr style="text-align:center;">
                    ${addNightRow()}
                    </tr>     		
                </tbody>
              </table>`;

              table.innerHTML += row;                                 
        });
}

//Get the 5 day weather API to get location - other api doesn't support location
function getFiveDayforecast(latitude, longitude) {
    let api = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${key}`;

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
