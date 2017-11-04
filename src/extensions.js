var mod = {
    loop: function(){

        Object.defineProperty(Structure.prototype, 'memory', {
            configurable: true,
            get: function() {
                if(_.isUndefined(Memory.structures)) {
                    Memory.structures = {};
                }
                if(!_.isObject(Memory.structures)) {
                    return undefined;
                }
                return Memory.structures[this.id] = Memory.structures[this.id] || {};
            },
            set: function(value) {
                if(_.isUndefined(Memory.structures)) {
                    Memory.structures = {};
                }
                if(!_.isObject(Memory.structures)) {
                    throw new Error('Could not set memory extension for structures');
                }
                Memory.structures[this.id] = value;
            }
        });
        
        Source.prototype.init = function() {
            var fields = this.room.lookForAtArea(LOOK_TERRAIN, this.pos.y-1, this.pos.x-1, this.pos.y+1, this.pos.x+1, true);
            this.accessibleFields = 9-_.countBy( fields , "terrain" ).wall;
        };
        
		
        Room.prototype.init = function(){
            // Room
            var self = this;
            if( this.population === undefined ) this.population = {};
            this.sourceAccessibleFields = 0;
            this.sourceEnergyAvailable = 0;
            this.relativeEnergyAvailable = this.energyCapacityAvailable > 0 ? this.energyAvailable / this.energyCapacityAvailable : 0;
            this.sources = [];            
            this.constructionSites = {
                order: [], // ids, ordered descending by remaining progress
                count: 0
            };
            this.repairableSites = {
                order: [], 
                count: 0
            }
            this.creepRepairableSites = {
                order: [], 
                count: 0
            }
            this.towers = [];
            this.towerFreeCapacity = 0;

            // Construction Sites
            _.sortBy(this.find(FIND_MY_CONSTRUCTION_SITES), 
                function(o) { 
                    return o.progress * -1; 
                }).forEach(function(site){
                    site.creeps = [];
                    self.constructionSites.order.push(site.id);
                    self.constructionSites.count++;
                    self.constructionSites[site.id] = site; 
                });
            
            // Sources
            _.sortBy(this.find(FIND_SOURCES), 
                function(o) { 
                    o.init();
                    return o.accessibleFields;
                }).forEach((source) => {
                    this.sources.push(source);
                    self.sourceAccessibleFields += source.accessibleFields;
                    self.sourceEnergyAvailable += source.energy;
                });
            
            // RepairableSites
            var coreStructures = [STRUCTURE_SPAWN,STRUCTURE_EXTENSION,STRUCTURE_ROAD,STRUCTURE_CONTROLLER];  
            _.sortBy(this.find(FIND_STRUCTURES, {
                filter: (structure) => structure.hits < structure.hitsMax && structure.hits < TOWER_REPAIR_LIMITS[this.controller.level] && (structure.structureType != STRUCTURE_ROAD || structure.hitsMax - structure.hits > 800 )  }), 
                'hits'
            ).forEach(function(struct){
                struct.creeps = [];
                struct.towers = [];
                self.repairableSites.order.push(struct.id);
                self.repairableSites.count++;
                self.repairableSites[struct.id] = struct;
                if( struct.hits < LIMIT_CREEP_REPAIRING || struct.structureType in coreStructures ){
                    self.creepRepairableSites.order.push(struct.id);
                    self.creepRepairableSites.count++;
                    self.creepRepairableSites[struct.id] = struct;
                }
            });
            
            this.maxPerJob = _.max([1,(self.population && self.population.worker ? self.population.worker.count : 0)/3.1]);
            
            // Towers
            _.sortBy(this.find(FIND_MY_STRUCTURES, {
                filter: {structureType: STRUCTURE_TOWER}
            }), function(o) { 
                return o.energy; 
            }).forEach(function(struct){
                self.towers.push(struct);
                self.towerFreeCapacity += (struct.energyCapacity - struct.energy);
            });

            // Spawns
            this.spawns = this.find(FIND_MY_SPAWNS);
            
            // Hostiles
            this.hostiles = this.find(FIND_HOSTILE_CREEPS);
            this.hostileIds = _.map(this.hostiles, 'id');
            this.hostilesHeal = this.find(FIND_HOSTILE_CREEPS, {
                filter: function(hostile) { 
                    return _.some( hostile.body, {'type': HEAL} );
                }
            });
            
            // storage
            if(this.storage && this.storage.store){
                this.storage.sum = _.sum(this.storage.store);
            }

            // Situation
            this.situation = {
                noEnergy: self.sourceEnergyAvailable == 0, 
                invasion: false
            }
            
            if( this.controller.my && this.memory.hostileIds ){
                this.situation.invasion = this.hostiles.length > 0;
                this.hostileIds.forEach( function(id){
                    if( !self.memory.hostileIds.includes(id) ){
                        var creep = Game.getObjectById(id);
                        var message = 'Hostile intruder ' + id + ' (' + creep.body.length + ' body parts) from "' + (creep.owner && creep.owner.username ? creep.owner.username : 'unknown') + '" in room ' + self.name + ' at ' + Game.time + ' ticks.'
                        Game.notify(message, INTRUDER_REPORT_DELAY);
                        console.log(message);
                    }
                });
                this.memory.hostileIds.forEach( function(id){
                    if( !self.hostileIds.includes(id) ){
                        var message = 'Hostile intruder ' + id  + ' gone at ' + Game.time + ' ticks.'; 
                        Game.notify(message, INTRUDER_REPORT_DELAY);
                        console.log(message);
                    }
                });
            }
            this.memory.hostileIds = this.hostileIds;
            
            if( Game.time % TIME_REPORT == 0 ) {
                this.sendReport(true);
                this.memory.report = {
                    tick: Game.time, 
                    time: new Date(Date.now() + 7200000).getTime(),
                    store: this.storage ? this.storage.store : null, 
                    controllerProgress: this.controller.progress, 
                    controllerProgressTotal: this.controller.progressTotal
                };
            }
        };
        

        Object.defineProperty(Creep.prototype, 'behaviour', {
            configurable: true,
            get: function() {
                if(this.memory.setup) {
                    return MODULES.creep.behaviour[this.memory.setup];
                }
                return null;
            }
        });
        
        Creep.prototype.run = function(behaviour){
            if( !this.spawning ){
                if(!behaviour) behaviour = this.behaviour;
                if( behaviour ) behaviour.run(this);
            }
        };

        Creep.prototype.unregisterTarget = function(){   
            var target = this.target;
            // unassign
            this.target = null;
            this.memory.target = null;
            this.memory.targetAssignmentTime = null;
            // unregister
            if( !this.memory.setup || !target) return;   
            if( !target.creeps ) return;
            if( !target.creeps[this.memory.setup] ) return;
            if( !target.creeps[this.memory.setup].includes(this.name) ) return;

            target.creeps[this.memory.setup].splice(target.creeps[this.memory.setup].indexOf(this.name), 1);
        };
        Creep.prototype.registerTarget = function(target){ 
            //if( !target ) console.log(JSON.stringify(this.memory));
            //precondition 
            if( target == null ) return;
            //unregister
            var targetId = target.id || target.name;
            //if( !targetId ) console.log(JSON.stringify(this.memory));
            if( this.target != target || this.memory.target != targetId)
                this.unregisterTarget();
            //assign
            this.target = target;
            this.memory.targetAssignmentTime = Game.time;
            this.memory.target = targetId;
            //register
            if( !this.memory.setup ) return;   
            if( !target.creeps ) {
                target.creeps = {};
            }
            if( !target.creeps[this.memory.setup] ){
                target.creeps[this.memory.setup] = [];
            }
            if( !target.creeps[this.memory.setup].includes(this.name) ) 
                target.creeps[this.memory.setup].push(this.name);
        };       
    }
}

module.exports = mod;