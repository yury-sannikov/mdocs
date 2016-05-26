FROM node:argon

WORKDIR /www

COPY package.json /www/

RUN npm install --production \
  && npm cache clean \
  && rm -rf ~/.node-gyp /tmp/npm* \
  && rm -rf /shared-modules

COPY ["./public/", "/www/public/"]
COPY ["./src/", "/www/src/"]
COPY ["./views/", "/www/views/"]
COPY ["./resources/", "/www/resources/"]
COPY ["./.env", "/www/.env"]

ENV SERVICE_8080_NAME="app-mdocs-co" \
    PORT="3030" \
    NODE_ENV="production"

EXPOSE 3030

CMD ["node", "./src/index.js"]
