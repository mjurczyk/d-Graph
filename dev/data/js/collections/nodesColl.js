!(function (global) {
  // Nodes collection
  global.APP = global.APP || {};
  
  global.APP.nodesColl = global.APP.nodesColl || {};
  
  global.APP.nodesColl.createFrom = function (src, config, filter) {

    return d3.layout.cluster()
            .size([360, config.innerRadius])
            .nodes(filter(src))
            .filter(function (node) {
              return !node.children && !node.subnet;
            });
    
  };
  
})(this);