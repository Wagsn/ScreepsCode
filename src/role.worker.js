/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.worker');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
	run: function(creep) {
		
	},
	getEnergyCount:function(){
		var spawnStructures =Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ) && structure.energy > 0;
                    }
            });
        var sources =0;
        for(var i =0; i<spawnStructures.length;i++){
            sources +=spawnStructures[i].energy;
        }
		return source;
	},
	getCreepBodys:function(){
		var source =getEnergyCount();
		if(sources>=800){
            return [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];//800
        }else if(sources>=700){
            return [WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];//700
        }else if(sources>=600){
            return [WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];//600
        }else if(sources>=500){
            return [WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];//500
        }else if(sources>=400){
            return [WORK,WORK,CARRY,CARRY,MOVE,MOVE];//400
        }else{
            return [WORK,CARRY,CARRY,MOVE,MOVE];//300
        }
	}
};