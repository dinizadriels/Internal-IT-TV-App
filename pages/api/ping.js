import { exec } from 'child_process';
import util from 'util';
import url from 'url';

const execPromise = util.promisify(exec);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { host } = req.body;
  
  if (!host) {
    return res.status(400).json({ error: 'Host parameter is required' });
  }

  try {
    // Extrair apenas o hostname ou IP do host (remover protocolo e porta)
    let cleanHost = host;
    
    // Remover protocolo (http://, https://, etc)
    if (cleanHost.includes('://')) {
      try {
        const parsedUrl = new URL(cleanHost);
        cleanHost = parsedUrl.hostname;
      } catch (e) {
        // Se falhar ao analisar como URL, tentar extrair manualmente
        cleanHost = cleanHost.split('://')[1];
      }
    }
    
    // Remover porta se existir
    if (cleanHost.includes(':')) {
      cleanHost = cleanHost.split(':')[0];
    }
    
    // Verificar se o host é válido (não vazio e não contém caracteres especiais)
    if (!cleanHost || /[;&|`\t\n\r]/.test(cleanHost)) {
      return res.status(400).json({ error: 'Invalid host parameter' });
    }
    
    console.log(`Executando ping para: ${cleanHost}`);
    
    // Executa o comando ping com timeout curto e apenas 1 pacote
    // Opções diferentes para Windows e sistemas baseados em Unix
    const isWindows = process.platform === 'win32';
    const pingCommand = isWindows
      ? `ping -n 1 -w 1000 ${cleanHost}`
      : `ping -c 1 -W 1 ${cleanHost}`;
    
    const { stdout } = await execPromise(pingCommand);
    
    // Verificar se o ping foi bem-sucedido com base na saída
    const isAlive = isWindows
      ? !stdout.includes('100% loss') && !stdout.includes('could not find host')
      : !stdout.includes('100% packet loss') && !stdout.includes('unknown host');
    
    console.log(`Resultado do ping para ${cleanHost}: ${isAlive ? 'Online' : 'Offline'}`);
    res.status(200).json({ isAlive });
  } catch (error) {
    console.error(`Erro ao executar ping para ${host}:`, error);
    // Se o comando ping falhar, consideramos o host como offline
    res.status(200).json({ isAlive: false });
  }
}
