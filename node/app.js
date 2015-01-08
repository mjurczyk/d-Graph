var AWS = require('aws-sdk'),
    fs = require('fs'),
    open = require('open');

!(function (global) {
  
  // ================================
  // States
  // ================================
  var config = {
        region: 'eu-west-1'
      },
      AWS_EC2 = null,
      AWS_ELB = null,
      collections = {
        VPC: null,
        securityGroups: null,
        loadBalancers: null,
        instances: null,
        subnets: null,
        ACL: null                // TODO
      },
      loadCallback = null,
      generatorCallback = null,
      outputPath = './vpcData';
  
  if( !AWS ) return;
  
  // ================================
  // Setup configs
  // ================================
  AWS.config.region = config.region;
  
  AWS_EC2 = new AWS.EC2();
  AWS_ELB = new AWS.ELB();
  
  // ================================
  // Load async data from AWS
  // ================================
  AWS_EC2.describeVpcs(null, function (err, data) {
    if( err !== null ){
      throw err;
    }
    collections.VPC = data.Vpcs || [];
    
    loadCallback();
  });
  
  AWS_EC2.describeSecurityGroups(null, function (err, data) {
    if( err !== null ){
      throw err;
    }
    
    collections.securityGroups = data.SecurityGroups || [];
    
    loadCallback();
  });
  
  AWS_EC2.describeInstances(null, function (err, data) {
    if( err !== null ){
      throw err; 
    }
    collections.instances = data.Reservations || [];
    
    loadCallback();
  });
  
  AWS_EC2.describeNetworkAcls(null, function (err, data) {
    if( err !== null ){
      throw err; 
    }
    collections.ACL = data || [];  // TODO: set result field, like 'Reservations'
    
    loadCallback();
  });
  
  AWS_EC2.describeSubnets(null, function (err, data) {
    if( err !== null ){
      throw err; 
    }
    //fs.writeFile('./test.json', JSON.stringify(data), function() {} );
    collections.subnets = data.Subnets || [];
    
    loadCallback();
  });
  
  AWS_ELB.describeLoadBalancers(null, function (err, data) {
    if( err !== null ){
      throw err; 
    }
    collections.loadBalancers = data.LoadBalancerDescriptions || [];
    
    loadCallback();
  });
  
  
  // ================================
  // After load
  // ================================
  loadCallback = function () {
    var ready = true,
        itrVPC,
        genVPC,
        
        vpc,
        subnets,
        loadBalancers,
        instances,
        securityGroups;
    
    // ==============================
    // Conditions
    // ==============================
    for( itr in collections ){
      if( collections[itr] === null ){
        ready = false; 
      }
    }
    
    if( !ready ) return;
    
    // ==============================
    // Output location
    // ==============================
    fs.exists(outputPath, function (exists) {
      if(exists === false){
        fs.mkdir(outputPath, function (err) {
          if(err !== null){
            throw err;
          }    
        });  
      }
    });
    
    // ==============================
    // Generator (VPC)
    // ==============================
    itrVPC = collections.VPC.length;
    genVPC = 1;
    
    while(--itrVPC){
      vpc = collections.VPC[itrVPC];
      subnets = getSubnetsForVPC(vpc.VpcId);
      loadBalancers = getLoadBalancersForVPC(vpc.VpcId);
      instances = getInstancesForVPC(vpc.VpcId);
      securityGroups = getSecurityGroupsForVPC(vpc.VpcId);
      
      console.log('generating VPC', vpc.VpcId, '...');
      console.log( '...', subnets.length, 'subnets' );
      console.log( '...', loadBalancers.length, 'loadBalancers' );
      console.log( '...', instances.length, 'instances' );
      console.log( '...', securityGroups.length, 'securityGroups' );
      
      fs.writeFile(outputPath + '/' + vpc.VpcId + '.json', JSON.stringify({
        
        // Data written into the file
        vpc: vpc,
        subnets: subnets,
        instances: instances,
        loadBalancers: loadBalancers,
        securityGroups: securityGroups
      }), function (err) {
        if( err !== null ){
          throw err; 
        }
        
        if(genVPC === collections.VPC.length - 1){
          generatorCallback();
        } else {
          genVPC++;
        }
      });
      
    }
    
    
    
  };
  
  // ================================
  // After files' generation
  // ================================
  generatorCallback = function () {
    
    console.log('listing all files ...');
    
    fs.readdir(outputPath, function (err, files) {
      if( err !== null ){
        throw err; 
      }
      
      // Filter out useless stuff
      files = files.filter( function (file) {
        return file.indexOf('.json') === file.length - '.json'.length; 
      });
      
      fs.writeFile(outputPath + '/__files__', JSON.stringify(files), function (err) {
        if( err !== null ){
          throw err; 
        }
      });
    });
  };
  
  // ================================
  //  Utils
  // ================================
  function getSubnetsForVPC (idVPC) {
    return collections.subnets.filter(function (subnet) {
      return subnet.VpcId === idVPC;
    }) || [];
  };
  
  function getLoadBalancersForVPC (idVPC) {
    return collections.loadBalancers.filter(function (loadBalancer) {
      return loadBalancer.VPCId === idVPC;
    }) || [];
  };
  
  function getInstancesForVPC (idVPC) {
    var result = [];
    
    collections.instances.forEach(function (reservation, indexReservation) {
      result = result.concat(reservation.Instances.filter(function (instance) {
        return instance.VpcId === idVPC;
      }) || [] );
    });
    
    return result;
  };
  
  function getSecurityGroupsForVPC (idVPC) {
    return collections.securityGroups.filter(function (securityGroup) {
      return securityGroup.VpcId === idVPC;
    }) || [];
  };
  
})(this);