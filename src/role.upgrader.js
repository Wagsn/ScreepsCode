/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.upgrader');
 * mod.thing == 'a thing'; // true
 */

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
		
		switch(creep.memory.action){
			
			case 5://withdrawing
			var targets = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {
					filter: (container) => {
						return (container.structureType == STRUCTURE_CONTAINER)&&container.store[RESOURCE_ENERGY] > 0;
					}
				});
			if(targets.length && creep.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
				creep.moveTo(targets[0]);
			}
			//�ж�
			if(creep.carry.energy == creep.carryCapacity){
				creep.memory.action =3;  //upgrading
			}
			break;
			case 3://upgrading
			if(creep.upgradeController(Game.spawns['Spawn1'].room.controller) == ERR_NOT_IN_RANGE) {
				creep.moveTo(creep.room.controller);
			}else if(creep.carry.energy == 0){
				creep.memory.action =5;  //withdrawing
			}
			break;
			
			case 1://harvesting
			if(creep.harvest(Memory['mySources'][1]) == ERR_NOT_IN_RANGE) {//harvest bad for source not in range
                creep.moveTo(Memory['mySources'][1]);
            }else if(creep.carry.energy == creep.carryCapacity){//dont need move��sure need change action or not 
				creep.memory.action =3;  //upgrading
			}
			break;
			
		}
		/*
        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
	    }
	    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.upgrading = true;
	    }

	    if(creep.memory.upgrading) {
            if(creep.upgradeController(Game.spawns['Spawn1'].room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
        else {
            if(creep.harvest(Memory['mySources'][0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Memory['mySources'][0]);
            }
        }
		*/
	}
};

module.exports = roleUpgrader;