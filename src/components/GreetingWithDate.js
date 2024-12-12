import React, { useState, useEffect } from "react";
import "./GreetingWithDate.css";
import { useNavigate } from "react-router-dom";


export default function GreetingWithDate() {
  const currentDate = new Date().toLocaleDateString("en-US", {  // Stores the current date
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const navigate = useNavigate();

  const handleLogout = () => { // function for the logout button, when the button is clicked the token is removed which removes user access
    localStorage.removeItem("token");
    navigate("/"); // Redirect to the home page
  };

  const [weather, setWeather] = useState(null); // Weather data
  const [error, setError] = useState(""); // Error message

  const API_KEY = "99ada0832a1e622052975e18e788b66a"; //OpenWeatherMap API key
  const location = "IRVINE"; // city

  useEffect(() => { // WEATHER API FUNCTIONALITY
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch weather data.");
        }

        const data = await response.json();
        setWeather({
          temp: data.main.temp,
          description: data.weather[0].description,
          city: data.name,
        });
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setError("Could not fetch weather data.");
      }
    };

    fetchWeather();
  }, []);

  return ( // Display for the
    <div className="container">
      <div className="greeting">
        <h1>Welcome back, User!</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div className="date-box">
        <h2>The date is {currentDate}</h2>
        <div className="weather">
          {weather ? (
            <>
              <p>Current Weather in {weather.city}:</p>
              <p>
                {weather.temp}°C - {weather.description}
              </p>
            </>
          ) : (
            <p>{error || "Loading weather data..."}</p>
          )}
        </div>
      </div>
    </div>
  );
}