import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';

export default function Noticias({ initialNews }) {
  const [news, setNews] = useState(initialNews || []);
  const [currentDate, setCurrentDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // Atualizar data atual
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    setCurrentDate(`${day}/${month}/${year}`);
    
    // Atualizar notícias a cada 30 minutos
    const updateInterval = setInterval(() => {
      refreshNews();
    }, 30 * 60 * 1000);
    
    // Rotação automática do carousel de notícias a cada 8 segundos
    const carouselInterval = setInterval(() => {
      if (news.length > 0) {
        setCurrentNewsIndex(prevIndex => (prevIndex + 1) % news.length);
      }
    }, 8000);
    
    return () => {
      clearInterval(updateInterval);
      clearInterval(carouselInterval);
    };
  }, [news.length]);

  // Função para atualizar notícias
  const refreshNews = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('/api/get-campinas-news');
      setNews(response.data.articles || []);
      setCurrentNewsIndex(0); // Resetar para a primeira notícia
    } catch (err) {
      console.error('Erro ao atualizar notícias:', err);
      setError('Não foi possível atualizar as notícias. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  // Formatar data da notícia
  const formatNewsDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}/${month}/${year} às ${hours}:${minutes}`;
  };

  // Navegar manualmente para a próxima notícia
  const nextNews = () => {
    setCurrentNewsIndex(prevIndex => (prevIndex + 1) % news.length);
  };

  // Navegar manualmente para a notícia anterior
  const prevNews = () => {
    setCurrentNewsIndex(prevIndex => (prevIndex - 1 + news.length) % news.length);
  };

  // Alternar modo tela cheia
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <Layout title="TV - Notícias de Campinas">
      <div className={`news-container fade-in ${isFullscreen ? 'fullscreen' : ''}`}>
        <div className="news-header">
          <h2 className="section-title">Notícias de Campinas</h2>
          <div className="news-controls">
            <button className="control-button refresh" onClick={refreshNews} title="Atualizar notícias">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 4v6h-6"></path>
                <path d="M1 20v-6h6"></path>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"></path>
                <path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14"></path>
              </svg>
            </button>
            <button className="control-button fullscreen" onClick={toggleFullscreen} title={isFullscreen ? "Sair da tela cheia" : "Tela cheia"}>
              {isFullscreen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 3v3a2 2 0 0 1-2 2H3"></path>
                  <path d="M21 8h-3a2 2 0 0 1-2-2V3"></path>
                  <path d="M3 16h3a2 2 0 0 1 2 2v3"></path>
                  <path d="M16 21v-3a2 2 0 0 1 2-2h3"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3"></path>
                  <path d="M21 8V5a2 2 0 0 0-2-2h-3"></path>
                  <path d="M3 16v3a2 2 0 0 0 2 2h3"></path>
                  <path d="M16 21h3a2 2 0 0 0 2-2v-3"></path>
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {loading && (
          <div className="loading-indicator">
            <div className="spinner-container">
              <div className="spinner"></div>
            </div>
            <p>Carregando notícias...</p>
          </div>
        )}
        
        {error && (
          <div className="error-message">
            <div className="error-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <p>{error}</p>
            <button onClick={refreshNews} className="refresh-button">
              Tentar novamente
            </button>
          </div>
        )}
        
        {!loading && !error && news.length === 0 && (
          <div className="no-news-message">
            <div className="empty-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
            </div>
            <p>Nenhuma notícia encontrada para a região de Campinas.</p>
            <button onClick={refreshNews} className="refresh-button">
              Atualizar
            </button>
          </div>
        )}
        
        {!loading && !error && news.length > 0 && (
          <div className="news-carousel-container">
            <div className="news-carousel">
              {news.map((item, index) => (
                <div 
                  key={index} 
                  className={`news-slide ${index === currentNewsIndex ? 'active' : ''}`}
                >
                  <div className="news-card">
                    <div className="news-image-container">
                      {item.urlToImage ? (
                        <img 
                          src={item.urlToImage} 
                          alt={item.title} 
                          className="news-image"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/images/logo.png'; // Imagem de fallback
                          }}
                        />
                      ) : (
                        <div className="news-image-placeholder">
                          <img src="/images/logo.png" alt="Notícia sem imagem" />
                        </div>
                      )}
                      <div className="news-source-badge">
                        {item.source?.name || 'Fonte desconhecida'}
                      </div>
                    </div>
                    
                    <div className="news-content">
                      <div className="news-meta">
                        <span className="news-date">{formatNewsDate(item.publishedAt)}</span>
                      </div>
                      
                      <h3 className="news-title">{item.title}</h3>
                      
                      <div className="news-description-container">
                        <p className="news-description">{item.description}</p>
                      </div>
                      
                      <div className="news-actions">
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="news-link">
                          <span>Leia a notícia completa</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {news.length > 1 && (
              <>
                <button className="carousel-control prev" onClick={prevNews}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
                <button className="carousel-control next" onClick={nextNews}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
                
                <div className="carousel-indicators">
                  {news.map((_, index) => (
                    <span 
                      key={index} 
                      className={`indicator ${currentNewsIndex === index ? 'active' : ''}`}
                      onClick={() => setCurrentNewsIndex(index)}
                    />
                  ))}
                </div>
                
                <div className="carousel-counter">
                  <span className="current">{currentNewsIndex + 1}</span>
                  <span className="separator">/</span>
                  <span className="total">{news.length}</span>
                </div>
              </>
            )}
          </div>
        )}
        
        <div className="news-update-info">
          <div className="update-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div className="update-text">
            <p>Atualização automática a cada 30 minutos • Última: {currentDate}</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .news-container {
          padding: 1rem;
          max-width: 1400px;
          margin: 0 auto;
          transition: all 0.5s ease;
        }
        
        .news-container.fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          z-index: 9999;
          background-color: var(--background-dark);
          padding: 2rem;
          display: flex;
          flex-direction: column;
        }
        
        .news-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .section-title {
          font-size: 2.2rem;
          font-weight: 700;
          background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
          letter-spacing: -0.5px;
        }
        
        .news-controls {
          display: flex;
          gap: 0.75rem;
        }
        
        .control-button {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.1);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-light);
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .control-button:hover {
          background-color: var(--primary-color);
          transform: scale(1.1);
        }
        
        .news-carousel-container {
          position: relative;
          margin: 1rem 0;
          overflow: hidden;
          border-radius: 20px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          background-color: var(--background-card);
          height: 700px; /* Aumentado para não ficar achatado */
          flex-grow: 1;
        }
        
        .fullscreen .news-carousel-container {
          height: calc(100% - 120px);
        }
        
        .news-carousel {
          position: relative;
          height: 100%;
          width: 100%;
        }
        
        .news-slide {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          transition: opacity 1s ease, transform 1s ease;
          visibility: hidden;
          transform: scale(0.92);
        }
        
        .news-slide.active {
          opacity: 1;
          visibility: visible;
          transform: scale(1);
        }
        
        .news-card {
          height: 100%;
          display: grid;
          grid-template-rows: 55% 45%;
          overflow: hidden;
        }
        
        .news-image-container {
          position: relative;
          overflow: hidden;
          width: 100%;
          height: 100%;
        }
        
        .news-image, .news-image-placeholder {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 8s ease;
        }
        
        .active .news-image {
          transform: scale(1.05);
        }
        
        .news-image-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(0, 0, 0, 0.2);
        }
        
        .news-image-placeholder img {
          max-width: 150px;
          max-height: 150px;
          opacity: 0.5;
        }
        
        .news-source-badge {
          position: absolute;
          top: 20px;
          left: 20px;
          background-color: var(--primary-color);
          color: white;
          padding: 8px 16px;
          border-radius: 30px;
          font-weight: 600;
          font-size: 0.9rem;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
          z-index: 2;
        }
        
        .news-content {
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          background: linear-gradient(180deg, var(--background-card) 0%, rgba(20, 20, 20, 0.98) 100%);
          position: relative;
        }
        
        .news-meta {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 1rem;
        }
        
        .news-date {
          font-size: 0.95rem;
          color: var(--text-secondary);
          background-color: rgba(255, 255, 255, 0.1);
          padding: 4px 12px;
          border-radius: 20px;
        }
        
        .news-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: var(--text-light);
          line-height: 1.2;
          letter-spacing: -0.5px;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          position: relative;
          padding-bottom: 1rem;
        }
        
        .news-title:after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 80px;
          height: 4px;
          background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
          border-radius: 2px;
        }
        
        .news-description-container {
          flex-grow: 1;
          overflow: auto;
          margin-bottom: 1.5rem;
          padding-right: 10px;
        }
        
        .news-description-container::-webkit-scrollbar {
          width: 6px;
        }
        
        .news-description-container::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        
        .news-description-container::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        
        .news-description {
          font-size: 1.4rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }
        
        .news-actions {
          display: flex;
          justify-content: flex-end;
        }
        
        .news-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 24px;
          background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
          color: white;
          text-decoration: none;
          border-radius: 30px;
          font-weight: 600;
          text-align: center;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 102, 204, 0.4);
          font-size: 1.1rem;
        }
        
        .news-link:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0, 153, 255, 0.5);
        }
        
        .carousel-control {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 60px;
          height: 60px;
          background-color: rgba(0, 0, 0, 0.6);
          color: white;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 2;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }
        
        .carousel-control:hover {
          background-color: var(--primary-color);
          transform: translateY(-50%) scale(1.1);
        }
        
        .carousel-control.prev {
          left: 25px;
        }
        
        .carousel-control.next {
          right: 25px;
        }
        
        .carousel-indicators {
          position: absolute;
          bottom: 30px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          gap: 12px;
        }
        
        .indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.3);
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .indicator:hover {
          background-color: rgba(255, 255, 255, 0.7);
        }
        
        .indicator.active {
          background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
          transform: scale(1.3);
        }
        
        .carousel-counter {
          position: absolute;
          bottom: 30px;
          right: 30px;
          background-color: rgba(0, 0, 0, 0.6);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        
        .carousel-counter .current {
          font-weight: 700;
          color: var(--primary-color);
        }
        
        .loading-indicator, .error-message, .no-news-message {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem;
          background: linear-gradient(135deg, var(--background-card) 0%, rgba(40, 40, 40, 0.9) 100%);
          border-radius: 20px;
          box-shadow: 0 15px 25px -5px rgba(0, 0, 0, 0.3);
          height: 500px;
          text-align: center;
        }
        
        .spinner-container {
          margin-bottom: 2rem;
          position: relative;
          width: 80px;
          height: 80px;
        }
        
        .spinner {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 6px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          border-top-color: var(--primary-color);
          animation: spin 1s ease-in-out infinite;
        }
        
        .spinner:before {
          content: '';
          position: absolute;
          top: -6px;
          left: -6px;
          right: -6px;
          bottom: -6px;
          border: 6px solid transparent;
          border-top-color: var(--secondary-color);
          border-radius: 50%;
          animation: spin 2s linear infinite;
          opacity: 0.5;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .error-icon, .empty-icon {
          margin-bottom: 2rem;
          color: var(--danger-color);
        }
        
        .empty-icon {
          color: var(--text-secondary);
        }
        
        .refresh-button {
          margin-top: 2rem;
          padding: 12px 24px;
          background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
          color: white;
          border: none;
          border-radius: 30px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 102, 204, 0.4);
        }
        
        .refresh-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0, 153, 255, 0.5);
        }
        
        .news-update-info {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 1.5rem;
          color: var(--text-secondary);
          font-size: 0.95rem;
          background-color: rgba(255, 255, 255, 0.05);
          padding: 10px 20px;
          border-radius: 30px;
          width: fit-content;
          margin-left: auto;
          margin-right: auto;
        }
        
        .update-icon {
          color: var(--primary-color);
        }
        
        @media (max-width: 1200px) {
          .news-card {
            grid-template-rows: 45% 55%;
          }
          
          .news-title {
            font-size: 2rem;
          }
          
          .news-description {
            font-size: 1.2rem;
          }
        }
        
        @media (max-width: 768px) {
          .news-card {
            grid-template-rows: 40% 60%;
          }
          
          .news-content {
            padding: 1.5rem;
          }
          
          .news-title {
            font-size: 1.7rem;
            margin-bottom: 1rem;
          }
          
          .news-description {
            font-size: 1.1rem;
          }
          
          .carousel-control {
            width: 45px;
            height: 45px;
          }
          
          .carousel-control.prev {
            left: 15px;
          }
          
          .carousel-control.next {
            right: 15px;
          }
          
          .news-source-badge {
            top: 10px;
            left: 10px;
            padding: 6px 12px;
            font-size: 0.8rem;
          }
          
          .news-link {
            padding: 10px 20px;
            font-size: 1rem;
          }
        }
      `}</style>
    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    // Buscar notícias da API
    const response = await axios.get('http://localhost:3000/api/get-campinas-news');
    const news = response.data.articles || [];
    
    return {
      props: {
        initialNews: news
      }
    };
  } catch (error) {
    console.error('Erro ao buscar notícias iniciais:', error);
    return {
      props: {
        initialNews: []
      }
    };
  }
}
