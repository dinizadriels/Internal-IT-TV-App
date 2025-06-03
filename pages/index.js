import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import axios from 'axios';

export default function Home({ initialServers, initialImages }) {
  const [currentDate, setCurrentDate] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState(initialImages || []);
  const [loadingImages, setLoadingImages] = useState(false);
  const [imageError, setImageError] = useState(null);
  const [servers, setServers] = useState(initialServers || {});
  const [hasOfflineServer, setHasOfflineServer] = useState(false);
  const [loading, setLoading] = useState(false);

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
    const serverInterval = setInterval(() => {
      checkServersStatus();
    }, 60000);

    // Efeito para reproduzir som quando algum servidor estiver offline
    if (hasOfflineServer) {
      const audio = new Audio('/sounds/down.mp3');
      audio.play().catch(e => console.log('Erro ao reproduzir áudio:', e));
    }

    // Rotação automática das imagens do carousel
    if (images.length > 0) {
      const imageInterval = setInterval(() => {
        setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
      }, 5000);

      return () => {
        clearInterval(serverInterval);
        clearInterval(imageInterval);
      };
    }
    
    // Recarregar imagens a cada 5 minutos para garantir atualização
    const reloadInterval = setInterval(() => {
      refreshImages();
    }, 5 * 60 * 1000);
    
    return () => {
      clearInterval(serverInterval);
      clearInterval(reloadInterval);
    };
  }, [images.length, hasOfflineServer]);

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

  // Função para atualizar imagens
  const refreshImages = async () => {
    setLoadingImages(true);
    setImageError(null);
    
    try {
      const response = await axios.get('/api/get-informative-images');
      if (response.data.images && response.data.images.length > 0) {
        setImages(response.data.images);
      }
    } catch (error) {
      console.error('Erro ao atualizar imagens:', error);
      setImageError('Não foi possível carregar as imagens informativas.');
    } finally {
      setLoadingImages(false);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(prevIndex => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <Layout>
      <div className="home-container fade-in">
        <div className="welcome-section scale-in" style={{
          textAlign: 'center',
          marginBottom: '2rem',
          padding: '2rem',
          backgroundColor: 'var(--background-card)',
          borderRadius: 'var(--border-radius)',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        }}>
          <h1 style={{fontSize: '2.5rem', marginBottom: '1rem'}}>Painel de Monitoramento</h1>
          <p style={{fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto'}}>
            Acompanhe em tempo real o status dos serviços, previsão do tempo e cotação do dólar.
          </p>
        </div>

        <h2 className="section-title slide-in-left" style={{marginBottom: '1.5rem', fontSize: '1.8rem', fontWeight: '600'}}>
          Status de Serviços Críticos
        </h2>
        
        {loading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <p>Verificando status dos servidores...</p>
          </div>
        )}
        
        <div className="card-grid slide-in-right">
          {Object.entries(servers).slice(0, 4).map(([key, server], index) => (
            <Card 
              key={key}
              title={server.label} 
              description={server.description || getServerDescription(server.label)}
              status={server.status}
              icon={server.icon || getServerIcon(server.label)}
              style={{animationDelay: `${index * 0.1}s`}}
            />
          ))}
        </div>
        
        <div className="dashboard-summary" style={{
          marginTop: '3rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          <div className="summary-card fade-in" style={{
            backgroundColor: 'var(--background-card)',
            borderRadius: 'var(--border-radius)',
            padding: '1.5rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            animationDelay: '0.3s'
          }}>
            <h3 style={{marginBottom: '1rem', fontSize: '1.5rem'}}>Resumo de Status</h3>
            <div style={{display: 'flex', justifyContent: 'space-around', textAlign: 'center'}}>
              <div>
                <div style={{
                  fontSize: '2.5rem', 
                  fontWeight: '700', 
                  color: 'var(--success-color)',
                  marginBottom: '0.5rem'
                }}>
                  {Object.values(servers).filter(server => server.status === 'on').length}
                </div>
                <p style={{color: 'var(--text-secondary)'}}>Online</p>
              </div>
              <div>
                <div style={{
                  fontSize: '2.5rem', 
                  fontWeight: '700', 
                  color: 'var(--danger-color)',
                  marginBottom: '0.5rem'
                }}>
                  {Object.values(servers).filter(server => server.status === 'off').length}
                </div>
                <p style={{color: 'var(--text-secondary)'}}>Offline</p>
              </div>
            </div>
          </div>
          
          <div className="summary-card fade-in" style={{
            backgroundColor: 'var(--background-card)',
            borderRadius: 'var(--border-radius)',
            padding: '1.5rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            animationDelay: '0.5s',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <h3 style={{marginBottom: '1rem', fontSize: '1.5rem'}}>Informativos</h3>
            
            {loadingImages && (
              <div className="loading-overlay">
                <div className="spinner"></div>
                <p>Carregando imagens...</p>
              </div>
            )}
            
            {imageError && (
              <div className="error-message">
                <p>{imageError}</p>
                <button onClick={refreshImages} className="refresh-button">
                  Tentar novamente
                </button>
              </div>
            )}
            
            {images.length > 0 ? (
              <div className="carousel-container">
                <div className="carousel-inner" style={{
                  display: 'flex',
                  transition: 'transform 0.5s ease',
                  transform: `translateX(-${currentImageIndex * 100}%)`
                }}>
                  {images.map((image, index) => (
                    <div key={index} className="carousel-item" style={{
                      minWidth: '100%',
                      height: '250px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      <img 
                        src={image} 
                        alt={`Informativo ${index + 1}`} 
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain'
                        }}
                        onError={(e) => {
                          console.error(`Erro ao carregar imagem: ${image}`);
                          e.target.src = '/images/logo.png'; // Imagem de fallback
                        }}
                      />
                    </div>
                  ))}
                </div>
                
                {images.length > 1 && (
                  <>
                    <button 
                      className="carousel-control prev" 
                      onClick={prevImage}
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '10px',
                        transform: 'translateY(-50%)',
                        background: 'rgba(0,0,0,0.5)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '30px',
                        height: '30px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        zIndex: 2
                      }}
                    >
                      &lt;
                    </button>
                    
                    <button 
                      className="carousel-control next" 
                      onClick={nextImage}
                      style={{
                        position: 'absolute',
                        top: '50%',
                        right: '10px',
                        transform: 'translateY(-50%)',
                        background: 'rgba(0,0,0,0.5)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '30px',
                        height: '30px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        zIndex: 2
                      }}
                    >
                      &gt;
                    </button>
                    
                    <div className="carousel-indicators" style={{
                      display: 'flex',
                      justifyContent: 'center',
                      position: 'absolute',
                      bottom: '10px',
                      left: '0',
                      right: '0'
                    }}>
                      {images.map((_, index) => (
                        <span 
                          key={index} 
                          className={`indicator ${currentImageIndex === index ? 'active' : ''}`}
                          style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            background: currentImageIndex === index ? 'var(--primary-color)' : '#ccc',
                            margin: '0 5px',
                            cursor: 'pointer'
                          }}
                          onClick={() => setCurrentImageIndex(index)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="no-images-message">
                <p>Nenhuma imagem informativa encontrada no diretório.</p>
                <p className="path-info">Diretório:</p>
                <button onClick={refreshImages} className="refresh-button">
                  Atualizar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .carousel-container {
          position: relative;
          width: 100%;
          overflow: hidden;
          border-radius: 8px;
        }
        
        .carousel-inner {
          display: flex;
          width: 100%;
        }
        
        .loading-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 10;
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
        
        .error-message, .no-images-message {
          text-align: center;
          padding: 2rem;
        }
        
        .path-info {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-top: 0.5rem;
          font-style: italic;
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
        
        @media (max-width: 768px) {
          .carousel-item {
            height: 200px !important;
          }
          
          .carousel-control {
            width: 25px !important;
            height: 25px !important;
          }
        }
      `}</style>
    </Layout>
  );
}

function getServerDescription(label) {
  const descriptions = {
    'Descricao Servidor/APP': 'desc',
    'Descricao Servidor/APP': 'desc',
    'Descricao Servidor/APP': 'desc',
    'Descricao Servidor/APP': 'desc',
    'Descricao Servidor/APP': 'desc',
    'Descricao Servidor/APP': 'desc',
    'Descricao Servidor/APP': 'desc',
    'Descricao Servidor/APP': 'desc',
    'Descricao Servidor/APP': 'desc',
    'Descricao Servidor/APP': 'desc',
    'Descricao Servidor/APP': 'desc',
    'Descricao Servidor/APP': 'desc',
    'Descricao Servidor/APP': 'desc',
  };
  
  return descriptions[label] || 'Servidor da HI Tecnologia';
}

function getServerIcon(label) {
  const icons = {
    'servericon': 'https://images.ctfassets.net/xz1dnu24egyd/3FbNmZRES38q2Sk2EcoT7a/a290dc207a67cf779fc7c2456b177e9f/press-kit-icon.svg',
    'servericon': 'https://images.ctfassets.net/xz1dnu24egyd/3FbNmZRES38q2Sk2EcoT7a/a290dc207a67cf779fc7c2456b177e9f/press-kit-icon.svg',
    'servericon': 'https://images.ctfassets.net/xz1dnu24egyd/3FbNmZRES38q2Sk2EcoT7a/a290dc207a67cf779fc7c2456b177e9f/press-kit-icon.svg',
    'servericon': 'https://images.ctfassets.net/xz1dnu24egyd/3FbNmZRES38q2Sk2EcoT7a/a290dc207a67cf779fc7c2456b177e9f/press-kit-icon.svg',
    'servericon': 'https://images.ctfassets.net/xz1dnu24egyd/3FbNmZRES38q2Sk2EcoT7a/a290dc207a67cf779fc7c2456b177e9f/press-kit-icon.svg',
    'servericon': 'https://images.ctfassets.net/xz1dnu24egyd/3FbNmZRES38q2Sk2EcoT7a/a290dc207a67cf779fc7c2456b177e9f/press-kit-icon.svg',
    'servericon': 'https://images.ctfassets.net/xz1dnu24egyd/3FbNmZRES38q2Sk2EcoT7a/a290dc207a67cf779fc7c2456b177e9f/press-kit-icon.svg',
    'servericon': 'https://images.ctfassets.net/xz1dnu24egyd/3FbNmZRES38q2Sk2EcoT7a/a290dc207a67cf779fc7c2456b177e9f/press-kit-icon.svg',
    'servericon': 'https://images.ctfassets.net/xz1dnu24egyd/3FbNmZRES38q2Sk2EcoT7a/a290dc207a67cf779fc7c2456b177e9f/press-kit-icon.svg',
    'servericon': 'https://images.ctfassets.net/xz1dnu24egyd/3FbNmZRES38q2Sk2EcoT7a/a290dc207a67cf779fc7c2456b177e9f/press-kit-icon.svg',
    'servericon': 'https://images.ctfassets.net/xz1dnu24egyd/3FbNmZRES38q2Sk2EcoT7a/a290dc207a67cf779fc7c2456b177e9f/press-kit-icon.svg',
    'servericon': 'https://images.ctfassets.net/xz1dnu24egyd/3FbNmZRES38q2Sk2EcoT7a/a290dc207a67cf779fc7c2456b177e9f/press-kit-icon.svg',
    'servericon': 'https://images.ctfassets.net/xz1dnu24egyd/3FbNmZRES38q2Sk2EcoT7a/a290dc207a67cf779fc7c2456b177e9f/press-kit-icon.svg',
  };
  
  return icons[label] || '/images/ubuntu.png';
}

export async function getServerSideProps() {
  // Buscar status inicial dos servidores
  let servers = {
    servidor1: { 
      label: 'Servidor', 
      status: 'checking', 
      description: 'Descrição do Servidor.', 
      icon: 'caminho-imagem',
      host: 'ip-do-servidor'
    },
    servidor1: { 
      label: 'Servidor', 
      status: 'checking', 
      description: 'Descrição do Servidor.', 
      icon: 'caminho-imagem',
      host: 'ip-do-servidor'
    },
    servidor1: { 
      label: 'Servidor', 
      status: 'checking', 
      description: 'Descrição do Servidor.', 
      icon: 'caminho-imagem',
      host: 'ip-do-servidor'
    },
    servidor1: { 
      label: 'Servidor', 
      status: 'checking', 
      description: 'Descrição do Servidor.', 
      icon: 'caminho-imagem',
      host: 'ip-do-servidor'
    },
    servidor1: { 
      label: 'Servidor', 
      status: 'checking', 
      description: 'Descrição do Servidor.', 
      icon: 'caminho-imagem',
      host: 'ip-do-servidor'
    },
    servidor1: { 
      label: 'Servidor', 
      status: 'checking', 
      description: 'Descrição do Servidor.', 
      icon: 'caminho-imagem',
      host: 'ip-do-servidor'
    },
  };
  
  // Buscar imagens informativas
  let images = [];
  try {
    // Usar a API para buscar imagens do diretório Samba
    const response = await axios.get('http://localhost:3000/api/get-informative-images');
    images = response.data.images || [];
  } catch (error) {
    console.error('Erro ao buscar imagens informativas:', error);
    // Não usar imagens de fallback, conforme solicitado
    images = [];
  }
  
  return {
    props: {
      initialServers: servers,
      initialImages: images
    }
  };
}
