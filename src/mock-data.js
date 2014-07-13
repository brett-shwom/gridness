MockData = (function () {

  function uniform() { 
    var randomIndex = Math.floor(Math.random() * (arguments.length))
    return arguments[randomIndex]
  }

  function generateRows() {
    var rows = []
      , i
    for (i=0; i< 100000; i++) {
      rows.push({
        index : i,
        name : 'brett',
        address : '123 Main',
        city : 'boston',
        state : 'mass',
        telephone : uniform('111-111-1111', '222-222-2222', '333-333-3333')
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
      'state',
      'telephone'
    ]
  }

  return {
    generateColumns : generateColumns,
    generateRows : generateRows
  }


})()