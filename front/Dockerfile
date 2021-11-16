FROM node:14.17.6-alpine3.12
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install
RUN npm run build
ENV HOST=0.0.0.0
EXPOSE 3000
CMD [ "npm", "start" ]
