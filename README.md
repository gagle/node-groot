groot
=====

#### Module loader with global variables ####

[![npm][npm-image]][npm-url]
[![travis][travis-image]][travis-url]
[![coveralls][coveralls-image]][coveralls-url]

This module tries to solve and improve the module loading. It's very common to have `require()`'s with relative paths like `../../../foo/bar`.

This is a well-known problem known by the Node.js community: [Better local require() paths for Node.js][better-require]. There are some solutions that seem to work but I personally dislike most of them, especially the one which uses the `node_modules` directory to store the modules of your app. My advice is to only use `node_modules` for external modules, __never__ for storing you own modules.

The way this module avoids the relative paths is by using global variables. This is by far the best solution to this problem; clean, easy to understand and compatible with all the operating systems.

```javascript
require('groot')({ requireVar: '__require', rootVar: '__root' });
```

If you execute the above piece of code in the main file, which is typically stored in the root directory, `__root` and `__require` will be set as global variables. `__root` will contain the absolute path of the root directory, and `__require` will be a function similar to `require()` but for loading the modules relative to root directory.

The root directory is the `__dirname` of the caller function.

For example, given the project's directory tree:

```
.
├─ app.js
├─ foo
│  └─ bar.js
└─ baz
   └─ qux.js
```

```javascript
// app.js
require('groot')({ requireVar: '__require', rootVar: '__root' });

// bar.js
var qux = __require('./baz/qux');
// "." points to the __dirname of app.js, that is, the project's root directory
```

Note that `__require('baz/qux')` (without a dot `.`) is intentionally invalid to avoid confusion with modules stored inside `node_modules`. The path must begin with a dot `.`.

An extra option can be passed to set the root directory instead of the directory of the caller:

```javascript
require('groot')({
  requireVar: '__require',
  rootVar: '__root',
  rootDir: __dirname
});
```

By setting `rootDir` to `__dirname` this is, in fact, the same as not setting the `rootDir` option.

___module_([options]) : undefined__

Options:

- __requireVar__ - _String_  
  Name of the global variable to require modules.
- __rootVar__ - _String_  
  Name of the global variable of the root directory.
- __rootDir__ - _String_  
  Absolute path that will be used as the root directory.

[npm-image]: https://img.shields.io/npm/v/groot.svg?style=flat
[npm-url]: https://npmjs.org/package/groot
[travis-image]: https://img.shields.io/travis/gagle/node-groot.svg?style=flat
[travis-url]: https://travis-ci.org/gagle/node-groot
[coveralls-image]: https://img.shields.io/coveralls/gagle/node-groot.svg?style=flat
[coveralls-url]: https://coveralls.io/r/gagle/node-groot
[better-require]: https://gist.github.com/branneman/8048520