!(function (global) {
  // Navigation component
  global.APP = global.APP || {};
  
  if( typeof global.APP.navCmp !== 'undefined' ) return;
  
  global.APP.navCmp = {};
  
  global.APP.navCmp.create = function (pageSelector, buttonsCollection) {
    var navigationEl = d3.selectAll( pageSelector + ' .nav-tab'),
        buttonsCollection = buttonsCollection || [],
        buttonConfig,
        buttonEl,
        itr;
    
    navigationEl = navigationEl.append('div').attr('class', 'nav-list');
    
    itr = 0;
    while( (itr++) < buttonsCollection.length ){
      buttonConfig = buttonsCollection[itr-1];
        
      buttonEl = navigationEl.append('div');
      
      buttonEl.attr('title', buttonConfig.label)
              .on('click', (typeof buttonConfig.callback === 'function' ? buttonConfig.callback : global.APP.noop) );
      global.APP.classUtil.add(buttonEl, ['nav-btn', buttonConfig.iconCls, buttonConfig.halfVisible ? 'nav-subtle' : null]);
    }
    
  };
  
})(this);