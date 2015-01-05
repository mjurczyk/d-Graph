!(function (global) {
  // Line component
  global.APP = global.APP || {};
  
  global.APP.initGraph = function (vpcFile) {
    var config = APP.configCmp({
          linksFilter: APP.linksFlt,
          nodesFilter: APP.nodesFlt,
          vpcTarget: vpcFile
        }),
        lineConfig = APP.lineCmp(config.link),
        svgFrame = APP.graphCmp.createFrame(config.graph);
    
    d3.json( config.data.url, function(error, response) {
      if( error ){
        return APP.showErrorScreen('Unknown JSON file', 'Application was unable to load the, so called, "' + config.data.url + '". You sure it exists, right?<br/> [ Err: ' + error. responseText  + ' ]');
      }
      
      var nodesCollection = APP.nodesColl.createFrom(response, config.graph, config.data.filterNodes),
          linksCollection = APP.linksColl.createFrom(nodesCollection, config.data.filterLinks);

      // Setup links
      APP.graphCmp.createLinks(svgFrame, linksCollection, lineConfig);

      // Setup nodes
      APP.graphCmp.createNodes(svgFrame, nodesCollection);

      // Setup additional effects
      APP.graphCmp.createHoverEffect();

      APP.showGraphScreen();
      
      svgFrame.transition().duration(5000)
              .attr('transform', String(svgFrame.attr('transform') || '') + 'rotate(90)scale(2)translate(-100,100)' );
    });
  };
  
  global.APP.showGraphScreen = function () {
    var splashEl = d3.select('.pt-page-splash'),
        viewEl = d3.select('.pt-page-graph');
    
    APP.classUtil.modify(splashEl, ['pt-page-moveToTopEasing', 'pt-page-ontop']);
    APP.classUtil.modify(viewEl, ['pt-page-moveFromBottom', 'pt-page-current']);
    
    // TODO: Do you even hack, bro?
    setTimeout(function () {
      APP.classUtil.remove(splashEl, ['pt-page-current'] );
    }, 1000);
  };
  
  global.APP.showErrorScreen = function (bigTitle, smallMessage) {
    var currentEls = d3.select('.pt-page-current'),
        errorEl = d3.select('.pt-page-error');
    
    errorEl.select('#error-title').html(bigTitle);
    errorEl.select('#error-message').html(smallMessage);
    
    APP.classUtil.modify(currentEls, ['pt-page-moveToBottomEasing', 'pt-page-ontop']);
    APP.classUtil.modify(errorEl, ['pt-page-moveFromTop', 'pt-page-current']);
  };
  
  window.onload = global.APP.initGraph('./data/json/vpc-0eccd76c.json');
  
})(this);