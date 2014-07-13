MockData = (function () {

  function uniform() { 
    var randomIndex = Math.floor(Math.random() * (arguments.length))
    return arguments[randomIndex]
  }

  function generateRows() {
    var rows = []
      , i
    for (i=0; i< 5000; i++) {
      rows.push({
        index : i,
        name : 'brett',
        address : '123 Main',
        city : uniform('boston','nyc', 'philly'),
        telephone : uniform('111-111-1111', '222-222-2222', '333-333-3333'),
        age : Math.round(Math.random() * 50 + 5),
        eyeColor : uniform('blue', 'green', 'hazel', 'brown'),
        score : Math.round(Math.random() * 100),
        awesome : uniform('yes', 'no', 'somewhat')

      })
    }

    return rows
  }

  function generateColumns() {
    return [
      'index',
      'name',
      'address',
      'city',
      'telephone',
      'age',
      'eyeColor',
      'score',
      'awesome'
    ]
  }

  return {
    generateColumns : generateColumns,
    generateRows : generateRows
  }


})()