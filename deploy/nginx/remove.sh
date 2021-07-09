docker-compose --env-file .env -f docker-compose.yml stop
docker-compose --env-file .env -f docker-compose.yml rm --force
docker volume prune --force