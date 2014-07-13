Aggregate = (function () {

  var comparators = {
    numeric : function (property, a, b) {
      if (a[property] < b[property])
         return -1
      if (a[property] > b[property])
         return 1
      return 0
    }
  }

  // function enrichWithVirtualColumns(rows) {

  //   var virtualColumns = {}

  //   var newProto = Object.create({
  //       virtualColumns : virtualColumns,
  //       __proto__ : oldProto
  //   })

  //   rows = rows.map(function(row) {
  //     row.__proto__ = newProto
  //   })

  //   return rows
  // }

  function orderBy(data /* , rest parameters */) {

    //at this point, this will only work on ungrouped data (grouped data has a different structure : [{key:key, data:{property1:val1,property2:val2}]...] vs [{property1:val1,property2:val2}...])
    
    var properties = Array.prototype.slice.call(arguments, 1) //pass properties as rest arguments
      , comparator
      , comparatorComposed

    if (properties.length > 0) { //if no order by properties are passed, just return the original data

      // switch (dataType) {
      //   case 'string'  :
      //   case 'numeric' : 
      //   default        :

      comparatorComposed = firstBy(function (c,d) {
        return comparators.numeric(properties[0],c,d)
      })

      comparatorComposed = properties.slice(1).reduce(function(previous, current) {
        return previous.thenBy(function (c,d) {
          return comparators.numeric(current,c,d)
        })
      },comparatorComposed)

          //comparator = comparators.numeric(property)
      //    break
      //}

      data = data.slice() //clone array (assumption is that data is in an array)
      
      data.sort(comparatorComposed)
    }


    return Object.create(data, {
      groupBy : {
        value : function(property) {
          return groupBy(this, property)
        }
      }
    })
  } 

  function groupBy(data, property) {
    var groupings = {}
    
    data.forEach(function (dataPoint) {
      if (!(dataPoint[property] in groupings)) {
        groupings[dataPoint[property]] = {key : dataPoint[property], data : [dataPoint]}
      }
      else {
       groupings[dataPoint[property]].data.push(dataPoint) 
      }

    })

    
    var groupingsAsArray = Object.keys(groupings).map(function(key) {
      return groupings[key]
    })

    groupingsAsArray.sum = function (field) {

      groupingsAsArray.forEach(function (grouping) {
        grouping.sum = grouping.sum || {}
        grouping.sum[field] = sum(grouping, field)
      })
      return this
    }

    groupingsAsArray.average = function (field) {
      groupingsAsArray.forEach(function (grouping) {
        grouping.average = grouping.average || {}
        grouping.average[field] = average(grouping, field)
      })
      return this
    }

    groupingsAsArray.count = function (field) {
      groupingsAsArray.forEach(function (grouping) {
        grouping.count = grouping.data.length
      })
      return this
    }

    groupingsAsArray.header = function (field) {
      groupingsAsArray.forEach(function (grouping) {
        grouping.header = true
      })
      return this
    }

    groupingsAsArray.footer = function (field) {
      groupingsAsArray.forEach(function (grouping) {
        grouping.footer = true
      })
      return this
    }

    groupingsAsArray.flatten = function (hiddenGroups) {
      var flattenedArray = []
        , hiddenGroups = hiddenGroups || {}

      groupingsAsArray.forEach(function (grouping) {


        if (grouping.header) {
          flattenedArray.push(Object.create(grouping, {
            __type__ : {
                  value: 'header',
                  writable: true,
                  enumerable: true,
                  configurable: true //ractive magic mode gets angry if this is false 
            }
          }))
        }

        if(hiddenGroups[grouping.key]) return //header will still be included

        flattenedArray = flattenedArray.concat(grouping.data) //TODO this needs to be recursive

        if (grouping.footer) {
          flattenedArray.push(Object.create(grouping, {
            __type__ : {
                  value: 'footer',
                  writable: true,
                  enumerable: true,
                  configurable: true 
            }
          }))
        }


      })
      return flattenedArray
    }

    return groupingsAsArray
  } 

  function sum(groupedByData, field) { 
    /*
      assume the following data structure:
      
      [{key: key, data : [datapoint1,datapoint2]}]

      enriches the groupedByData object with a property : 'sum'

    */

    var theSum = groupedByData.data.reduce(function (previous, datapoint) {
      return previous + datapoint[field]
    },0)

    
    return theSum
    
  }

  function average(groupedByData, field) { 
    /*
      assume the following data structure:
      
      [{key: key, data : [datapoint1,datapoint2]}]
    */

    var theAverage = groupedByData.data.reduce(function (previous, datapoint) {
      return previous + datapoint[field]
    },0) / groupedByData.data.length

    
    return theAverage
    
  }





  return {
    orderBy : orderBy,
    sum : sum,
    groupBy: groupBy,
    average : average//,
    //enrichWithVirtualColumns : enrichWithVirtualColumns
  }

})()
