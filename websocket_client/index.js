const io = require("socket.io-client");

const URL = "http://back:8082/test"
const CONFIG = { path: "/socket/" }
const connector = io(URL, CONFIG);

// connector wait for successful connection and launch the tests
connector.on("connect_error", (err) => {
  console.error(`Connection error: ${err.message}, restart in 15 secondes...`);
  setTimeout(() => {
    connector.connect();
  }, 15000);
});

connector.on("connect", () => {
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
      console.log(`client ${i}: ${data}`);
    });
  }

  setTimeout(() => {
    console.log(`End of the test! send reset to the api...`);
    connector.emit("reset_counter");
    connector.disconnect();
  }, 10000);
});
