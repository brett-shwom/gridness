Aggregate = (function () {

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
    count : count,
    sum : sum,
    groupBy: groupBy,
    average : average
  }

})()
