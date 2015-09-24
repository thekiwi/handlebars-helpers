'use strict';

var should = require('should');
var hbs = require('handlebars');
var utils = require('../lib/utils');
var helpers = require('..');
helpers.array({handlebars: hbs});
hbs.registerHelper('arrayify', utils.arrayify);

var context = {array: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']};

describe('after', function() {
  it('should return an empty string when undefined.', function() {
    hbs.compile('{{after}}')().should.equal('');
  });

  it('should return all of the items in an array after the given index.', function() {
    var fn = hbs.compile('{{after array 5}}');
    fn(context).should.eql(['f', 'g', 'h'].toString());
  });

  it('should return all of the items in an array after the specified count.', function() {
    var fn = hbs.compile('{{after array 5}}');
    fn(context).should.eql(['f', 'g', 'h'].toString());
  });
});

describe('any', function() {
  it('should conditionally render a block the array isn\'t empty.', function() {
    var fn = hbs.compile('{{#any array}}AAA{{else}}BBB{{/any}}');
    fn(context).should.equal('AAA');
  });

  it('should render the inverse when the array is empty', function() {
    var fn = hbs.compile('{{#any array}}AAA{{else}}BBB{{/any}}');
    fn({array: []}).should.equal('BBB');
  });
});

describe('before', function() {
  it('should return an empty string when undefined.', function() {
    hbs.compile('{{before}}')().should.equal('');
  });
  it('should return all of the items in an array before the given index.', function() {
    var fn = hbs.compile('{{before array 5}}');
    fn(context).should.eql(['a', 'b', 'c'].toString());
  });

  it('should return all of the items in an array before the specified count.', function() {
    var fn = hbs.compile('{{before array 5}}');
    fn(context).should.eql(['a', 'b', 'c'].toString());
  });
});

describe('each', function() {
  it('should use the key and value of each property in an object inside a block.', function() {
    var fn = hbs.compile('{{#each obj}}{{@key}}: {{this}} {{/each}}');
    fn({obj: {fry: 3, bender: 120 }}).should.equal('fry: 3 bender: 120 ');
  });
});

describe('eachIndex', function() {
  it('should render the block using the array and each item\'s index.', function() {
    var fn = hbs.compile('{{#eachIndex array}} {{item}} is {{index}} {{/eachIndex}}');
    fn(context).should.equal(' a is 0  b is 1  c is 2  d is 3  e is 4  f is 5  g is 6  h is 7 ');
  });
});

describe('eachIndexPlusOne', function() {
  it('should render the block using the array and each item\'s index + 1.', function() {
    var fn = hbs.compile('{{#eachIndexPlusOne array}} {{item}} is {{index}} {{/eachIndexPlusOne}}');
    fn(context).should.equal(' a is 1  b is 2  c is 3  d is 4  e is 5  f is 6  g is 7  h is 8 ');
  });
});

describe('empty', function() {
  it('should render the first block when an array is empty.', function() {
    var fn = hbs.compile('{{#empty array}}AAA{{else}}BBB{{/empty}}');
    fn({array: []}).should.equal('AAA');
  });

  it('should render the second block when an array is not empty.', function() {
    var fn = hbs.compile('{{#empty array}}AAA{{else}}BBB{{/empty}}');
    fn(context).should.equal('BBB');
  });
});

describe('first', function() {
  it('should return the first item in a collection.', function() {
    var fn = hbs.compile('{{first foo}}');
    fn({foo: ['a', 'b', 'c']}).should.equal('a');
  });

  it('should return an array with the first two items in a collection.', function() {
    var fn = hbs.compile('{{first foo 2}}');
    fn({foo: ['a', 'b', 'c']}).should.eql(['a', 'b'].toString());
  });

  it('should return an empty string when undefined.', function() {
    hbs.compile('{{first}}')().should.equal('');
  });

  it('should return the first item in an array.', function() {
    var fn = hbs.compile('{{first foo}}');
    fn({foo: ['a', 'b', 'c']}).should.equal('a');
  });

  it('should return an array with the first two items in an array.', function() {
    var fn = hbs.compile('{{first foo 2}}');
    fn({foo: ['a', 'b', 'c']}).should.eql(['a', 'b'].toString());
  });
});

describe('filter', function() {
  it('should conditionally render a block if a specified string is in the collection.', function() {
    var source = '{{#filter array "d"}}AAA{{else}}BBB{{/filter}}';
    hbs.compile(source)(context).should.equal('AAA');
  });

  it('should render a block for each object that has a "first" property with the value "d".', function() {

    var ctx = {
      collection: [
        {first: 'aaa', last: 'bbb'},
        {first: 'b'},
        {title: 'ccc', last: 'ddd'},
        {first: 'd'},
        {first: 'eee', last: 'fff'},
        {first: 'f'},
        {title: 'ggg', last: 'hhh'},
        {first: 'h'}
      ]
    };

    var source = '{{#filter collection "d" property="first"}}{{this.first}}{{else}}ZZZ{{/filter}}';
    var fn = hbs.compile(source);
    fn(ctx).should.equal('d');
  });
});

describe('forEach', function() {
  it('should iterate over an array, exposing objects as context.', function() {
    var arr = [{name: 'a'}, {name: 'b'}, {name: 'c'}];

    var fn = hbs.compile('{{#forEach arr}}{{name}}{{/forEach}}');
    fn({arr: arr}).should.equal('abc');
  });

  it('should expose `index`', function() {
    var arr = [{name: 'a'}, {name: 'b'}, {name: 'c'}];

    var fn = hbs.compile('{{#forEach arr}}{{index}}{{/forEach}}');
    fn({arr: arr}).should.equal('123');
  });

  it('should expose `total`', function() {
    var arr = [{name: 'a'}, {name: 'b'}, {name: 'c'}];

    var fn = hbs.compile('{{#forEach arr}}{{total}}{{/forEach}}');
    fn({arr: arr}).should.equal('333');
  });

  it('should expose `isFirst`', function() {
    var arr = [{name: 'a'}, {name: 'b'}, {name: 'c'}];

    var fn = hbs.compile('{{#forEach arr}}{{isFirst}}{{/forEach}}');
    fn({arr: arr}).should.equal('truefalsefalse');
  });

  it('should expose `isLast`', function() {
    var arr = [{name: 'a'}, {name: 'b'}, {name: 'c'}];

    var fn = hbs.compile('{{#forEach arr}}{{isLast}}{{/forEach}}');
    fn({arr: arr}).should.equal('falsefalsetrue');
  });
});

describe('inArray', function() {
  it('should render the first block when a value exists in the array.', function() {
    var fn = hbs.compile('{{#inArray array "d"}}AAA{{else}}BBB{{/inArray}}');
    fn(context).should.equal('AAA');
  });

  it('should render the second block when a value does not exist.', function() {
    var fn = hbs.compile('{{#inArray array "foo"}}AAA{{else}}BBB{{/inArray}}');
    fn(context).should.equal('BBB');
  });
});

describe('isArray', function() {
  it('should return true if the value is an array.', function() {
    hbs.compile('{{isArray "foo"}}')().should.eql('false');
    hbs.compile('{{isArray foo}}')({foo: ['foo']}).should.equal('true');
    hbs.compile('{{isArray (arrayify "foo")}}')().should.equal('true');
    hbs.compile('{{isArray (arrayify ["foo"])}}')().should.equal('true');
  });
});

describe('join', function() {
  it('should return an empty string when undefined.', function() {
    hbs.compile('{{join}}')().should.equal('');
  });

  it('should join items by the default separator.', function() {
    hbs.compile('{{join array}}')(context).should.equal('a, b, c, d, e, f, g, h');
  });

  it('should join by a custom separator.', function() {
    var fn = hbs.compile('{{join array " | "}}');
    fn(context).should.equal('a | b | c | d | e | f | g | h');
  });
});

describe('last', function() {
  it('should return an empty string when undefined.', function() {
    hbs.compile('{{last}}')().should.equal('');
  });

  it('should return the last item in an array.', function() {
    hbs.compile('{{last array}}')(context).should.equal('h');
  });

  it('should return an array with the last two items in an array.', function() {
    hbs.compile('{{last array 2}}')(context).should.eql(['g', 'h'].toString());
  });
});

describe('length', function() {
  it('should return the length of the array', function() {
    var fn = hbs.compile('{{length array}}');
    fn(context).should.equal('8');
  });

  it('should return an empty string when undefined.', function() {
    hbs.compile('{{length}}')().should.equal('');
  });

  it('should return the length of a string.', function() {
    var fn = hbs.compile('{{length "foo"}}');
    fn(context).should.equal('3');
  });

  it('should parse an array passed as a string', function() {
    var fn = hbs.compile('{{length \'["b", "c", "a"]\'}}');
    fn(context).should.equal('3');
  });

  it('should return 0 when the array is invalid:', function() {
    var fn = hbs.compile('{{length \'["b", "c", "a"\'}}');
    fn(context).should.equal('0');
  });
});

describe('lengthEqual', function() {
  it('should render the first block if length is the given number', function() {
    var fn = hbs.compile('{{#lengthEqual array 8}}AAA{{else}}BBB{{/lengthEqual}}');
    fn(context).should.equal('AAA');
  });

  it('should render the second block if length is not the given number', function() {
    var fn = hbs.compile('{{#lengthEqual array 3}}AAA{{else}}BBB{{/lengthEqual}}');
    fn(context).should.equal('BBB');
  });
});

describe('map', function() {
  it('should return an empty string when undefined.', function() {
    hbs.compile('{{map}}')().should.equal('');
  });

  it('should map the items in the array and return new values.', function() {
    var o = {};
    o.double = function(str) {
      return str + str;
    };
    var fn = hbs.compile('{{map \'["a","b","c"]\' double}}');
    fn(o).should.equal('aa,bb,cc');
  });

  it('should return an empty string when the array is invalid:', function() {
    var fn = hbs.compile('{{map \'["b", "c", "a"\'}}');
    fn(context).should.equal('');
  });
});

describe('sort', function() {
  it('should return an empty string when an invalid value is passed:', function() {
    var fn = hbs.compile('{{sort}}');
    var res = fn();
    res.should.equal('');
  });

  it('should sort the items in the array', function() {
    var fn = hbs.compile('{{sort array}}');
    var res = fn({array: ['c', 'a', 'b']});
    res.should.equal('a,b,c');
  });
  
  it('should return all items in an array sorted in lexicographical order.', function() {
    var fn = hbs.compile('{{sort array}}');
    fn(context).should.eql(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].toString());
  });

  it('should sort the items in the array in reverse order:', function() {
    var fn = hbs.compile('{{sort array reverse="true"}}');
    var res = fn({array: ['c', 'a', 'b']});
    res.should.equal('c,b,a');
  });
});

describe('sortBy', function() {
  it('should return an empty string when undefined.', function() {
    hbs.compile('{{sortBy}}')().should.equal('');
  });

  it('should sort the items in an array.', function() {
    var fn = hbs.compile('{{sortBy \'["b", "c", "a"]\'}}');
    fn(context).should.equal('a,b,c');
  });

  it('should return an empty string when the array is invalid:', function() {
    var fn = hbs.compile('{{sortBy \'["b", "c", "a"\'}}');
    fn(context).should.equal('');
  });

  it('should take a compare function.', function() {
    var o = {};
    o.compare = function (a, b) {
      return b.localeCompare(a);
    };
    var fn = hbs.compile('{{sortBy \'["b", "c", "a"]\' compare}}');
    fn(o).should.equal('c,b,a');
  });

  it('should sort based on object key:', function() {
    var ctx = {arr: [{a: 'zzz'}, {a: 'aaa'}]};
    hbs.registerHelper(helpers.data());
    var fn = hbs.compile('{{{stringify (sortBy arr "a") 0}}}');
    fn(ctx).should.equal('[{"a":"aaa"},{"a":"zzz"}]');
  });
});

describe('withAfter', function() {
  it('should use all of the items in an array after the specified count.', function() {
    var fn = hbs.compile('{{#withAfter array 5}}<{{this}}>{{/withAfter}}');
    fn(context).should.equal('<f><g><h>');
  });
});

describe('withBefore', function() {
  it('should use all of the items in an array before the specified count.', function() {
    var fn = hbs.compile('{{#withBefore array 5}}<{{this}}>{{/withBefore}}');
    fn(context).should.equal('<a><b><c>');
  });
});

describe('{{withFirst}}', function() {
  it('should use the first item in an array.', function() {
    var fn = hbs.compile('{{#withFirst array}}<p>{{this}} is smart.</p>{{/withFirst}}');
    fn(context).should.equal('<p>a is smart.</p>');
  });
  it('should return an empty string when no array is passed:', function() {
    hbs.compile('{{#withFirst}}{{/withFirst}}')().should.equal('');
  });
  it('should use the first two items in an array.', function() {
    var fn = hbs.compile('{{#withFirst array 2}}<p>{{this}} is smart.</p>{{/withFirst}}');
    fn(context).should.equal('<p>a is smart.</p><p>b is smart.</p>');
  });
});

describe('withLast', function() {
  it('should use the last item in an array.', function() {
    var fn = hbs.compile('{{#withLast array}}<p>{{this}} is dumb.</p>{{/withLast}}');
    fn(context).should.equal('<p>h is dumb.</p>');
  });
  it('should use the last two items in an array.', function() {
    var fn = hbs.compile('{{#withLast array 2}}<p>{{this}} is dumb.</p>{{/withLast}}');
    fn(context).should.equal('<p>g is dumb.</p><p>h is dumb.</p>');
  });
});

describe('withSort', function() {
  it('should sort the array in lexicographical order', function() {
    var fn = hbs.compile('{{#withSort array}}<p>{{this}}</p>{{/withSort}}');
    fn(context).should.equal('<p>a</p><p>b</p><p>c</p><p>d</p><p>e</p><p>f</p><p>g</p><p>h</p>');
  });
  it('should sort the array in reverse order', function() {
    var fn = hbs.compile('{{#withSort array reverse="true"}}<p>{{this}}</p>{{/withSort}}');
    fn(context).should.equal('<p>h</p><p>g</p><p>f</p><p>e</p><p>d</p><p>c</p><p>b</p><p>a</p>');
  });

  it('should sort the array by deliveries', function() {
    var fn = hbs.compile('{{#withSort collection "deliveries"}}{{name}}: {{deliveries}} <br>{{/withSort}}');
    var res = fn({
      collection: [{name: 'f', deliveries: 8021 }, {name: 'b', deliveries: 239 }, {name: 'd', deliveries: -12 }]
    });
    res.should.equal('d: -12 <br>b: 239 <br>f: 8021 <br>');
  });

  it('should sort the array by deliveries in reverse order', function() {
    var fn = hbs.compile('{{#withSort collection "deliveries" reverse="true"}}{{name}}: {{deliveries}} <br>{{/withSort}}');
    var res = fn({
      collection: [{name: 'f', deliveries: 8021 }, {name: 'b', deliveries: 239 }, {name: 'd', deliveries: -12 }]
    });
    res.should.equal('f: 8021 <br>b: 239 <br>d: -12 <br>');
  });
});

