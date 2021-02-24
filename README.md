# Open RangeFeed
A stock- and social sentiment simulator required for Cyber Ranges.

## Setup
1. Add your DB config to [src/dbconfig.js](src/dbconfig.js).
2. Install deps via `$ yarn`

If you don't have yarn installed do `$ npm install -g yarn`

3. Populate default content in these folders:
- [Profile Pictures](public/img/faces/legacy) – Put in images with file names 0.jpeg, 1.jpeg, 2.jpeg... and so on.
- [Social Media Messages](src/content/tweet-list/tweets.json) – Examples included in file. Add as many messages as you want.

## How to run locally
Install CouchDB and create a new database called "rangefeed2". Then run:
```
$ yarn start
```

## Create production build
```
$ yarn run build
```
The build will be copied to [/build](build). You can deploy the content to a web server like NGINX or Apache.

## Enable CORS

If you have your DB instance on a different domain you will run into cross domain issues. To resolve this add the whitelisted domains to the cors "origins" array in [cors.json](cloud/dbjson/cors.json).
