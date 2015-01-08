!(function (global) {
  // Config component
  global.APP = global.APP || {};
  
  if( typeof global.APP.configCmp !== 'undefined' ) return;
  
  global.APP.configCmp = function (params) {
    var params = params || {},
        _vals = {
          graph: {
            container: 'graph-container',

            diameter: 960,
            padding: 240,

            radius: 0,
            innerRadius: 0
          },
          link: {

            // https://github.com/mbostock/d3/wiki/SVG-Shapes#line_interpolate
            interpolation: 'basis',
            tension: .5,
            radius: function (point) {
              return point.y; 
            },
            angle: function (point) {
              return point.x / 180 * Math.PI; 
            }
          },
          data: {
            url: params.vpcTarget,
            filterNodes: params.nodesFilter,
            filterLinks: params.linksFilter
          },
          filesList: './data/json/__files__',
          filesDir: './data/json/'
        };
    _vals.graph.radius = _vals.graph.diameter / 2;
    _vals.graph.innerRadius = _vals.graph.radius - _vals.graph.padding;

    return _vals;
  };
  
})(this);