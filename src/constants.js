/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('constants');
 * mod.thing == 'a thing'; // true
 */

var constants ={};
module.exports =constants;

const constants.creepTypes ={
	harvester: 1,
	upgrader: 2,
	builder: 3,
	onlyHarvester: 4,
	carrier: 5,
	claimer: 6
};
/*
creep.action:
1  harvesting //get energy from the source
2  building  
3  upgrading
4  transfering to spawn and extension  ?? or all energy structures
5  withdrawing  //get energy from an energy structure
6  claiming //get the control of the room 
*/

