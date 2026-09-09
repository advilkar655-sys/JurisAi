/**
 * JurisAI Node.js Backend Server
 * Securely manages Gemini API Key on server-side proxy & serves static assets on Port 8085.
 */

import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    lines.forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        if (!process.env[key]) process.env[key] = value.trim();
      }
    });
  }
}

loadEnv();

const PORT = process.env.PORT || 8090;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer(async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // Endpoint: Proxy to Gemini API
  if (pathname === '/api/gemini' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', async () => {
      try {
        const { prompt, systemInstruction } = JSON.parse(body || '{}');
        
        const combinedPrompt = systemInstruction 
          ? `[SYSTEM INSTRUCTION]\n${systemInstruction}\n\n[USER REQUEST]\n${prompt}` 
          : prompt;

        const resultText = await callGeminiServerSide(combinedPrompt, GEMINI_API_KEY);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, text: resultText }));
      } catch (err) {
        console.error("Server Proxy Gemini Error:", err.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // Static File Serving
  let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
  
  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Server File Error');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
});

/**
 * Perform HTTPS call to Google Gemini API from Backend Server
 */
function callGeminiServerSide(promptText, apiKey) {
  return new Promise((resolve, reject) => {
    const models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-2.5-pro", "gemini-1.5-pro"];
    const versions = ["v1beta", "v1"];
    
    let modelIdx = 0;
    let versionIdx = 0;

    function tryNext() {
      if (versionIdx >= versions.length) {
        return reject(new Error("Unable to connect to Gemini API with configured key."));
      }

      const ver = versions[versionIdx];
      const model = models[modelIdx];

      const postData = JSON.stringify({
        contents: [{ role: "user", parts: [{ text: promptText }] }],
        generationConfig: { temperature: 0.2, topP: 0.95 }
      });

      const options = {
        hostname: 'generativelanguage.googleapis.com',
        path: `/${ver}/models/${model}:generateContent?key=${apiKey}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const request = https.request(options, response => {
        let resBody = '';
        response.on('data', chunk => { resBody += chunk; });
        response.on('end', () => {
          if (response.statusCode === 200) {
            try {
              const data = JSON.parse(resBody);
              const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
              if (text) return resolve(text);
            } catch (e) {
              // try next
            }
          }

          // Advance model or version
          modelIdx++;
          if (modelIdx >= models.length) {
            modelIdx = 0;
            versionIdx++;
          }
          tryNext();
        });
      });

      request.on('error', err => {
        modelIdx++;
        if (modelIdx >= models.length) {
          modelIdx = 0;
          versionIdx++;
        }
        tryNext();
      });

      request.write(postData);
      request.end();
    }

    tryNext();
  });
}

server.listen(PORT, () => {
  console.log(`⚖️ JurisAI Backend Proxy Server running at http://localhost:${PORT}`);
  console.log(`🔒 API Key is securely loaded server-side.`);
});
