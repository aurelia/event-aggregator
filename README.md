# aurelia-event-aggregator

[![npm Version](https://img.shields.io/npm/v/aurelia-event-aggregator.svg)](https://www.npmjs.com/package/aurelia-event-aggregator)
[![ZenHub](https://raw.githubusercontent.com/ZenHubIO/support/master/zenhub-badge.png)](https://zenhub.io)
[![Join the chat at https://gitter.im/aurelia/discuss](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/aurelia/discuss?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![CircleCI](https://circleci.com/gh/aurelia/event-aggregator.svg?style=shield)](https://circleci.com/gh/aurelia/event-aggregator)

This library is part of the [Aurelia](http://www.aurelia.io/) platform and contains a lightweight pub/sub messaging system for app-wide or per-object loosely coupled events.

> To keep up to date on [Aurelia](http://www.aurelia.io/), please visit and subscribe to [the official blog](http://blog.aurelia.io/) and [our email list](http://eepurl.com/ces50j). We also invite you to [follow us on twitter](https://twitter.com/aureliaeffect). If you have questions, please [join our community on Gitter](https://gitter.im/aurelia/discuss) or use [stack overflow](http://stackoverflow.com/search?q=aurelia). Documentation can be found [in our developer hub](http://aurelia.io/hub.html). If you would like to have deeper insight into our development process, please install the [ZenHub](https://zenhub.io) Chrome or Firefox Extension and visit any of our repository's boards.

## Platform Support

This library can be used in the **browser** as well as on the **server**.

## Building The Code

To build the code, follow these steps.

1. Ensure that [NodeJS](http://nodejs.org/) is installed. This provides the platform on which the build tooling runs.
2. From the project folder, execute the following command:

	```shell
	npm install
	```
4. To build the code, you can now run:

	```shell
	npm run build
	```
5. You will find the compiled code in the `dist` folder, available in six module formats: AMD, CommonJS and ES2015, ES2017, native modules, and System.

6. See `package.json` scripts section for other tasks related to generating the docs and linting.

## Running The Tests

To run the unit tests, first ensure that you have followed the steps above in order to install all dependencies and successfully build the library. Once you have done that, proceed with these additional steps:

```shell
npm test
```
