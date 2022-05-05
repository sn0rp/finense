FROM node:alpine as base

WORKDIR /finense

COPY . .

RUN npm install

CMD ["npm", "run", "start"]