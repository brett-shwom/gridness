Aggregate = (function () {

  var comparators = {
    numeric : function (property) {
      return function (a, b) {
        if (a[property] < b[property])
           return -1
        if (a[property] > b[property])
           return 1
        return 0
      }
    }
  }

  function orderBy(data, property, dataType) {
    //at this point, this will only work on ungrouped data (grouped data has a different structure : [{key:key, data:{property1:val1,property2:val2}]...] vs [{property1:val1,property2:val2}...])
    
    var comparator


    switch (dataType) {
      case 'string'  :
      case 'numeric' : 
      default        :

        comparator = comparators.numeric(property)
        break
    }

    data = data.slice() //clone array (assumption is that data is in an array)

    data.sort(comparator)
    
    return data
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
    
    return Object.keys(groupings).map(function(key) { //optimize me
      return groupings[key]
    })
  } 

  function sum(groupedByData, field) { 
    /*
      assume the following data structure:
      
      [{key: key, data : [datapoint1,datapoint2]}]
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

    var theSum = groupedByData.data.reduce(function (previous, datapoint) {
      return previous + datapoint[field]
    },0)

    
    return theSum / groupedByData.data.length
    
  }

  function count(groupedByData) { 
    /*
      assume the following data structure:
      
      [{key: key, data : [datapoint1,datapoint2]}]
    */
    
    return groupedByData.data.length
    
  }


  return {
    orderBy : orderBy,
    count : count,
    sum : sum,
    groupBy: groupBy,
    average : average
  }

})()
