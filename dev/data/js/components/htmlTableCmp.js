!(function (global) {
  // HTML Table component
  global.APP = global.APP || {};
  
  if( typeof global.APP.htmlTableCmp !== 'undefined' ) return;
  
  global.APP.htmlTableCmp = {};
  
  global.APP.htmlTableCmp.init = function (container) {
    var htmlTablePage = d3.select('.pt-page-html-table'),
        tableEl = htmlTablePage.select('table'),
        floatingColumn = htmlTablePage.selectAll('tr > td:first-of-type'),
        scrollThreshold = 300;
    
    container.on('scroll', function () {
      var scrollValue = {
            x: this.scrollLeft,
            y: this.scrollTop
          },
          cumulativeHeight = 0;
      
      if(scrollValue.x >= scrollThreshold){
        if(!tableEl.classed('floating-column')){
          global.APP.classUtil.add(tableEl, 'floating-column');
        }
      } else {
        if(tableEl.classed('floating-column')){
          global.APP.classUtil.remove(tableEl, 'floating-column');
        }
      }
      
      // floatingColumn
      floatingColumn.each(function () {
        this.style.top = (cumulativeHeight - scrollValue.y) + 'px';
        
        cumulativeHeight += this.offsetHeight;
      });
    });
  };
  
  global.APP.htmlTableCmp.showTable = function (targetNode) {
    var htmlTableCmp = this,
        vpcFile = global.APP.fileSelectorCmp.getCurrentFileName(),
        instanceName = targetNode.key,
        container = d3.select('.pt-page-html-table .table-container');
    
    global.APP.pageUtil.swapPages(null, '.pt-page-html-table', 'top');

    d3.text([
      './data/html/',
      vpcFile.substr(0, vpcFile.indexOf('.json')),
      '-security-groups.html'
    ].join(''), function (content) {
      d3.select('.pt-page-html-table .table-container').html(content);
      
      htmlTableCmp.init(container);
      htmlTableCmp.createNavigation();
      htmlTableCmp.selectNodeInTable(container, instanceName);
    });
  };
  
  global.APP.htmlTableCmp.selectNodeInTable = function (container, instanceName) {
    var selectedColumn = -1;
    
    d3.selectAll('.pt-page-html-table').selectAll('tr').each(function (el, index) {
      var tableRow = d3.select(this),
          intersectingCell = tableRow.select(['td:nth-child(', selectedColumn + 1, ')'].join(''));
      
      if(index === 0){
        tableRow.selectAll('td').each(function (cell, cellIndex) {
          var tableCell = d3.select(this),
              desiredNode = tableCell.text() === instanceName;

          if(desiredNode){
            global.APP.classUtil.add(tableCell, 'selected');
            
            container.node().scrollLeft = tableCell.node().offsetLeft - window.innerWidth/2 + tableCell.node().offsetWidth/2;
            
            selectedColumn = cellIndex;
          } else {
            global.APP.classUtil.remove(tableCell, 'selected');
          }
        });
      } else if(index > 0) {
        global.APP.classUtil.add(intersectingCell, 'selected');
        
        if(intersectingCell.text().trim()){
          global.APP.classUtil.add(tableRow, 'selected');
        }
      }
    });
  };
  
  global.APP.htmlTableCmp.createNavigation = function () {
    if(!d3.select('.pt-page-html-table .nav-tab > *').empty()){
      return;
    }
    
    global.APP.navCmp.create(
      '.pt-page-html-table',
      [
        {
          label: 'Sidetab',
          iconCls: 'nav-sidetab',
          halfVisible: false,
          callback: function () {}
        },
        {
          label: 'Return to the graph',
          iconCls: 'nav-return',
          halfVisible: true,
          callback: function () {
            global.APP.pageUtil.swapPages(null, '.pt-page-graph', 'bottom');
          }
        },
        {
          label: 'Print the page',
          iconCls: 'nav-print',
          halfVisible: true,
          callback: function () {
            window.print();
          }
        }
      ]
    );
  };
})(this);