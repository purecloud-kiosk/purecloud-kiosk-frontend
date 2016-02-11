# PureCloud Kiosk Frontend [![Build Status](https://travis-ci.org/purecloud-kiosk/purecloud-kiosk-frontend.svg?branch=master)](https://travis-ci.org/purecloud-kiosk/purecloud-kiosk-frontend)

This repo is for the front-end dashboard of the PureCloud Kiosk System.

## Usage
### Requirements
* [NodeJS](http://nodejs.org/) (with [NPM](https://www.npmjs.org/))

### Installation
1. Clone this repo.
2. Install the dependencies with `npm install`. If `postinstall` does not execute, run `bower install`,
3. Start up an instance of the Backend API server, which can be found [here](https://github.com/purecloud-kiosk/purecloud-kiosk-backend)
4. Start the server with `npm start` or `node server.js`.

### Development
If you are continuing development, use `npm run start-dev`. It will watch for changes in the files and rebuild everything for you.

For any new packages that need to be installed, be sure to save it into the package.json (for Node Modules)
and bower.json (for Bower Components).

Just install using the `--save` argument when installing. Ex. `npm install --save express` or `bower install --save bootstrap`

### Testing
Tests are written using [Mocha](http://mochajs.org). As development progresses, add tests to the `test` directory. To execute all of the tests, run `npm test`. Be sure to modify the `test_mongo_uri` (if needed) before testing.

## Credits
* [RDash](https://github.com/rdash/rdash-ui)
