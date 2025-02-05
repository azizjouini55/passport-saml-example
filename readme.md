# Containerised micro service protected by shibboleth SSO 

The sample application is a simple flask REST API. 
we are running a docker compose stack with 3 containers:
- A traefik reverse proxy 
- A node.js middleware service that handles the SAML request resolution and communication with backend API
- A Back end API running our main application

the first iteration of this project was trying out diffrent methods to integrate a Node.js application into an existing shibboleth SSO system.
we tried first a non dockerised application with the passport saml plugin.

for the next step we thought of containerizing every service we need , as we need to make our solution cloud naive.
our docker stack is running on two seperate bridge docker networks,
an internal network for backend services to communicate and a front network for the middleware an traefik services.

on our host VN we have configured and installed a shibboleth service provider to be able to register with TUD Identity provider and register with credentials,
to configure the sp we have used the steps from this link : https://idp.tu-dresden.de/docu/

after installing an sp on our host machine , we can then configure the node.js middleware , this service uses the passport.js package,
which enables us to employ diffrent methods of Authentication , in our case we used passport-saml.
this microservice is always built and pushed to docker hub using a github actions workflow.

for Traefik we used it to hide our internal services that way we have a scalable solution , in case we need to  deploy multiple middleware services for diffrent applications

