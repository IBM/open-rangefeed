# Open Rangefeed
A stock- and social sentiment simulator required for Cyber Ranges.

## DB Setup

1. Install CouchDB or use Cloudant on IBM Cloud
2. Create a new database called "rangefeed2"
3. Create a new DB user
4. Give this user read permissions on the new rangefeed2 DB you created in step 2
5. Put the hostname where your DB is located into [src/dbconfig.js](src/dbconfig.js)

## App Setup

1. Install deps via `$ yarn`. If you don't have yarn installed do `$ npm install -g yarn`.
2. Populate default content in these folders:
- [Profile Pictures](public/img/faces/legacy) – Put in images with file names 0.jpeg, 1.jpeg, 2.jpeg... and so on.
- [Social Media Messages](src/content/tweet-list/tweets.json) – Examples included in file. Add as many messages as you want.

## How to run locally
```
$ yarn start
```

## Create production build
```
$ yarn run build
```
The build will be copied to the [build folder](build). You can deploy the content to a web server like NGINX or Apache.

## Enable CORS

If you have your DB instance on a different domain you will run into cross domain issues. To resolve this add the whitelisted domains to the cors "origins" array in [cors.json](cloud/dbjson/cors.json).
