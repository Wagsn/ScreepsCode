

module.exports = {
	loop : function () {
		for(var iRoom in Game.rooms){
            var towers = Game.rooms[iRoom].find(
            		FIND_MY_STRUCTURES, {
            		filter: {
            			structureType: STRUCTURE_TOWER
            		}
            	});
			for(var i =0, len =towers.length; i<len; i++){
				
				var closestHostile = towers[i].pos.findClosestByRange(FIND_HOSTILE_CREEPS);
				if (closestHostile && closestHostile.owner.username != 'Gin') {
					towers[i].attack(closestHostile);
				}
				if(towers[i].energy > towers[i].energyCapacity*0.7){
					var closestDamagedStructure = towers[i].pos.findClosestByRange(FIND_STRUCTURES, {
							filter: (structure) => ((structure.structureType == STRUCTURE_CONTAINER && structure.hits < structure.hitsMax)
								 || ((structure.structureType == STRUCTURE_RAMPART) && structure.hits < structure.hitsMax * 0.006)    //30K
								 || ((structure.structureType == STRUCTURE_WALL) && structure.hits < structure.hitsMax * 0.0003))    //33K
						});
					if (closestDamagedStructure) {
						towers[i].repair(closestDamagedStructure);
					}
				}
				
				
			}
            //Game.rooms[iRoom].towers.forEach(tower => this.run(tower));
        }
	}
}
/*
const friends =['Gin'];

function isFriend(playerName){
    for(var i = 0; i < arr.length; i++){
        if(value === arr[i]){
            return true;
        }
    }
    return false;
}
/*
/*
module.exports = {
    self: this,
    loop: function(){
        for(var iRoom in Game.rooms){
            //var towers = Game.rooms[iRoom].find(
            //FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
            Game.rooms[iRoom].towers.forEach(tower => this.run(tower));
        }
    }, 
    run: function(tower){
        if(tower) {
            // TODO: Calculate Values only once initial
            // TODO: convert to action pattern  
			
            // Heal  治疗
            var casualty = _.sortBy(tower.room.find(FIND_MY_CREEPS, {
                    filter: (creep) => creep.hits < creep.hitsMax && 
                    (creep.towers == null || creep.towers.length == 0)
                }), 'hits');
                
            //var closestCasualty = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
            //        filter: (creep) => creep.hits < creep.hitsMax
            //    });
            if(casualty.length > 0) {
                tower.heal(casualty[0]);
                if( casualty.towers == null )casualty.towers = [];
                    casualty.towers.push(tower.id);
                return;
            } 

            // urgend Repair
            if( (tower.room.creepRepairableSites.count > 0) ) {
                for( var iSite = 0; iSite < tower.room.creepRepairableSites.count; iSite++){
                    var site = tower.room.creepRepairableSites[tower.room.creepRepairableSites.order[iSite]];
                    
                    if(site.towers == null || site.towers.length == 0){
                        if( site.towers == null ) 
                            site.towers = [];
                        site.towers.push(tower.id);
                        tower.repair(site);
                        return;
                    }
                }
            }
            
            // Attack
            
            //var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
            //    filter: function(hostile){ return _.some(hostile.body, {'type': HEAL}); } 
            //});
            //if(closestHostile) {
            //    tower.attack(closestHostile);
            //    return;
            //}           
            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(closestHostile) {
                tower.attack(closestHostile);
                return;
            } 

            // Repair
            if( (tower.room.repairableSites.count > 0) && (tower.energy > (tower.energyCapacity * (1-(0.2/tower.room.towers.length)))) ) {
                var find = siteId => tower.room.repairableSites[siteId].towers.length == 0;
                var targetId = _.find(tower.room.repairableSites.order, find);
                if( targetId ){
                    var site = tower.room.repairableSites[targetId];
                    site.towers.push(tower.id);
                    tower.repair(site);
                    return;
                }
            }
        }
    }
}*/
