const io = require("socket.io-client");

const URL = "http://back:8080/game"
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
  ]

  for (const [i, client] of clients.entries()) {
    client.on("connect", () => {
      console.log(`client ${i}: connected!`);

      if (i == 1) {
        client.emit('launch_game', { friendly: true, player1_id: 1, player2_id: 0 });
        client.emit('paddle_movement', {x: 1, y: 9})
      }
    });
  }

  setTimeout(() => {
    connector.on('new_frame', (data) => {
      console.log(`Puck    position = x :${data.puck.x}, y : ${data.puck.y}`);
      console.log(`Player1 position = x :${data.paddle_player1.x}, y : ${data.paddle_player1.y}`);
      console.log(`Player2 position = x :${data.paddle_player2.x}, y : ${data.paddle_player2.y}`);
    });
  }, 1000);
  
  setTimeout(() => {
    connector.emit('paddle_movement', {x: 4, y: 5})
  }, 2000);


  for (const [i, client] of clients.entries()) {
    setTimeout(() => {
      setTimeout(() => {
        console.log(`client ${i}: disconnection...`);
        client.disconnect();
      }, 500);
    }, 4000);
  }

  connector.on('interrupted_game', () => {
    console.log("Interrupted game");
  });

  setTimeout(() => {
    console.log(`End of the test! send reset to the api...`);
    connector.emit("reset_counter");
    connector.disconnect();
  }, 5000);

});