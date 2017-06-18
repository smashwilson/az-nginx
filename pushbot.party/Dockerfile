FROM node:8-alpine
LABEL maintainer "Ash Wilson"

WORKDIR /usr/src/app
ADD package.json /usr/src/app/package.json
ADD package-lock.json /usr/src/app/package-lock.json
RUN npm install

ADD . /usr/src/app

ENTRYPOINT ["/usr/src/app/entrypoint.sh"]
