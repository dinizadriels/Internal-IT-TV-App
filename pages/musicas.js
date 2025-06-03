import { useState, useEffect } from 'react';
import Layout from '../components/Layout';

export default function Musicas({ musicPlayerLoaded, currentPlaylist, setCurrentPlaylist, isPlayerMinimized, setIsPlayerMinimized }) {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    // Atualizar data atual
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    setCurrentDate(`${day}/${month}/${year}`);
    
    // Garantir que o player esteja maximizado quando estiver na página de músicas
    setIsPlayerMinimized(false);
    
    // Limpar ao desmontar
    return () => {
      // Não minimizamos aqui, isso será tratado pelo router no _app.js
    };
  }, [setIsPlayerMinimized]);

  return (
    <Layout title="TV - Músicas">
      <div className="music-container fade-in">
        <div className="content-wrapper">
          <h2 className="section-title">
            Player de Música
          </h2>
          
          <div className="player-card">
            {/* Espaço reservado para o player que é renderizado pelo _app.js */}
            <div className="music-player-placeholder"></div>
            
            <div className="instructions">
              <h3>Sobre a playlist:</h3>
              <div className="divider"></div>
              <p>Esta é a playlist corporativa da HI Tecnologia, com músicas selecionadas para criar um ambiente agradável e produtivo.</p>
              <p>O player permanecerá tocando mesmo ao navegar para outras telas do aplicativo.</p>
              <p className="note">Nota: O volume pode ser ajustado diretamente no player acima. A reprodução é contínua e sem limite de tempo.</p>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .music-container {
          min-height: calc(100vh - 60px); /* Altura total menos o cabeçalho */
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 0 1rem;
        }
        
        .content-wrapper {
          width: 100%;
          max-width: 1000px;
          margin: 0 auto;
          padding: 3rem 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .section-title {
          margin-bottom: 3rem;
          font-size: 2.2rem;
          font-weight: 600;
          text-align: center;
          background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.5px;
        }
        
        .player-card {
          width: 100%;
          max-width: 800px;
          background-color: var(--background-card);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          margin: 0 auto;
          transform: translateY(0);
          position: relative;
          z-index: 1;
        }
        
        .music-player-placeholder {
          width: 100%;
          height: 352px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: rgba(0, 0, 0, 0.2);
        }
        
        .instructions {
          padding: 2.5rem;
          background: linear-gradient(180deg, var(--background-card) 0%, rgba(30, 30, 30, 0.95) 100%);
        }
        
        .instructions h3 {
          margin-bottom: 1rem;
          font-size: 1.5rem;
          color: var(--text-light);
          font-weight: 600;
        }
        
        .divider {
          height: 3px;
          width: 60px;
          background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
          margin-bottom: 1.5rem;
          border-radius: 2px;
        }
        
        .instructions p {
          margin-bottom: 1rem;
          color: var(--text-secondary);
          line-height: 1.6;
          font-size: 1.05rem;
        }
        
        .note {
          font-style: italic;
          color: var(--text-secondary);
          font-size: 0.95rem;
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        @media (max-width: 768px) {
          .content-wrapper {
            padding: 2rem 0.5rem;
          }
          
          .instructions {
            padding: 1.5rem;
          }
          
          .section-title {
            font-size: 1.8rem;
            margin-bottom: 2rem;
          }
        }
      `}</style>
    </Layout>
  );
}
