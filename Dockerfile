FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 61001

CMD [ "npm", "run", "dev" ]