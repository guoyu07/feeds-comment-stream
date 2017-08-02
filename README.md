# Pusher Feeds Comments Stream

This is a source code of [Pusher Feeds Comments Stream demo app](https://feeds-comment-stream.herokuapp.com/)

### Usage

#### Feeds instance setup

Please get your `instanceId` and `key` from [Dashboard](https://dash.pusher.com/) first.

Then you can define them:

- For client app can define your `instanceId` in `src/app.js`.
- For server app you can pass `PUSHER_INSTANCE_ID` and `PUSHER_KEY` as env variables for Node.js process or set up manually in `server/index.js`.

#### Yarn
```sh
yarn install
yarn start-dev
```

#### NPM
```sh
npm install
npm run start-dev
```

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

Below you will find some information on how to perform common tasks.<br>
You can find the most recent version of this guide [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).
