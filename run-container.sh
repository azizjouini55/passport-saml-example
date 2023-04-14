
#!/bin/bash

git add . 
git commit -m "updated image"
git push origin 
docker compose stop
docker image rm azizjouini/passport-app-saml --force
docker compose rm -f
sleep 20s
docker compose pull   
docker compose up -d
