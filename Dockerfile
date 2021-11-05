#Stage 0 - Build Frontend Assets
FROM node:12.22.5 as build

WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm --save-dev nodemon
COPY . .
RUN npm run build
RUN npm run devstart

# Stage 1 - Serve Frontend Assets
FROM nginx:1.19

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY  --from=build /app/build /usr/share/nginx/html
