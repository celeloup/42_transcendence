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
  // connector.emit("reset_counter");
  const clients = [
    io(URL),
    io(URL),
    io(URL),
  ]
  for (const [i, client] of clients.entries()) {
    client.on("connect", () => {
      console.log(`client ${i}: connected!`);
      if (i == 1) {
        client.emit('launch_game', { id: 444, friendly: false, user1_id: 1, user2_id: 2, user1_score: 10, user2_score: 10 });
        client.emit('paddle_movement', { id_game: 444, move: "up" })
      }
      if (i == 1 || i == 2)
      client.emit('join_game', 444);
      // if (i == 4) {
      //   client.emit('launch_game', { id: 789, friendly: false, user1_id: 3, user2_id: 4, user1_score: 10, user2_score: 10 });
      //   client.emit('paddle_movement', { id_game: 789, y: 28 })
      // }
      if (i == 2) {
        connector.emit("reset_counter");
      }
    });
    setTimeout(() => {
      client.on('new_frame', (data) => {
        console.log(`CLIENT ${i} RECEIVING:`)
        console.log(`Puck    position = x :${data.puck.x}, y : ${data.puck.y}`);
        console.log(`Player1 position = x :${data.paddle_player1.x}, y : ${data.paddle_player1.y}`);
        console.log(`Player2 position = x :${data.paddle_player2.x}, y : ${data.paddle_player2.y}`);
      });
    }, 500);
  }

  // setTimeout(() => {
  //   connector.on('new_frame', (data) => {
  //     console.log(`Puck    position = x :${data.puck.x}, y : ${data.puck.y}`);
  //     console.log(`Player1 position = x :${data.paddle_player1.x}, y : ${data.paddle_player1.y}`);
  //     console.log(`Player2 position = x :${data.paddle_player2.x}, y : ${data.paddle_player2.y}`);
  //   });
  // }, 1000);

  // setTimeout(() => {
  //   connector.emit('paddle_movement', { id_game: 444, y: 5 })
  // }, 1000);

  for (const [i, client] of clients.entries()) {
    setTimeout(() => {
      setTimeout(() => {
        console.log(`client ${i}: disconnection...`);
        client.disconnect();
      }, 100);
    }, 1000);
  }

  setTimeout(() => {
    console.log(`End of the test! send reset to the api...`);
    connector.disconnect();
  }, 2000);

  setTimeout(() => {
    console.log("Ending test");
  }, 3000);
});