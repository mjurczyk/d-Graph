!(function (global) {
  // Controls component
  global.APP = global.APP || {};
  
  if( typeof global.APP.controlsCmp !== 'undefined' ) return;
  
  global.APP.controlsCmp = {};
  
  global.APP.controlsCmp.init = function (graphEl) {
    var graphDraggingMask;
    
    if( !graphEl || typeof graphEl.attr !== 'function' ){
      return global.APP.showError(
        'Unable to setup graph controls',
        'Graph element passed from point A to point B was not really a graph. That is not good.'
      );
    }
    
    graphDraggingMask = d3.select(graphEl.node().parentNode);
    
    d3.behavior.zoom()
      .on('zoom', function () {
        graphEl.attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')');
      })(graphDraggingMask);
  };
  
})(this);