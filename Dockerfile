FROM node:15 

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY wait-for-it.sh /usr/wait-for-it.sh

RUN chmod +x /usr/wait-for-it.sh

COPY . .

EXPOSE 8080

CMD ["npm run start:dev"]