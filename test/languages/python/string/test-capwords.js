XMLHttpRequest = {}
window = {window: {},document: {lastModified: 1388954399,getElementsByTagName: function(){return [];}},location: {href: ""}}
process.env.TZ = 'UTC'
window.window = window
var expect = require('chai').expect
var capwords = require('/Users/kvz/code/phpjs/src/python/string/capwords.js')

describe('python.string.capwords.js', function () {
  it('should pass example 1', function (done) {
    capwords('kevin van  zonneveld');
    var expected = 'Kevin Van  Zonneveld'
    var result = capwords('kevin van  zonneveld');
    expect(result).to.deep.equal(expected)
    done()
  })
  it('should pass example 2', function (done) {
    capwords('HELLO WORLD');
    var expected = 'HELLO WORLD'
    var result = capwords('HELLO WORLD');
    expect(result).to.deep.equal(expected)
    done()
  })
})