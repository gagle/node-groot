'use strict';

var code = require('code');
var lab = module.exports.lab = require('lab').script();

var expect = code.expect;
var describe = lab.describe;
var it = lab.it;
var after = lab.after;
var afterEach = lab.afterEach;

var groot = require('../lib');

describe('groot', function () {
  after(function (done) {
    delete global.__root;
    delete global.__require;
    done();
  });

  it('sets global vars', function (done) {
    groot({ requireVar: '__require', rootVar: '__root', rootDir: __dirname });

    expect(__require).to.be.a.function();
    expect(__root).to.be.equal(__dirname);

    done();
  });
});

describe('groot', function () {
  afterEach(function (done) {
    delete global.__require;
    done();
  });

  it('calls the original require function', function (done) {
    groot({ requireVar: '__require' });

    expect(__require('./quux')).to.be.equal('quux');

    done();
  });

  it('takes paths relative from the root', function (done) {
    groot({ requireVar: '__require' });

    expect(__require('./foo/bar')).to.be.equal('qux');

    done();
  });

  it('requires paths starting with a dot', function (done) {
    groot({ requireVar: '__require' });

    expect(function () {
      __require('foo');
    }).to.throw();

    done();
  });
});

describe('groot', function () {
  after(function (done) {
    delete global.__base;
    done();
  });

  it('does not do anything if no options are passed', function (done) {
    var globalKeys = Object.keys(global).length;

    groot();

    expect(Object.keys(global).length).to.equal(globalKeys);

    done();
  });

  it('takes the __dirname of the caller function if rootDir is not passed',
      function (done) {
    groot({ rootVar: '__base' });

    expect(__base).to.be.equal(__dirname);

    done();
  });

  it('requires absolute root paths', function (done) {
    expect(function () {
      groot({ rootDir: 'foo' });
    }).to.throw();

    done();
  });
});