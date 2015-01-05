!(function (global) {
  global.APP = global.APP || {};
  
  global.APP.classUtil = global.APP.classUtil || {};
  
  global.APP.classUtil.add = function (element, classes) {  
    if( element && typeof element.attr === 'function' ){
      if( classes instanceof Array ){
        classes = classes.join(' ').trim();
      } else {
        classes = String(classes); 
      }
      
      element.attr({
        'class': [
          element.attr('class'),
          classes
        ].join(' ').trim()
      });
      
      return element;
    }
  };
  
  global.APP.classUtil.remove = function (element, classes) {
    var itr;
    
    if( element && typeof element.attr === 'function' ){
      if( classes instanceof String ){
        classes = classes.split(' ');
      } else {
        classes = Array(classes); 
      }
      
      itr = classes.length;
      while(itr--){
        element.attr({
          'class': element.attr('class').split(classes[itr]).join('').trim()
        });
      }
      
      return element;
    }
  };
  
  global.APP.classUtil.modify = function (element, addCol, rmCol) {
    APP.classUtil.add(element, addCol);
    APP.classUtil.remove(element, rmCol);
    
    return element;
  };
  
  
  
})(this);