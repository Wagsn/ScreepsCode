/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.builder');
 * mod.thing == 'a thing'; // true
 * global code, warning to change
 */

var roleBuilder = {                                
    run: function(creep) {
		switch(creep.memory.action){
			case 2://building
			/*
			if(creep.memory.datas.sourceId != undefined){
				var target = Game.getObjectById(creep.memory.datas.sourceId);
				if(creep.harvest(target) == ERR_NOT_IN_RANGE) {
					creep.moveTo(target);
				}
			}else{
				for(var i =0, len =Memory['sourceData'].length; i<len; i++){
					var name = Memory['sourceData'][i].harvesterName;
					if (!Game.creeps[name]) {
						Memory['sourceData'][i].harvesterName = creep.name;
						creep.memory.sourceId =Memory['sourceData'][i].sourceId;
						break;
					}
				}
				
			}
			
			*/
			var targets = Game.spawns['Spawn1'].room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }else if(creep.upgradeController(Game.spawns['Spawn1'].room.controller) == ERR_NOT_IN_RANGE) {
				creep.moveTo(creep.room.controller);
				creep.memory.action =3;
			}
			//判断下一次行动
			if(creep.carry.energy == 0){
				var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
					filter: (container) => {
						return (container.structureType == STRUCTURE_CONTAINER)&&container.store[RESOURCE_ENERGY] > 0;
					}
				});
				if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(target);
				}
				creep.memory.action =5;//withdrawing
			}
			break;
			case 5://withdrawing
			var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
					filter: (container) => {
						return (container.structureType == STRUCTURE_CONTAINER)&&container.store[RESOURCE_ENERGY] > 0;
					}
				});
			if(target){
				if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(target);
				}
			}
			if(creep.carry.energy == creep.carryCapacity){
				creep.memory.action =2;  //building
			}
			break;
			
			case 1://harvesting
			if(creep.harvest(Memory['mySources'][0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Memory['mySources'][0]);
            }
			if(creep.carry.energy == creep.carryCapacity){
				creep.memory.action =2;  //building
			}
			break;
			
			case 3://upgrading
			if(creep.upgradeController(Game.spawns['Spawn1'].room.controller) == ERR_NOT_IN_RANGE) {
				creep.moveTo(creep.room.controller);
			}else if(creep.carry.energy == 0){
				creep.memory.action =5;  //withdrawing
			}
			break;
			
		}
	}
};
module.exports = roleBuilder;
