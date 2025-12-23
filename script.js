async function getWeather(location) {
  const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${key}&q=${location}&aqi=no`)
  const data = await response.json();
  console.log(data)
}

getWeather('New York');