docker-compose --env-file .env.dev -f docker-dev.yml stop
docker-compose --env-file .env.dev -f docker-dev.yml rm --force
docker-compose --env-file .env.dev -f docker-dev.yml up -d --build --force-recreate -V
./log.sh