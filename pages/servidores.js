import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';

export default function Servidores() {
  const [currentDate, setCurrentDate] = useState('');
  const [servers, setServers] = useState({
    hiisdat: { 
      label: 'HIISDAT', 
      status: 'checking', 
      description: 'Servidor Samba 4 com os drives L e R.', 
      icon: '/images/ubuntu.png',
      host: 'https://192.168.0.95:10000' // Substitua pelo IP ou hostname real
    },
    hiisdat: { 
      label: 'HIISDAT', 
      status: 'checking', 
      description: 'Servidor Samba 4 com os drives L e R.', 
      icon: '/images/ubuntu.png',
      host: 'https://192.168.0.95:10000' // Substitua pelo IP ou hostname real
    },
    hiappb: { 
      label: 'HIAPPB', 
      status: 'checking', 
      description: 'Servidor de Aplicações, GIT, SVN e Tracs.', 
      icon: '/images/ubuntu.png',
      host: '192.168.0.90' // Substitua pelo IP ou hostname real
    },
    hiappb: { 
      label: 'HIAPPB', 
      status: 'checking', 
      description: 'Servidor de Aplicações, GIT, SVN e Tracs.', 
      icon: '/images/ubuntu.png',
      host: '192.168.0.90' // Substitua pelo IP ou hostname real
    },
    hiappb: { 
      label: 'HIAPPB', 
      status: 'checking', 
      description: 'Servidor de Aplicações, GIT, SVN e Tracs.', 
      icon: '/images/ubuntu.png',
      host: '192.168.0.90' // Substitua pelo IP ou hostname real
    },
    hiappb: { 
      label: 'HIAPPB', 
      status: 'checking', 
      description: 'Servidor de Aplicações, GIT, SVN e Tracs.', 
      icon: '/images/ubuntu.png',
      host: '192.168.0.90' // Substitua pelo IP ou hostname real
    }
  });
  
  const [hasOfflineServer, setHasOfflineServer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Atualizar data atual
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    setCurrentDate(`${day}/${month}/${year}`);
    
    // Verificar status dos servidores via API
    checkServersStatus();
    
    // Verificar status dos servidores a cada 60 segundos
    const interval = setInterval(() => {
      checkServersStatus();
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Efeito para reproduzir som quando algum servidor estiver offline
  useEffect(() => {
    if (hasOfflineServer) {
      const audio = new Audio('/sounds/down.mp3');
      audio.play().catch(e => console.log('Erro ao reproduzir áudio:', e));
    }
  }, [hasOfflineServer]);

  // Função para verificar status dos servidores via API
  const checkServersStatus = async () => {
    setLoading(true);
    const updatedServers = { ...servers };
    let offlineDetected = false;
    
    // Para cada servidor, fazer uma chamada à API de ping
    for (const key in updatedServers) {
      try {
        // Chamada à API de ping
        const response = await axios.post('/api/ping', { 
          host: updatedServers[key].host 
        });
        
        // Atualizar status com base na resposta
        updatedServers[key].status = response.data.isAlive ? 'on' : 'off';
        
        if (updatedServers[key].status === 'off') {
          offlineDetected = true;
        }
      } catch (error) {
        console.error(`Erro ao verificar status do servidor ${key}:`, error);
        updatedServers[key].status = 'off'; // Em caso de erro, considerar offline
        offlineDetected = true;
      }
    }
    
    setServers(updatedServers);
    setHasOfflineServer(offlineDetected);
    setLoading(false);
  };

  return (
    <Layout title="Monitor - HI Tecnologia - Status dos Servidores">
      <div className="servers-container fade-in">
        <div className="date-display">{currentDate}</div>
        
        <div className="main">
          <div className="responsive-wrapper">
            <div className="content-main">
              {loading && (
                <div className="loading-overlay">
                  <div className="spinner"></div>
                  <p>Verificando status dos servidores...</p>
                </div>
              )}
              
              <div className="card-grid1">
                {Object.entries(servers).map(([key, server], index) => (
                  <article key={key} className="card scale-in" style={{animationDelay: `${index * 0.1}s`}}>
                    <div className="card-header">
                      <div>
                        <span>
                          <img src={server.icon} alt={server.label} />
                        </span>
                        <h3>{server.label}</h3>
                      </div>
                    </div>
                    <div className="card-body1">
                      <p>{server.description}</p>
                    </div>
                    <div className={server.status === 'on' ? 'card-footer' : 'card-footer1'}>
                      {server.status === 'off' && (
                        <audio id="statusChangeAudio" autoPlay style={{ display: 'none' }}>
                          <source src="/sounds/down.mp3" type="audio/mp3" />
                        </audio>
                      )}
                      <p>{server.status === 'checking' ? 'Verificando...' : (server.status === 'on' ? 'Online' : 'Offline')}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .card-grid1 {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .card-body1 {
          padding: 1rem;
          flex-grow: 1;
        }
        
        .card-footer {
          padding: 1rem;
          background-color: #4CAF50;
          color: white;
          text-align: center;
          border-radius: 0 0 8px 8px;
        }
        
        .card-footer1 {
          padding: 1rem;
          background-color: #F44336;
          color: white;
          text-align: center;
          border-radius: 0 0 8px 8px;
        }
        
        .date-display {
          font-size: 1.2rem;
          font-weight: 500;
          text-align: right;
          margin-bottom: 1rem;
          color: #666;
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
      `}</style>
    </Layout>
  );
}
