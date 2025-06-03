import axios from 'axios';

export default async function handler(req, res) {
  try {
    // Utilizando a API do NewsAPI para buscar notícias de Campinas
    // É necessário obter uma chave de API em https://newsapi.org/
    const apiKey = 'chave-api'; // Substitua pela chave real em produção
    
    // Parâmetros da busca
    const params = {
      q: 'Campinas',
      language: 'pt',
      sortBy: 'publishedAt',
      pageSize: 10,
      apiKey: apiKey
    };
    
    // Fazendo a requisição para a API
    const response = await axios.get('https://newsapi.org/v2/everything', { params });
    
    // Verificando se a resposta foi bem-sucedida
    if (response.data.status === 'ok') {
      // Formatando os dados para o formato esperado pela aplicação
      const articles = response.data.articles.map(article => ({
        title: article.title,
        description: article.description,
        publishedAt: article.publishedAt,
        url: article.url,
        urlToImage: article.urlToImage
      }));
      
      res.status(200).json({ articles });
    } else {
      throw new Error('Falha ao buscar notícias');
    }
  } catch (error) {
    console.error('Erro ao buscar notícias de Campinas:', error);
    
    // Em caso de erro, tentar uma API alternativa
    try {
      // Utilizando a API do Gnews como alternativa
      const gnewsApiKey = 'SUA_CHAVE_GNEWS_AQUI'; // Substitua pela chave real em produção
      const gnewsResponse = await axios.get(`https://gnews.io/api/v4/search?q=Campinas&lang=pt&country=br&max=10&apikey=${gnewsApiKey}`);
      
      if (gnewsResponse.data.articles) {
        const articles = gnewsResponse.data.articles.map(article => ({
          title: article.title,
          description: article.description,
          publishedAt: article.publishedAt,
          url: article.url,
          urlToImage: article.image
        }));
        
        res.status(200).json({ articles });
        return;
      }
    } catch (gnewsError) {
      console.error('Erro ao buscar notícias alternativas:', gnewsError);
    }
    
    // Se ambas as APIs falharem, retornar erro
    res.status(500).json({ 
      error: 'Erro ao buscar notícias',
      message: 'Não foi possível obter notícias da região de Campinas no momento.'
    });
  }
}
