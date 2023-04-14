
#!/bin/bash
docker compose stop
docker compose rm -f
docker image rm azizjouini/passport-app-saml --force
#docker compose pull   
docker compose up -d
