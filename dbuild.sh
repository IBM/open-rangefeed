#!/bin/sh

# Create admin app build and copy over
cd ../admin
yarn run build
cd ../rangefeed2
rm -Rf ./admin/*
cp -a ../admin/build/. ./admin/

# Builds and runs docker container
yarn run build
docker stop rangefeed2
docker system prune --force
docker rmi rangefeed2
docker build -t rangefeed2 .
docker run -d -p 80:80 -p 5984:5984 --name rangefeed2 rangefeed2
docker ps

# Create new tarfile to distribute
docker save rangefeed2 > rangefeed2.tar

# Exporting a docker image to tar file:
# $ docker save rangefeed2 > rangefeed2.tar
# See https://www.jamescoyle.net/how-to/1512-export-and-import-a-docker-image-between-nodes