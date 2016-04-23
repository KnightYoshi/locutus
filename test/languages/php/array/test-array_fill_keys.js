XMLHttpRequest = {}
window = {window: {},document: {lastModified: 1388954399,getElementsByTagName: function(){return [];}},location: {href: ""}}
process.env.TZ = 'UTC'
window.window = window
var expect = require('chai').expect
var ini_set = require('/Users/kvz/code/phpjs/src/php/info/ini_set')
var ini_get = require('/Users/kvz/code/phpjs/src/php/info/ini_get')
var array_fill_keys = require('/Users/kvz/code/phpjs/src/php/array/array_fill_keys.js')

describe('php.array.array_fill_keys.js', function () {
  it('should pass example 1', function (done) {
    keys = {'a': 'foo', 2: 5, 3: 10, 4: 'bar'}
    array_fill_keys(keys, 'banana')
    var expected = {"foo": "banana", 5: "banana", 10: "banana", "bar": "banana"}
keys = {'a': 'foo', 2: 5, 3: 10, 4: 'bar'}
    var result = array_fill_keys(keys, 'banana')
    expect(result).to.deep.equal(expected)
    done()
  })
})