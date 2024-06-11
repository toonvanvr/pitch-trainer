FROM node:22

RUN npm i -g @angular/cli@18

# NPM cache
VOLUME /root/.npm

# Angular
RUN mkdir -p /app/node_modules
VOLUME /app
VOLUME /app/node_modules
WORKDIR /app
EXPOSE 4200
CMD yarn install && yarn run start -- --host 0.0.0.0
