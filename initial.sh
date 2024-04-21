#!/bin/bash
docker stop frontendcontainer
docker rm frontendcontainer

docker build -t vuefrontend .
docker run -d -p 3000:80 --name frontendcontainer vuefrontend
