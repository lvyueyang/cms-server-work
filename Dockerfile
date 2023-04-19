FROM node:18-alpine

WORKDIR /app

COPY . /app

ENV TZ="Asia/Shanghai"

EXPOSE 7000

CMD ["npm", "run", "start:prod", "--prefix", "packages/server"]
