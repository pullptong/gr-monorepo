FROM node:18-alpine

WORKDIR /usr/src/app/dashboard

COPY package*.json ./

RUN npm ci

COPY . .