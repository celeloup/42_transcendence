const io = require("socket.io-client");

const URL = "http://back:8082/messages";
const CONFIG = { path: "/socket/" }
const connector = io(URL, CONFIG);

connector.on("connect_error", (err) => {
  console.error(`Connection error: ${err.message}, restart in 5 secondes...`);
  setTimeout(() => {
    connector.connect();
  }, 5000);
});

connector.on("connect", () => {
  connector.disconnect();
  
  const clients = [
    io(URL, CONFIG),
    io(URL, CONFIG),
    io(URL, CONFIG),
    io(URL, CONFIG),
  ]
  
  for (const [i, client] of clients.entries()) {
    client.on("connect", () => {
      console.log(`client ${i}: connected!`);
      setTimeout(() => {
        client.emit("Hello_server", `Hello from client ${i}!`);  
      }, Math.random() * (8000 - 3000) + 3000);
    
      setTimeout(() => {
        client.emit("send_to_all", `Hello from client ${i}!`);  
      }, Math.random() * (8000 - 3000) + 3000);
  
      setTimeout(() => {
        console.log(`client ${i}: disconnection...`);
        client.disconnect();
      }, 9000);
    });
    
    client.on("receive_message", (data) => {
      console.log(`client ${i} received message: ${data}`);
    });
  }
});

