#!/usr/bin/env node
// qwen-call.js — chama Qwen via endpoint compatível OpenAI
// Uso: node anthropic-call.js <arquivo-prompt.txt>

const https = require('https');
const fs    = require('fs');

const apiKey  = process.env.QWEN_API_KEY;
const model   = process.env.QWEN_MODEL || 'qwen-plus';
const baseUrl = process.env.QWEN_BASE_URL || 'https://ws-alz5lprkmvl6p01o.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1';
const file    = process.argv[2];

if (!file)   { process.stderr.write('Uso: node anthropic-call.js <prompt.txt>\n'); process.exit(1); }
if (!apiKey) { process.stderr.write('ERRO: QWEN_API_KEY não definida\n'); process.exit(1); }

const prompt = fs.readFileSync(file, 'utf8');
const body   = JSON.stringify({
  model,
  max_tokens: 8192,
  messages: [{ role: 'user', content: prompt }]
});

const url = new URL(baseUrl + '/chat/completions');

const req = https.request({
  hostname: url.hostname,
  path: url.pathname,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + apiKey,
    'Content-Length': Buffer.byteLength(body)
  }
}, (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    try {
      const j = JSON.parse(data);
      if (j.error) { process.stderr.write('ERRO API: ' + j.error.message + '\n'); process.exit(1); }
      process.stdout.write(j.choices[0].message.content);
    } catch (e) {
      process.stderr.write('ERRO parse: ' + e.message + '\n');
      process.stderr.write(data + '\n');
      process.exit(1);
    }
  });
});

req.on('error', e => { process.stderr.write('ERRO conexão: ' + e.message + '\n'); process.exit(1); });
req.write(body);
req.end();
