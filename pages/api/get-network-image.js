import { createReadStream } from 'fs';
import { stat } from 'fs/promises';
import path from 'path';

export default async function handler(req, res) {
  try {
    // Obter o caminho da imagem da query
    const { path: imagePath } = req.query;
    
    if (!imagePath) {
      return res.status(400).json({ error: 'Parâmetro de caminho não fornecido' });
    }
    
    // Verificar se o caminho é válido (para segurança)
    // Garantir que o caminho começa com L:\Corp\Qualidade\Informativos\Tela_de_descanso
    if (!imagePath.startsWith('L:\\Corp\\Qualidade\\Informativos\\Tela_de_descanso')) {
      return res.status(403).json({ error: 'Acesso negado a este caminho' });
    }
    
    try {
      // Verificar se o arquivo existe e obter informações
      const stats = await stat(imagePath);
      
      if (!stats.isFile()) {
        return res.status(404).json({ error: 'Arquivo não encontrado' });
      }
      
      // Determinar o tipo de conteúdo com base na extensão
      const ext = path.extname(imagePath).toLowerCase();
      let contentType;
      
      switch (ext) {
        case '.jpg':
        case '.jpeg':
          contentType = 'image/jpeg';
          break;
        case '.png':
          contentType = 'image/png';
          break;
        case '.gif':
          contentType = 'image/gif';
          break;
        case '.webp':
          contentType = 'image/webp';
          break;
        case '.svg':
          contentType = 'image/svg+xml';
          break;
        case '.bmp':
          contentType = 'image/bmp';
          break;
        default:
          contentType = 'application/octet-stream';
      }
      
      // Definir cabeçalhos de resposta
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Length', stats.size);
      res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache de 1 hora
      
      // Criar stream de leitura e enviar o arquivo
      const fileStream = createReadStream(imagePath);
      fileStream.pipe(res);
      
    } catch (fileError) {
      console.error('Erro ao acessar arquivo:', fileError);
      return res.status(404).json({ error: 'Arquivo não encontrado ou inacessível' });
    }
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
