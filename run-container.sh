
#!/bin/bash

WEBHOOK_URL="https://new-image.free.beeceptor.com/docker-image"
EXPECTED_VALUE="{ "status": "image pushed"}"
SLEEP_TIME=30

git add . 
git commit -m "updated image"
git push origin 
docker compose stop
docker image rm azizjouini/passport-app-saml --force
docker compose rm -f


while true; do
  # Make a request to the endpoint and capture the response
  response=$(curl -s -X POST $WEBHOOK_URL)
  # Check if the response contains the expected message or value
  if [[ "$response" == *"$EXPECTED_VALUE"* ]]; then
    echo "Webhook triggered successfully!"
    break
    # Do something here when the webhook is triggered
  else
    echo "Webhook not triggered."
  fi

  # Wait for the specified time before checking again
  sleep $SLEEP_TIME
done
docker compose pull   
docker compose up -d
