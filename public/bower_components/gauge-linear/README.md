# gauge-linear

A D3-based linear gauge.

## Installation

1) From the root of your application:
```
$ bower install git@github.build.ge.com:components/gauge-linear.git --save
```
2) Tell your module loader to import the angular module, and inject it into your Angular application. In your app.js:
```
import GaugeLinearModule from './bower_components/gauge-linear/dist/module';
let AppModule = angular.module('app', [
  // lots of injected stuff, like:
  'ui.router',
  // this module
  'GaugeLinearModule'
]);
```
3) Import the styles for this module. In your app.scss:
```
@import "../bower_components/gauge-linear/dist/module";
```

## Usage

See the comments in dist/module.js for usage. Also see the live demo with examples at http://angular-es6-datavis.grc-apps.svc.ice.ge.com/#/gauges

## Contributing

Assuming you have followed the installation instructions above,

1) Clone this repo:
```
$ git clone git@github.build.ge.com:components/gauge-linear.git
```
2) Install dependencies:
```
bash-3.2$ npm install
bash-3.2$ jspm install
```
3) Use [bower link](http://bower.io/docs/api/#link) to create a local symlink:
```
$ cd gauge-linear
$ bower link
```
4) Link your application to the repo. From the root of your application:
```
$ bower link gauge-linear
```
5) Make your changes in `src/` and when you're ready to see them, update `dist/`:
```
bash-3.2$ npm run-script prepublish
```
This command copies `src/module.js` and `src/gauge-linear.js` to `dist/`. Reload your application and you should see the changes.

## Testing

This module uses Karma and Jasmine for unit tests. To run your tests and generate a code coverage report:
```
bash-3.2$ karma start
```
