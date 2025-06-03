import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function Layout({ children, title = 'Monitor - HI Tecnologia' }) {
  const router = useRouter();
  const [isRotating, setIsRotating] = useState(true);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [transitionActive, setTransitionActive] = useState(false);
  const [nextPath, setNextPath] = useState('');
  const [menuExpanded, setMenuExpanded] = useState(false);
  
  // Atualizar relógio e data
  useEffect(() => {
    const updateTimeAndDate = () => {
      const now = new Date();
      
      // Atualizar horário
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
      
      // Atualizar data
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      setCurrentDate(`${day}/${month}/${year}`);
    };

    updateTimeAndDate();
    const interval = setInterval(updateTimeAndDate, 1000);
    return () => clearInterval(interval);
  }, []);

  // Rotação automática entre telas
  useEffect(() => {
    if (!isRotating) return;
    
    const screens = [
      { path: '/', duration: 30000 },
      { path: '/clima', duration: 20000 },
      { path: '/dolar', duration: 15000 },
      { path: '/servidores', duration: 25000 },
      { path: '/servicos', duration: 25000 },
      { path: '/musicas', duration: 20000 }, // Adicionado músicas à rotação
      { path: '/noticias', duration: 25000 } // Adicionado notícias à rotação
    ];
    
    const currentScreenIndex = screens.findIndex(screen => screen.path === router.pathname);
    const nextScreenIndex = (currentScreenIndex + 1) % screens.length;
    
    const timer = setTimeout(() => {
      // Iniciar transição
      setNextPath(screens[nextScreenIndex].path);
      setTransitionActive(true);
      
      // Após a animação, navegar para a próxima tela
      setTimeout(() => {
        router.push(screens[nextScreenIndex].path);
        
        // Resetar transição após a navegação
        setTimeout(() => {
          setTransitionActive(false);
        }, 1500);
      }, 1500);
    }, screens[currentScreenIndex >= 0 ? currentScreenIndex : 0].duration);
    
    return () => clearTimeout(timer);
  }, [isRotating, router]);

  const toggleRotation = () => {
    setIsRotating(prev => !prev);
  };
  
  const toggleMenu = () => {
    setMenuExpanded(prev => !prev);
  };
  
  const handleNavigation = (path) => {
    if (path === router.pathname) return;
    
    // Iniciar transição
    setNextPath(path);
    setTransitionActive(true);
    
    // Após a animação, navegar para a tela selecionada
    setTimeout(() => {
      router.push(path);
      
      // Resetar transição após a navegação
      setTimeout(() => {
        setTransitionActive(false);
      }, 1500);
    }, 1500);
    
    // Fechar o menu após a navegação
    setMenuExpanded(false);
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="https://www.hitecnologia.com.br/wp-content/uploads/2022/03/Avatar-300x300.jpg" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      
      {/* Transição efeito água com logo */}
      {transitionActive && (
        <div className="water-transition">
          <div className="water-body"></div>
          <div className="logo-overlay">
            <img src="/images/logo-empresa.png" alt="HI Tecnologia" className="transition-logo" />
          </div>
        </div>
      )}
      
      <div className="header">
        <div className="logo-container">
          <img src="/images/logo.png" height="60" alt="HI Tecnologia" />
        </div>
        <div className="title-container">
          {title !== 'Monitor - HI Tecnologia' && <h1 className="page-title">{title.replace('Monitor - HI Tecnologia - ', '')}</h1>}
        </div>
        <div className="datetime-display">
          <div className="date">{currentDate}</div>
          <div className="time">{currentTime}</div>
        </div>
      </div>
      <main className="main-content">
        <div className="content-wrapper">
          {children}
        </div>
      </main>
      
      {/* Menu minimalista */}
      <div className={`mini-navigation ${menuExpanded ? 'expanded' : ''}`}>
        <div className="menu-toggle" onClick={toggleMenu}>
          <div className="menu-icon">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span className="menu-label">{menuExpanded ? 'Fechar' : 'Menu'}</span>
        </div>
        
        {menuExpanded && (
          <div className="menu-content">
            <button 
              onClick={toggleRotation} 
              className={`rotation-toggle ${isRotating ? 'active' : 'inactive'}`}
            >
              {isRotating ? 'Pausar Rotação' : 'Iniciar Rotação'}
            </button>
            
            <div className="nav-buttons">
              <button 
                onClick={() => handleNavigation('/')} 
                className={router.pathname === '/' ? 'active' : ''}
              >
                Início
              </button>
              <button 
                onClick={() => handleNavigation('/clima')} 
                className={router.pathname === '/clima' ? 'active' : ''}
              >
                Clima
              </button>
              <button 
                onClick={() => handleNavigation('/dolar')} 
                className={router.pathname === '/dolar' ? 'active' : ''}
              >
                Dólar
              </button>
              <button 
                onClick={() => handleNavigation('/servidores')} 
                className={router.pathname === '/servidores' ? 'active' : ''}
              >
                Servidores
              </button>
              <button 
                onClick={() => handleNavigation('/servicos')} 
                className={router.pathname === '/servicos' ? 'active' : ''}
              >
                Serviços
              </button>
              <button 
                onClick={() => handleNavigation('/musicas')} 
                className={router.pathname === '/musicas' ? 'active' : ''}
              >
                Músicas
              </button>
              <button 
                onClick={() => handleNavigation('/noticias')} 
                className={router.pathname === '/noticias' ? 'active' : ''}
              >
                Notícias
              </button>
            </div>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background-color: var(--background-header);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .logo-container {
          flex: 1;
        }
        
        .title-container {
          flex: 2;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .page-title {
          margin: 0;
          font-size: 2rem;
          font-weight: 600;
          color: var(--text-light);
          text-align: center;
        }
        
        .datetime-display {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.25rem;
        }
        
        .date, .time {
          font-size: 1.2rem;
          font-weight: 500;
          color: var(--text-secondary);
        }
        
        .time {
          font-size: 1.4rem;
          color: var(--text-light);
        }
        
        /* Menu minimalista */
        .mini-navigation {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        
        .menu-toggle {
          display: flex;
          align-items: center;
          background-color: var(--primary-color);
          color: white;
          border-radius: 30px;
          padding: 8px 16px;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }
        
        .menu-toggle:hover {
          background-color: var(--secondary-color);
        }
        
        .menu-icon {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          width: 20px;
          height: 16px;
          margin-right: 8px;
        }
        
        .menu-icon span {
          display: block;
          height: 2px;
          width: 100%;
          background-color: white;
          border-radius: 2px;
          transition: all 0.3s ease;
        }
        
        .expanded .menu-icon span:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }
        
        .expanded .menu-icon span:nth-child(2) {
          opacity: 0;
        }
        
        .expanded .menu-icon span:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }
        
        .menu-label {
          font-size: 0.9rem;
          font-weight: 500;
        }
        
        .menu-content {
          margin-top: 10px;
          background-color: var(--background-header);
          border-radius: 12px;
          padding: 15px;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
          animation: fadeIn 0.3s ease;
          min-width: 200px;
        }
        
        .rotation-toggle {
          width: 100%;
          padding: 8px 12px;
          margin-bottom: 10px;
          background-color: var(--background-card);
          color: var(--text-light);
          border: none;
          border-radius: var(--border-radius);
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }
        
        .rotation-toggle:hover {
          background-color: var(--primary-color);
        }
        
        .rotation-toggle.active {
          background-color: var(--primary-color);
        }
        
        .nav-buttons {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }
        
        .nav-buttons button {
          padding: 8px 12px;
          background-color: var(--background-card);
          color: var(--text-light);
          border: none;
          border-radius: var(--border-radius);
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
          text-align: center;
        }
        
        .nav-buttons button:hover {
          background-color: var(--primary-color);
        }
        
        .nav-buttons button.active {
          background-color: var(--primary-color);
        }
      `}</style>
      
      <style jsx global>{`
        :root {
          --primary-color: #0066cc;
          --secondary-color: #0099ff;
          --background-dark: #121212;
          --background-card: #1e1e1e;
          --background-header: #1a1a1a;
          --text-light: #ffffff;
          --text-secondary: #b3b3b3;
          --success-color: #4CAF50;
          --danger-color: #F44336;
          --warning-color: #FFC107;
          --border-radius: 8px;
        }
        
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        html, body {
          font-family: 'Poppins', sans-serif;
          background-color: var(--background-dark);
          color: var(--text-light);
          overflow-x: hidden;
        }
        
        .main-content {
          min-height: calc(100vh - 80px);
          padding: 2rem;
          padding-bottom: 4rem;
        }
        
        .content-wrapper {
          max-width: 1400px;
          margin: 0 auto;
        }
        
        /* Animações */
        .fade-in {
          animation: fadeIn 0.5s ease-in;
        }
        
        .scale-in {
          animation: scaleIn 0.5s ease-out;
        }
        
        .slide-in-left {
          animation: slideInLeft 0.5s ease-out;
        }
        
        .slide-in-right {
          animation: slideInRight 0.5s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        @keyframes slideInLeft {
          from { transform: translateX(-50px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideInRight {
          from { transform: translateX(50px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        /* Transição efeito água aprimorada */
        .water-transition {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 9999;
          pointer-events: none;
          overflow: hidden;
        }
        
        .water-body {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: var(--primary-color);
          transform-origin: center bottom;
          animation: waterWave 1.5s ease-in-out forwards;
        }
        
        /* Logo centralizada na transição */
        .logo-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 10000;
          animation: logoFade 1.5s ease-in-out;
        }
        
        .transition-logo {
          max-width: 300px;
          height: auto;
          filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
        }
        
        @keyframes logoFade {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
          }
          20% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          80% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.1);
          }
        }
        
        @keyframes waterWave {
          0% {
            transform: translateY(100%) scaleY(0.1);
            border-radius: 100% 100% 0 0 / 30% 30% 0 0;
            opacity: 0.8;
          }
          30% {
            transform: translateY(50%) scaleY(0.5);
            border-radius: 100% 100% 0 0 / 20% 20% 0 0;
            opacity: 0.9;
          }
          60% {
            transform: translateY(25%) scaleY(0.8);
            border-radius: 100% 100% 0 0 / 10% 10% 0 0;
            opacity: 1;
          }
          100% {
            transform: translateY(0%) scaleY(1);
            border-radius: 0;
            opacity: 1;
          }
        }
        
        /* Adicionar ondulações na água aprimoradas */
        .water-body::before,
        .water-body::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 200%;
          height: 100%;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 45% 47% 44% 42%;
          transform: translate3d(0, 0, 0);
        }
        
        .water-body::before {
          animation: drift 5s infinite linear;
        }
        
        .water-body::after {
          animation: drift 7s infinite linear;
          opacity: 0.5;
        }
        
        @keyframes drift {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
