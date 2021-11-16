FROM node:15.14.0-alpine3.12
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install
RUN npm run build
EXPOSE 8080
CMD [ "npm", "start" ]


