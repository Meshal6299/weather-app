const apiKey = config.MY_KEY;

const state = {
  unit: 'f',
  lastData: null,
};

const els = {
  form: document.getElementById('search-form'),
  input: document.getElementById('search-input'),
  unitToggle: document.getElementById('unit-toggle'),
  status: document.getElementById('status'),
  weather: document.getElementById('weather'),
  location: document.getElementById('location'),
  condition: document.getElementById('condition'),
  updated: document.getElementById('updated'),
  tempValue: document.getElementById('temp-value'),
  tempUnit: document.getElementById('temp-unit'),
  feelsLike: document.getElementById('feels-like'),
  humidity: document.getElementById('humidity'),
  wind: document.getElementById('wind'),
  pressure: document.getElementById('pressure'),
  visibility: document.getElementById('visibility'),
  uv: document.getElementById('uv'),
};

function setStatus(message, tone = 'info') {
  els.status.textContent = message;
  els.status.dataset.tone = tone;
}

function formatWind(current) {
  if (state.unit === 'f') {
    return `${current.wind_mph.toFixed(1)} mph ${current.wind_dir}`;
  }
  return `${current.wind_kph.toFixed(1)} km/h ${current.wind_dir}`;
}

function formatPressure(current) {
  if (state.unit === 'f') {
    return `${current.pressure_in.toFixed(2)} inHg`;
  }
  return `${current.pressure_mb.toFixed(0)} hPa`;
}

function formatVisibility(current) {
  if (state.unit === 'f') {
    return `${current.vis_miles.toFixed(1)} mi`;
  }
  return `${current.vis_km.toFixed(1)} km`;
}

function renderWeather(data) {
  const { location, current } = data;
  state.lastData = data;

  els.location.textContent = `${location.name}, ${location.region || location.country}`;
  els.condition.textContent = current.condition.text;
  els.updated.textContent = `Updated ${current.last_updated}`;

  const temp = state.unit === 'f' ? current.temp_f : current.temp_c;
  const feels = state.unit === 'f' ? current.feelslike_f : current.feelslike_c;
  els.tempValue.textContent = Math.round(temp);
  els.tempUnit.textContent = state.unit === 'f' ? '°F' : '°C';
  els.feelsLike.textContent = `${Math.round(feels)}${state.unit === 'f' ? '°F' : '°C'}`;

  els.humidity.textContent = `${current.humidity}%`;
  els.wind.textContent = formatWind(current);
  els.pressure.textContent = formatPressure(current);
  els.visibility.textContent = formatVisibility(current);
  els.uv.textContent = current.uv.toFixed(1);

  els.unitToggle.textContent = state.unit === 'f' ? '°F' : '°C';
  els.weather.hidden = false;
}

async function getWeather(location) {
  try {
    setStatus('Loading weather...', 'info');
    els.weather.hidden = true;
    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(location)}&aqi=no`);
    if (!response.ok) {
      throw new Error('Could not fetch weather.');
    }
    const data = await response.json();
    renderWeather(data);
    setStatus(`Showing weather for ${data.location.name}.`, 'success');
  } catch (err) {
    setStatus(err.message || 'Something went wrong.', 'error');
  }
}

function handleSearch(event) {
  event.preventDefault();
  const query = els.input.value.trim();
  if (!query) {
    setStatus('Enter a city or ZIP to search.', 'error');
    return;
  }
  getWeather(query);
}

function handleUnitToggle() {
  state.unit = state.unit === 'f' ? 'c' : 'f';
  if (state.lastData) {
    renderWeather(state.lastData);
    setStatus(`Switched to ${state.unit === 'f' ? 'Fahrenheit' : 'Celsius'}.`, 'info');
  }
}

function init() {
  els.form.addEventListener('submit', handleSearch);
  els.unitToggle.addEventListener('click', handleUnitToggle);
  els.input.value = 'New York';
  getWeather('New York');
}

document.addEventListener('DOMContentLoaded', init);