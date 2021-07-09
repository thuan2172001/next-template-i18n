./remove.sh
docker-compose --project-name=dev --env-file .env -f docker-compose.yml up -d --build --force-recreate -V
source .env
ssh -oStrictHostKeyChecking=no -p 22222 -R ${SERVER_DOMAIN}:80:localhost:${PORT} dev.nftal.io | \
./log.sh

