!(function (global) {
  // Links collection
  global.APP = global.APP || {};
  
  global.APP.linksColl = global.APP.linksColl || {};
  
  global.APP.linksColl.createFrom = function (src, filter) {
    
    return d3.layout.bundle()(filter(src));
    
  };
  
})(this);