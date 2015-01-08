!(function (global) {
  
  // Graph component
  global.APP = global.APP || {};
  
  if( typeof global.APP.graphCmp !== 'undefined' ) return;
  
  global.APP.graphCmp = {};
  
  global.APP.graphCmp.init = function () {
    var graphCmp = this;
    
    graphCmp.createNavigation();
  };
  
  global.APP.graphCmp.createGraph = function (vpcFile) {
    var config = global.APP.configCmp({
          linksFilter: global.APP.linksFlt,
          nodesFilter: global.APP.nodesFlt,
          vpcTarget: vpcFile
        }),
        lineConfig = global.APP.lineCmp(config.link),
        svgFrame = global.APP.graphCmp.createFrame(config.graph),
        menuEl = d3.select('.pt-page-graph .nav-tab'),
        labelEl = d3.select('.graph-title');
    
    d3.json( config.data.url, function(error, response) {
      var nodesCollection,
          linksCollection;
      
      if( error ){
        return global.APP.showError(
          'Unknown JSON file', 
          [
            'Application was unable to load the, so called, "' + config.data.url + '".',
            'You sure it exists, right?<br/>',
            '[ Err: ' + error. responseText  + ' ]'
          ].join(' ')
        );
      }
      
      nodesCollection = global.APP.nodesColl.createFrom(response, config.graph, config.data.filterNodes);
      linksCollection = global.APP.linksColl.createFrom(nodesCollection, config.data.filterLinks);

      // Setup links
      global.APP.graphCmp.createLinks(svgFrame, linksCollection, lineConfig);

      // Setup nodes
      global.APP.graphCmp.createNodes(svgFrame, nodesCollection);

      // Setup additional effects
      global.APP.graphCmp.createHoverEffect();
      
      // Setup controls
      global.APP.controlsCmp.init(svgFrame);
      
      // Setup label
      labelEl.text( config.data.url.replace(/^.*[\\\/]|.json/g, '').toUpperCase() );
      
      global.APP.pageUtil.swapPages(null, '.pt-page-graph', 'bottom');
      
      global.APP.classUtil.remove(menuEl, 'no-graph-selected');
    });
  };
  
  global.APP.graphCmp.createFrame = function (config) {
    var graphEl = d3.select('.' + config.container);
    
    if( !graphEl.empty() ){
       graphEl.remove();
    }
    
    global.APP.graphCmp.graphFrame = d3.select('.pt-page-graph').append('div')
            .attr('class', config.container + ' full-scale-graph')
            .append('svg')
            .attr({
              width: config.diameter,
              height: config.diameter
            })
            .append('g')    // Dragging mask
            .append('g');
    
    global.APP.graphCmp.graphFrame.append('rect')
            .attr({
              width: config.diameter,
              height: config.diameter,
              x: -config.diameter/2,
              y: -config.diameter/2,
              fill: 'rgba(0, 0, 0, 0)'
            });
    
    
    return global.APP.graphCmp.graphFrame;
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
  
  global.APP.graphCmp.createNavigation = function () {
    global.APP.navCmp.create(
      '.pt-page-graph',
      [
        {
          label: 'Sidetab',
          iconCls: 'nav-sidetab',
          halfVisible: false,
          callback: function () {

          }
        },
        {
          label: 'Choose a VPC file',
          iconCls: 'nav-files',
          halfVisible: true,
          callback: function () {
            global.APP.pageUtil.swapPages(null, '.pt-page-file-select', 'top');
          }
        },
        {
          label: 'Print the page',
          iconCls: 'nav-print',
          halfVisible: true,
          callback: function () {
            window.print();
          }
        }
      ]
    );
  };
  
})(this);