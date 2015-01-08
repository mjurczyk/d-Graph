!(function (global) {
  // Nodes filter
  global.APP = global.APP || {};
  
  if( typeof global.APP.nodesFlt !== 'undefined' ) return;
  
  global.APP.nodesFlt = function (collection) {
    var map = {},
        arr = {
          children: []
        },
        itr,
        instance,
        subnet,
        securityGroupsIn,
        securityGroupsOut;
    
    // Setup subnets
    itr = collection.subnets.length;
    while(itr--){
      subnet = {
        key: collection.subnets[itr].SubnetId,
        subnet: true,
        children: []
      };
      arr.children.push(subnet);
    }
    
    // Setup instances
    itr = collection.instances.length;
    while(itr--){
      instance = collection.instances[itr];
      
      subnet = (arr.children.filter(function (element) {
        return element.key === instance.SubnetId;
      })[0] || null);
      
      if( !subnet ){
        continue;
      }
      
      securityGroupsOut = (instance.SecurityGroups.map(function (group) {
        return group.GroupId;
      }) || []);
      
      securityGroupsIn = global.APP.securityPermissionsFlt.flatGroupConnections(collection.securityGroups, securityGroupsOut);

      subnet.children.push({
        key: (instance.Tags.filter(function (tag) {
          return tag.Key === 'Name';
        })[0].Value || 'Undefined'),
        securityGroupsIn: securityGroupsIn,
        securityGroupsOut: securityGroupsOut,
        
        // IP matching
        ipAddress: {
          public: instance.PublicIpAddress,
          private: instance.PrivateIpAddress
        },
        ipPermIn: global.APP.securityPermissionsFlt.flatIpPermissions(collection.securityGroups, securityGroupsIn, 'ingress'),
        ipPermOut: global.APP.securityPermissionsFlt.flatIpPermissions(collection.securityGroups, securityGroupsOut, 'egress')
      });
    }
    
    return arr;
  };
  
})(this);