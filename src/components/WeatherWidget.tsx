import React, { useState, useEffect } from "react";
import axios from "axios";

interface WeatherData {
    main: {
        temp: number;
        humidity: number;
    };
    weather: {
        description: string;
        icon: string;
    }[];
}

interface ForecastData {
    list: {
        dt_txt: string;
        main: {
            temp: number;
            humidity: number;
        };
        weather: {
            description: string;
            icon: string;
        }[];
    }[];
}

const WeatherWidget: React.FC = () => {
    const [city, setCity] = useState("");
    const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
    const [forecast, setForecast] = useState<ForecastData | null>(null);
    const [isCurrentWeather, setIsCurrentWeather] = useState(true);

    const fetchCurrentWeather = async () => {
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=02bfae9ad771a23b7500840b7087263b`
            );
            setCurrentWeather(response.data);
        } catch (error) {
            console.error("Error fetching current weather:", error);
        }
    };

    const fetchForecast = async () => {
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=02bfae9ad771a23b7500840b7087263b`
            );
            setForecast(response.data);
        } catch (error) {
            console.error("Error fetching forecast:", error);
        }
    };

    const handleLocationClick = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetchWeatherByCoordinates(latitude, longitude);
                },
                (error) => {
                    console.error("Error getting geolocation:", error);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    };

    const fetchWeatherByCoordinates = async (latitude: number, longitude: number) => {
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=02bfae9ad771a23b7500840b7087263b`
            );
            setCurrentWeather(response.data);
        } catch (error) {
            console.error("Error fetching weather by coordinates:", error);
        }
    };

    useEffect(() => {
        if (city !== "") {
            if (isCurrentWeather) {
                fetchCurrentWeather();
            } else {
                fetchForecast();
            }
        }
        // eslint-disable-next-line
    }, [city, isCurrentWeather]);

    return (
        <div>
            <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city"
            />
            <button onClick={handleLocationClick}>Get Current Location</button>
            <div>
                <input
                    type="radio"
                    id="currentWeather"
                    checked={isCurrentWeather}
                    onChange={() => setIsCurrentWeather(true)}
                />
                <label htmlFor="currentWeather">Current Weather</label>
                <input
                    type="radio"
                    id="forecast"
                    checked={!isCurrentWeather}
                    onChange={() => setIsCurrentWeather(false)}
                />
                <label htmlFor="forecast">5-Day Forecast</label>
            </div>
            {currentWeather && isCurrentWeather && (
                <div>
                    <h2>Current Weather</h2>
                    <p>Temperature: {currentWeather.main.temp} °C</p>
                    <p>Humidity: {currentWeather.main.humidity}%</p>
                    <p>Description: {currentWeather.weather[0].description}</p>
                    <img
                        src={`https://openweathermap.org/img/w/${currentWeather.weather[0].icon}.png`}
                        alt="Weather Icon"
                    />
                </div>
            )}
            {forecast && !isCurrentWeather && (
                <div>
                    <h2>5-Day Forecast</h2>
                    {forecast.list.map((item) => (
                        <div key={item.dt_txt}>
                            <p>Date/Time: {item.dt_txt}</p>
                            <p>Temperature: {item.main.temp} °C</p>
                            <p>Humidity: {item.main.humidity}%</p>
                            <p>Description: {item.weather[0].description}</p>
                            <img
                                src={`https://openweathermap.org/img/w/${item.weather[0].icon}.png`}
                                alt="Weather Icon"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WeatherWidget;
