
//util
var mod = {};
module.exports = mod;

//数据初始化，每个tick都会执行的
mod.loop =function () {

	if (!Memory['someData']) {
		Memory['someData'] = {};
	}
	/*
	var room;
	for(var prop in Games.rooms){// Classified preservation structure
		room =Games.rooms[prop];
		var structures =room.find(FIND_STRUCTURES);
		for(var i =0, len =structures.length; i<len; i++){
			if(room.memory[structures[i].structureType]){//room.memory.structure.id =id;
				room.memory[structures[i].structureType][structures[i].id] =structures[i].id;
			}else{
				room.memory[structures[i].structureType] ={};
				room.memory[structures[i].structureType][structures[i].id] =structures[i].id;
				if(Memory[structures]){
					
				}else{
					
				}
				
			}
		}
	}
	*/
	Memory['mySources'] = Game.spawns['Spawn1'].room.find(FIND_SOURCES);
	//console.log(JSON.stringify(Memory['mySources']));
	// { creepNeedCount: [{role:'harvester', needCout: 1}, {role: 'onlyHarvester', needCount}] }
	Memory['someData']['onlyHarvesterNeedCount'] = Memory['mySources'].length;
	Memory['someData']['hrvesterNeedCount'] = 1;
	Memory['someData']['builderNeedCount'] = 2;
	Memory['someData']['upgraderNeedCount'] = 1;
	Memory['someData']['carrierNeedCount'] = 1;
	Memory['someData']['claimerNeedCount'] = 1;
	//监控source使用
	if (!Memory['sourceData']) {
		Memory['sourceData'] = [];
		var sources = Game.spawns['Spawn1'].room.find(FIND_SOURCES);
		for (var i = 0, len = sources.length; i < len; i++) {
			var iData = {};
			iData.sourceId = sources[i].id;
			iData.harvesterName = 'non';
			Memory['sourceData'].push(iData);
		}
	}

	//console.log(Memory['sourceData']);
	//console.log(Game.spawns['Spawn1'].room.find(FIND_SOURCES));
	//structureType  resourceProvider  resourceNeeder
	//containerType  resourceProvider  resourceNeeder
	Memory['myContainers'] = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {
			filter: (container) => {
				return (container.structureType == STRUCTURE_CONTAINER);
			}
		});

	//Clear memory
	if (Game.time % 1500 == 0) {
		for (var name in Memory.creeps) {
			if (!Game.creeps[name]) {
				delete Memory.creeps[name];
				console.log('Clearing non-existing creep memory:', name);
			}
		}
	}
};
/*
creep.action:
1  harvesting //get energy from the source
2  building
3  upgrading
4  transfering to spawn and extension  ?? or all energy structures
5  withdrawing  //get energy from an energy structure
 */
//Initialize data 数据初始化，只执行一次，除非有人发起刷新
mod.init =function () {
	if (!Memory['someData']) {
		Memory['someData'] = {};
	}
};
mod.spawnACreepByType =function(creepType) {
	var newName,
	arole,
	newAction,
	bodys,
	data = {};
	switch (creepType) {
	case 1:
		newName = 'Harvester' + Game.time;
		arole = 'harvester';
		newAction = 1; //harvesting
		bodys = this.getNomalBodys(Game.spawns['Spawn1'].room.energyAvailable);
		break;
	case 2:
		newName = 'Upgrader' + Game.time;
		arole = 'upgrader';
		newAction = 5;
		bodys = this.getNomalBodys(Game.spawns['Spawn1'].room.energyAvailable);
		break;
	case 3:
		newName = 'Builder' + Game.time;
		arole = 'builder';
		newAction = 5; //withdrawing
		bodys = this.getNomalBodys(Game.spawns['Spawn1'].room.energyAvailable);
		break;
	case 4:
		newName = 'OnlyHarvester' + Game.time;
		arole = 'onlyHarvester';
		newAction = 1;
		bodys = this.getNomalBodys(Game.spawns['Spawn1'].room.energyAvailable);
		var bodyType = {
			maximum: [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE],
			medium: [WORK, WORK, WORK, WORK, CARRY, MOVE],
			minimum: [WORK, WORK, CARRY, MOVE]
		}
		if (Game.spawns['Spawn1'].room.energyAvailable >= 850) {
			bodys = bodyType.maximum;
		} else if (Game.spawns['Spawn1'].room.energyAvailable >= 500) {
			bodys = bodyType.medium;
		} else {
			bodys = bodyType.minimum;
		}
		//判断他需要采集的资源点  每个source有个属性为 harvesterName 保存采集它的名字creep.name 判断 creep 是否存在 不存在则代替他
		for (var i = 0, len = Memory['sourceData'].length; i < len; i++) {
			if (Memory['sourceData'][i].harvesterName == 'non') {
				Memory['sourceData'][i].harvesterName = newName;
				data = {
					sourceId: Memory['sourceData'][i].sourceId
				};
				break;
			} else {
				var name = Memory['sourceData'][i].harvesterName;
				if (!Game.creeps[name]) {
					Memory['sourceData'][i].harvesterName = newName;
					data = {
						sourceId: Memory['sourceData'][i].sourceId
					};
					break;
				}
			}
		}
		break;
	case 5:
		newName = 'Carrier' + Game.time;
		arole = 'carrier';
		newAction = 5; //withdrawing
		var bodyType = {
			maximum: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], //500
			minimum: [CARRY, CARRY, CARRY, MOVE, MOVE]//250
		}
		if (Game.spawns['Spawn1'].room.energyAvailable >= 500) {
			bodys = bodyType.maximum;
		} else {
			bodys = bodyType.minimum;
		}
		break;
	case 6:
		newName = 'Claimer' + Game.time;
		arole = 'claimer';
		newAction = 6; //claiming
		var bodyType = {
			maximum: [CLAIM, CLAIM, MOVE, MOVE], //1300
			minimum: [CLAIM, MOVE]//650
		}
		if (Game.spawns['Spawn1'].room.energyAvailable >= 1300) {
			bodys = bodyType.maximum;
		} else {
			bodys = bodyType.minimum;
		}
		break;
	}
	//Game.spawns['Spawn1'].spawnCreep(bodys, newName);
	Game.spawns['Spawn1'].spawnCreep(bodys, newName, {
		memory: {
			role: arole,
			action: newAction,
			datas: data
		}
	});
};
//Spawn new creep
mod.getNomalBodys =function (spawnEnergy) {
	if (spawnEnergy >= 800) {
		return [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
	} else if (spawnEnergy >= 600) {
		return [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
	} else if (spawnEnergy >= 400) {
		return [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
	} else {
		return [WORK, CARRY, MOVE];
	}
};
mod.HashTable =function(){ // Custom simple hash table constructor. can be used to save structures or resources information
	var size =0;
	var ebtry = new Object(); //entry(记录)
	this.add =function(key, value){ //if key not in entry, then add it, else update value.
		if(!this.containsKey(key)){
			size++
		}
		entry[key] =value;
	};
	this.getValue =function(key){ //get value by key
		return this.containsKey(key) ? entry[key] : null;
	};
	this.remove =function(key){ //
		if(this.containsKey(key) && (delete entry[key])){
			size--;
		}
	};
	this.containsKey =function(key){
		return (key in entry);
	};
	this.containsValue =function(value){
		for(var prop in entry){
			if(entry[prop] == value){
				return true;
			}
		}
		return false;
	};
	this.contains =function(f){  //
		for(var prop in entry){
			return f(entry[prop]);   //f(object){} obtect in entry
		}
		return false;
	};
	this.filterSingle =function(f){
		for(var prop in entry){
			if(f(entry[prop])){
				return entry[prop];
			}
		}
		return null;
	};
	this.filter =function(f){
		var values =[];
		for(var prop in entry){
			if(f(entry[prop])){
				values.push(entry[prop]);
			}
		}
		return values;
	};
	this.getValues =function(){
		var values =new Array();
		for(var prop in entry){
			values.push(entry[prop]);
		}
		return values;
	};
	this.getKeys =function(){
		var keys =new Array();
		for(var prop in entry){
			keys.push(prop);
		}
		return keys;
	};
	this.getSize =function(){
		return size;
	};
	this.clear =function(){
		size =0;
		entry =new Object();
	};
}
const creepTypes = {
	harvester: 1,
	upgrader: 2,
	builder: 3,
	onlyHarvester: 4,
	carrier: 5
};

mod.isActiveforCreepByName =function(name){
	if(Memory.screeps[name]){
		if(Game.screeps[name]){
			return true;
		}
	}
	return false;
};

mod.SourceInfo =function(info){    //
	this.id =info.id;//Game.findObjectById(sourceInfo.id);
	this.pos =info.pos;// roomName =sourceInfo.pos.roomName
	this.harvesterName =info.harvesterName;
	
}

mod.SourceManager =function(){ //distribution and registration of resources for management
	var sourcesTable =new HashTable();
	this.init =function(rooms){  //(Hash<string,Room>)  FIND_SOURCES  rooms =Game.rooms
		for(var prop in rooms){
			addAll(sourcesTable, rooms[prop].find(FIND_SOURCES));
		}
	};
	this.addAll =function(sources){  //(SourceArray), sources =rooms[prop].find(FIND_SOURCES)
		for(var i=0, len=sources.length; i<len; i++){
			this.add(surces[i]);
		}
	};
	this.add =function(source){    //(Source)
		/*
		var info ={id: source.id, pos: source.pos, harvesterName: 'non'};
		var sourceInfo =new SourceInfo(info);
		sourcesTable.add(source.id, sourceInfo);
		*/
		info ={id: source.id, pos: source.pos, harvesterName: 'non'};//通过JSON创建对象，无法使用类的函数
		sourcesTable.add(source.id, info);
	};
	this.registSource =function(creep){    //Registering Idle Resources  registration
		if(!mod.isActiveforCreepByName(creep.name)){
			return false;
		}
		if(sourcesTable.containsKey(creep.memory.datas.sourceId)){
			return true;
		}
		var sources =sourceTable.getValues();
		for(var i =0, len =sources.length; i<len; i++){
			if(!mod.isActiveforCreepByName(sources[i].harvesterName)){
				
			}
		}
	};
	this.getIdleSource =function()){
		var sourceInfos =sourcesTable.getValues();
		for(var i=0, len =sourceInfos.length; i<len; i++){
			if(!mod.isActiveforCreepByName(sourceInfos[i].harvesterName)){  //idle source 
				
			}
		}
	};
};




















