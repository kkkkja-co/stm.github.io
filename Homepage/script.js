// Add this at the top of the file
const dialingSound = new Audio('Button/dialing.mp3');

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
        dialingSound.currentTime = 0;
        dialingSound.play();
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
}

// Add after the Wordle button event listener
document.querySelector('.game-button:nth-child(3)').addEventListener('click', function() {
    const popup = document.getElementById('sudokuPopup');
    popup.classList.add('active');
});

function closeSudokuPopup() {
    const popup = document.getElementById('sudokuPopup');
    popup.classList.remove('active');
}
