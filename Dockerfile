FROM node:25.5-alpine

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* ./

RUN npm install; 

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]