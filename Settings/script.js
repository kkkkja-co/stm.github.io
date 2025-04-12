document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const soundToggle = document.getElementById('soundToggle');

    // Load saved settings
    darkModeToggle.checked = localStorage.getItem('darkMode') === 'true';
    soundToggle.checked = localStorage.getItem('sound') !== 'false';

    // Update time and weatheron
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

    // Dark mode toggle
    darkModeToggle.addEventListener('change', () => {
        localStorage.setItem('darkMode', darkModeToggle.checked);
        updateTheme();
    });

    // Sound toggle
    soundToggle.addEventListener('change', () => {
        localStorage.setItem('sound', soundToggle.checked);
    });

    // Add language selection handler
    const languageSelect = document.getElementById('languageSelect');
    
    // Load saved language
    const savedLanguage = localStorage.getItem('language') || 'en';
    languageSelect.value = savedLanguage;

    languageSelect.addEventListener('change', () => {
        localStorage.setItem('language', languageSelect.value);
    });

    function updateTheme() {
        const iPhoneFrame = document.querySelector('.iphone-x');
        const settingsGroups = document.querySelectorAll('.setting-group');
        
        if (darkModeToggle.checked) {
            iPhoneFrame.style.background = '#000';
            document.body.style.color = '#fff';
            settingsGroups.forEach(group => {
                group.style.background = '#1c1c1e';
                group.style.color = '#fff';
            });
        } else {
            iPhoneFrame.style.background = '#f2f2f7';
            document.body.style.color = '#000';
            settingsGroups.forEach(group => {
                group.style.background = '#fff';
                group.style.color = '#000';
            });
        }
    }

    // Initial updates
    updateHKTime();
    setDefaultWeather();
    updateTheme();

    // Update time every minute
    setInterval(updateHKTime, 60000);
});

// Add translations object
const translations = {
    'zh-TW': {
        'Settings': '設定',
        'Language': '語言',
        'System Language': '系統語言',
        'Display': '顯示',
        'Dark Mode': '深色模式',
        'Sound': '聲音',
        'Sound Effects': '音效',
        'About': '關於',
        'Version': '版本',
        'H.R.': '心率',
        'B.P.': '血壓'
    },
    'ja': {
        'Settings': '設定',
        'Language': '言語',
        'System Language': 'システム言語',
        'Display': 'ディスプレイ',
        'Dark Mode': 'ダークモード',
        'Sound': 'サウンド',
        'Sound Effects': '効果音',
        'About': '概要',
        'Version': 'バージョン',
        'H.R.': '心拍数',
        'B.P.': '血圧'
    }
};

// Add translation function
function translateContent(language) {
    if (language === 'en') {
        document.querySelectorAll('[data-translate]').forEach(element => {
            element.textContent = element.getAttribute('data-translate');
        });
        return;
    }

    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[language] && translations[language][key]) {
            element.textContent = translations[language][key];
        }
    });
}

// Update language select event listener
languageSelect.addEventListener('change', () => {
    const selectedLanguage = languageSelect.value;
    localStorage.setItem('language', selectedLanguage);
    translateContent(selectedLanguage);
});

// Add initial translation on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    languageSelect.value = savedLanguage;
    translateContent(savedLanguage);
});

document.addEventListener('DOMContentLoaded', () => {
    const languageSelect = document.getElementById('languageSelect');
    
    // Load saved language
    const savedLanguage = localStorage.getItem('language') || 'en';
    languageSelect.value = savedLanguage;
    
    // Initial translation
    translatePage(savedLanguage);
    
    // Language change handler
    languageSelect.addEventListener('change', (e) => {
        const selectedLanguage = e.target.value;
        localStorage.setItem('language', selectedLanguage);
        translatePage(selectedLanguage);
    });
    
    function translatePage(language) {
        if (language === 'en') {
            // Restore original English text
            document.querySelectorAll('[data-translate]').forEach(element => {
                element.textContent = element.getAttribute('data-translate');
            });
            return;
        }

        // Translate all elements with data-translate attribute
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[language] && translations[language][key]) {
                element.textContent = translations[language][key];
            }
        });

        // Translate health info
        const heartRate = document.querySelector('.heart-rate');
        const bloodPressure = document.querySelector('.blood-pressure');
        
        if (heartRate && translations[language]['H.R.']) {
            heartRate.textContent = `${translations[language]['H.R.']}💓 : 72`;
        }
        
        if (bloodPressure && translations[language]['B.P.']) {
            bloodPressure.textContent = `${translations[language]['B.P.']}🩸 : 157`;
        }
    }

    // ...existing code for other settings...
});