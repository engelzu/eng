const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.mp4': 'video/mp4',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.otf': 'font/otf',
    '.wasm': 'application/wasm'
};

// Helper para executar funções Serverless Netlify localmente
async function handleNetlifyFunction(handlerPath, req, res, parsedUrl) {
    try {
        const resolvedPath = path.resolve(handlerPath);
        
        // Remove do cache do Node para que alterações na função sejam carregadas em tempo real
        delete require.cache[resolvedPath];
        const functionModule = require(resolvedPath);
        
        // Parâmetros de consulta
        const queryParams = {};
        parsedUrl.searchParams.forEach((value, key) => {
            queryParams[key] = value;
        });

        // Ler corpo da requisição se aplicável
        let body = '';
        if (req.method === 'POST' || req.method === 'PUT') {
            const buffers = [];
            for await (const chunk of req) {
                buffers.push(chunk);
            }
            body = Buffer.concat(buffers).toString('utf-8');
        }

        const event = {
            httpMethod: req.method,
            queryStringParameters: queryParams,
            headers: req.headers,
            body: body,
            path: parsedUrl.pathname
        };

        const context = {};
        const result = await functionModule.handler(event, context);

        // Copia os cabeçalhos de resposta
        res.writeHead(result.statusCode || 200, result.headers || {});
        
        if (result.body) {
            if (result.isBase64Encoded) {
                res.end(Buffer.from(result.body, 'base64'));
            } else {
                res.end(result.body);
            }
        } else {
            res.end();
        }
    } catch (err) {
        console.error(`Erro ao executar função Netlify (${handlerPath}):`, err);
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: err.message || 'Erro interno da função' }));
    }
}

const server = http.createServer(async (req, res) => {
    const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
    let pathname = decodeURIComponent(parsedUrl.pathname);
    
    // Roteamento de funções do Netlify/SharePoint
    if (pathname === '/sync-projects' || pathname === '/.netlify/functions/sync-projects') {
        await handleNetlifyFunction('./netlify/functions/sync-projects.js', req, res, parsedUrl);
        return;
    }
    
    if (pathname === '/download-project' || pathname === '/.netlify/functions/download-project') {
        await handleNetlifyFunction('./netlify/functions/download-project.js', req, res, parsedUrl);
        return;
    }
    
    // Roteamento de arquivos estáticos
    let filePath = path.join(process.cwd(), pathname);
    
    // Clean URLs: tenta adicionar .html primeiro se não houver extensão
    if (!path.extname(pathname)) {
        const htmlPath = path.join(process.cwd(), pathname + '.html');
        if (fs.existsSync(htmlPath) && fs.statSync(htmlPath).isFile()) {
            filePath = htmlPath;
        } else if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
            filePath = path.join(filePath, 'index.html');
        }
    } else if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
    }
    
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';
    
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                const path404 = path.join(process.cwd(), '404.html');
                if (fs.existsSync(path404)) {
                    fs.readFile(path404, (err, content404) => {
                        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                        res.end(content404, 'utf-8');
                    });
                } else {
                    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
                    res.end('Página não encontrada (404)', 'utf-8');
                }
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end(`Erro interno do servidor: ${error.code}`, 'utf-8');
            }
        } else {
            // For JS files, send no-cache headers so patched bundles are always fresh
            const headers = { 'Content-Type': contentType };
            if (extname === '.js') {
                headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
                headers['Pragma'] = 'no-cache';
                headers['Expires'] = '0';
            }
            res.writeHead(200, headers);
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`===========================================================`);
    console.log(` Servidor local ativo em: http://localhost:${PORT}/`);
    console.log(` Funções Serverless de Integração SharePoint mapeadas!`);
    console.log(` Pressione Ctrl+C para encerrar o servidor.`);
    console.log(`===========================================================`);
});
