const io = require("socket.io-client");

const URL = "http://back:8080/channel"
const connector = io(URL);

// connector wait for successful connection and launch the tests
connector.on("connect_error", (err) => {
  console.error(`Connection error: ${err.message}, restart in 15 secondes...`);
  setTimeout(() => {
    connector.connect();
  }, 15000);
});

connector.on("connect", () => {
  const clients = [
    io(URL),
    io(URL),
    io(URL),
    io(URL),
  ]
  
  for (const [i, client] of clients.entries()) {
    client.on("connect", () => {
      console.log(`client ${i}: connected!`);
      setTimeout(() => {
		  const message = `Hello from client ${i}!`;
		  const recipient = `toto`;

		  client.emit('send_message', { content: message , recipient: recipient});
      }, Math.random() * (8000 - 3000) + 3000);
      
      client.emit("request_messages", 'toto');

      setTimeout(() => {
        console.log(`client ${i}: disconnection...`);
        client.disconnect();
      }, 9000);
    });
    
    client.on("messagesByChannel", (data) => {
      console.log(`client ${i}: ${JSON.stringify(data)}`);
    });

  }

 setTimeout(() => {
   console.log(`End of the test! send reset to the api...`);
   connector.emit("reset_counter");
   connector.disconnect();
 }, 10000);
});
