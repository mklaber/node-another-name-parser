"use strict";

var sut = require('../lib/parser'),
  expect = require('chai').expect;

describe('parser', function () {

  var tests = [
    {
      "test": "last, first",
      "result": {
        "prefix": null,
        "first": "John",
        "middle": null,
        "last": "Doe",
        "suffix": null,
        "original": "Doe, John"
      }
    }, {
      "test": "last, first middle with excessive whitespace",
      "result": {
        "prefix": null,
        "first": "John",
        "middle": "P",
        "last": "Doe",
        "suffix": null,
        "original": "Doe, \nJohn    P\t\t  \r"
      }
    }, {
      "test": "last, first middle",
      "result": {
        "prefix": null,
        "first": "John",
        "middle": "P",
        "last": "Doe",
        "suffix": null,
        "original": "Doe, John P"
      }
    }, {
      "test": "last, title first initial",
      "result": {
        "prefix": "Dr.",
        "first": "John",
        "middle": "P",
        "last": "Doe",
        "suffix": null,
        "original": "Doe, Dr. John P"
      }
    }, {
      "test": "hyphenated last name",
      "result": {
        "prefix": null,
        "first": "John",
        "middle": "R",
        "last": "Doe-Smith",
        "suffix": null,
        "original": "John R Doe-Smith"
      }
    }, {
      "test": "first last",
      "result": {
        "prefix": null,
        "first": "John",
        "middle": null,
        "last": "Doe",
        "suffix": null,
        "original": "John Doe"
      }
    }, {
      "test": "title, suffix, and compound last name",
      "result": {
        "prefix": "Mr.",
        "first": "Anthony",
        "middle": "R",
        "last": "Von Fange",
        "suffix": "III",
        "original": "Mr. Anthony R Von Fange III"
      }
    }, {
      "test": "first middle last",
      "result": {
        "prefix": null,
        "first": "Sara",
        "middle": "Ann",
        "last": "Fraser",
        "suffix": null,
        "original": "Sara Ann Fraser"
      }
    }, {
      "test": "compound first and last",
      "result": {
        "prefix": null,
        "first": "Mary Ann",
        "middle": null,
        "last": "Fraser",
        "suffix": null,
        "original": "Mary Ann Fraser"
      }
    }, {
      "test": "last, compound first",
      "result": {
        "prefix": null,
        "first": "Mary Ann",
        "middle": null,
        "last": "Fraser",
        "suffix": null,
        "original": "Fraser, Mary Ann"
      }
    }, {
      "test": "compound first and compound last and middle",
      "result": {
        "prefix": null,
        "first": "Jo Ellen",
        "middle": "Mary",
        "last": "St. Louis",
        "suffix": null,
        "original": "Jo Ellen Mary St. Louis"
      }
    }, {
      "test": "single name is just first",
      "result": {
        "prefix": null,
        "first": "Adam",
        "middle": null,
        "last": null,
        "suffix": null,
        "original": "Adam"
      }
    }, {
      "test": "ignore quoted names",
      "result": {
        "prefix": null,
        "first": "Donald",
        "middle": "Rex",
        "last": "St. Louis",
        "suffix": null,
        "original": "Donald \"Don\" Rex St. Louis"
      }
    }, {
      "test": "ignore parenthesized names",
      "result": {
        "prefix": null,
        "first": "Donald",
        "middle": "Rex",
        "last": "St. Louis",
        "suffix": null,
        "original": "Donald (Don) Rex St. Louis"
      }
    }, {
      "test": "split compound first name if it's the only name given",
      "result": {
        "prefix": null,
        "first": "Mary",
        "middle": null,
        "last": "Ann",
        "suffix": null,
        "original": "Mary Ann"
      }
    }, {
      "test": "first and last",
      "result": {
        "prefix": null,
        "first": "Jonathan",
        "middle": null,
        "last": "Smith",
        "suffix": null,
        "original": "Jonathan Smith"
      }
    }, {
      "test": "first, compound last, and suffix",
      "result": {
        "prefix": null,
        "first": "Anthony",
        "middle": null,
        "last": "Von Fange",
        "suffix": "III",
        "original": "Anthony Von Fange III"
      }
    }, {
      "test": "title first and last",
      "result": {
        "prefix": "Mr",
        "first": "John",
        "middle": null,
        "last": "Doe",
        "suffix": null,
        "original": "Mr John Doe"
      }
    }, {
      "test": "multiple titles",
      "result": {
        "prefix": "Mr. Dr.",
        "first": "Jane",
        "middle": null,
        "last": "Smith",
        "suffix": null,
        "original": "Mr. Dr. Jane Smith"
      }
    }, {
      "test": "title and multiple suffix",
      "result": {
        "prefix": "Mr",
        "first": "John",
        "middle": null,
        "last": "Doe",
        "suffix": "PhD Esq",
        "original": "Mr John Doe PhD Esq"
      }
    }, {
      "test": "title first and last keeps punctuation",
      "result": {
        "prefix": "Mrs.",
        "first": "Jane",
        "middle": null,
        "last": "Doe",
        "suffix": null,
        "original": "Mrs. Jane Doe"
      }
    }, {
      "test": "first last and suffix",
      "result": {
        "prefix": null,
        "first": "Smarty",
        "middle": null,
        "last": "Pants",
        "suffix": "PhD",
        "original": "Smarty Pants PhD"
      }
    }, {
      "test": "first last, suffix",
      "result": {
        "prefix": null,
        "first": "Smarty",
        "middle": null,
        "last": "Pants",
        "suffix": "Ph.D.",
        "original": "Smarty Pants, Ph.D."
      }
    }, {
      "test": "first middle initial last",
      "result": {
        "prefix": null,
        "first": "Mark",
        "middle": "P",
        "last": "Williams",
        "suffix": null,
        "original": "Mark P Williams"
      }
    }, {
      "test": "first compound last name",
      "result": {
        "prefix": null,
        "first": "Aaron",
        "middle": null,
        "last": "bin Omar",
        "suffix": null,
        "original": "Aaron bin Omar"
      }
    }
  ];

  tests.forEach(function (test) {

    it('should parse ' + test.test + ' correctly', function () {
      var result = sut(test.result.original);
      expect(result).to.have.property('prefix', test.result.prefix);
      expect(result).to.have.property('first', test.result.first);
      expect(result).to.have.property('middle', test.result.middle);
      expect(result).to.have.property('last', test.result.last);
      expect(result).to.have.property('suffix', test.result.suffix);
      expect(result).to.have.property('original', test.result.original);
    });
  });

});
