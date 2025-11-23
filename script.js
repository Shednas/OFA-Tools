window.onload = () => {
    digitalClock();
}


function appendToDisplay(value) {
    const display = document.getElementById('calculatorDisplay');
    if (display.value === 'Error') display.value = '';
    const lastChar = display.value.slice(-1);
    if (display.value === '' && ['+', '-', '*', '/', '%'].includes(value)) return;
    if (['+', '-', '*', '/', '%'].includes(lastChar) && ['+', '-', '*', '/', '%'].includes(value)) {
        display.value = display.value.slice(0, -1) + value;
        return;
    }
    if (value === '.') {
        const parts = display.value.split(/[\+\-\*\/%]/);
        if (parts[parts.length - 1].includes('.')) return;
        if (display.value === '' || ['+', '-', '*', '/', '%'].includes(lastChar)) display.value += '0';
    }
    if (display.value.length >= 20) return;
    display.value += value;
}

function calculateResult() {
    const display = document.getElementById('calculatorDisplay');
    try {
        if (display.value === '') return;
        let expression = display.value.replace(/(\d+)%/g, "($1/100)");
        display.value = eval(expression).toFixed(4);
    } catch (error) {
        display.value = 'Error';
    }
}

function removeLastValue() {
    const display = document.getElementById('calculatorDisplay');
    if (display.value === '' || display.value === 'Error') {
        display.value = '';
        return;
    }
    display.value = display.value.slice(0, -1);
}

function clearDisplay() {
    const display = document.getElementById('calculatorDisplay');
    display.value = '';
}

// Calendar
let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function showCalendar(month = currentMonth, year = currentYear) {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const calendarBody = document.getElementById("calendarBody");
    const monthYear = document.getElementById("monthYear");

    monthYear.textContent = `${monthNames[month]} ${year}`;

    let html = "";
    let date = 1;

    for (let i = 0; i < 6; i++) {
        html += "<tr>";
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                html += "<td></td>";
            } else if (date > daysInMonth) {
                html += "<td></td>";
            } else {
                let style = "";
                if (date === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                    style = "background-color: green; color: white; border-radius: 50%;";
                }
                html += `<td style="${style}">${date}</td>`;
                date++;
            }
        }
        html += "</tr>";
    }

    calendarBody.innerHTML = html;
}

function prevMonth() {
    currentMonth--;
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    showCalendar(currentMonth, currentYear);
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    showCalendar(currentMonth, currentYear);
}

// Initialize calendar
showCalendar();


// Coin Flip
function flipCoin() {
    const coinResultDisplay = document.getElementById('coinResultDisplay');
    const coinDesc = document.querySelector('.coinDesc');
    const result = Math.floor(Math.random()*2);
    if (result === 0) {
        coinResultDisplay.innerText = "H";
        coinDesc.innerText = "Heads";
    } else {
        coinResultDisplay.innerText = "T";
        coinDesc.innerText = "Tails";
    }
}

// Convert Currency
async function currencyConverter() {
    const amount = parseFloat(document.getElementById("amount").value);
    const fromCurrency = document.getElementById("fromCurrency").value;
    const toCurrency = document.getElementById("toCurrency").value;
    const result = document.getElementById("convertedAmount");

    if (isNaN(amount) || amount <= 0) {
        result.innerText = "Please enter a valid amount.";
        return;
    }

    if (fromCurrency === toCurrency) {
        result.innerText = `${amount.toFixed(2)} ${toCurrency}`;
        return;
    }

    try {
        const response = await fetch("https://open.er-api.com/v6/latest/USD");
        const data = await response.json();

        if (data.result !== "success") {
            result.innerText = "Failed to fetch currency rates.";
            return;
        }

        const rates = data.rates;
        const finalAmount = (amount / rates[fromCurrency]) * rates[toCurrency];
        result.innerText = `${finalAmount.toFixed(2)} ${toCurrency}`;
    } catch (err) {
        console.error(err);
        result.innerText = "Failed to fetch currency rates.";
    }
}

// Dice Roller
function rollDice() {
    const numOfDice = Number(document.getElementById("Number_pick").value);
    const diceResult = document.getElementById("result-title");
    const diceShow = document.getElementById("result");

    if (numOfDice < 1 || numOfDice > 6 || isNaN(numOfDice)) {
        diceResult.innerHTML = "<p>Please enter a number between 1 and 6.</p>";
        return;
    }

    // Final results
    let results = [];
    for (let i = 0; i < numOfDice; i++) {
        results.push(Math.floor(Math.random() * 6) + 1);
    }

    // Rolling animation
    let randomAnimation = setInterval(() => {
        let htmlTitle = `<h2 class="result-title">Rolling...</h2>`;
        let html = ""; // FIXED

        results.forEach(() => {
            const randomRoll = Math.floor(Math.random() * 6) + 1;
            html += `
                <img src="/assets/dice/${randomRoll}.svg" class="dice-image">
            `;
        });

        diceResult.innerHTML = htmlTitle;
        diceShow.innerHTML = html;
    }, 80);

    // Final result after animation
    setTimeout(() => {
        clearInterval(randomAnimation);

        let finalHtmlTitle = `<h2 class="result-title">Result:</h2>`;
        let finalHtml = ""; // FIXED

        results.forEach((result) => {
            finalHtml += `
                <img src="/assets/dice/${result}.svg" class="dice-image">
            `;
        });

        diceResult.innerHTML = finalHtmlTitle;
        diceShow.innerHTML = finalHtml;
    }, 600);
}

// Digital Clock
function digitalClock() {
    const time = new Date();
    const clockDisplay = document.getElementById("clockDisplay");
    let hours = time.getHours();
    const meridian = hours >=12 ? 'pm': 'am';
    hours = hours % 12 || 12;
    let minutes = time.getMinutes();
    let seconds = time.getSeconds();
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}${meridian}`;
    clockDisplay.textContent = timeString;
}
setInterval(digitalClock, 1000);

// Password Generator
const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const numberChars = '0123456789';
const symbolChars = '@!~#$%^&*()_+<>?/.,;:[]{}=|";';

function generatePassword() {
    
    const generatedPassword = document.getElementById("generatedPassword");
    generatedPassword.textContent="";

    const length = Number(document.getElementById("length").value);

    if(length < 8)
        {
            generatedPassword.textContent = "Please Enter a number greater than 7."
            return;
        };

    const includeLowercase = document.getElementById("includeLowercase").checked;
    const includeUppercase = document.getElementById("includeUppercase").checked;
    const includeNumbers = document.getElementById("includeNumbers").checked;
    const includeSymbols = document.getElementById("includeSymbols").checked;

    let password = "";
    let allowedChars = "";

    allowedChars += includeLowercase? lowercaseChars : "";
    allowedChars += includeUppercase? uppercaseChars : "";
    allowedChars += includeNumbers? numberChars : "";
    allowedChars += includeSymbols? symbolChars : "";

    if(allowedChars == ""){
        generatedPassword.textContent = "Please select at least one type of character."
        return;
    }
    
    for (let i=0; i<length; i++){
        const randomIndex = Math.floor(Math.random()*allowedChars.length);
        password +=allowedChars[randomIndex];
    }

    generatedPassword.textContent = password;
}

// Pokemon Finder
async function findPokemon() {
    const pokemonNameInput = document.getElementById("pokemonFinder").value.toLowerCase();
    const pokemonImage = document.getElementById("pokemonImage");
    const pokemonIdName = document.getElementById("pokemonIdName");
    const pokemonType = document.getElementById("pokemonType");
    const pokemonAbilities = document.getElementById("pokemonAbilities");
    const pokemonStatsTitle = document.getElementById("pokemonStatsTitle");
    const stat1 = document.getElementById("stat1"), stat2 = document.getElementById("stat2"), stat3 = document.getElementById("stat3"), stat4 = document.getElementById("stat4"), stat5 = document.getElementById("stat5"), stat6 = document.getElementById("stat6");
    const pokemonHeight = document.getElementById("pokemonHeight");
    const pokemonWeight = document.getElementById("pokemonWeight");

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonNameInput}`);

        if (!response.ok){
            throw new Error("Pokemon not found");
        }

        const pokeData = await response.json();

        pokemonImage.src = pokeData.sprites.other["official-artwork"].front_default;
        pokemonImage.style.visibility = "visible";

        pokemonIdName.textContent = `#${pokeData.id} - ${pokeData.name.toUpperCase()}`;
        pokemonType.textContent = `Type: ${pokeData.types.map(typeInfo => typeInfo.type.name.charAt(0).toUpperCase() + typeInfo.type.name.slice(1)).join(', ')}`;
        pokemonAbilities.textContent = `Abilities: ${pokeData.abilities.map(abilityInfo => abilityInfo.ability.name.charAt(0).toUpperCase() + abilityInfo.ability.name.slice(1)).join(', ')}`;

        pokemonStatsTitle.style.visibility = "visible";
        stat1.textContent = `HP: ${pokeData.stats[0].base_stat}`;
        stat2.textContent = `Attack: ${pokeData.stats[1].base_stat}`;
        stat3.textContent = `Defense: ${pokeData.stats[2].base_stat}`;
        stat4.textContent = `Special Attack: ${pokeData.stats[3].base_stat}`;
        stat5.textContent = `Special Defense: ${pokeData.stats[4].base_stat}`;
        stat6.textContent = `Speed: ${pokeData.stats[5].base_stat}`;

        pokemonHeight.textContent = `Height: ${pokeData.height / 10}m`;
        pokemonWeight.textContent = `Weight: ${pokeData.weight / 10}kg`;

    } catch (error) {
        console.error("Error fetching Pokemon data:", error);
    }
}

// Rock Paper Scissors
function playRPS(playerPlays) {
    let userScore = document.getElementById("userScore");
    let computerScore = document.getElementById("computerScore");
    let resultMessage = document.getElementById("resultMessage");
    let userChoice= document.getElementById("userChoice");
    let computerChoice= document.getElementById("computerChoice");


    const choices = ['rock', 'paper', 'scissors'];
    const computerPlays = choices[Math.floor(Math.random() * choices.length)];

    userChoice.textContent = playerPlays;
    computerChoice.textContent = computerPlays;

    if (playerPlays === computerPlays){
        resultMessage.textContent = "It's a Tie!";
    } else if (playerPlays === 'rock' && computerPlays === 'scissors' ||
                playerPlays === 'paper' && computerPlays === 'rock' ||
                playerPlays === 'scissors' && computerPlays === 'paper'){
                    resultMessage.textContent = "Congratulations! You Win!";
                    userScore.textContent = parseInt(userScore.textContent) + 1;
    } else {
        resultMessage.textContent = "Sorry! You Lose!";
        computerScore.textContent = parseInt(computerScore.textContent) + 1;
    }

}

// Stopwatch
let timer = null;
let startTime = 0;
let elapsedTime = 0;
let isRunning = false;

function startTimer(){
    if(!isRunning){
        isRunning = true;
        startTime = Date.now() - elapsedTime;
        timer = setInterval(updateStopwatchDisplay, 10);
    }
}
function resetTimer(){
    isRunning = false;
    clearInterval(timer);
    startTime = 0;
    elapsedTime = 0;
    const stopwatchDisplay = document.getElementById("stopwatchDisplay");
    stopwatchDisplay.textContent = "00:00:00";
}

function stopTimer(){
    if(isRunning){
        isRunning = false;
        clearInterval(timer);
        elapsedTime = Date.now() - startTime;
    }
}

function updateStopwatchDisplay(){
    const currentTime = Date.now();
    elapsedTime = currentTime - startTime;
    const stopHours = Math.floor(elapsedTime/(1000*60*60));
    const stopMinutes = Math.floor(elapsedTime/(1000*60)%60);
    const stopSeconds = Math.floor(elapsedTime/1000%60);
    const stopMilliseconds = Math.floor(elapsedTime%1000/10);
    const stopwatchDisplay = document.getElementById("stopwatchDisplay");
    stopwatchDisplay.textContent = `${stopHours.toString().padStart(2, '0')}:${stopMinutes.toString().padStart(2, '0')}:${stopSeconds.toString().padStart(2, '0')}.${stopMilliseconds.toString()}
        `
}

// Weather
async function getWeather() {
    const cityInput = document.getElementById('cityInput');
    const cityName = document.getElementById('cityName');
    const temperature = document.getElementById('temperature');
    const weatherDesc = document.getElementById('weatherDesc');
    const weatherIcon = document.getElementById('weatherIcon');

    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityInput.value}`);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
        console.error("City not found");
        cityName.textContent = "City not found";
        temperature.textContent = "";
        weatherDesc.textContent = "";
        weatherIcon.textContent = "";
        return;
    }

    const { latitude, longitude, name } = geoData.results[0];

    const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    );
    const weather = await res.json();
    const currentWeather = weather.current_weather;

    cityName.textContent = name;
    temperature.textContent = `Temperature: ${currentWeather.temperature}°C`;
    weatherDesc.textContent = `Wind Speed: ${currentWeather.windspeed} km/h`;

    const weatherEmojiMap = {
        0: "☀️",
        1: "🌤️",
        2: "⛅",
        3: "☁️",
        45: "🌫️",
        48: "🌫️",
        51: "🌦️",
        53: "🌧️",
        55: "🌧️",
        61: "🌧️",
        63: "🌧️",
        65: "🌧️",
        71: "🌨️",
        73: "🌨️",
        75: "❄️",
        80: "🌧️",
        81: "🌧️",
        82: "🌧️",
        95: "⛈️",
        96: "⛈️",
        99: "⛈️"
    };

    weatherIcon.textContent = weatherEmojiMap[currentWeather.weathercode] || "❓";
}
