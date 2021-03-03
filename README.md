# Open Rangefeed
A stock- and social sentiment simulator required for Cyber Ranges.

Note: We use Yarn instead of NPM so make sure you have it installed before following any of the steps below:
```
$ npm install -g yarn
```

## DB Setup

1. Install CouchDB or use Cloudant on IBM Cloud
2. Create a new database called "rangefeed2"
3. Create a new database called "tweets"
4. Create a new DB user
5. Make your new user a member of the 2 DBs you created in step 2 and 3
6. Put the hostname where your DB is located into [src/dbconfig.js](src/dbconfig.js)
7. Enable CORS on your DB instance

### Enable CORS on CouchDB

If you are running your DB instance on a different domain compared to your app instance you need to enable CORS. In the following replace `127.0.0.1` with the IP address of your CouchDB instance. For enhanced security you want to set the `origins` value to the domain where your Rangefeed2 app instance is running on instead of the wildcard `*`. Then run each curl command one by one.

If you are using Cloudant then these commands will not work. You will have to log into your IBM Cloud console and configure CORS from there via the UI.

```
curl -X PUT http://127.0.0.1:5984/_node/_local/_config/httpd/enable_cors -d '"true"'
curl -X PUT http://127.0.0.1:5984/_node/_local/_config/cors/origins -d '"*"'
curl -X PUT http://127.0.0.1:5984/_node/_local/_config/cors/credentials -d '"true"'
curl -X PUT http://127.0.0.1:5984/_node/_local/_config/cors/methods -d '"GET, PUT, POST, HEAD, DELETE"'
curl -X PUT http://127.0.0.1:5984/_node/_local/_config/cors/headers -d '"accept, authorization, content-type, origin, referer, x-csrf-token"'
curl -X PUT http://127.0.0.1:5984/_node/_local/_config/httpd/enable_cors -d '"true"'
curl -X PUT http://127.0.0.1:5984/_node/_local/_config/chttpd/bind_address -d '"0.0.0.0"'
```

## Content Population

1. Put in profile pictures with file names 0.jpeg, 1.jpeg, 2.jpeg etc. into the [faces folder](public/img/faces/legacy)
2. Populate tweets in [tweets.json](src/content/tweet-list/tweets.json)

## Install Dependencies
```
$ yarn
```

## Running Locally
```
$ yarn start
```

## Create Build

```
$ yarn run build
```

The build will be copied to the folder [build](build). You can deploy the content to a web server like NGINX or Apache. Alternatively you can also use Docker.

## Docker Deployment

### Stop running Rangefeed2 instances on Docker
```
$ yarn run dstop
```

### Delete old local images
```
$ yarn run dclear
```

### Create fresh Docker image
```
$ yarn run dbuild
```

Deploy your Docker image on your Kubernetes or OpenShift cluster.


### Run Docker image locally
```
$ yarn run drun
```

### Create tar ball
```
$ yarn run tar
```

To load the tarball to a Docker runtime do:
```
$ docker load --input rangefeed2.tar
```