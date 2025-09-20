#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 3001;
const DEMO_FILE = path.join(__dirname, '../components/survey-render/demo.html');
const WIDGET_FILE = path.join(__dirname, '../components/survey-render/opineeo-0.0.1.js');

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

// Track file modification times
let lastModified = new Map();

// Watch for changes in the widget files
function watchWidgetFiles() {
    // Watch main widget file
    if (fs.existsSync(WIDGET_FILE)) {
        fs.watchFile(WIDGET_FILE, { interval: 1000 }, (curr, prev) => {
            if (curr.mtime !== prev.mtime) {
                console.log('🔄 Main widget file changed, reloading...');
                lastModified.set(WIDGET_FILE, curr.mtime);
                notifyClients();
            }
        });
        console.log('👀 Watching main widget file:', WIDGET_FILE);
    } else {
        console.log('⚠️  Main widget file not found:', WIDGET_FILE);
    }
}

// Store connected clients for live reload
const clients = new Set();

function notifyClients() {
    const message = 'data: reload\n\n';
    clients.forEach(client => {
        try {
            client.write(message);
        } catch (err) {
            clients.delete(client);
        }
    });
}

// Create HTTP server
const server = http.createServer((req, res) => {
    const url = req.url;

    // Handle live reload endpoint
    if (url === '/__live_reload') {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Cache-Control'
        });

        clients.add(res);

        // Send initial connection message
        res.write('data: connected\n\n');

        // Clean up on disconnect
        req.on('close', () => {
            clients.delete(res);
        });

        return;
    }

    // Handle root path - serve demo.html
    if (url === '/' || url === '/index.html') {
        serveFile(DEMO_FILE, res);
        return;
    }

    // Handle widget files
    if (url === '/opineeo-0.0.1.js') {
        serveFile(WIDGET_FILE, res);
        return;
    }

    // Handle other static files
    const filePath = path.join(__dirname, '..', url);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        serveFile(filePath, res);
        return;
    }

    // 404
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>404 - Not Found</title>
      <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        h1 { color: #e74c3c; }
      </style>
    </head>
    <body>
      <h1>404 - File Not Found</h1>
      <p>The requested file could not be found.</p>
      <a href="/">← Back to Demo</a>
    </body>
    </html>
  `);
});

function serveFile(filePath, res) {
    try {
        const ext = path.extname(filePath).toLowerCase();
        const contentType = mimeTypes[ext] || 'application/octet-stream';

        // Add cache busting for widget files
        if (filePath === WIDGET_FILE) {
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
        }

        res.writeHead(200, { 'Content-Type': contentType });

        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

        fileStream.on('error', (err) => {
            console.error('Error serving file:', err);
            res.writeHead(500);
            res.end('Error serving file');
        });

    } catch (err) {
        console.error('Error serving file:', err);
        res.writeHead(500);
        res.end('Error serving file');
    }
}

// Inject live reload script into HTML
function injectLiveReload(html) {
    const liveReloadScript = `
    <script>
      (function() {
        const eventSource = new EventSource('/__live_reload');
        eventSource.onmessage = function(event) {
          if (event.data === 'reload') {
            console.log('🔄 Live reload triggered');
            window.location.reload();
          }
        };
        eventSource.onerror = function(event) {
          console.log('Live reload connection error');
        };
      })();
    </script>
  `;

    return html.replace('</body>', liveReloadScript + '</body>');
}

// Override serveFile for HTML files to inject live reload
const originalServeFile = serveFile;
serveFile = function (filePath, res) {
    if (path.extname(filePath).toLowerCase() === '.html') {
        try {
            const html = fs.readFileSync(filePath, 'utf8');
            const htmlWithReload = injectLiveReload(html);

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(htmlWithReload);
        } catch (err) {
            console.error('Error serving HTML file:', err);
            res.writeHead(500);
            res.end('Error serving HTML file');
        }
    } else {
        originalServeFile(filePath, res);
    }
};

// Start server
server.listen(PORT, () => {
    console.log('🚀 Development server started!');
    console.log(`📱 Demo: http://localhost:${PORT}`);
    console.log(`📄 Main Widget: http://localhost:${PORT}/opineeo-0.0.1.js`);
    console.log('');
    console.log('✨ Features:');
    console.log('  • Live reload on widget file changes');
    console.log('  • Cache busting for widget files');
    console.log('  • Hot reload in browser');
    console.log('  • Full widget version');
    console.log('');
    console.log('Press Ctrl+C to stop the server');

    // Start watching the widget files
    watchWidgetFiles();
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down development server...');
    server.close(() => {
        console.log('✅ Server stopped');
        process.exit(0);
    });
});

// Handle errors
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Please try a different port.`);
    } else {
        console.error('❌ Server error:', err);
    }
    process.exit(1);
});
