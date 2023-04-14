
#!/bin/bash

git add . 
git commit -m "updated image"
git push origin 
docker compose stop
docker image rm azizjouini/passport-app-saml --force
docker compose rm -f
curl -v -X POST 'https://new-image.free.beeceptor.com/my/api/path' -H 'Content-Type: application/json' -d '{"data":"Hello Beeceptor"}'
docker compose pull   
docker compose up -d
