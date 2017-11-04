var roleOnlyHarvester = {
    /** @param {Creep} creep **/
    run: function(creep) {
		switch(creep.memory.action){//When spawn new creep the action should be initialize
			case 1:
			var target = Game.getObjectById(creep.memory.datas.sourceId);
			if(creep.harvest(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
			if(creep.carry.energy == creep.carryCapacity){
				creep.memory.action =4;  //transfering
			}
			break;
			case 4://transfering to container
			//!! can save container id to easy find it, the find function will use more cpu time 
			var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {// find closet container with space
					filter: (structure) => {
						if(structure.structureType != STRUCTURE_CONTAINER){
							return false;
						}
						var storeAmount;
						for(var prop in structure.store){
							storeAmount +=structure.store[prop];
						}
						return (structure.storeCapacity > storeAmount);
					}
			});
			if(target) {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);//moveTo function will use more cpu time, you can save the path use pos.findPath at first time 
                }
            }else{//dont have container or all of they is full, transfer to storage
				
			}
			if(creep.carry.energy == 0){
				creep.memory.action =1;  //harvesting
			}
			break;
		}
	}
};
module.exports = roleOnlyHarvester;