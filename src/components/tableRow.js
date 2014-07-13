if (!window.Components) Components = {} //replace with require etc.

Components.tableRow = Ractive.extend({
  template: getSync('templates/tableRow.html')
})