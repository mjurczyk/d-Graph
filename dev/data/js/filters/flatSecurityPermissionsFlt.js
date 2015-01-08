!(function (global) {
  global.APP = global.APP || {};
  
  if( typeof global.APP.securityPermissionsFlt !== 'undefined' ) return;
  
  global.APP.securityPermissionsFlt = {};
  
  global.APP.securityPermissionsFlt.filterGroupsByInstance = function (collection, groups) {
    return collection.filter(function (group) {
      itr = groups.length;
      while(itr--){
        if( groups[itr] === group.GroupId ){
          return true; 
        }
      }
      return false;
    });
  };
  
  global.APP.securityPermissionsFlt.flatGroupConnections = function (collection, groups) {
    var securityPermissionFlt = this,
        permissions = [],
        itr;
    
    this.filterGroupsByInstance(collection, groups)
        .forEach(function (group) {
          group.IpPermissions.forEach(function (ipPerm) {
            ipPerm.UserIdGroupPairs.forEach(function (pair) {
              permissions.push(pair.GroupId);
              
            });
          });
        });
    
    return permissions;
  };
  
  global.APP.securityPermissionsFlt.flatIpPermissions = function (collection, groups, direction) {
    var ipPermissions = [];
    
    this.filterGroupsByInstance(collection, groups)
        .map(function (group) {
          return group[ direction.toLowerCase() === 'egress' ? 'IpPermissionsEgress' : 'IpPermissions'].map(function (permission) {
            return permission.IpRanges.map(function (range) {
              return range.CidrIp;
            }).join(',');
          }).join(',');
        }).join(',').split(',').forEach(function (permission) {
          if( permission && ipPermissions.indexOf(permission) === -1 ){
             ipPermissions.push(permission);
          }
        });
    
    return ipPermissions;
  };
  
})(this);