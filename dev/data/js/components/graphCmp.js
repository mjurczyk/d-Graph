!(function (global) {
  
  // Graph component
  global.APP = global.APP || {};
  
  if( typeof global.APP.graphCmp !== 'undefined' ) return;
  
  global.APP.graphCmp = {};
  
  global.APP.graphCmp.createFrame = function (config) {
    
    return global.APP.graphCmp.graphFrame = d3.select(config.container)
            .attr({
              'class': 'full-scale-graph'
            })
            .append('svg')
            .attr({
              width: config.diameter,
              height: config.diameter,
            })
            .append('g');
    
  };
  
  global.APP.graphCmp.createLinks = function (container, collection, config) {
    
    return global.APP.graphCmp.links = container.selectAll('.link')
              .data(collection)
              .enter().append('path')
              .each(function (d) { 
                d.source = d[0];
                d.target = d[d.length - 1]; 
              })
              .attr({
                'class': 'link',
                d: config
              });
    
  };
  
  global.APP.graphCmp.createNodes = function (container, collection) {
    
    return global.APP.graphCmp.nodes = container.selectAll('.node')
              .data(collection)
              .enter().append('g')
              .attr({
                'class': 'node',
                transform: function (element) {
                  return [
                    'rotate(',
                    element.x - 90,
                    ')',
                    'translate(',
                    element.y,
                    ')'
                  ].join('');
                }
              })
              .append('text')
              .attr({
                'text-anchor': function (element) {
                  return element.x < 180 ? 'start' : 'end';
                },
                dx: function (element) {
                  return element.x < 180 ? 8 : -8
                },
                dy: '.31em',
                transform: function (element) {
                  return element.x < 180 ? null : 'rotate(180)';
                }
              })
              .text(function (element) {
                return element.key || element.name || 'Undefined';
              });
    
  };
  
  global.APP.graphCmp.createHoverEffect = function () {
    var nodes = global.APP.graphCmp.nodes || [],
        links = global.APP.graphCmp.links || [];
    
    nodes.on('mouseover', function (node) {

      nodes.each(function (n) { 
        n.target = n.source = false; 
      });

      // Setup links' coloring
      links.classed('link-target', function (l) { 
        if (l.target === node) {
          return l.source.source = true; 
        }
      })
      .classed('link-source', function (l) { 
        if (l.source === node) {
          return l.target.target = true; 
        }
      })
      .classed('link-not-selected', function (l) {
        var domEl = d3.select(this);
        return !domEl.classed('link-source') && !domEl.classed('link-target');
      })
      .filter(function (l) { 
        return l.target === node || l.source === node; 
      })
      .each(function () { 
        this.parentNode.appendChild(this); 
      });

      // Setup nodes' coloring
      nodes.classed('node-target', function (n) { 
        return n.target; 
      })
      .classed('node-source', function (n) { 
        return n.source; 
      })
      .classed('node-not-selected', function (n) {
        var domEl = d3.select(this);
        return !domEl.classed('node-source') && !domEl.classed('node-target') && !(n === node);
      });
      
    }).on('mouseout', function (node) {
      links.classed('link-target', false)
           .classed('link-source', false)
           .classed('link-not-selected', false);

      nodes.classed('node-target', false)
           .classed('node-source', false)
           .classed('node-not-selected', false);
    });
    
  };
  
})(this);