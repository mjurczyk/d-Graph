!(function (global) {
  global.APP = global.APP || {};
  
  global.APP.pageUtil = global.APP.pageUtil || {};
  
  global.APP.pageUtil.swapPages = function (hidePagesSelector, showPagesSelector, motionDirection, middlewareFunction, callbackFunction) {  
    var hidePagesSelector = String(hidePagesSelector || '.pt-page-current'),
        pages = {
          currentPage: d3.selectAll(hidePagesSelector),
          nextPage: d3.selectAll(showPagesSelector)
        },
        direction = String(motionDirection || 'bottom'),
        counterDirection = {
          'Bottom': 'Top',
          'Right': 'Left',
          'Top': 'Bottom',
          'Left': 'Right'
        },
        animationCls = {},
        middlewareFunction = (typeof middlewareFunction === 'function' ? middlewareFunction : global.APP.noop),
        callbackFunction = (typeof callbackFunction === 'function' ? callbackFunction : global.APP.noop);
    
    middlewareFunction(pages);
    
    direction = direction[0].toUpperCase() + direction.substr(1);
    
    animationCls = {
      currentPage: 'pt-page-moveTo' + direction + 'Easing',
      nextPage: 'pt-page-moveFrom' + counterDirection[direction]
    };
    
    global.APP.classUtil.add(pages.currentPage, [animationCls.currentPage, 'pt-page-ontop']);
    global.APP.classUtil.add(pages.nextPage, [animationCls.nextPage, 'pt-page-current']);
    
    // TODO: Do you even hack, bro?
    setTimeout(function () {
      global.APP.classUtil.remove(pages.currentPage, ['pt-page-current', 'pt-page-ontop', animationCls.currentPage] );
      global.APP.classUtil.remove(pages.nextPage, [animationCls.nextPage] );
      
      callbackFunction(pages);
    }, 600);
  };
  
})(this);