FROM node:12-alpine

ADD . /app

WORKDIR /app

RUN npm ci
RUN npm run build
