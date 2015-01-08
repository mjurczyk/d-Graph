!(function (global) {
  // Line component
  global.APP = global.APP || {};
  
  global.APP.noop = function () {};
  
  global.APP.init = function (filesInput) {
    d3.json(filesInput, function (error, response) {
      if( error ){
        return global.APP.showError(
          'Files list not found', 
          [
            'There should be a file containing a list of all input files.',
            'It is not there.<br/>',
            '[ Err: ' + error.responseText  + ' ]'
          ].join(' ')
        );
      }
      
      global.APP.fileSelectorCmp.setFileList(response || []);
      
      global.APP.pageUtil.swapPages(null, '.pt-page-graph', 'top');
    });
  };
  
  global.APP.showError = function (bigTitle, smallMessage) {
    global.APP.pageUtil.swapPages(null, '.pt-page-error', 'bottom', function (pages) {
      pages.nextPage.select('#error-title').html(bigTitle);
      pages.nextPage.select('#error-message').html(smallMessage);
    });
    
    throw Error(bigTitle);
  };
  
  window.onload = function () {
    global.APP.init(global.APP.configCmp().filesList);
    
    global.APP.graphCmp.init();
  };
  
})(this);