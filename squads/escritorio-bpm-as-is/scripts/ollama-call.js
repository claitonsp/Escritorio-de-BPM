#!/usr/bin/env node
// Chama Ollama (OpenAI-compatible) e imprime a resposta no stdout
// Uso: node ollama-call.js /path/to/prompt.txt

const http = require('http');
const fs   = require('fs');

const model = process.env.OLLAMA_MODEL || 'qwen2.5:14b';
const base  = process.env.OLLAMA_URL   || 'http://127.0.0.1:11434';
const url   = new URL(base + '/v1/chat/completions');

const promptFile = process.argv[2];
if (!promptFile) {
  process.stderr.write('Uso: node ollama-call.js <prompt.txt>\n');
  process.exit(1);
}

const prompt = fs.readFileSync(promptFile, 'utf8');
const body   = JSON.stringify({
  model,
  messages: [{ role: 'user', content: prompt }],
  stream: false
});

const opts = {
  hostname : url.hostname,
  port     : Number(url.port) || 11434,
  path     : url.pathname,
  method   : 'POST',
  headers  : {
    'Content-Type'   : 'application/json',
    'Content-Length' : Buffer.byteLength(body)
  }
};

const req = http.request(opts, res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    try {
      const r = JSON.parse(d);
      process.stdout.write(r.choices[0].message.content || '');
    } catch (e) {
      process.stderr.write('Ollama parse error: ' + e.message + '\n' + d.slice(0, 300) + '\n');
      process.exit(1);
    }
  });
});

req.on('error', e => {
  process.stderr.write(
    'Ollama connection error: ' + e.message +
    '\nVerifique se o Ollama esta rodando: ollama serve\n'
  );
  process.exit(1);
});

req.write(body);
req.end();
