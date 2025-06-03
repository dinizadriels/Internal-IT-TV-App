import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import { fetchServicesStatus } from '../lib/api';

export default function Servicos({ initialServices }) {
  const [currentDate, setCurrentDate] = useState('');
  const [services, setServices] = useState(initialServices || {});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Atualizar data atual
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    setCurrentDate(`${day}/${month}/${year}`);
    
    // Verificar status dos serviços a cada 2 minutos
    const interval = setInterval(() => {
      refreshServicesStatus();
    }, 2 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Função para atualizar status dos serviços
  const refreshServicesStatus = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedServices = await fetchServicesStatus();
      setServices(updatedServices);
    } catch (err) {
      console.error('Erro ao atualizar status dos serviços:', err);
      setError('Não foi possível atualizar o status dos serviços. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  // Verificar se há algum serviço offline
  const hasOfflineService = Object.values(services).some(service => service.status === 'off');

  // Efeito para reproduzir som quando algum serviço estiver offline
  useEffect(() => {
    if (hasOfflineService) {
      const audio = new Audio('/sounds/down.mp3');
      audio.play().catch(e => console.log('Erro ao reproduzir áudio:', e));
    }
  }, [hasOfflineService]);

  return (
    <Layout title="TV - Serviços Internos">
      <div className="services-container fade-in">
        <div className="date-display">{currentDate}</div>
        
        <h2 className="section-title" style={{marginBottom: '1.5rem', fontSize: '2rem', fontWeight: '600', textAlign: 'center'}}>
          Status dos Serviços Internos
        </h2>
        
        {loading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <p>Verificando status dos serviços...</p>
          </div>
        )}
        
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={refreshServicesStatus} className="refresh-button">
              Tentar novamente
            </button>
          </div>
        )}
        
        <div className="card-grid slide-in-right">
          {Object.entries(services).map(([key, service], index) => (
            <Card 
              key={key}
              title={service.label} 
              description={service.description}
              status={service.status}
              icon={getServiceIcon(service.label)}
              style={{animationDelay: `${index * 0.1}s`}}
            />
          ))}
        </div>
        
        <div className="status-summary">
          <div className="summary-item">
            <div className="status-count online">
              {Object.values(services).filter(service => service.status === 'on').length}
            </div>
            <p>Serviços Online</p>
          </div>
          
          <div className="summary-item">
            <div className="status-count offline">
              {Object.values(services).filter(service => service.status === 'off').length}
            </div>
            <p>Serviços Offline</p>
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
        
        .services-container {
          padding: 1rem;
        }
        
        .card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .loading-overlay {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          margin-bottom: 1rem;
          background-color: rgba(0, 0, 0, 0.1);
          border-radius: 8px;
        }
        
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          border-top-color: var(--primary-color);
          animation: spin 1s ease-in-out infinite;
          margin-bottom: 1rem;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .error-message {
          text-align: center;
          padding: 2rem;
          margin-bottom: 1rem;
          background-color: rgba(244, 67, 54, 0.1);
          border-radius: 8px;
        }
        
        .refresh-button {
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          background-color: var(--primary-color);
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        
        .refresh-button:hover {
          background-color: var(--secondary-color);
        }
        
        .status-summary {
          display: flex;
          justify-content: center;
          gap: 3rem;
          margin-top: 2rem;
          padding: 1.5rem;
          background-color: var(--background-card);
          border-radius: var(--border-radius);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        
        .summary-item {
          text-align: center;
        }
        
        .status-count {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        
        .online {
          color: var(--success-color);
        }
        
        .offline {
          color: var(--danger-color);
        }
      `}</style>
    </Layout>
  );
}

function getServiceIcon(label) {
  const icons = {
    'APP': 'Descrição do APP',
    'APP': 'Descrição do APP',
    'APP': 'Descrição do APP',
    'APP': 'Descrição do APP',
    'APP': 'Descrição do APP',
    'APP': 'Descrição do APP',
    'APP': 'Descrição do APP',
  };
  
  return icons[label] || '/images/ubuntu.png';
}

export async function getServerSideProps() {
  try {
    const services = await fetchServicesStatus();
    
    return {
      props: {
        initialServices: services
      }
    };
  } catch (error) {
    console.error('Erro ao buscar status inicial dos serviços:', error);
    return {
      props: {
        initialServices: {}
      }
    };
  }
}
