var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleOnlyHarvester = require('role.onlyHarvester');
var roleCarrier =require('role.carrier');
var roleClaimer =require('role.claimer');
var util = require('util');
var tower =require('tower');

module.exports.loop = function () {
	// 13 36 E54S13 //
	// 43 34 E54S16 下方
	var cupUsedTxt ='tick start: ' +Game.cpu.getUsed();
	
	if (!Memory['unNeedInit']) { //如果 unNeedInit == (false || undefined)
		Memory['unNeedInit'] = true;
	}
	
	//数据初始化
	util.loop();
	tower.loop();
	//遍历creeps
	for(var name in Game.creeps) {
        var creep = Game.creeps[name];
		switch(creep.memory.role){
			case 'harvester':
			roleHarvester.run(creep);
			break;
			case 'upgrader':
			roleUpgrader.run(creep);
			break;
			case 'builder':
			roleBuilder.run(creep);
			break;
			case 'onlyHarvester':
			roleOnlyHarvester.run(creep);
			break;
			case 'carrier':
			roleCarrier.run(creep);
			break;
			case 'claimer':
			roleClaimer.run(creep);
			break;
			//default:
			//break;
		}
    }
	
	cupUsedTxt +='  end creepsView: ' +Game.cpu.getUsed();
	
	////
	//Memory['someData']['claimerNeedCount'] =1;//+Memory['someData']['claimerNeedCount'] 
	//spawn new creep   
	var creepNeedCount =Memory['someData']['builderNeedCount'] +Memory['someData']['onlyHarvesterNeedCount']+Memory['someData']['carrierNeedCount']
	+ Memory['someData']['upgraderNeedCount']  +Memory['someData']['hrvesterNeedCount'] ;
	if (Object.keys(Game.creeps).length < creepNeedCount) {
		
		var harvestersLength = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester').length;
		var upgradersLength = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader').length;
		var buildersLength = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder').length;
		var onlyHarvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'onlyHarvester');
		var carriers = _.filter(Game.creeps, (creep) => creep.memory.role == 'carrier');
		var claimers = _.filter(Game.creeps, (creep) => creep.memory.role == 'claimer');
		var creepType;
		if (harvestersLength < Memory['someData']['hrvesterNeedCount']) {
			creepType =1;//harvester
		}else if( onlyHarvesters.length <Memory['someData']['onlyHarvesterNeedCount']){
			creepType =4;//onlyHarvester
		}else if (carriers.length < Memory['someData']['carrierNeedCount']){
			creepType =5;//carrier
		}else if (upgradersLength < Memory['someData']['upgraderNeedCount']) {
			creepType =2;//upgrader
		}else if (buildersLength < Memory['someData']['builderNeedCount']) {
			creepType =3;//builder
		}else{
			creepType =6;//claimer 
		}
		util.spawnACreepByType(creepType);
		
		
		//util.spawnNewCreep();
	}
	
	cupUsedTxt +='  tick end: ' +Game.cpu.getUsed();
	if(Game.cpu.getUsed() >18){
		console.log(cupUsedTxt);
		console.log('........... warning ... cpu ... used ..............');
	}
    //console.log(Object.keys(Game.creeps).length);
	//console.log(Game.spawns['Spawn1'].room);
}


