const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {

    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);

    let extname = path.extname(filePath);

    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg'
    };

    // SPA Fallback
    if (!extname) {
        filePath = path.join(__dirname, 'index.html');
        extname = '.html';
    }

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404);
            res.end('Not Found');
        } else {
            res.writeHead(200, {
                'Content-Type': mimeTypes[extname] || 'text/html'
            });
            res.end(content);
        }
    });
});

server.listen(8080, () => console.log("Server running on port 8080"));
