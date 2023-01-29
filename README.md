# 💫 Pong Wars - ft_transcendence
<a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white"/></a>
<a href="https://nestjs.com/"><img src="https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white"/></a>
<a href="https://www.postgresql.org/"><img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white"/></a>
<a href="https://socket.io/"><img src="https://img.shields.io/badge/Socket.io-010101?&style=for-the-badge&logo=Socket.io&logoColor=white"/></a>
<a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"/></a>
<a href="https://p5js.org/"><img src="https://img.shields.io/badge/p5%20js-ED225D?style=for-the-badge&logo=p5dotjs&logoColor=white"/></a>

ft_transcendence is [42 school](http://42.fr)'s end of common core cursus project where you need to build a web app for the students to play a cool game of pong. **_[Test Pong Wars here](https://pong-wars.cyberduck.blog/)_** !   

<p align="center"><img src="/assets/pong_wars.gif" width="700"/></p>

Our twist on the famous arcade game ? You can play in space ! Featuring its fun and colourful retro design, **Pong Wars** is a tribute to the old times, where pixels looked much bigger on our screens but where games were just as fun as today. Make some friends (or ennemies) by challenging them to a game of galactic pong.   
You’re not a student of 42 ? No problem, use one of our *ghost users* to log in and have fun with everyone else !
<p align="center"><img src="/assets/pong_game.gif" width="700"/></p>

## Our stack

- NestJS 8 (backend framework based on Node.js)
- PostgreSQL
- Swagger (API documentation)
- Socket.io
- ReactJS 17 (frontend framework)
- Sass
- p5.js

All our code is written in Typescript.

## Usage & prerequisites

⚠️ Note that you will need *42 school API keys* to run this project. ⚠️ 

If you don’t have access to the API, you can still visit Pong Wars [here](https://pong-wars.cyberduck.blog/) and log in as Ghosty or Casper, our ghost users.

To launch Pong Wars you will need **Docker**.  Several `.env.sample` have been provided to show the required environnement variables.

```jsx
# Build the app
make

# Stop the app
make down

# Clean
make clean
```

## Features

### Game

- Live multiplayer Pong game made with p5.js and socket.io
- Matchmaking system
- Game customisation (3 different maps, adjust ball speed, number a goals, enable boots and power-ups …)
- Spectator mode

<p align="center"> <img src="/assets/matchmaking.png" width="30%"/> <img src="/assets/win_view.png" width="30%"/> <img src="/assets/street_fighter_map.png" width="30%"/> </p>

### Chat

- Direct messages
- Easy channel creation (public, private or protected by a password)
- Ability to block other users
- Moderation system (ban and mute)
- Access to users’s profiles
- Ability to send game request

<p align="center">
<img src="/assets/channel_creation_example.png" width="30%"/> <img src="/assets/moderation_example.gif" width="30%"/> <img src="/assets/chat_profile.png" width="30%"/> 
</p>

### User account

- Students can log in via the school authentication API
- Customisation of username (must be unique) and profile picture (generated automatically if none is provided)
- Option to enable two-factor authentication
- Friend list
- Current status (online, offline, in game)
- Statistics (rank, win rate, number of matches played …)
- Match history
- Achievements
<p align="center"><img src="/assets/profile_page.png" width="700"/></p>

## Contribution
This beautiful project has been brought to you by :

[@CyberDuck79](https://github.com/cyberduck79) - Back-end developpement and deployment  
[@amartin-menadier](https://github.com/amartin-menadier) - Back-end developpement   
[@jgonfroy42](https://github.com/jgonfroy42) - Back-end developpement   
[@celeloup](https://github.com/celeloup) - Design and front-end developpement  
[@cclaude42](https://github.com/cclaude42) - Front-end developpement
