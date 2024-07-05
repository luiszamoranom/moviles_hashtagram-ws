// @ts-ignore
import express from 'express';
// @ts-ignore
import cors from 'cors'
const WebSocket = require('ws');

export const app = express();
const PORT = 4444

const wss = new WebSocket.Server({ noServer: true });
const clients = new Set();

wss.on('connection', (ws: any) => {
    console.log('Cliente conectado');
    clients.add(ws);
  
    ws.on('message', (message: string) => {
      console.log(`Mensaje recibido: ${message}`);

      clients.forEach((client: any) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    });
  
    ws.on('close', () => {
      console.log('Cliente desconectado');
      clients.delete(ws);
    });
  });

  const server = app.listen(PORT, () => {
    console.log(`Servidor WS corriendo en el puerto ${PORT}`);
  });
  
  server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (socket: any) => {
      wss.emit('connection', socket, request);
    });
  });