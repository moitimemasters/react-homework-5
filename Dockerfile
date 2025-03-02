FROM node:23

WORKDIR /app

COPY package.json /app
RUN npm install

COPY . /app

CMD ["npm", "run", "start"]
