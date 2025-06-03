import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';

const execAsync = promisify(exec);

export default async function handler(req, res) {
  try {
    // Verificar se estamos em ambiente de produção ou desenvolvimento
    const isProduction = process.env.NODE_ENV === 'production';
    
    let imagesDirectory;
    let imageFiles = [];
    
    if (isProduction) {
      // Em produção, usar o diretório Samba mapeado como drive L:
      // Verificar se o diretório está acessível
      try {
        // Usar o comando dir para listar arquivos no diretório de rede
        const { stdout } = await execAsync('dir "L:\\Corp\\Qualidade\\Informativos\\Tela_de_descanso" /b');
        
        // Processar a saída para obter os nomes dos arquivos
        const files = stdout.split('\n').filter(file => file.trim() !== '');
        
        // Filtrar apenas arquivos de imagem
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
        imageFiles = files.filter(file => {
          const ext = path.extname(file).toLowerCase();
          return imageExtensions.includes(ext);
        });
        
        // Criar URLs para as imagens (usando um caminho especial para acessar o diretório de rede)
        const imageUrls = imageFiles.map(file => 
          `/api/get-network-image?path=${encodeURIComponent(`L:\\Corp\\Qualidade\\Informativos\\Tela_de_descanso\\${file}`)}`
        );
        
        // Retornar as URLs das imagens
        return res.status(200).json({ images: imageUrls });
      } catch (networkError) {
        console.error('Erro ao acessar diretório de rede:', networkError);
        
        // Fallback para o diretório local em caso de erro
        imagesDirectory = path.join(process.cwd(), 'public', 'images', 'informativos');
      }
    } else {
      // Em desenvolvimento, usar a pasta pública
      imagesDirectory = path.join(process.cwd(), 'public', 'images', 'informativos');
    }
    
    // Se chegamos aqui, estamos usando o diretório local (desenvolvimento ou fallback)
    // Verificar se o diretório existe
    if (!fs.existsSync(imagesDirectory)) {
      return res.status(404).json({ 
        error: 'Diretório de imagens não encontrado',
        message: 'O diretório de imagens informativas não foi encontrado. Por favor, verifique se o caminho está correto.'
      });
    }
    
    // Ler os arquivos do diretório local
    const files = fs.readdirSync(imagesDirectory);
    
    // Filtrar apenas arquivos de imagem
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
    imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return imageExtensions.includes(ext);
    });
    
    // Criar URLs para as imagens
    const imageUrls = imageFiles.map(file => `/images/informativos/${file}`);
    
    // Retornar as URLs das imagens
    res.status(200).json({ images: imageUrls });
  } catch (error) {
    console.error('Erro ao buscar imagens informativas:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: 'Ocorreu um erro ao buscar as imagens informativas.'
    });
  }
}
