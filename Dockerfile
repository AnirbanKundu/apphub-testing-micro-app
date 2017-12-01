FROM node:boron

WORKDIR /usr/app

COPY package.json .
RUN npm install

COPY . .

EXPOSE 9001
CMD [ "node", "app.js" ]