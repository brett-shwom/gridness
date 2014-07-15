expect = require("chai").expect
aggregateFunctions = require '../src/aggregate'

describe 'groupBy()', ->
  it 'should return an array with', ->
    it 'a "data" property', ->
    
      returnedObject = aggregateFunctions.groupBy [{a:1}]
      expect(returnedObject).to.have.property 'data'