# px-modal [![Build Status](https://travis-ci.org/PredixDev/px-modal.svg?branch=master)](https://travis-ci.org/PredixDev/px-modal)

[![px-modal demo](px-modal.png?raw=true)](https://github.com/PredixDev/px-modal)

## Overview

px-modal is a Predix UI component that opens a modal window and overlays over the page.


## Usage

### Prerequisites
1. node.js
2. npm
3. bower
4. [webcomponents-lite.js polyfill](https://github.com/webcomponents/webcomponentsjs)

Node, npm and bower are necessary to install the component and dependencies. webcomponents.js adds support for web components and custom elements to your application.

### Getting Started

First, install the component via bower on the command line.

```
bower install https://github.com/PredixDev/px-modal.git --save
```

Second, import the component to your application with the following tag in your head.

```
<link rel="import" href="/bower_components/px-modal/px-modal.html"/>
```

Finally, use the component in your application:

### Examples

Modal triggered by button click
```
<px-modal
  btn-modal-positive="Continue"
  btn-modal-negative="Back"
  modal-heading="Sign-in required">
    <button class="btn btn--primary modal-trigger">Open Modal</button>
    <p>
      <b>Please sign-in to access this part of the application.</b>
    </p>
    <p>Lorem ipsum</p>
</px-modal>
```

Modal triggered by link
```
<px-modal
  btn-modal-positive="Continue"
  btn-modal-negative="Back"
  modal-heading="Sign-in required">
    <a href="javascript:void(0)" class="modal-trigger">Open Modal</a>
    <p>
      <b>Please sign-in to access this part of the application.</b>
    </p>
    <p><em>Two</em>Lorem ipsum dolor sit amet, </p>
</px-modal>
```

An input that brings up a modal when input loses focus (onblur event)
```
<input onblur="inputLostFocus()" class="text-input" type="text" placeholder="…">
<px-modal
  id="three"
  btn-modal-positive="Continue"
  btn-modal-negative="Back"
  modal-heading="Sign-in required">
    <p>
      <b>Please sign-in to access this part of the application.</b>
    </p>
    <p><em>Two</em>Lorem ipsum dolor sit amet, </p>
</px-modal>

<script>
  function inputLostFocus(evt){
    Polymer.dom(document).querySelector("#three").modalButtonClicked();
  }
</script>
```

Click on the link to open its modal, click OK to go to www.ge.com:
```
<a href="javascript:void(0)" onclick="gotoLink()">Goto GE.com?</a>
<px-modal
  id="four"
  btn-modal-positive="Continue"
  btn-modal-negative="Back"
  modal-heading="Sign-in required">
    <p>
      <b>Please sign-in to access this part of the application.</b>
    </p>
    <p><em>Two</em>Lorem ipsum dolor sit amet, </p>
</px-modal>

<script>
  function gotoLink(evt){
    Polymer.dom(document).querySelector("#four").modalButtonClicked();
  }

  document.getElementById('four').addEventListener('btnModalPositiveClicked', function() {
    window.location.href = 'https://www.ge.com';
  });
</script>
```

## documentation

Read the full API and view the demo [here](https://predixdev.github.io/px-modal).

### Local Development
From the component's directory...

```
$ npm install
$ bower install
$ gulp sass
```

### API and examples

From the component's directory

```
$ gulp serve
```

Starts a local server. Navigate to the root of that server (e.g. http://localhost:8080/) in a browser to open the API documentation page, with link to the "Demo" / working examples.


### GE Coding Style Guide
[GE JS Developer's Guide](https://github.com/GeneralElectric/javascript)

<br />
<hr />

## Known Issues

Please use [Github Issues](https://github.com/PredixDev/px-modal/issues) to submit any bugs you might find.
