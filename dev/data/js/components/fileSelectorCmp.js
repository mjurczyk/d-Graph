!(function (global) {
  // Files' Selector component
  global.APP = global.APP || {};
  
  if( typeof global.APP.fileSelectorCmp !== 'undefined' ) return;
  
  global.APP.fileSelectorCmp = {
    fileSelected: null,
    fileList: []
  };
  
  global.APP.fileSelectorCmp.createFileListView = function (config) {
    var fileSelectorCmp = this,
        viewEl = d3.selectAll('.file-select'),
        fileIconsEl,
        fileConfig,
        fileEl,
        itr;
    
    viewEl.selectAll('*').remove();
    
    itr = 0;
    while( (itr++) < fileSelectorCmp.fileList.length ){
      fileConfig = fileSelectorCmp.fileList[itr-1];
      
      fileEl = viewEl.append('div')
                    .attr('ind', itr-1)
                    .text(fileConfig);
      
      global.APP.classUtil.add(fileEl, ['file-icon', (itr-1 === fileSelectorCmp.fileSelected) ? 'file-current' : null]);
    }
    
    fileIconsEl = d3.selectAll('.file-icon');
    fileIconsEl.on('click', function () {
      var fileIconEl = d3.select(d3.event.target);
      
      fileSelectorCmp.pickFile(Number(fileIconEl.attr('ind')) || 0);

      fileSelectorCmp.selectFileElement(fileIconEl);
      
      global.APP.graphCmp.createGraph( global.APP.configCmp().filesDir + fileIconEl.text() );
    });
  };
  
  global.APP.fileSelectorCmp.setFileList = function (list) {
    var fileSelectorCmp = this;
    
    fileSelectorCmp.fileList = list || [];
    fileSelectorCmp.createFileListView();
  };
  
  global.APP.fileSelectorCmp.pickFile = function (index) {
    var fileSelectorCmp = this;
    
    fileSelectorCmp.fileSelected = index || 0;
  };
  
  global.APP.fileSelectorCmp.selectFileElement = function (element) {
    var viewEl = d3.selectAll('.file-select');
    
    global.APP.classUtil.remove(viewEl.selectAll('.file-icon'), 'file-current');
    
    global.APP.classUtil.add(element, 'file-current');
  }; 
  
  global.APP.fileSelectorCmp.getCurrentFileName = function () {
    return this.fileList[this.fileSelected] || '';
  };
})(this);