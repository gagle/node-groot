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

    expect(global.__require).to.be.a.function();
    expect(global.__root).to.be.equal(__dirname);

    done();
  });
});

describe('groot', function () {
  after(function (done) {
    delete global.__base;
    done();
  });

  it('does not do anything if no options are passed', function (done) {
    groot();

    expect(global.__require).to.not.exist();
    expect(global.__root).to.not.exist();

    done();
  });

  it('takes the __dirname of the caller function if rootDir is not passed',
      function (done) {
    groot({ rootVar: '__base' });

    expect(global.__base).to.be.equal(__dirname);

    done();
  });

  it('requires absolute root paths', function (done) {
    expect(function () {
      groot({ rootDir: 'foo' });
    }).to.throw();

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

    expect(global.__require('./foo')).to.be.equal('bar');

    done();
  });

  it('does not allow paths not starting with a dot', function (done) {
    groot({ requireVar: '__require' });

    expect(function () {
      global.__require('foo');
    }).to.throw();

    done();
  });
});