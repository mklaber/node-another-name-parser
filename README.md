# another-name-parser

Here's yet another name parsing node.js library. It'll take a [personal name](https://en.wikipedia.org/wiki/Personal_name) 
and returns a `prefix` (title), `first` (or *given name*), `middle` (or initial), `last` (or *family name*), 
and `suffix`. It's designed for US English but could be useful elsewhere. It's inspired by a SQL script a 
colleague pulled together long ago combined with inspiration from a few other libraries.


[![NPM](https://nodei.co/npm/another-name-parser.png)](https://nodei.co/npm/another-name-parser/)


## Installation

Via [npm](https://www.npmjs.com/package/another-name-parser)

```bash
$ npm install another-name-parser
```

## Usage

```javascript

var parser = require('another-name-parser');

var name = parser('Commissioner James "Jim" W. Gordon, Sr.');
// → { prefix: 'Commissioner',
//     first: 'James',
//     middle: 'W.',
//     last: 'Gordon',
//     suffix: 'Sr.',
//     original: 'Commissioner James "Jim" W. Gordon, Sr.' }

```

## Features

* Handles many common prefixes/titles
* Retains `.` that appear in the original name (*Dr.* &rarr; *Dr.*, *PhD* &rarr; *PhD*)
* Recognizes common compound first names (*Mary Jo*, *Juan Carlos*, etc.)
* Recognizes common compound last name prefixes (*St.*, *Mac*, *Bin*, etc.)
* Recognizes *Last Name, First Name* order
* Ignores quoted or parenthesized nicknames (*Catherine "Cathy" Smith* &rarr; *Catherine Smith*, *James (Jim) Von Trapp* &rarr; *James Von Trapp*)


## Tests

Dependencies: [grunt-cli](https://www.npmjs.com/package/grunt-cli)

```bash
npm install -g grunt-cli
npm test
```


## TODO

* Handle multiple names, e.g, *Jim & Mark Anderson*
* Handle likely company names (maybe)

## Acknowledgements

* My former colleague and whomever he got his original script from
* Some of the test cases and compound lastname prefixes came from the [humanname](https://www.npmjs.com/package/humanname) module


## License

[MIT License](http://www.opensource.org/licenses/mit-license.php)

## Author

[Matt Klaber](https://github.com/mklaber)
