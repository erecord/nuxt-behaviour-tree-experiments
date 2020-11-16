FROM node:12-alpine
RUN apk update
RUN apk add git
WORKDIR /usr/src/app

COPY package.json .
RUN yarn

CMD ["yarn", "dev"]