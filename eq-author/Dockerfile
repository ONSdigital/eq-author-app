FROM node:8-alpine as build

WORKDIR /app

ARG APPLICATION_VERSION
ENV EQ_AUTHOR_VERSION $APPLICATION_VERSION

# Install
COPY package.json yarn.lock /app/
RUN yarn install --frozen-lockfile

# Copy build dependencies
COPY src /app/src
COPY config /app/config
COPY public /app/public
COPY scripts /app/scripts
COPY .babelrc .eslintrc.js .env .env.production /app/

RUN yarn build

FROM nginx:stable

EXPOSE 3000

COPY nginx /etc/nginx/
# Log to stdout/stderr
RUN mkdir -p /etc/nginx/logs && ln -sf /dev/stdout /etc/nginx/logs/access.log && ln -sf /dev/stderr /etc/nginx/logs/error.log
COPY --from=build /app/build /etc/nginx/html/
RUN cp /etc/nginx/html/index.html /etc/nginx/html/index.html.tmpl

CMD ["/etc/nginx/docker-entrypoint.sh"]
