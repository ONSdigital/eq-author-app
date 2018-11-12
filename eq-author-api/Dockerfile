FROM node:10-alpine

RUN apk add --no-cache python3 && \
    python3 -m ensurepip && \
    rm -r /usr/lib/python*/ensurepip && \
    pip3 install --upgrade pip setuptools && \
    if [ ! -e /usr/bin/pip ]; then ln -s pip3 /usr/bin/pip ; fi && \
    if [ ! -e /usr/bin/python ]; then ln -sf /usr/bin/python3 /usr/bin/python; fi && \
    rm -r /root/.cache && \
    pip install --upgrade awscli==1.16.27

EXPOSE 4000
ENV PORT=4000
WORKDIR /app

ARG APPLICATION_VERSION
ENV EQ_AUTHOR_API_VERSION $APPLICATION_VERSION
ENV AWS_DEFAULT_REGION eu-west-1
ENV NODE_ENV production

ENTRYPOINT ["./docker-entrypoint.sh"]

COPY . /app
RUN yarn install