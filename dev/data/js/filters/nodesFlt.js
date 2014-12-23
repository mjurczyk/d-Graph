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
        securityGroups;
    
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
      
      securityGroups = (instance.SecurityGroups.map(function (group) {
        return group.GroupId;
      }) || []);
      
      subnet.children.push({
        key: (instance.Tags.filter(function (tag) {
          return tag.Key === 'Name';
        })[0].Value || 'Undefined'),
        securityGroupsIn: global.APP.flatSecurityPermissionsFlt(collection.securityGroups, securityGroups),
        securityGroupsOut: securityGroups
      });
    }
    
    return arr;
  };
  
})(this);