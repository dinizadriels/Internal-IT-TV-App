import axios from 'axios';

// Função para verificar status de um serviço via HTTP
export async function checkServiceStatus(url) {
  try {
    const response = await axios.get(url, {
      timeout: 5000, // Timeout de 5 segundos
      validateStatus: false // Não lançar erro para status HTTP diferentes de 2xx
    });
    
    // Considerar serviço online se o status for 2xx ou 3xx
    return response.status >= 200 && response.status < 400;
  } catch (error) {
    console.error(`Erro ao verificar status do serviço ${url}:`, error);
    return false; // Serviço offline em caso de erro
  }
}

// Função para verificar status de um servidor via ping
export async function checkServerStatus(host) {
  try {
    const response = await axios.post('/api/ping', { host });
    return response.data.isAlive;
  } catch (error) {
    console.error(`Erro ao verificar status do servidor ${host}:`, error);
    return false; // Servidor offline em caso de erro
  }
}

// Função para buscar status de todos os serviços
export async function fetchServicesStatus() {
  const services = {
    site1: { 
      label: 'site1', 
      status: 'checking',
      url: 'insira-url-do-site',
      description: 'descrição-do-site'
    },
    site2: { 
      label: 'site2', 
      status: 'checking',
      url: 'insira-url-do-site',
      description: 'descrição-do-site'
    },
    site3: { 
      label: 'site3', 
      status: 'checking',
      url: 'insira-url-do-site',
      description: 'descrição-do-site'
    },
    site4: { 
      label: 'site4', 
      status: 'checking',
      url: 'insira-url-do-site',
      description: 'descrição-do-site'
    },
    site5: { 
      label: 'site5', 
      status: 'checking',
      url: 'insira-url-do-site',
      description: 'descrição-do-site'
    },
    site6: { 
      label: 'site6', 
      status: 'checking',
      url: 'insira-url-do-site',
      description: 'descrição-do-site'
    },
    site7: { 
      label: 'site7', 
      status: 'checking',
      url: 'insira-url-do-site',
      description: 'descrição-do-site'
    }
  };

  // Verificar status de cada serviço em paralelo
  const statusPromises = Object.entries(services).map(async ([key, service]) => {
    const isOnline = await checkServiceStatus(service.url);
    return [key, { ...service, status: isOnline ? 'on' : 'off' }];
  });

  // Aguardar todas as verificações
  const statusResults = await Promise.all(statusPromises);
  
  // Construir objeto com resultados
  const servicesStatus = {};
  statusResults.forEach(([key, service]) => {
    servicesStatus[key] = service;
  });

  return servicesStatus;
}

// Função para buscar status de todos os servidores
export async function fetchServersStatus() {
  const servers = {
    hiisdat: { 
      label: 'servidor1', 
      status: 'checking', 
      description: 'descrição-servidor', 
      icon: 'caminho-para-imagem',
      host: 'insira-seu-servidor' // Substitua pelo IP ou hostname real em produção
    },
    hiisint: { 
      label: 'servidor2', 
      status: 'checking', 
      description: 'descrição-servidor', 
      icon: 'caminho-para-imagem',
      host: 'insira-seu-servidor' // Substitua pelo IP ou hostname real em produção
    },
    hiappb: { 
      label: 'servidor3', 
      status: 'checking', 
      description: 'descrição-servidor', 
      icon: 'caminho-para-imagem',
      host: 'insira-seu-servidor' // Substitua pelo IP ou hostname real em produção
    },
    iserp: { 
      label: 'servidor4', 
      status: 'checking', 
      description: 'descrição-servidor', 
      icon: 'caminho-para-imagem',
      host: 'insira-seu-servidor' // Substitua pelo IP ou hostname real em produção
    },
    telefonia: { 
      label: 'servidor5', 
      status: 'checking', 
      description: 'descrição-servidor', 
      icon: 'caminho-para-imagem',
      host: 'insira-seu-servidor' // Substitua pelo IP ou hostname real em produção
    },
    server1032: { 
      label: 'servidor6', 
      status: 'checking', 
      description: 'descrição-servidor', 
      icon: 'caminho-para-imagem',
      host: 'insira-seu-servidor' // Substitua pelo IP ou hostname real em produção
    }
  };

  // Verificar status de cada servidor em paralelo
  const statusPromises = Object.entries(servers).map(async ([key, server]) => {
    const isOnline = await checkServerStatus(server.host);
    return [key, { ...server, status: isOnline ? 'on' : 'off' }];
  });

  // Aguardar todas as verificações
  const statusResults = await Promise.all(statusPromises);
  
  // Construir objeto com resultados
  const serversStatus = {};
  statusResults.forEach(([key, server]) => {
    serversStatus[key] = server;
  });

  return serversStatus;
}

// Funções para buscar cotações
export async function fetchDollarRate() {
  try {
    const url = 'https://economia.awesomeapi.com.br/last/USD-BRL';
    const response = await axios.get(url);
    
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar cotação do dólar:', error);
    return null;
  }
}

export async function fetchEuroRate() {
  try {
    const url = 'https://economia.awesomeapi.com.br/last/EUR-BRL';
    const response = await axios.get(url);
    
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar cotação do euro:', error);
    return null;
  }
}

export async function fetchBitcoinRate() {
  try {
    const url = 'https://economia.awesomeapi.com.br/last/BTC-BRL';
    const response = await axios.get(url);
    
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar cotação do bitcoin:', error);
    return null;
  }
}

export async function fetchHistoricalDollarRate() {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const formattedDate = yesterday.toISOString().split('T')[0].replace(/-/g, '');
    
    const url = `https://economia.awesomeapi.com.br/json/daily/USD-BRL/?start_date=${formattedDate}&end_date=${formattedDate}`;
    const response = await axios.get(url);
    
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar cotação histórica do dólar:', error);
    return null;
  }
}

export async function fetchHistoricalEuroRate() {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const formattedDate = yesterday.toISOString().split('T')[0].replace(/-/g, '');
    
    const url = `https://economia.awesomeapi.com.br/json/daily/EUR-BRL/?start_date=${formattedDate}&end_date=${formattedDate}`;
    const response = await axios.get(url);
    
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar cotação histórica do euro:', error);
    return null;
  }
}

export async function fetchHistoricalBitcoinRate() {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const formattedDate = yesterday.toISOString().split('T')[0].replace(/-/g, '');
    
    const url = `https://economia.awesomeapi.com.br/json/daily/BTC-BRL/?start_date=${formattedDate}&end_date=${formattedDate}`;
    const response = await axios.get(url);
    
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar cotação histórica do bitcoin:', error);
    return null;
  }
}

// Função para buscar dados do clima
export async function fetchWeatherData(city = 'Campinas') {
  try {
    const apiKey = '0aa1089fbc5c300335aa98334d383925';
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados do clima:', error);
    return null;
  }
}
