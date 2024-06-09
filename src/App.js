import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [error, setError] = useState('');

    const apiKey = '6683ab9d483bd12c06454f06a56ce6be';

    const getWeather = async () => {
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`);
            setWeather(response.data);
            setError('');

            const forecastResponse = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`);
            console.log('Forecast Response:', forecastResponse.data);

            const filteredForecast = {};

            forecastResponse.data.list.forEach((item) => {
                const date = item.dt_txt.split(' ')[0];
                if (!filteredForecast[date] || item.main.temp > filteredForecast[date].temp) {
                    filteredForecast[date] = {
                        date: date,
                        weather: item.weather[0],
                        temp: item.main.temp,
                    };
                }
            });

            const today = new Date();
            const todayDate = today.toISOString().split('T')[0];

            const filteredForecastArray = Object.values(filteredForecast).filter(day => day.date !== todayDate);

            setForecast(filteredForecastArray);

        } catch (error) {
            console.error('Ошибка при получении данных:', error);
            if (error.response && error.response.status === 401) {
                setError('Ошибка авторизации. Проверьте ваш API ключ.');
            } else if (error.response && error.response.status === 404) {
                setError('Город не найден. Проверьте правильность введённого города.');
            } else {
                setError('Ошибка при получении данных. Пожалуйста, проверьте правильность введённого города и API ключа.');
            }
        }
    };

    const handleInputChange = (event) => {
        setCity(event.target.value);
    };

    const handleSearch = () => {
        if (city) {
            getWeather();
        } else {
            setError('Пожалуйста, введите название города.');
        }
    };

    const getWeatherIconUrl = (icon) => `https://openweathermap.org/img/wn/${icon}.png`;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' });
    };

    return (
        <div>
            <div className="container">
                <h1>Прогноз погоды</h1>
                <input
                    type="text"
                    value={city}
                    onChange={handleInputChange}
                    placeholder="Введите город"
                />
                <button onClick={handleSearch}>Найти</button>
                {error && <p className="error">{error}</p>}
                {weather && (
                    <div className="weather-info">
                        <h2>{weather.name}</h2>
                        <img src={getWeatherIconUrl(weather.weather[0].icon)} alt="weather icon" />
                        <p>Температура: {Math.round(weather.main.temp)} °C</p>
                        <p>Погода: {weather.weather[0].description}</p>
                        <p>Влажность: {weather.main.humidity} %</p>
                        <p>Скорость ветра: {weather.wind.speed} м/с</p>
                    </div>
                )}
            </div>
            <div className="container2">
                {forecast.length > 0 && (
                    <div className="forecast">
                        <h2>Прогноз на 5 дней</h2>
                        <div className="forecast-days">
                            {forecast.map((day, index) => (
                                <div key={index} className="forecast-day">
                                    <p>{formatDate(day.date)}</p>
                                    <img src={getWeatherIconUrl(day.weather.icon)} alt="weather icon" />
                                    <p>Температура: {Math.round(day.temp)} °C</p>
                                    <p>Погода: {day.weather.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
