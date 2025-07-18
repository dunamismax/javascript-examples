/**
 * Weather Dashboard - Advanced JavaScript Learning Example
 * 
 * This application demonstrates advanced JavaScript concepts including:
 * - API integration with fetch()
 * - Async/await for handling asynchronous operations
 * - Geolocation API for location services
 * - Error handling and user feedback
 * - Date/time manipulation
 * - Dynamic DOM content creation
 * - State management for different UI states
 * 
 * Learning Focus:
 * 1. Making HTTP requests to external APIs
 * 2. Handling asynchronous operations gracefully
 * 3. Working with browser APIs (Geolocation)
 * 4. Error handling patterns and user experience
 * 5. Dynamic content rendering and updates
 * 6. Data formatting and presentation
 */

// Application state management
const appState = {
    currentCity: null,
    weatherData: null,
    forecastData: null,
    isLoading: false,
    error: null,
    temperatureUnit: 'celsius', // 'celsius' or 'fahrenheit'
    recentCities: []
};

// API configuration - Using OpenWeatherMap API (free tier)
const API_CONFIG = {
    // Note: In a real application, you would store API keys securely
    // For learning purposes, we'll use a mock API or instructions for getting a key
    baseUrl: 'https://api.openweathermap.org/data/2.5',
    apiKey: 'YOUR_API_KEY_HERE', // Users need to get their own key
    iconBaseUrl: 'https://openweathermap.org/img/wn'
};

// Constants for better maintainability
const STORAGE_KEYS = {
    RECENT_CITIES: 'weatherApp_recentCities',
    TEMPERATURE_UNIT: 'weatherApp_temperatureUnit'
};

const UI_STATES = {
    INITIAL: 'initial',
    LOADING: 'loading',
    SUCCESS: 'success',
    ERROR: 'error'
};

// DOM element references
const elements = {
    cityInput: null,
    searchBtn: null,
    locationBtn: null,
    loadingState: null,
    errorState: null,
    currentWeather: null,
    forecast: null,
    recentCities: null,
    // Error elements
    errorTitle: null,
    errorMessage: null,
    retryBtn: null,
    // Weather display elements
    locationName: null,
    currentDate: null,
    mainWeatherIcon: null,
    currentTemp: null,
    tempToggle: null,
    weatherCondition: null,
    weatherDescription: null,
    feelsLike: null,
    humidity: null,
    windSpeed: null,
    pressure: null,
    visibility: null,
    uvIndex: null,
    forecastContainer: null,
    recentCitiesList: null,
    clearHistory: null
};

/**
 * Initialize the weather dashboard
 * Sets up event listeners and loads saved data
 */
function initWeatherApp() {
    cacheElements();
    loadSavedData();
    setupEventListeners();
    
    // Show initial state
    setUIState(UI_STATES.INITIAL);
    
    console.log('Weather Dashboard initialized');
    
    // Check if API key is configured
    if (API_CONFIG.apiKey === 'YOUR_API_KEY_HERE') {
        showError('API Key Required', 
            'Please get a free API key from OpenWeatherMap.org and replace YOUR_API_KEY_HERE in the code. ' +
            'For learning purposes, you can also use the mock data mode.');
    }
}

/**
 * Cache DOM elements for better performance
 * Prevents repeated DOM queries
 */
function cacheElements() {
    // Input elements
    elements.cityInput = document.getElementById('cityInput');
    elements.searchBtn = document.getElementById('searchBtn');
    elements.locationBtn = document.getElementById('locationBtn');
    
    // State containers
    elements.loadingState = document.getElementById('loadingState');
    elements.errorState = document.getElementById('errorState');
    elements.currentWeather = document.getElementById('currentWeather');
    elements.forecast = document.getElementById('forecast');
    elements.recentCities = document.getElementById('recentCities');
    
    // Error elements
    elements.errorTitle = document.getElementById('errorTitle');
    elements.errorMessage = document.getElementById('errorMessage');
    elements.retryBtn = document.getElementById('retryBtn');
    
    // Weather display elements
    elements.locationName = document.getElementById('locationName');
    elements.currentDate = document.getElementById('currentDate');
    elements.mainWeatherIcon = document.getElementById('mainWeatherIcon');
    elements.currentTemp = document.getElementById('currentTemp');
    elements.tempToggle = document.getElementById('tempToggle');
    elements.weatherCondition = document.getElementById('weatherCondition');
    elements.weatherDescription = document.getElementById('weatherDescription');
    elements.feelsLike = document.getElementById('feelsLike');
    elements.humidity = document.getElementById('humidity');
    elements.windSpeed = document.getElementById('windSpeed');
    elements.pressure = document.getElementById('pressure');
    elements.visibility = document.getElementById('visibility');
    elements.uvIndex = document.getElementById('uvIndex');
    elements.forecastContainer = document.getElementById('forecastContainer');
    elements.recentCitiesList = document.getElementById('recentCitiesList');
    elements.clearHistory = document.getElementById('clearHistory');
}

/**
 * Load saved data from localStorage
 * Demonstrates persistent storage patterns
 */
function loadSavedData() {
    try {
        // Load recent cities
        const savedCities = localStorage.getItem(STORAGE_KEYS.RECENT_CITIES);
        if (savedCities) {
            appState.recentCities = JSON.parse(savedCities);
        }
        
        // Load temperature unit preference
        const savedUnit = localStorage.getItem(STORAGE_KEYS.TEMPERATURE_UNIT);
        if (savedUnit) {
            appState.temperatureUnit = savedUnit;
            updateTemperatureToggle();
        }
    } catch (error) {
        console.error('Failed to load saved data:', error);
    }
}

/**
 * Set up all event listeners
 * Demonstrates various event handling patterns
 */
function setupEventListeners() {
    // Search functionality
    elements.searchBtn.addEventListener('click', handleSearch);
    elements.cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    // Geolocation functionality
    elements.locationBtn.addEventListener('click', handleGetLocation);
    
    // Temperature unit toggle
    elements.tempToggle.addEventListener('click', toggleTemperatureUnit);
    
    // Error retry
    elements.retryBtn.addEventListener('click', handleRetry);
    
    // Recent cities interactions
    elements.recentCitiesList.addEventListener('click', handleRecentCityClick);
    elements.clearHistory.addEventListener('click', clearRecentCities);
}

/**
 * Handle city search
 * Demonstrates input validation and API calls
 */
async function handleSearch() {
    const cityName = elements.cityInput.value.trim();
    
    if (!cityName) {
        elements.cityInput.focus();
        return;
    }
    
    await searchWeatherByCity(cityName);
}

/**
 * Search weather by city name
 * Demonstrates async/await and error handling
 */
async function searchWeatherByCity(cityName) {
    try {
        setUIState(UI_STATES.LOADING);
        
        // For demo purposes, we'll use mock data if API key is not configured
        if (API_CONFIG.apiKey === 'YOUR_API_KEY_HERE') {
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
            const mockData = generateMockWeatherData(cityName);
            displayWeatherData(mockData);
            addToRecentCities(cityName);
            setUIState(UI_STATES.SUCCESS);
            return;
        }
        
        // Real API call
        const weatherData = await fetchCurrentWeather(cityName);
        const forecastData = await fetchForecast(cityName);
        
        appState.weatherData = weatherData;
        appState.forecastData = forecastData;
        appState.currentCity = cityName;
        
        displayWeatherData(weatherData);
        displayForecast(forecastData);
        addToRecentCities(cityName);
        
        setUIState(UI_STATES.SUCCESS);
        
    } catch (error) {
        console.error('Weather search failed:', error);
        showError('City Not Found', 
            `Unable to find weather data for "${cityName}". Please check the spelling and try again.`);
    }
}

/**
 * Fetch current weather data from API
 * Demonstrates fetch() and async/await patterns
 */
async function fetchCurrentWeather(cityName) {
    const url = `${API_CONFIG.baseUrl}/weather?q=${encodeURIComponent(cityName)}&appid=${API_CONFIG.apiKey}&units=metric`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error(`City "${cityName}" not found`);
        } else if (response.status === 401) {
            throw new Error('Invalid API key. Please check your OpenWeatherMap API key.');
        } else {
            throw new Error(`HTTP Error: ${response.status}`);
        }
    }
    
    return await response.json();
}

/**
 * Fetch 5-day forecast data from API
 */
async function fetchForecast(cityName) {
    const url = `${API_CONFIG.baseUrl}/forecast?q=${encodeURIComponent(cityName)}&appid=${API_CONFIG.apiKey}&units=metric`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`Forecast fetch failed: ${response.status}`);
    }
    
    return await response.json();
}

/**
 * Handle geolocation request
 * Demonstrates browser Geolocation API
 */
function handleGetLocation() {
    if (!navigator.geolocation) {
        showError('Geolocation Not Supported', 
            'Your browser does not support geolocation. Please search for a city manually.');
        return;
    }
    
    setUIState(UI_STATES.LOADING);
    
    // Request user's current location
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            try {
                const { latitude, longitude } = position.coords;
                await searchWeatherByCoordinates(latitude, longitude);
            } catch (error) {
                console.error('Location weather fetch failed:', error);
                showError('Location Error', 
                    'Unable to fetch weather data for your location. Please try again.');
            }
        },
        (error) => {
            console.error('Geolocation error:', error);
            let errorMessage = 'Unable to access your location. ';
            
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage += 'Location access was denied. Please enable location permissions.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage += 'Location information is unavailable.';
                    break;
                case error.TIMEOUT:
                    errorMessage += 'Location request timed out.';
                    break;
                default:
                    errorMessage += 'An unknown error occurred.';
                    break;
            }
            
            showError('Location Access Failed', errorMessage);
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes
        }
    );
}

/**
 * Search weather by coordinates
 * Used for geolocation-based weather lookup
 */
async function searchWeatherByCoordinates(lat, lon) {
    try {
        // For demo purposes, use mock data if API key is not configured
        if (API_CONFIG.apiKey === 'YOUR_API_KEY_HERE') {
            await new Promise(resolve => setTimeout(resolve, 1500));
            const mockData = generateMockWeatherData('Your Location');
            displayWeatherData(mockData);
            setUIState(UI_STATES.SUCCESS);
            return;
        }
        
        const url = `${API_CONFIG.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${API_CONFIG.apiKey}&units=metric`;
        const forecastUrl = `${API_CONFIG.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${API_CONFIG.apiKey}&units=metric`;
        
        const [weatherResponse, forecastResponse] = await Promise.all([
            fetch(url),
            fetch(forecastUrl)
        ]);
        
        if (!weatherResponse.ok || !forecastResponse.ok) {
            throw new Error('Failed to fetch weather data');
        }
        
        const weatherData = await weatherResponse.json();
        const forecastData = await forecastResponse.json();
        
        appState.weatherData = weatherData;
        appState.forecastData = forecastData;
        appState.currentCity = weatherData.name;
        
        displayWeatherData(weatherData);
        displayForecast(forecastData);
        
        setUIState(UI_STATES.SUCCESS);
        
    } catch (error) {
        throw error;
    }
}

/**
 * Display weather data in the UI
 * Demonstrates DOM manipulation and data presentation
 */
function displayWeatherData(data) {
    // Update location and date
    elements.locationName.textContent = `${data.name}, ${data.sys.country}`;
    elements.currentDate.textContent = formatCurrentDate();
    
    // Update weather icon
    const iconCode = data.weather[0].icon;
    elements.mainWeatherIcon.src = `${API_CONFIG.iconBaseUrl}/${iconCode}@2x.png`;
    elements.mainWeatherIcon.alt = data.weather[0].description;
    
    // Update temperature
    const temp = Math.round(data.main.temp);
    elements.currentTemp.textContent = formatTemperature(temp);
    
    // Update weather condition
    elements.weatherCondition.textContent = data.weather[0].main;
    elements.weatherDescription.textContent = capitalizeWords(data.weather[0].description);
    
    // Update weather details
    elements.feelsLike.textContent = formatTemperature(Math.round(data.main.feels_like));
    elements.humidity.textContent = `${data.main.humidity}%`;
    elements.windSpeed.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`; // Convert m/s to km/h
    elements.pressure.textContent = `${data.main.pressure} hPa`;
    elements.visibility.textContent = `${Math.round(data.visibility / 1000)} km`;
    
    // UV Index would require additional API call in real implementation
    elements.uvIndex.textContent = 'N/A';
}

/**
 * Display 5-day forecast
 * Demonstrates working with arrays and date manipulation
 */
function displayForecast(data) {
    elements.forecastContainer.innerHTML = '';
    
    // Group forecast data by day (API returns 3-hour intervals)
    const dailyForecasts = groupForecastByDay(data.list);
    
    // Display first 5 days
    const forecastDays = Object.keys(dailyForecasts).slice(0, 5);
    
    forecastDays.forEach(date => {
        const dayData = dailyForecasts[date];
        const forecastElement = createForecastElement(date, dayData);
        elements.forecastContainer.appendChild(forecastElement);
    });
}

/**
 * Group forecast data by day
 * Demonstrates data processing and manipulation
 */
function groupForecastByDay(forecastList) {
    const grouped = {};
    
    forecastList.forEach(item => {
        const date = new Date(item.dt * 1000).toDateString();
        
        if (!grouped[date]) {
            grouped[date] = {
                temps: [],
                conditions: [],
                icons: [],
                descriptions: []
            };
        }
        
        grouped[date].temps.push(item.main.temp);
        grouped[date].conditions.push(item.weather[0].main);
        grouped[date].icons.push(item.weather[0].icon);
        grouped[date].descriptions.push(item.weather[0].description);
    });
    
    // Calculate daily averages and most common conditions
    Object.keys(grouped).forEach(date => {
        const dayData = grouped[date];
        dayData.maxTemp = Math.max(...dayData.temps);
        dayData.minTemp = Math.min(...dayData.temps);
        dayData.avgTemp = dayData.temps.reduce((a, b) => a + b, 0) / dayData.temps.length;
        
        // Get most common condition and icon
        dayData.condition = getMostFrequent(dayData.conditions);
        dayData.icon = getMostFrequent(dayData.icons);
        dayData.description = getMostFrequent(dayData.descriptions);
    });
    
    return grouped;
}

/**
 * Create forecast element for a single day
 * Demonstrates DOM element creation
 */
function createForecastElement(date, dayData) {
    const forecastItem = document.createElement('div');
    forecastItem.className = 'forecast-item';
    
    const dayName = formatDayName(new Date(date));
    
    forecastItem.innerHTML = `
        <div class="forecast-day">${dayName}</div>
        <div class="forecast-icon">
            <img src="${API_CONFIG.iconBaseUrl}/${dayData.icon}.png" alt="${dayData.description}">
        </div>
        <div class="forecast-temps">
            <span class="forecast-high">${formatTemperature(Math.round(dayData.maxTemp))}</span>
            <span class="forecast-low">${formatTemperature(Math.round(dayData.minTemp))}</span>
        </div>
        <div class="forecast-condition">${dayData.condition}</div>
    `;
    
    return forecastItem;
}

/**
 * Add city to recent searches
 * Demonstrates array manipulation and data persistence
 */
function addToRecentCities(cityName) {
    // Remove if already exists (to move to front)
    appState.recentCities = appState.recentCities.filter(city => 
        city.toLowerCase() !== cityName.toLowerCase()
    );
    
    // Add to front
    appState.recentCities.unshift(cityName);
    
    // Keep only last 5 cities
    appState.recentCities = appState.recentCities.slice(0, 5);
    
    // Save to localStorage
    saveRecentCities();
    
    // Update UI
    renderRecentCities();
}

/**
 * Render recent cities in the UI
 * Demonstrates dynamic content creation
 */
function renderRecentCities() {
    elements.recentCitiesList.innerHTML = '';
    
    if (appState.recentCities.length === 0) {
        elements.recentCities.classList.add('hidden');
        return;
    }
    
    elements.recentCities.classList.remove('hidden');
    
    appState.recentCities.forEach(city => {
        const cityElement = document.createElement('button');
        cityElement.className = 'recent-city-item';
        cityElement.textContent = city;
        cityElement.addEventListener('click', () => searchWeatherByCity(city));
        elements.recentCitiesList.appendChild(cityElement);
    });
}

/**
 * Handle recent city click
 * Demonstrates event delegation
 */
function handleRecentCityClick(e) {
    if (e.target.classList.contains('recent-city-item')) {
        const cityName = e.target.textContent;
        searchWeatherByCity(cityName);
    }
}

/**
 * Clear recent cities history
 */
function clearRecentCities() {
    appState.recentCities = [];
    saveRecentCities();
    elements.recentCities.classList.add('hidden');
}

/**
 * Toggle temperature unit between Celsius and Fahrenheit
 * Demonstrates state management and UI updates
 */
function toggleTemperatureUnit() {
    appState.temperatureUnit = appState.temperatureUnit === 'celsius' ? 'fahrenheit' : 'celsius';
    
    // Save preference
    localStorage.setItem(STORAGE_KEYS.TEMPERATURE_UNIT, appState.temperatureUnit);
    
    // Update UI
    updateTemperatureToggle();
    
    // Re-render weather data if available
    if (appState.weatherData) {
        displayWeatherData(appState.weatherData);
    }
    
    if (appState.forecastData) {
        displayForecast(appState.forecastData);
    }
}

/**
 * Update temperature toggle button text
 */
function updateTemperatureToggle() {
    elements.tempToggle.textContent = appState.temperatureUnit === 'celsius' ? '°F' : '°C';
}

/**
 * Handle retry button click
 */
function handleRetry() {
    if (appState.currentCity) {
        searchWeatherByCity(appState.currentCity);
    } else {
        setUIState(UI_STATES.INITIAL);
    }
}

/**
 * Set UI state and show/hide appropriate sections
 * Demonstrates state-based UI management
 */
function setUIState(state) {
    // Hide all state sections
    elements.loadingState.classList.add('hidden');
    elements.errorState.classList.add('hidden');
    elements.currentWeather.classList.add('hidden');
    elements.forecast.classList.add('hidden');
    
    switch (state) {
        case UI_STATES.LOADING:
            elements.loadingState.classList.remove('hidden');
            break;
        case UI_STATES.ERROR:
            elements.errorState.classList.remove('hidden');
            break;
        case UI_STATES.SUCCESS:
            elements.currentWeather.classList.remove('hidden');
            elements.forecast.classList.remove('hidden');
            renderRecentCities();
            break;
        case UI_STATES.INITIAL:
        default:
            renderRecentCities();
            break;
    }
}

/**
 * Show error message
 * Demonstrates error handling and user feedback
 */
function showError(title, message) {
    elements.errorTitle.textContent = title;
    elements.errorMessage.textContent = message;
    setUIState(UI_STATES.ERROR);
}

/**
 * Save recent cities to localStorage
 */
function saveRecentCities() {
    try {
        localStorage.setItem(STORAGE_KEYS.RECENT_CITIES, JSON.stringify(appState.recentCities));
    } catch (error) {
        console.error('Failed to save recent cities:', error);
    }
}

// Utility functions for data formatting and manipulation

/**
 * Format temperature based on current unit
 */
function formatTemperature(celsius) {
    if (appState.temperatureUnit === 'fahrenheit') {
        const fahrenheit = (celsius * 9/5) + 32;
        return `${Math.round(fahrenheit)}°F`;
    }
    return `${celsius}°C`;
}

/**
 * Format current date
 */
function formatCurrentDate() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return now.toLocaleDateString('en-US', options);
}

/**
 * Format day name for forecast
 */
function formatDayName(date) {
    const today = new Date().toDateString();
    const tomorrow = new Date(Date.now() + 86400000).toDateString();
    
    if (date.toDateString() === today) {
        return 'Today';
    } else if (date.toDateString() === tomorrow) {
        return 'Tomorrow';
    } else {
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    }
}

/**
 * Capitalize words in a string
 */
function capitalizeWords(str) {
    return str.replace(/\b\w/g, letter => letter.toUpperCase());
}

/**
 * Get most frequent item in an array
 */
function getMostFrequent(arr) {
    const frequency = {};
    let maxCount = 0;
    let mostFrequent = arr[0];
    
    arr.forEach(item => {
        frequency[item] = (frequency[item] || 0) + 1;
        if (frequency[item] > maxCount) {
            maxCount = frequency[item];
            mostFrequent = item;
        }
    });
    
    return mostFrequent;
}

/**
 * Generate mock weather data for demo purposes
 * This function simulates API responses when no real API key is configured
 */
function generateMockWeatherData(cityName) {
    const mockConditions = [
        { main: 'Clear', description: 'clear sky', icon: '01d' },
        { main: 'Clouds', description: 'few clouds', icon: '02d' },
        { main: 'Clouds', description: 'scattered clouds', icon: '03d' },
        { main: 'Rain', description: 'light rain', icon: '10d' },
        { main: 'Snow', description: 'light snow', icon: '13d' }
    ];
    
    const randomCondition = mockConditions[Math.floor(Math.random() * mockConditions.length)];
    const baseTemp = Math.floor(Math.random() * 30) + 5; // 5-35°C
    
    return {
        name: cityName,
        sys: { country: 'Demo' },
        weather: [randomCondition],
        main: {
            temp: baseTemp,
            feels_like: baseTemp + Math.floor(Math.random() * 6) - 3,
            humidity: Math.floor(Math.random() * 40) + 30,
            pressure: Math.floor(Math.random() * 50) + 1000
        },
        wind: {
            speed: Math.random() * 10 + 2
        },
        visibility: Math.floor(Math.random() * 5000) + 5000
    };
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initWeatherApp);