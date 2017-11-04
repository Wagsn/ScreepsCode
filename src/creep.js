
var mod ={};
module.exports = mod;

/*
var action =new Action();
*/
mod.Action =function(creepName){
	this.creepName =creepName;
	this.microAction =function(creep, target){   //default action
		return false;
	};
	this.run =function(creep){
		this.microAction();
	};
	
}