/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.claimer');
 * mod.thing == 'a thing'; // true
 */
var roleClaimer ={};

module.exports = roleClaimer;

roleClaimer.run =function(creep){
    //claiming 声明room的归属权  claimController(target)
	if(!creep.memory.controllerPos){
		creep.memory.controllerPos =new RoomPosition(43,34,'E53S16');
	}
	if(creep.room.name == 'E53S16'){
		var returnCode =creep.claimController(creep.room.controller);
		console.log('returnCode:  '+returnCode);
		if(returnCode==ERR_NOT_IN_RANGE){
			creep.moveTo(creep.room.controller);
		}
	}else{
		console.log('runnig to ' +creep.memory.controllerPos+' '+creep.moveTo(new RoomPosition(43,34,'E53S16')));
	}
    //if(creep.claimController(target))
    
}
