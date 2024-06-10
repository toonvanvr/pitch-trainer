FROM node:22-alpine

RUN npm i -g @angular/cli@18

# NPM cache
VOLUME /root/.npm

# Angular
VOLUME /app
VOLUME /app/node_modules
WORKDIR /app
EXPOSE 4200
CMD npm i && npm run start -- --host 0.0.0.0