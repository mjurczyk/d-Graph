!(function (global) {
  // Line component
  global.APP = global.APP || {};
  
  if( typeof global.APP.lineCmp !== 'undefined' ) return;
  
  global.APP.lineCmp = function (config) {
    
    return d3.svg.line.radial()
            .interpolate(config.interpolation)
            .tension(config.tension)
            .radius(config.radius)
            .angle(config.angle);
    
  };
  
})(this);
