"use strict";

var sut = require('../lib/util'),
  expect = require('chai').expect;

describe('util', function () {

  describe('isBlank', function () {

    var blankTests = [null, undefined, '', '   ', ' \n '];

    blankTests.forEach(function(test) {
      it('should return true for: ' + test, function () {
        expect(sut.isBlank(test)).to.be.true;
      });
    });

    it('should return false for words', function () {
      expect(sut.isBlank('foo')).to.be.false;
    });

  });

  describe('collapseWhitespace', function () {

    it('should trim collapse some whitespace', function () {
      var word = '   blah \n asdf';
      expect(sut.collapseWhitespace(word)).to.eql('blah asdf');
    });

  });


  var tests = [
    {
      haystack: 'It was the best of times. It was the worst of times.',
      haystackType: 'string',
      index: {
        needle: 'Best',
        expected: 'It was the best of times'.indexOf('best')
      },
      count: {
        needle: 'i',
        expected: 4
      }
    },
    {
      haystack: ['ABC', 'ghi', 'GhI', 'jkm'],
      haystackType: 'array',
      index: {
        needle: 'GHI',
        expected: 1
      },
      count: {
        needle: 'GHI',
        expected: 2
      }
    },
    {
      haystack: 'It was the best of times. It was the worst of times.',
      haystackType: 'string',
      index: {
        needle: 'Awesome',
        expected: -1
      },
      count: {
        needle: 'needle',
        expected: 0
      }
    },
    {
      haystack: ['ABC', 'ghi', 'GhI', 'jkm'],
      haystackType: 'array',
      index: {
        needle: 'XYZ',
        expected: -1
      },
      count: {
        needle: 'needle',
        expected: 0
      }
    }
  ];

  describe('indexOf', function () {

    tests.forEach(function(test) {
      it('should return ' + test.index.expected + ' for ' + test.index.needle + ' in ' +
        test.haystackType, function () {
        expect(sut.indexOf(test.haystack, test.index.needle)).to.eql(test.index.expected);
      });
    });

  });

  describe('count', function () {

    tests.forEach(function(test) {
      it('should return ' + test.count.expected + ' for ' + test.count.needle + ' in ' +
        test.haystackType, function () {
        expect(sut.count(test.haystack, test.count.needle)).to.eql(test.count.expected);
      });
    });

  });

  describe('contains', function () {

    tests.forEach(function(test) {
      it('should return ' + (test.count.expected !== 0) + ' for ' + test.count.needle + ' in ' +
        test.haystackType, function () {
        expect(sut.contains(test.haystack, test.count.needle)).to.eql(test.count.expected !== 0);
      });
    });

  });

  describe('compact', function () {

    it('should compact an array', function () {
      var bloatedArr = [123, 0, null, undefined, false, true, -1];
      var compactArr = [123, true, -1];
      expect(sut.compact(bloatedArr)).to.eql(compactArr);

    });

  });

});
