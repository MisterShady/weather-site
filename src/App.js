import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState('');

    const apiKey = '9f6650c297fba7c69df252fcfb7a058e';

    const getWeather = async () => {
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`);
            setWeather(response.data);
            setError('');
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

    return (
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
                    <p>Температура: {weather.main.temp} °C</p>
                    <p>Погода: {weather.weather[0].description}</p>
                    <p>Влажность: {weather.main.humidity} %</p>
                    <p>Скорость ветра: {weather.wind.speed} м/с</p>
                </div>
            )}
        </div>
    );
}

export default App;
