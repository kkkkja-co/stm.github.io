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

    function updateWeather() {
        const weatherElement = document.querySelector('.hk-weather');
        const currentHour = new Date().getHours();
        let condition = '☀️';
        
        if (currentHour < 6 || currentHour > 18) {
            condition = '🌙';
        } else if (currentHour > 12) {
            condition = '⛅️';
        }
        
        const temp = Math.floor(Math.random() * (28 - 22) + 22);
        weatherElement.textContent = `${temp}°C ${condition}`;
    }

    // Initial updates
    updateTime();
    updateWeather();

    // Update time every minute
    setInterval(updateTime, 60000);
});