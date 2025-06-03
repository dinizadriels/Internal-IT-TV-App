import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { fetchWeatherData } from '../lib/api';

export default function Clima({ initialWeatherData }) {
  const [weatherData, setWeatherData] = useState(initialWeatherData);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    // Atualizar data atual
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    setCurrentDate(`${day}/${month}/${year}`);
  }, []);

  // Tradução de condições climáticas
  const portugueseConditions = {
    'Rain': 'Chuva',
    'Clouds': 'Nublado',
    'Clear': 'Limpo',
    'Partly cloudy': 'Parcialmente Nublado',
    'clear sky': 'Céu Limpo',
    'few clouds': 'Poucas Nuvens',
    'broken clouds': 'Nuvens Fragmentadas',
    'scattered clouds': 'Nuvens Dispersas',
    'shower rain': 'Chuva Forte',
    'moderate rain': 'Chuva Moderada',
    'light rain': 'Chuva Leve',
    'thunderstorm': 'Tempestade',
    'snow': 'Neve',
    'mist': 'Névoa',
    'overcast clouds': 'Céu Encoberto',
    'haze': 'Neblina',
    'fog': 'Nevoeiro',
    'drizzle': 'Garoa',
    'smoke': 'Fumaça',
    'dust': 'Poeira',
    'sand': 'Areia',
    'ash': 'Cinzas',
    'squall': 'Rajada',
    'tornado': 'Tornado',
    'heavy intensity rain': 'Chuva Intensa',
    'very heavy rain': 'Chuva Muito Intensa',
    'extreme rain': 'Chuva Extrema',
    'freezing rain': 'Chuva Congelante',
    'light intensity shower rain': 'Pancada de Chuva Leve',
    'heavy intensity shower rain': 'Pancada de Chuva Intensa',
    'ragged shower rain': 'Pancada de Chuva Irregular',
    'light snow': 'Neve Leve',
    'heavy snow': 'Neve Intensa',
    'sleet': 'Aguaneve',
    'light shower sleet': 'Aguaneve Leve',
    'shower sleet': 'Aguaneve',
    'light rain and snow': 'Chuva Leve com Neve',
    'rain and snow': 'Chuva com Neve',
    'light shower snow': 'Neve Leve',
    'shower snow': 'Neve',
    'heavy shower snow': 'Neve Intensa'
  };

  // Tradução de dias da semana
  const portugueseDays = {
    'Sunday': 'Dom',
    'Monday': 'Seg',
    'Tuesday': 'Ter',
    'Wednesday': 'Qua',
    'Thursday': 'Qui',
    'Friday': 'Sex',
    'Saturday': 'Sab'
  };

  // Função para obter ícone com base na condição
  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'Rain':
      case 'light rain':
      case 'moderate rain':
      case 'heavy intensity rain':
      case 'very heavy rain':
      case 'extreme rain':
      case 'freezing rain':
      case 'light intensity shower rain':
      case 'heavy intensity shower rain':
      case 'ragged shower rain':
      case 'shower rain':
      case 'drizzle':
        return 'https://img.icons8.com/color-glass/96/rain--v1.png';
      case 'Clouds':
      case 'broken clouds':
      case 'scattered clouds':
      case 'overcast clouds':
        return 'https://img.icons8.com/color-glass/96/cloud--v1.png';
      case 'Clear':
      case 'clear sky':
        return 'https://img.icons8.com/color-glass/96/sun--v1.png';
      case 'Partly cloudy':
      case 'few clouds':
        return 'https://img.icons8.com/color-glass/96/partly-cloudy-day--v1.png';
      case 'thunderstorm':
        return 'https://img.icons8.com/color-glass/96/storm--v1.png';
      case 'snow':
      case 'light snow':
      case 'heavy snow':
      case 'sleet':
      case 'light shower sleet':
      case 'shower sleet':
      case 'light rain and snow':
      case 'rain and snow':
      case 'light shower snow':
      case 'shower snow':
      case 'heavy shower snow':
        return 'https://img.icons8.com/color-glass/96/snow--v1.png';
      case 'mist':
      case 'haze':
      case 'fog':
      case 'smoke':
      case 'dust':
      case 'sand':
      case 'ash':
        return 'https://img.icons8.com/color-glass/96/fog-day--v1.png';
      default:
        return 'https://img.icons8.com/color/96/wind.png';
    }
  };

  // Função para traduzir condição climática
  const translateCondition = (condition) => {
    return portugueseConditions[condition] || condition;
  };

  return (
    <Layout title="TV - Previsão do Tempo">
      <div className="weather-container fade-in">
        <div className="date-display">{currentDate}</div>
        
        <section className="current-weather-centered scale-in">
          {weatherData && (
            <div className="weather-content">
              <div className="weather-icon">
                <img 
                  src={getWeatherIcon(weatherData.list[0].weather[0].main)} 
                  alt={translateCondition(weatherData.list[0].weather[0].main)}
                  width="120"
                  height="120"
                />
              </div>
              
              <h1 className="temperature">
                {Math.round(weatherData.list[0].main.temp)}°C
              </h1>
              
              <div className="location">
                <h2>Campinas</h2>
              </div>
              
              <div className="condition">
                <p>{translateCondition(weatherData.list[0].weather[0].main)}</p>
                <p className="description">{translateCondition(weatherData.list[0].weather[0].description)}</p>
              </div>
              
              <div className="extra-info">
                <div className="info-item">
                  <span className="label">Umidade</span>
                  <span className="value">{weatherData.list[0].main.humidity}%</span>
                </div>
                <div className="info-item">
                  <span className="label">Vento</span>
                  <span className="value">{Math.round(weatherData.list[0].wind.speed * 3.6)} km/h</span>
                </div>
                <div className="info-item">
                  <span className="label">Sensação</span>
                  <span className="value">{Math.round(weatherData.list[0].main.feels_like)}°C</span>
                </div>
              </div>
            </div>
          )}
        </section>
        
        <section className="week-forecast slide-in-right">
          {weatherData && weatherData.list.slice(1, 6).map((day, index) => {
            const date = new Date();
            date.setDate(date.getDate() + index + 1);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
            const dayNameShort = portugueseDays[dayName];
            const condition = day.weather[0].main;
            const description = day.weather[0].description;
            const translatedCondition = translateCondition(condition);
            const translatedDescription = translateCondition(description);
            const iconUrl = getWeatherIcon(condition);

            return (
              <div className="forecast-day" key={index} style={{animationDelay: `${index * 0.1}s`}}>
                <h3>{dayNameShort}</h3>
                <img src={iconUrl} width="64" height="64" alt={translatedCondition} />
                <p className="forecast-temp">{Math.round(day.main.temp)}°</p>
                <p className="forecast-condition">{translatedCondition}</p>
              </div>
            );
          })}
        </section>
      </div>

      <style jsx>{`
        .date-display {
          font-size: 1.2rem;
          font-weight: 500;
          text-align: right;
          margin-bottom: 1rem;
          color: #666;
        }
        
        .weather-container {
          padding: 1rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .current-weather-centered {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 3rem;
          padding: 2rem;
          background-color: var(--background-card);
          border-radius: var(--border-radius);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        
        .weather-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 500px;
        }
        
        .weather-icon {
          margin-bottom: 1rem;
        }
        
        .temperature {
          font-size: 5rem;
          font-weight: 700;
          color: var(--primary-color);
          margin: 0;
          line-height: 1;
        }
        
        .location h2 {
          font-size: 2rem;
          font-weight: 600;
          margin: 0.5rem 0;
        }
        
        .condition {
          margin: 1rem 0;
        }
        
        .condition p {
          font-size: 1.5rem;
          font-weight: 500;
          margin: 0.25rem 0;
          color: var(--text-light);
        }
        
        .condition .description {
          font-size: 1.2rem;
          color: var(--text-secondary);
        }
        
        .extra-info {
          display: flex;
          justify-content: space-between;
          width: 100%;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .info-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 1.5rem;
        }
        
        .info-item .label {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
        }
        
        .info-item .value {
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--text-light);
        }
        
        .week-forecast {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin-top: 2rem;
        }
        
        .forecast-day {
          background-color: var(--background-card);
          border-radius: var(--border-radius);
          padding: 1.5rem;
          text-align: center;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }
        
        .forecast-day:hover {
          transform: translateY(-5px);
        }
        
        .forecast-day h3 {
          font-size: 1.2rem;
          margin-bottom: 1rem;
          color: var(--text-light);
        }
        
        .forecast-temp {
          font-size: 1.8rem;
          font-weight: 700;
          margin: 0.5rem 0;
          color: var(--primary-color);
        }
        
        .forecast-condition {
          font-size: 1rem;
          color: var(--text-secondary);
        }
        
        @media (max-width: 768px) {
          .temperature {
            font-size: 4rem;
          }
          
          .location h2 {
            font-size: 1.8rem;
          }
          
          .condition p {
            font-size: 1.3rem;
          }
          
          .extra-info {
            flex-wrap: wrap;
          }
          
          .info-item {
            width: 33%;
            padding: 0.5rem;
          }
        }
      `}</style>
    </Layout>
  );
}

export async function getServerSideProps() {
  const weatherData = await fetchWeatherData('Campinas');
  
  return {
    props: {
      initialWeatherData: weatherData
    }
  };
}
