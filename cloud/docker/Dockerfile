FROM node:argon

WORKDIR /api

COPY package.json /api/

RUN npm install --production \
  && npm cache clean \
  && rm -rf ~/.node-gyp /tmp/npm* \
  && rm -rf /shared-modules

COPY ./app/ /api/app/

ENV SERVICE_8080_NAME="app-mdocs-co" \
    PORT="8080" \
    NODE_ENV="production"

EXPOSE 8080

CMD ["node", "./app/index.js"]
