/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.harvester');
 * mod.thing == 'a thing'; // true
 */

var roleHarvester = {
    /** @param {Creep} creep **/
    run: function(creep) {
		switch(creep.memory.action){//When spawn new creep the action should be initialize
			case 1://harvesting
			/*
			var target = creep.room.find(FIND_STRUCTURES, {
					filter: (structure) => {
						return (structure.structureType == STRUCTURE_STORAGE  );
					}
			});
			if(target && creep.withdraw(target, RESOURCE_ENERGY) ==ERR_NOT_IN_RANGE){
				creep.moveTo(target);
			}
			*/
			/*
			if(creep.harvest(Memory['mySources'][1]) == ERR_NOT_IN_RANGE) {
			creep.moveTo(Memory['mySources'][1]);
			}
			*/
			
			const targets = creep.room.find(FIND_DROPPED_RESOURCES);
			if (targets.length) {
				creep.moveTo(targets[0]);
				creep.pickup(targets[0]);
			}else if(creep.harvest(Memory['mySources'][1]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Memory['mySources'][1]);
				break;
            }
			
			if(creep.carry.energy == creep.carryCapacity){
				creep.memory.action =4;  //transfering
			}
			break;
			case 4://transfering to spawn and extension, if energy is full to the tower 
			var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
					filter: (structure) => {
						return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ) && structure.energy < structure.energyCapacity;
					}// || structure.structureType == STRUCTURE_TOWER 
			});
			if(target) {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }else{
                if(creep.upgradeController(Game.spawns['Spawn1'].room.controller) == ERR_NOT_IN_RANGE) {
					creep.moveTo(creep.room.controller);
					creep.memory.action =3;
				}
            }
			if(creep.carry.energy == 0){
				creep.memory.action =1;  //harvesting
			}
			break;
			case 3://upgrading controller
			if(creep.upgradeController(Game.spawns['Spawn1'].room.controller) == ERR_NOT_IN_RANGE) {
				//creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
				creep.moveTo(creep.room.controller);
			}
			if(creep.carry.energy == 0){
				creep.memory.action =1;  //harvesting
			}
			break;
			
		}
	}
};
module.exports = roleHarvester;