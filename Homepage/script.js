// Add this at the top of the file
const dialingSound = new Audio('./Button/dialing.mp3');

// Pre-load the audio file
dialingSound.load();

// Update Hong Kong time
function updateHKTime() {
    const timeElement = document.querySelector('.hk-time');
    if (!timeElement) return;
    
    const now = new Date();
    const options = { 
        timeZone: 'Asia/Hong_Kong', 
        hour: '2-digit',    // Changed to 2-digit for consistent format
        minute: '2-digit',
        hour12: false       // Changed to false for 24-hour format
    };
    const time = now.toLocaleTimeString('en-US', options);
    timeElement.textContent = time;
}

// Set fixed weather
function setDefaultWeather() {
    const weatherElement = document.querySelector('.hk-weather');
    const currentHour = new Date().getHours();
    let condition = '☀️';
    
    if (currentHour < 6 || currentHour > 18) {
        condition = '🌙';
    } else if (currentHour > 12) {
        condition = '⛅️';
    }
    
    const temp = 12;  // Fixed temperature at 12°C
    weatherElement.textContent = `${temp}°C ${condition}`;
}

// Update displays
function updateDisplay() {
    updateHKTime();
    setDefaultWeather();
}

// Initial update
updateDisplay();

// Update every minute
setInterval(updateDisplay, 60000);

// Modify the help button click handler
document.querySelector('.help-button').addEventListener('click', function() {
    const dynamicIsland = document.querySelector('.dynamic-island');
    const islandContent = document.querySelector('.island-content');
    
    // Expand dynamic island first
    dynamicIsland.classList.add('dialing');
    
    // Clear existing content and add hang up button
    islandContent.innerHTML = `
        <div class="dialing-content">
            <span class="contact-name">Son</span>
            <span class="emergency-label">emergency contact</span>
            <button class="hang-up-button" aria-label="Hang up">
                <span class="hang-up-icon"></span>
            </button>
        </div>
    `;
    
    // Wait 0.5s then play sound
    setTimeout(() => {
        try {
            dialingSound.currentTime = 0;
            const playPromise = dialingSound.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("Audio play failed:", error);
                });
            }
        } catch (error) {
            console.log("Audio playback error:", error);
        }
    }, 500);
    
    // Show dialing content
    setTimeout(() => {
        document.querySelector('.dialing-content').classList.add('show');
    }, 100);

    // Add click handler for hang up button
    document.querySelector('.hang-up-button').addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent event bubbling
        
        // Stop the dialing sound
        dialingSound.pause();
        dialingSound.currentTime = 0;
        
        dynamicIsland.classList.remove('dialing');
        islandContent.innerHTML = `
            <div class="hk-info">
                <span class="hk-time"></span>
                <span class="weather-divider">•</span>
                <span class="hk-weather"></span>
            </div>
        `;
        updateDisplay();
    });
});

// Add event listener to Wordle button
document.querySelector('.game-button:nth-child(2)').addEventListener('click', function() {
    const popup = document.getElementById('wordlePopup');
    popup.classList.add('active');
});

function closeWordlePopup() {
    const popup = document.getElementById('wordlePopup');
    popup.classList.remove('active');
    clearIframeCache('wordlePopup');
}

// Add after the Wordle button event listener
document.querySelector('.game-button:nth-child(3)').addEventListener('click', function() {
    const popup = document.getElementById('sudokuPopup');
    popup.classList.add('active');
});

function closeSudokuPopup() {
    const popup = document.getElementById('sudokuPopup');
    popup.classList.remove('active');
    clearIframeCache('sudokuPopup');
}

// Add event listener to Matching Game button
document.querySelector('.game-button:nth-child(4)').addEventListener('click', function() {
    const popup = document.getElementById('matchingPopup');
    popup.classList.add('active');
});

function closeMatchingPopup() {
    const popup = document.getElementById('matchingPopup');
    popup.classList.remove('active');
    clearIframeCache('matchingPopup');
}

// Add event listener to Candy Crush button
document.querySelector('.game-button:nth-child(5)').addEventListener('click', function() {
    const popup = document.getElementById('candycrushPopup');
    popup.classList.add('active');
});

function closeCandyCrushPopup() {
    const popup = document.getElementById('candycrushPopup');
    popup.classList.remove('active');
    clearIframeCache('candycrushPopup');
}

// Function to clear iframe cache by reloading the source
function clearIframeCache(popupId) {
    const iframe = document.querySelector(`#${popupId} iframe`);
    const currentSrc = iframe.src;
    iframe.src = '';
    iframe.src = currentSrc;
}

async function updateTuenMunWeather() {
    const weatherBox = document.querySelector('.weather-box');
    
    try {
        // Fetch current weather data
        const weatherResponse = await fetch('https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=en');
        const weatherData = await weatherResponse.json();
        
        // Get Tuen Mun temperature
        const tuenMunTemp = weatherData.temperature.data.find(item => item.place === "Tuen Mun");
        weatherBox.querySelector('.current-temp').textContent = `${tuenMunTemp.value}°C`;
        
        // Get Tuen Mun humidity
        const tuenMunHumidity = weatherData.humidity.data.find(item => item.place === "Tuen Mun");
        weatherBox.querySelector('.humidity').textContent = `${tuenMunHumidity.value}%`;
        
        // Fetch forecast data for high/low temperatures
        const forecastResponse = await fetch('https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=fnd&lang=en');
        const forecastData = await forecastResponse.json();
        
        // Get today's forecast
        const todayForecast = forecastData.weatherForecast[0];
        weatherBox.querySelector('.low-temp').textContent = `${todayForecast.forecastMintemp.value}°C`;
        weatherBox.querySelector('.high-temp').textContent = `${todayForecast.forecastMaxtemp.value}°C`;

    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateTuenMunWeather();
    // Update weather every 5 minutes
    setInterval(updateTuenMunWeather, 300000);
});
