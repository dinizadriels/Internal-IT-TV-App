import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { 
  fetchDollarRate, 
  fetchHistoricalDollarRate,
  fetchEuroRate,
  fetchHistoricalEuroRate,
  fetchBitcoinRate,
  fetchHistoricalBitcoinRate
} from '../lib/api';

export default function Dolar({ 
  currentDollarRate, 
  historicalDollarRate,
  currentEuroRate,
  historicalEuroRate,
  currentBitcoinRate,
  historicalBitcoinRate
}) {
  const [currentDate, setCurrentDate] = useState('');
  const [currentCurrency, setCurrentCurrency] = useState('dollar');
  const [currencyData, setCurrencyData] = useState({
    dollar: {
      current: currentDollarRate,
      historical: historicalDollarRate,
      symbol: 'USD',
      name: 'Dólar',
      icon: '💵'
    },
    euro: {
      current: currentEuroRate,
      historical: historicalEuroRate,
      symbol: 'EUR',
      name: 'Euro',
      icon: '💶'
    },
    bitcoin: {
      current: currentBitcoinRate,
      historical: historicalBitcoinRate,
      symbol: 'BTC',
      name: 'Bitcoin',
      icon: '₿'
    }
  });

  useEffect(() => {
    // Atualizar data atual
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    setCurrentDate(`${day}/${month}/${year}`);
    
    // Rotação automática entre moedas
    const interval = setInterval(() => {
      setCurrentCurrency(prev => {
        switch(prev) {
          case 'dollar': return 'euro';
          case 'euro': return 'bitcoin';
          case 'bitcoin': return 'dollar';
          default: return 'dollar';
        }
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Formatar o preço da moeda
  const formatCurrency = (value, isBitcoin = false) => {
    if (!value) return '0,00';
    
    const numValue = Number(value);
    
    if (isBitcoin) {
      // Para Bitcoin, usar formato com mais casas decimais e separador de milhares
      return numValue.toLocaleString('pt-BR', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      });
    }
    
    return numValue.toLocaleString('pt-BR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  // Obter dados da moeda atual
  const getCurrentData = () => {
    const data = currencyData[currentCurrency];
    
    // Determinar o código da moeda para acessar os dados da API
    let currencyCode;
    let isBitcoin = false;
    
    switch(currentCurrency) {
      case 'dollar':
        currencyCode = 'USDBRL';
        break;
      case 'euro':
        currencyCode = 'EURBRL';
        break;
      case 'bitcoin':
        currencyCode = 'BTCBRL';
        isBitcoin = true;
        break;
      default:
        currencyCode = 'USDBRL';
    }
    
    return {
      ...data,
      currencyCode,
      isBitcoin,
      currentRate: data.current?.[currencyCode],
      historicalRate: data.historical
    };
  };

  const currentData = getCurrentData();

  return (
    <Layout title={`TV - Cotação do ${currentData.name}`}>
      <div className="currency-container fade-in">
        <div className="date-display">{currentDate}</div>
        
        <div className="currency-carousel">
          <div className="currency-tabs">
            <button 
              className={`currency-tab ${currentCurrency === 'dollar' ? 'active' : ''}`}
              onClick={() => setCurrentCurrency('dollar')}
            >
              💵 Dólar
            </button>
            <button 
              className={`currency-tab ${currentCurrency === 'euro' ? 'active' : ''}`}
              onClick={() => setCurrentCurrency('euro')}
            >
              💶 Euro
            </button>
            <button 
              className={`currency-tab ${currentCurrency === 'bitcoin' ? 'active' : ''}`}
              onClick={() => setCurrentCurrency('bitcoin')}
            >
              ₿ Bitcoin
            </button>
          </div>
          
          <section className="current-rate scale-in">
            <div className="currency-header">
              <span className="currency-icon">{currentData.icon}</span>
              <h2 className="currency-title">{currentData.name} hoje</h2>
            </div>
            
            <h1 className="currency-value">
              R$ {formatCurrency(currentData.currentRate?.bid, currentData.isBitcoin)}
            </h1>
            
            <hr className="divider" />
            
            {currentData.historicalRate && currentData.historicalRate.length > 0 && (
              <p className="historical-rate slide-in-right">
                Cotação final do dia anterior: <span>R$ {formatCurrency(currentData.historicalRate[0]?.bid, currentData.isBitcoin)}</span>
              </p>
            )}
          </section>
          
          <div className="currency-info slide-in-left">
            <h3>Informações da Cotação</h3>
            
            <div className="info-grid">
              {currentData.currentRate && (
                <>
                  <div className="info-card">
                    <h4>Máxima</h4>
                    <p className="value high">R$ {formatCurrency(currentData.currentRate.high, currentData.isBitcoin)}</p>
                  </div>
                  
                  <div className="info-card">
                    <h4>Mínima</h4>
                    <p className="value low">R$ {formatCurrency(currentData.currentRate.low, currentData.isBitcoin)}</p>
                  </div>
                  
                  <div className="info-card">
                    <h4>Variação</h4>
                    <p className={`value ${Number(currentData.currentRate.pctChange) >= 0 ? 'positive' : 'negative'}`}>
                      {Number(currentData.currentRate.pctChange) >= 0 ? '+' : ''}{currentData.currentRate.pctChange}%
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .date-display {
          font-size: 1.2rem;
          font-weight: 500;
          text-align: right;
          margin-bottom: 1rem;
          color: #666;
        }
        
        .currency-container {
          padding: 1rem;
        }
        
        .currency-carousel {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        .currency-tabs {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        
        .currency-tab {
          padding: 0.75rem 1.5rem;
          background-color: var(--background-card);
          border: none;
          border-radius: var(--border-radius);
          color: var(--text-light);
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .currency-tab.active {
          background-color: var(--primary-color);
          color: white;
          transform: translateY(-3px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
        }
        
        .current-rate {
          background-color: var(--background-card);
          border-radius: var(--border-radius);
          padding: 2rem;
          text-align: center;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        
        .currency-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        
        .currency-icon {
          font-size: 2.5rem;
        }
        
        .currency-title {
          font-size: 2rem;
          font-weight: 600;
          color: var(--text-light);
          margin: 0;
        }
        
        .currency-value {
          font-size: 4rem;
          font-weight: 700;
          color: var(--primary-color);
          margin: 1.5rem 0;
        }
        
        .divider {
          border: none;
          height: 1px;
          background-color: rgba(255, 255, 255, 0.1);
          margin: 1.5rem 0;
        }
        
        .historical-rate {
          font-size: 1.2rem;
          color: var(--text-secondary);
        }
        
        .historical-rate span {
          color: var(--secondary-color);
          font-weight: 500;
        }
        
        .currency-info {
          background-color: var(--background-card);
          border-radius: var(--border-radius);
          padding: 1.5rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        
        .currency-info h3 {
          margin-bottom: 1.5rem;
          color: var(--text-light);
          font-size: 1.5rem;
          text-align: center;
        }
        
        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
        }
        
        .info-card {
          padding: 1.5rem;
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: var(--border-radius);
          text-align: center;
        }
        
        .info-card h4 {
          color: var(--text-secondary);
          margin-bottom: 0.75rem;
          font-size: 1.1rem;
          font-weight: 500;
        }
        
        .value {
          font-size: 1.5rem;
          font-weight: 600;
        }
        
        .high {
          color: var(--success-color);
        }
        
        .low {
          color: var(--danger-color);
        }
        
        .positive {
          color: var(--success-color);
        }
        
        .negative {
          color: var(--danger-color);
        }
        
        @media (max-width: 768px) {
          .currency-value {
            font-size: 3rem;
          }
          
          .currency-tabs {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </Layout>
  );
}

export async function getServerSideProps() {
  // Buscar cotações atuais
  const currentDollarRate = await fetchDollarRate();
  const currentEuroRate = await fetchEuroRate();
  const currentBitcoinRate = await fetchBitcoinRate();
  
  // Buscar cotações históricas
  const historicalDollarRate = await fetchHistoricalDollarRate();
  const historicalEuroRate = await fetchHistoricalEuroRate();
  const historicalBitcoinRate = await fetchHistoricalBitcoinRate();
  
  return {
    props: {
      currentDollarRate: currentDollarRate || {},
      historicalDollarRate: historicalDollarRate || [],
      currentEuroRate: currentEuroRate || {},
      historicalEuroRate: historicalEuroRate || [],
      currentBitcoinRate: currentBitcoinRate || {},
      historicalBitcoinRate: historicalBitcoinRate || []
    }
  };
}
