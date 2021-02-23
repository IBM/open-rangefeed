# RangeFeed2
A stock- and social sentiment simulator required for Cyber Ranges.

## Setup
1. Add your DB config to [src/dbconfig.js](src/dbconfig.js).
2. Install deps via `$ yarn`

If you don't have yarn installed do `$ npm install -g yarn`

3. Populate default content.
- [Profile Pictures](public/img/faces/legacy) For IBM use, this content can be found [here](https://ibm.ent.box.com/folder/127129180625)
- [Special Images](public/img/faces/special) For IBM use, this content can be found [here](https://ibm.ent.box.com/folder/127130913759)
- [Tweets](src/content/tweet-list/tweets.json) For IBM use, this content can be found [here](https://ibm.ent.box.com/file/737140732000)

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
