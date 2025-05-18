document.addEventListener('DOMContentLoaded', () => {
    function updateTime() {
        const timeElement = document.querySelector('.hk-time');
        const now = new Date();
        const options = { 
            timeZone: 'Asia/Hong_Kong',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        };
        timeElement.textContent = now.toLocaleTimeString('en-US', options);
    }

    async function updateWeather() {
        try {
            // Fetch current weather from HKO API
            const response = await fetch('https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=en');
            const data = await response.json();

            // Update temperature
            const temperature = data.temperature.data.find(item => item.place === "Hong Kong Observatory");
            if (temperature) {
                document.querySelector('.current-temp').textContent = `${temperature.value}°C`;
            }

            // Update humidity
            const humidity = data.humidity.data.find(item => item.place === "Hong Kong Observatory");
            if (humidity) {
                document.querySelector('.humidity').textContent = `Humidity: ${humidity.value}%`;
            }

            // Update weather icon based on icon number from API
            const weatherIcon = document.querySelector('.weather-icon');
            if (data.icon) {
                weatherIcon.src = `/Weather/assets/weather-icons/${data.icon}.svg`;
            }

        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    }

    async function updateWeatherForecast() {
        try {
            const response = await fetch('https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=fnd&lang=en');
            const data = await response.json();
            
            const forecastList = document.querySelector('.forecast-list');
            forecastList.innerHTML = '';
            
            // Limit to 5 days
            data.weatherForecast.slice(0, 5).forEach(day => {
                // Parse the date string (YYYYMMDD format from HKO API)
                const year = day.forecastDate.substring(0, 4);
                const month = day.forecastDate.substring(4, 6);
                const dayNum = day.forecastDate.substring(6, 8);
                
                // Format as DD/MM
                const formattedDate = `${dayNum}/${month}`;
                
                const forecastItem = document.createElement('div');
                forecastItem.className = 'forecast-item';
                forecastItem.innerHTML = `
                    <div class="forecast-date">${formattedDate}</div>
                    <div class="forecast-condition">${day.forecastWeather}</div>
                    <div class="forecast-temp">
                        <span class="forecast-low">${day.forecastMintemp.value}°</span>
                        <span class="forecast-high">${day.forecastMaxtemp.value}°</span>
                    </div>
                `;
                
                forecastList.appendChild(forecastItem);
            });
        } catch (error) {
            console.error('Error fetching forecast:', error);
        }
    }

    // Initial updates
    updateTime();
    updateWeather();
    updateWeatherForecast();

    // Update time every minute
    setInterval(updateTime, 60000);

    // Update weather every 5 minutes
    setInterval(updateWeather, 300000);

    // Update forecast every hour
    setInterval(updateWeatherForecast, 3600000);
});