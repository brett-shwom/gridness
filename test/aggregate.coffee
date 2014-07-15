expect = require("chai").expect
Aggregate = require '../src/aggregate'

describe 'groupBy()', ->
  describe 'when passed an object and a field on which to groupBy', ->
    
    returnedObject = null #trick to make variable available to 'beforeEach' and the 'it's
    
    beforeEach ->
      returnedObject = Aggregate.groupBy [{a:1}], 'a'

    it 'should return an array', ->
      
      expect(returnedObject).to.be.instanceof Array 
      
      describe 'whose elements contain', ->
      
        it 'a "data" property', ->
          expect(returnedObject[0]).to.have.property 'data'
      
        it 'a "key" property', ->
          expect(returnedObject[0]).to.have.property 'key'

  describe 'when passed objects', ->
      manyObjects = null

      beforeEach ->
        manyObjects = [
          name : 'brett'
          city : 'nyc'
          eyeColor :'blue'
          score : 0
        ,
          name : 'jill'
          city : 'nyc'
          eyeColor :'blue'
          score : 10
        ,
          name : 'jak'
          city : 'nyc'
          eyeColor :'green'
          score : 20
        ,
          name : 'lea'
          city : 'philly'
          eyeColor :'green'
          score : 30
        ]

      describe 'with an average score of 10 in nyc', ->
        it 'should return an average score of 10', ->
          averages = Aggregate.groupBy(manyObjects, 'city').average('score')
          nycGrouping = (averages.filter (averageObject) -> averageObject.key == 'nyc')[0]
          expect(nycGrouping.average.score).to.equal(10)
