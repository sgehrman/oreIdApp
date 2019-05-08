### STAGE 1: Build ###

# We label our stage as 'vue-built'
FROM node:11-alpine AS vue-built

# we need that for node-gyp
RUN apk add --update \
  git  \
  autoconf \
  automake \
  libtool \
  libpng-dev \
  nasm \
  python \
  python-dev \
  py-pip \
  build-base \
  g++ \
  openssh-client \
  cairo-dev \
  jpeg-dev \
  pango-dev \
  giflib-dev \
  && pip install virtualenv \
  && rm -rf /var/cache/apk/*

RUN mkdir /ng-app
WORKDIR /ng-app

COPY . .

RUN npm i

RUN npm run build

FROM nginx:1.15.2-alpine

## Copy our default nginx config
COPY nginx/default.conf /etc/nginx/conf.d/

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

## From 'builder' stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=vue-built /ng-app/build /usr/share/nginx/html

## copy favicons
COPY --from=vue-built /ng-app/favicon/* /usr/share/nginx/html/

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
