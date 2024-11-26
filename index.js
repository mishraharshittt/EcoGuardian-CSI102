document.addEventListener("DOMContentLoaded", () => {
  const weatherText = document.getElementById("weather");

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const apiKey = '79718b8bff714da4a3d92728241011';
      const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}&aqi=no`;

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data); 

        const weatherDescription = data.current.condition.text;
        const temperature = data.current.temp_c;
        weatherText.textContent = `It's currently ${weatherDescription} with a temperature of ${temperature}°C.`;
      } catch (error) {
        console.error("Error fetching weather data:", error);
        weatherText.textContent = "Unable to fetch weather data. Please try again later.";
      }
    }, () => {
      weatherText.textContent = "Location access denied. Unable to fetch weather data.";
    });
  } else {
    weatherText.textContent = "Geolocation is not supported by your browser.";
  }

  document.getElementById("developers-btn").onclick = () => {
    window.location.href = "developers.html"; 
  };

  document.getElementById("individuals-btn").onclick = () => {
    window.location.href = "individuals.html"; 
  };
});
