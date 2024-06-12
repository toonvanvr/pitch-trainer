# Pitch Trainer

## Develop locally

```sh
cd app
yarn install
yarn run start
```

http://localhost:4200

## Develop locally using docker

> This probably won't work well on linux due to the root permissions on volumes
> and Windows' docker doesn't support autoreload due to NTFS

```sh
docker compose up --build
```

http://localhost:4200

Note: docker has its own volume with node_modules 
