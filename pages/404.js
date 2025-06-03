import { useEffect } from 'react';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';

export default function Layout404() {
  const router = useRouter();

  useEffect(() => {
    // Redirecionar para a página inicial após 5 segundos
    const timer = setTimeout(() => {
      router.push('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <Layout title="TV - Página não encontrada">
      <div className="not-found-container fade-in" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '70vh',
        textAlign: 'center',
        padding: '2rem'
      }}>
        <h1 style={{fontSize: '4rem', marginBottom: '1rem', color: 'var(--primary-color)'}}>404</h1>
        <h2 style={{fontSize: '2rem', marginBottom: '2rem'}}>Página não encontrada</h2>
        <p style={{fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', marginBottom: '2rem'}}>
          A página que você está procurando não existe ou foi movida.
          Você será redirecionado para a página inicial em 5 segundos.
        </p>
        <button 
          onClick={() => router.push('/')}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
          }}
        >
          Voltar para o início
        </button>
      </div>
    </Layout>
  );
}
