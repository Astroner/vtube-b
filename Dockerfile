FROM node:16-alpine

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

EXPOSE 8080
ENV NODE_ENV=production
ENV PORT=8080
CMD ["yarn", "start"]