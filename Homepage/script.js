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

// Update displays
function updateDisplay() {
    updateHKTime();
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

async function updateWeatherDisplay() {
    try {
        console.log('Fetching weather data...'); // Debug log
        const weatherResponse = await fetch('https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=en');
        const weatherData = await weatherResponse.json();
        console.log('Weather data received:', weatherData); // Debug data

        // Update dynamic island and weather box temperature
        const temperature = weatherData.temperature.data.find(item => item.place === "Tuen Mun");
        if (temperature) {
            // Update both dynamic island and weather box temperatures
            const currentTempElement = document.querySelector('.current-temp');
            const dynamicTempElement = document.querySelector('.hk-temp');
            
            if (currentTempElement) currentTempElement.textContent = `${temperature.value}°C`;
            if (dynamicTempElement) dynamicTempElement.textContent = `${temperature.value}°C`;
            console.log('Temperature updated:', temperature.value);
        }

        // Update weather icon
        if (weatherData.icon) {
            const weatherIcon = getWeatherEmoji(weatherData.icon);
            const iconElement = document.querySelector('.hk-weather-icon');
            if (iconElement) {
                iconElement.textContent = weatherIcon;
                console.log('Weather icon updated:', weatherIcon);
            }
        }

        // Update humidity
        const humidity = weatherData.humidity.data.find(item => item.place === "Tuen Mun");
        if (humidity) {
            const humidityElement = document.querySelector('.humidity');
            if (humidityElement) {
                humidityElement.textContent = `Humidity: ${humidity.value}%`;
                console.log('Humidity updated:', humidity.value);
            }
        }

        // Update forecast (high/low temperatures)
        const forecastResponse = await fetch('https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=fnd&lang=en');
        const forecastData = await forecastResponse.json();
        console.log('Forecast data received:', forecastData); // Debug data
        
        if (forecastData.weatherForecast?.[0]) {
            const today = forecastData.weatherForecast[0];
            const lowElement = document.querySelector('.low');
            const highElement = document.querySelector('.high');
            
            if (lowElement) lowElement.textContent = `L: ${today.forecastMintemp.value}°C`;
            if (highElement) highElement.textContent = `H: ${today.forecastMaxtemp.value}°C`;
            console.log('Forecast updated:', today);
        }

    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

function getWeatherEmoji(iconCode) {
    const weatherEmojis = {
        50: '☀️',  // Sunny
        51: '🌤️',  // Sunny Periods
        52: '⛅',  // Sunny Intervals
        53: '🌥️',  // Cloudy
        54: '☁️',  // Overcast
        60: '🌧️',  // Light Rain
        61: '🌧️',  // Rain
        62: '⛈️',  // Heavy Rain
        63: '🌩️',  // Thunderstorms
        64: '⛈️',  // Thunderstorms with Heavy Rain
        65: '🌨️',  // Snow
        70: '🌫️',  // Mist
        71: '🌫️',  // Fog
        72: '🌫️',  // Haze
        73: '🌫️',  // Smoke
        74: '🌫️',  // Sandstorm
        76: '🌊',  // Tsunami Warning
        77: '🌪️',  // Strong Monsoon Signal
    };
    return weatherEmojis[iconCode] || '🌤️';
}

function updateTime() {
    const timeElement = document.querySelector('.hk-time');
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    timeElement.textContent = `${hours}:${minutes}`;
}

// Initialize and set update intervals
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing weather display...'); // Debug log
    
    // Immediate updates
    updateTime();
    updateWeatherDisplay();
    
    // Set update intervals
    setInterval(updateTime, 60000); // Update time every minute
    setInterval(updateWeatherDisplay, 300000); // Update weather every 5 minutes
});
