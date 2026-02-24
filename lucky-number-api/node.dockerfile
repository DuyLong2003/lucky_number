FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copi$
# where available (npm@5+)
COPY package*.json ./

#RUN npm install yarn
#RUN yarn
# If you are building your code for production
# RUN npm ci --only=production

RUN npm install
RUN npm install pm2 -g

# Bundle app source
COPY . .

EXPOSE 3000
#EXPOSE 10002

CMD [ "pm2-runtime", "./src/index.js" ]
