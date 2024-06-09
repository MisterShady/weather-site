import React, {useState} from 'react';
import axios from 'axios';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const App = () => {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState([]);

    const apiKey = '6683ab9d483bd12c06454f06a56ce6be';

    const getWeather = async () => {
        try {
            const [weatherResponse, forecastResponse] = await Promise.all([
                axios.get('https://api.openweathermap.org/data/2.5/weather', {
                    params: {q: city, appid: apiKey, units: 'metric', lang: 'ru'},
                }),
                axios.get('https://api.openweathermap.org/data/2.5/forecast', {
                    params: {q: city, appid: apiKey, units: 'metric', lang: 'ru'},
                }),
            ]);

            setWeather(weatherResponse.data);
            setForecast(processForecast(forecastResponse.data.list));
            toast.success('Данные получены успешно!');
        } catch (error) {
            handleErrors(error);
        }
    };

    const processForecast = (forecastList) => {
        const filteredForecast = {};

        forecastList.forEach((item) => {
            const date = item.dt_txt.split(' ')[0];
            if (!filteredForecast[date] || item.main.temp > filteredForecast[date].temp) {
                filteredForecast[date] = {
                    date: date,
                    weather: item.weather[0],
                    temp: item.main.temp,
                };
            }
        });

        const todayDate = new Date().toISOString().split('T')[0];
        return Object.values(filteredForecast).filter(day => day.date !== todayDate);
    };

    const handleErrors = (error) => {
        console.error('Ошибка при получении данных:', error);
        if (error.response) {
            const {status} = error.response;
            if (status === 401) {
                toast.error('Ошибка авторизации. Проверьте ваш API ключ.');
            } else if (status === 404) {
                toast.error('Город не найден. Проверьте название введённого города.');
            } else {
                toast.error('Ошибка при получении данных. Проверьте название города и API ключа.');
            }
        } else {
            toast.error('Произошла ошибка при соединении. Проверьте ваше интернет-соединение.');
        }
    };

    const handleInputChange = (event) => {
        setCity(event.target.value);
    };

    const handleSearch = () => {
        if (city) {
            getWeather();
        } else {
            toast.error('Пожалуйста, введите название города.');
        }
    };

    const getWeatherIconUrl = (icon) => `https://openweathermap.org/img/wn/${icon}.png`;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {weekday: 'long', day: 'numeric', month: 'long'});
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
                {weather && (
                    <div className="weather-info">
                        <h2>{weather.name}</h2>
                        <img src={getWeatherIconUrl(weather.weather[0].icon)} alt="weather icon"/>
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
                                    <img src={getWeatherIconUrl(day.weather.icon)} alt="weather icon"/>
                                    <p>{Math.round(day.temp)} °C</p>
                                    <p>{day.weather.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <ToastContainer/>
        </div>
    );
}

export default App;