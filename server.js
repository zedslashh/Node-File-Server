const http = require('http');
const fs = require('fs');
const path = require('path');

let port = 3000;

const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => (body += chunk));
        req.on('end', () => {
            const { filename, content, searchWord } = JSON.parse(body);
            const filePath = path.join(__dirname, filename);

            if (req.url === '/create') {
                fs.writeFile(filePath, '', err => {
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end(err ? 'Error creating file' : 'File created successfully');
                });
            } else if (req.url === '/read') {
                fs.readFile(filePath, 'utf8', (err, data) => {
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end(err ? 'Error reading file' : data);
                });
            } else if (req.url === '/write') {
                fs.writeFile(filePath, content, err => {
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end(err ? 'Error writing to file' : 'Content written to file');
                });
            } else if (req.url === '/search') {
                fs.readFile(filePath, 'utf8', (err, data) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Error reading file');
                    } else {
                        const found = data.includes(searchWord);
                        res.writeHead(200, { 'Content-Type': 'text/plain' });
                        res.end(found ? `Word "${searchWord}" found` : `Word "${searchWord}" not found`);
                    }
                });
            }
        });
    } else if (req.url === '/') {
        fs.readFile(path.join(__dirname, 'index.html'), 'utf8', (err, data) => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(err ? 'Error loading page' : data);
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
