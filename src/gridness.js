(function ( global, factory ) {
  'use strict'

  // Common JS (i.e. browserify) environment
  if ( typeof module !== 'undefined' && module.exports && typeof require === 'function' ) {
    factory( require( 'Ractive' ) )
  }

  // AMD?
  else if ( typeof define === 'function' && define.amd ) {
    define([ 'Ractive' ], factory )
  }

  // browser global
  else if ( global.Ractive ) {
    global.Gridness = factory( global.Ractive )
  }

  else {
    throw new Error( 'Could not find Ractive! It must be loaded before gridness' );
  }

}( typeof window !== 'undefined' ? window : this, function ( Ractive ) {
  'use strict'

  return function (options) {

    options = options || {}
    options.templates = options.templates || {}

    if (!options.el) {
      throw 'must provide an el'
    }

    if (!options.rows) {
      throw 'must provide rows'
    }

    if (!options.columns) {
      throw 'must provide columns'
    }

    var start = 0
      , virtualWindowSize = options.virtualWindowSize || 10
      , projectedRows
      , rows = options.rows
      , columns = options.columns
      , virtualColumns = columns //mutate me later once we start virtualizing columns
      , ractive
      , Templates
      , aggregationBeforeFlattening


    Templates = (function () {
      return {
        table    : options.templates.table || getSync('templates/table.html'),
        tableRow : options.templates.tableRow || getSync('templates/tableRow.html'),
        tableCell : options.templates.tableCell  || getSync('templates/tableCell.html')
      }
    })()


    ractive = new Ractive({
      el  : options.el,
      debug : true,
      twoway :false, //im not sure why this is set to false -- get rid of it probably (test on IE 8 first though)
      data : {
        virtualRows : [],//the call to sliceData() will initialize this
        //memoize : memoize,
        frozenRows : [],
        invisibleGroups : {},
        virtualColumns : virtualColumns,
        frozenColumns : []
      },
      // components : {
      //   tableCell : Components.tableCell,
      //   tableRow : Components.tableRow
      // }, //components seem to be making scrolling really slow
      partials : {
        tableCell : Templates.tableCell,
        tableRow : Templates.tableRow
      },
      template : Templates.table
    })

    function freezeRows(topNRows) {
      ractive.set('frozenRows', ractive.get('virtualRows').slice(0,topNRows))
    }

    function freezeColumns(firstNColumns) {
      ractive.set('frozenColumns', ractive.get('virtualColumns').slice(0,firstNColumns))
    }

    function reflatten() {

      projectedRows = aggregationBeforeFlattening
        .flatten(ractive.get('invisibleGroups'))

      sliceData(start, start+virtualWindowSize - ractive.get('frozenRows').length)
    }

    //http://stackoverflow.com/a/11252120
    function getElementScrollScale(domElement){
      return domElement.scrollTop / (domElement.scrollHeight - domElement.clientHeight);
    }

    function sliceData(start,end) {
      ractive.merge('virtualRows', projectedRows.slice(start,end))
    }  

    ractive.on({
      scrolling : function () {
        var scrollScale = getElementScrollScale(virtualScrollPane)
          , start = scrollScale * (rows.length - numberOfRowsToShow) //do i need to round this?
          , end = start + numberOfRowsToShow
          
        sliceData(start,end)
      },
      wheel : function (e) {

        var deltaY
          , deltaX

        if ('deltaY' in e.original) {
          deltaY = e.original.deltaY
          deltaX = e.original.deltaX
        }
        else if ('wheelDeltaY' in e.original ) {
          deltaY = -1 * e.original.wheelDeltaY
          deltaX = -1 * e.original.wheelDeltaX 
        }
        else { /* IE 8 */
          deltaY = -1 * Math.floor(e.original.wheelDelta/120) 
          deltaX = 0        
        }

        e.original.preventDefault()

        // if (deltaY > 0) deltaY = 1    //need to tweak this 
        // if (deltaY < 0) deltaY = -1
        // if (deltaY === 0) return

        if (start + deltaY < 0) {
          start = 0
        }
        else if (start + virtualWindowSize + deltaY - ractive.get('frozenRows').length > projectedRows.length) {
          start = projectedRows.length - virtualWindowSize - ractive.get('frozenRows').length
        }
        else {
          start += deltaY
        }

        sliceData(start, start+virtualWindowSize - ractive.get('frozenRows').length)
      },
      toggleGroupingVisibility : function (event) {
        var group = event.context

        ractive.toggle('invisibleGroups.' + group.key) //a bit of ractive keypath fun
      }
    })
    
    
    aggregationBeforeFlattening = options.getAggregationBeforeFlattening()

    var startTime = new Date

    reflatten()

    console.log('time taken to flatten ' + (projectedRows.length).toLocaleString() + ' rows', (startTime.getTime() - (new Date).getTime())/1000)

    //console.log(projectedRows)

    ractive.observe('invisibleGroups', function () {
      reflatten()
    }, { init :false } ) //init : false --> prevents reflatten() from being called on initial load

    ractive.observe('frozenRows', function () {
      console.log('frozen rows changed ')
      reflatten()
    }, { init:false } ) //init : false --> prevents reflatten() from being called on initial load

    sliceData(start, virtualWindowSize)

    return {
      freezeRows : freezeRows,
      freezeColumns : freezeColumns,
      ractive : ractive
    }

  }
}))

