if (!window.Components) Components = {} //replace with require etc.

Components.tableCell = Ractive.extend({
  template: getSync('templates/tableCell.html')
})