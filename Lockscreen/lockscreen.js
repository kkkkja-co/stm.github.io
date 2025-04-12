// Add these variables at the top
let startY = 0;
let currentY = 0;
const lockscreen = document.getElementById('lockscreen');

// Add touch event listeners
document.addEventListener('touchstart', handleTouchStart);
document.addEventListener('touchmove', handleTouchMove);
document.addEventListener('touchend', handleTouchEnd);

// Add after the touch event listeners
let isMouseDown = false;

document.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    startY = e.clientY;
});

document.addEventListener('mousemove', (e) => {
    if (!isMouseDown) return;
    currentY = e.clientY;
});

document.addEventListener('mouseup', () => {
    if (!isMouseDown) return;
    const swipeDistance = startY - currentY;
    
    if (swipeDistance > 150 && startY > window.innerHeight - 200) {
        unlockPhone();
    }
    isMouseDown = false;
});

function handleTouchStart(e) {
    startY = e.touches[0].clientY;
}

function handleTouchMove(e) {
    currentY = e.touches[0].clientY;
}

function handleTouchEnd() {
    const swipeDistance = startY - currentY;
    
    // If swipe distance is more than 150px and started from bottom area
    if (swipeDistance > 150 && startY > window.innerHeight - 200) {
        unlockPhone();
    }
}

// Update the unlockPhone function
function unlockPhone() {
    // Simply redirect to homepage without animation
    window.location.href = 'homepage.html';
}

// Update Hong Kong time for dynamic island
function updateHKTime() {
    const timeElement = document.querySelector('.hk-time');
    if (!timeElement) return;
    
    const now = new Date();
    const options = { 
        timeZone: 'Asia/Hong_Kong', 
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
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
    
    const temp = 12;
    weatherElement.textContent = `${temp}°C ${condition}`;
}

// Update lock screen time
function updateLockTime() {
    const timeElement = document.getElementById('lockTime');
    const dateElement = document.getElementById('lockDate');
    const now = new Date();
    
    // Update time
    const timeOptions = { 
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    };
    timeElement.textContent = now.toLocaleTimeString('en-US', timeOptions);
    
    // Update date
    const dateOptions = {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    };
    dateElement.textContent = now.toLocaleDateString('en-US', dateOptions);
}

// Update all displays
function updateDisplay() {
    updateHKTime();
    setDefaultWeather();
    updateLockTime();
}

// Initial update
updateDisplay();

// Update every minute
setInterval(updateDisplay, 60000);