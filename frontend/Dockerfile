# get node image
FROM node:16.14.2 as builder
WORKDIR /usr/src/app/frontend

# install npm modules
COPY --chown=node:node package.json .
RUN npm install
COPY --chown=node:node . .
RUN npm run build

FROM nginx:1.23.1
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/src/app/frontend/build /usr/share/nginx/html
