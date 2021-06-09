FROM node:11.9

WORKDIR /app

RUN mkdir -p /app
COPY package.json /app
#COPY package-lock.json /app

WORKDIR /app

RUN npm install
COPY . /app

# Check the app for any syntax errors
RUN node app.js

EXPOSE 4192

CMD ["npm", "start"]

