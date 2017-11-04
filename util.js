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
  this.contains =function(o){
    if(typeof o == 'function'){
      return this.containsByFunc(o);
    }
    if(typeof o == 'object'){
      return this.containsByObj(o);
    }
    return false;
  };
  this.filterSingleByObj =function(obj){
    for(var key in entry){
      var flag =true;
      for(var prop in obj){
        flag =flag&&((prop in entry[key]) && entry[key][prop] == obj[prop]);
      }
      if(flag){
        return entry[key];
      }
    }
    return null;
  };
  this.filterSingleByFunc =function(f){
		for(var prop in entry){
			if(f(entry[prop])){
				return entry[prop];
			}
		}
		return null;
	};
  this.filterByFunc =function(func){
		var values =[];
		for(var prop in entry){
			if(f(entry[prop])){
				values.push(entry[prop]);
			}
		}
		return values;
	};
  this.filterByObj =function(obj){
    var values =[];
    for(var key in entry){
      var flag =true;
      for(var prop in obj){
        flag =flag&&((prop in entry[key]) && entry[key][prop] == obj[prop]);
      }
      if(flag){
        values.push(entry[key]);
      }
    }
    return values;
  };
};
