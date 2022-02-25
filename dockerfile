# syntax=docker/dockerfile:1

FROM node:17.3.0-alpine

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

RUN apk update
RUN apk add
RUN apk add ffmpeg

COPY . .

CMD [ "node", "index.js" ]