
#!/bin/bash
LOCAL_IMAGE_DIGEST=$(docker inspect --format='{{index .RepoDigests 0}}' azizjouini/passport-app-saml)
SLEEP_TIME=20s
git add . 
git commit -m "updated image"
git push origin 

docker compose stop
docker compose rm -f
docker image rm azizjouini/passport-app-saml --force


while true; do
DOCKERHUB_DIGEST=$(docker manifest inspect azizjouini/passport-app-saml | jq -r '.config.digest')
if ["$DOCKERHUB_DIGEST" == "$LOCAL_IMAGE_DIGEST"]; then 
  echo "no image pushed"
else
 echo "new image is pushed"
 break
 fi

sleep $SLEEP_TIME
done

docker compose pull   
docker compose up -d
