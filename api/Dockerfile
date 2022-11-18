FROM node:18-alpine

WORKDIR /usr/src/app/api

COPY package*.json ./

RUN npm ci

COPY . .