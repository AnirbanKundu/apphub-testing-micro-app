# px-clearfix-design

The clearfix module provides a minimal clearfix helper class to help clear floats. This module is a fork of the [inuitcss clearfix module](https://github.com/inuitcss/trumps.clearfix).

**px-clearfix-design is a Predix UI CSS module.** You can find a demonstration and full documentation on the [Predix UI catalog](https://predixdev.github.io/predix-ui/?show=px-clearfix-design&type=css]).

## Install the module

To use the module, you need to install it in your project using Bower. Run this task on the command line from inside your project folder:

```
bower install --save px-clearfix-design
```

## Import it in your Sass

The module won't do anything until you import and configure it in your project Sass file. Follow these steps to import it:

### 1. Enable Flags

There are no flags to set before importing this module in your project Sass file.

### 2. Customize Styles

There are no style variables to set before importing this module in your project Sass file.

### 3. Import Sass File

Import the module by placing this code into the **Trumps** layer of your project Sass file:

```
@import 'px-clearfix-design/_trumps.clearfix.scss';
```

## Use it in your project

You'll use this module to add the `clearfix` rules to other classes in your Sass.

Avoid using the `.clearfix` class directly in your markup. Instead, try to `@extend` the clearfix module inside the parent class that will wrap around floated elements. For example:

```
.row {
  @extend %clearfix;
  ...
}
```

## Dependencies

This module depends on the following Predix UI CSS modules:

* [px-functions-design](https://github.com/PredixDev/px-functions-design)
