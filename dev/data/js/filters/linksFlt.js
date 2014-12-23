!(function (global) {
  // Links filter
  global.APP = global.APP || {};
  
  if( typeof global.APP.linksFlt !== 'undefined' ) return;
  
  global.APP.linksFlt = function (nodes) {
    var links = [],
        stringified = {},
        itr;
    
    nodes.forEach(function (node) {
      
      var connectionsOut = nodes.filter(function (sibling) {
            var i, j;
        
            i = sibling.securityGroupsIn.length;
            while(i--){
              j = node.securityGroupsOut.length;
              while(j--){
                if( sibling.securityGroupsIn[i] === node.securityGroupsOut[j] ){
                  return true; 
                }
              }
            }
            return false;
          }),
          strNode,
          regex,
          itr;
      
      itr = connectionsOut.length;
      while(itr--){
        links.push({
          source: node,
          target: connectionsOut[itr]
        });  
      }
      
    });
    
    return links;
  };
  
})(this);