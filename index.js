const net = require("net");
const fetch = require("node-fetch");
const ip = require("ip");

const DEVICE_URL = "http://192.168.4.1";
const PORT = 4665;

const server = net.createServer((socket) => {
  socket.on("data", (buffer) => {
    const data = buffer.toString();
    const rows = data.split(/\r\n/);
    // row = JSON.parse(rows[0]);
    console.log(rows.length);
  });
});

server.listen(PORT);

async function connect(params) {
  const response = await fetch(`${DEVICE_URL}/tcp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });
  const info = await response.json();
  console.log(`Connection info: ${JSON.stringify(info)}`);
}

async function start() {
  await connect({
    port: PORT,
    ip: ip.address(),
    output: "json",
    latency: 200000,
  });
  await fetch(`${DEVICE_URL}/stream/start`);
  setTimeout(() => {
    stop();
  }, 1000);
}

async function stop() {
  await fetch(`${DEVICE_URL}/stream/stop`);
  server.close();
  process.exit();
}

start();
