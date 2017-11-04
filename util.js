const mod={};
modlue.exports =mod;

mod.HashTable =function(){
  var size;
  var entry;
  this.add =function(key, value){//add key-value or update value by key
    if(!this.containsKey(key)){
      size++;
    }
    entry[key] =value;
  };
  this.remove =function(key){//return value and delete key, if key not in entry, return null.
    if(this.containsKey(key)){
      var value =entry[key];
      delete entry[key];//i dont know it will effect return value or not, i dont test it.
      size--;
      return value;
    }
    return null;
    /*
    if(this.containsKey(key) && delete entry[key]){
      size--;
    }
    */
  };
  this.containsKey =function(key){
    return (key in entry);
  };
  this.containsValue =function(value){
    for(var key in entry){
      if(entry[key]==value){//same of pointer
        return true;
      }
    }
    return false;
  };
  this.containsByFunc =function(func){
    for(var key in entry){
      return func(entry[key]);
    }
    return false;
  };
  this.containsByObj =function(obj){
    for(var key in entry){
      var flag =true;
      for(var prop in obj){
        flag =flag&&((prop in entry[key]) && entry[key][prop] == obj[prop]);
      }
      if(flag){
        return true;
      }
    }
    return false;
  };
  this.contains =function(filter){
    if(typeof filter == 'function'){
      return this.containsByFunc(filter);
    }
    if(typeof filter == 'object'){
      return this.containsByObj(filter);
    }
    return false;
  };
  this.
};
