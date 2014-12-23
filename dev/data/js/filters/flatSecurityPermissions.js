!(function (global) {
  // Links filter
  global.APP = global.APP || {};
  
  if( typeof global.APP.flatSecurityPermissionsFlt !== 'undefined' ) return;
  
  global.APP.flatSecurityPermissionsFlt = function (collection, groups) {
    var permissions = [],
        itr;
    
    collection.filter(function (group) {
      
      itr = groups.length;
      while(itr--){
        if( groups[itr] === group.GroupId ){
          return true; 
        }
      }
      return false;
      
    }).forEach(function (group) {
      
      group.IpPermissions.forEach(function (ipPerm) {
        ipPerm.UserIdGroupPairs.forEach(function (pair) {
          permissions.push(pair.GroupId);
        });
      });
      
    });
    
    return permissions;
  };
  
})(this);