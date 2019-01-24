FROM node:10-alpine
MAINTAINER eq.team@ons.gov.uk

ARG APPLICATION_VERSION
ENV EQ_PUBLISHER_VERSION $APPLICATION_VERSION
ENV NODE_ENV production

COPY . /app
WORKDIR /app
RUN yarn install --frozen-lockfile

EXPOSE 9000

ENTRYPOINT ["yarn", "start"]