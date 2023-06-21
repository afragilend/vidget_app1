import React from 'react';
import ReactDOM from 'react-dom';
import WeatherWidget from './components/WeatherWidget.tsx';

ReactDOM.render(
    <React.StrictMode>
        <WeatherWidget />
    </React.StrictMode>,
    document.getElementById('root')
);
