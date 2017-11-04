
// global code, warning to change

var roleCarrier = {
	bodys:[],

    /** @param {Creep} creep **/
    //搬运人 carrier, 负责填满 spawn 和 extension 的 energy
    run: function(creep) {
        switch(creep.memory.action){//When spawn new creep the action should be initialize
			case 5://withdrawing
			var target =Game.getObjectById(creep.memory.sourceId);
			//console.log(target);
			if(target){
				var returnCode =creep.withdraw(target, RESOURCE_ENERGY);
				//console.log(returnCode);
				if(returnCode == ERR_NOT_IN_RANGE) {
					creep.moveTo(target);
				}else if(returnCode == ERR_NOT_ENOUGH_RESOURCES){
					var targets = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {
							filter: (container) => {
								return (container.structureType == STRUCTURE_CONTAINER) && container.store[RESOURCE_ENERGY] > 0;
							}
						});
						//console.log(targets);
					if (targets.length) {
						creep.memory.sourceId = targets[0].id;
						if (creep.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
							creep.moveTo(targets[0]);
						}
					}
				}
			}else {
				var targets = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {
						filter: (container) => {
							return (container.structureType == STRUCTURE_CONTAINER) && container.store[RESOURCE_ENERGY] > 0;
						}
					});
				if (targets.length) {
					creep.memory.sourceId =targets[0].id;
					if (creep.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						creep.moveTo(targets[0]);
					}
				}
			}
			//判断
			if(creep.carry.energy == creep.carryCapacity){
				creep.memory.action =4;  //transfering
			}
			break;
			case 4: //transfering to spawn and extension, if energy is full to the tower
			// Game.spawns['Spawn1'].room.find
			var tower = creep.pos.findClosestByRange(FIND_STRUCTURES, {
					filter: (structure) => {
						return (structure.structureType == STRUCTURE_TOWER) && (structure.energy < structure.energyCapacity * 0.6);
					} //
				});
			if (tower) {
				var returnCode = creep.transfer(tower, RESOURCE_ENERGY);
				if (returnCode == ERR_NOT_IN_RANGE) {
					creep.moveTo(tower);
				}
			} else {
				var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
						filter: (structure) => {
							return (structure.structureType == STRUCTURE_EXTENSION ||
								structure.structureType == STRUCTURE_SPAWN
								||structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
						} //
					});
				if (target) {
					if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						creep.moveTo(target);
					}
				} else {
					var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
							filter: (structure) => {
								return (structure.structureType == STRUCTURE_STORAGE);
							} //
						});
					if (target) {
						if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
							creep.moveTo(target);
						}
					}
				}
			}
			
			
			//判断
			if(creep.carry.energy == 0){
				creep.memory.action =5;  //withdrawing
			}
			break;
			//case 
			/*
			case 3://upgrading controller
			if(creep.upgradeController(Game.spawns['Spawn1'].room.controller) == ERR_NOT_IN_RANGE) {
				//creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
				creep.moveTo(creep.room.controller);
			}
			//判断
			if(creep.carry.energy == 0){
				creep.memory.action =5;  //withdrawing
			}
			break;
			*/
			/*
			case 1://harvesting
			if(creep.harvest(Memory['mySources'][0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Memory['mySources'][0]);
            }
			if(creep.carry.energy == creep.carryCapacity){
				creep.memory.action =4;  //transfering
			}
			break;
			*/
		}
    }
};

module.exports = roleCarrier;