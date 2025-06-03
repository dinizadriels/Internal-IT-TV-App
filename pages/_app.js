import '../styles/globals.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [pageTransition, setPageTransition] = useState({
    isChanging: false,
    currentPath: '',
    nextPath: ''
  });
  const [musicPlayerLoaded, setMusicPlayerLoaded] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState("id-playlist");
  const [isPlayerMinimized, setIsPlayerMinimized] = useState(true);

  useEffect(() => {
    const handleRouteChangeStart = (url) => {
      setPageTransition({
        isChanging: true,
        currentPath: router.pathname,
        nextPath: url
      });
    };

    const handleRouteChangeComplete = () => {
      setPageTransition({
        isChanging: false,
        currentPath: router.pathname,
        nextPath: ''
      });
      
      // Verificar se estamos na página de músicas
      setIsPlayerMinimized(router.pathname !== '/musicas');
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    
    // Verificar a rota inicial
    setIsPlayerMinimized(router.pathname !== '/musicas');

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router]);

  // Carregar o player de música apenas uma vez
  useEffect(() => {
    if (!musicPlayerLoaded) {
      setMusicPlayerLoaded(true);
    }
  }, []);

  // Criar um objeto com as props que serão passadas para os componentes
  const enhancedPageProps = {
    ...pageProps,
    musicPlayerLoaded,
    currentPlaylist,
    setCurrentPlaylist,
    isPlayerMinimized,
    setIsPlayerMinimized
  };

  return (
    <>
      <Head>
        {/* Script para garantir que o player Spotify seja carregado apenas uma vez */}
        <script dangerouslySetInnerHTML={{
          __html: `
            window.onSpotifyIframeApiReady = (IFrameAPI) => {
              window.spotifyIFrameAPI = IFrameAPI;
            };
          `
        }} />
        <script src="https://open.spotify.com/embed-podcast/iframe-api/v1" async></script>
      </Head>
      
      <div className={`app-container ${pageTransition.isChanging ? 'page-transitioning' : ''}`}>
        {/* Player de música persistente - sempre visível mas minimizado quando não estiver na página de músicas */}
        {musicPlayerLoaded && (
          <div className={`persistent-music-player ${isPlayerMinimized ? 'minimized' : 'maximized'}`}>
            <iframe 
              id="spotify-player"
              title="spotify-widget" 
              src={`https://open.spotify.com/embed/playlist/${currentPlaylist}?utm_source=generator`}
              width="100%" 
              height="352" 
              frameBorder="0" 
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
              loading="lazy"
              className="spotify-iframe"
            ></iframe>
            
            {isPlayerMinimized && (
              <div className="mini-player-indicator" onClick={() => router.push('/musicas')}>
                <div className="mini-player-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polygon points="10 8 16 12 10 16 10 8"></polygon>
                  </svg>
                </div>
                <div className="mini-player-text">Música tocando</div>
              </div>
            )}
          </div>
        )}
        
        <Component {...enhancedPageProps} />
        
        {pageTransition.isChanging && (
          <div className="page-transition-overlay">
            <div className="transition-loader"></div>
          </div>
        )}
        
        <style jsx>{`
          .persistent-music-player {
            transition: all 0.5s ease;
          }
          
          .persistent-music-player.minimized {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            z-index: 1000;
            border-radius: 25px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
          }
          
          .persistent-music-player.minimized .spotify-iframe {
            opacity: 0;
            pointer-events: none;
          }
          
          .persistent-music-player.maximized {
            position: relative;
            width: 100%;
            height: auto;
            z-index: 1;
          }
          
          .mini-player-indicator {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: linear-gradient(135deg, #1DB954, #191414);
            color: white;
            cursor: pointer;
            border-radius: 25px;
            animation: pulse 2s infinite;
          }
          
          .mini-player-icon {
            margin-bottom: 5px;
          }
          
          .mini-player-text {
            font-size: 0;
            white-space: nowrap;
          }
          
          .mini-player-indicator:hover {
            width: 150px;
            border-radius: 25px;
          }
          
          .mini-player-indicator:hover .mini-player-text {
            font-size: 12px;
          }
          
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
        `}</style>
      </div>
    </>
  );
}

export default MyApp;
