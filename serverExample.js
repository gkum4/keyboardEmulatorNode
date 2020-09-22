const WebSocket = require('ws');
const robot = require("robotjs");
const axios = require('axios');

const api = axios.create({
  baseURL: 'https://EXAMPLE.firebaseio.com',
});

const wss = new WebSocket.Server({ port: 8888 });

const { networkInterfaces } = require('os');

const nets = networkInterfaces();
const ips = Object.create(null); // or just '{}', an empty object

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // skip over non-ipv4 and internal (i.e. 127.0.0.1) addresses
        if (net.family === 'IPv4' && !net.internal) {
            if (!ips[name]) {
                ips[name] = [];
            }

            ips[name].push(net.address);
        }
    }
}

if (ips.en8 !== undefined) {
  api.put('/.json', {
    computerIp: String(ips.en8[0])
  });
  console.log('Computer local ip: ' + ips.en8[0]);
}
if (ips.en0 !== undefined) {
  api.put('/.json', {
    computerIp: String(ips.en0[0])
  });
  console.log('Computer local ip: ' + ips.en0[0]);
}

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    if (message === '1') {
      robot.keyTap('left');
    }
    if (message === '2') {
      robot.keyTap('down');
    }
    if (message === '3') {
      robot.keyTap('right');
    }
    if (message === '4') {
      robot.keyTap('up');
    }
    if (message === '5') {
      robot.typeString('`');
    }
    if (message === '6') {
      robot.keyTap('delete');
    }
  });
});