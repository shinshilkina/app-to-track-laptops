FROM alpine:latest
RUN apk add --no-cache nodejs npm
WORKDIR /server

COPY . /server

RUN npm install
RUN npm i mysql2

EXPOSE 5000

ENTRYPOINT ["node"]

CMD ["script.js"]
