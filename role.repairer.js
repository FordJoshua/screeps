var roleRepairer = {

	/** @param {Creep} creep **/
	run: function (creep) {

		if (creep.memory.repairing && creep.store[RESOURCE_ENERGY] == 0) {
			creep.memory.repairing = false;
			creep.say('🔄 harvest');
		}
		if (!creep.memory.repairing && creep.store.getFreeCapacity() == 0) {
			creep.memory.repairing = true;
			creep.say('🚧 repair');
		}

		if (creep.memory.repairing) {
			var targets = creep.room.find(FIND_STRUCTURES, {
				filter: (structure) => {
					return ((structure.structureType != STRUCTURE_WALL &&
						structure.structureType != STRUCTURE_RAMPART) && structure.hits < structure.hitsMax);
				}
			});
			targets.sort((a, b) => a - b);

			if (targets.length) {
				if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
					creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
				}
			}
		}
		else {
			var containers = creep.room.find(FIND_STRUCTURES, {
				filter: (structure) => {
					return structure.structureType == STRUCTURE_CONTAINER &&
						structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
				}
			});

			if (containers.length > 0) {
				// console.log('debug repairer')
				var container = creep.pos.findClosestByPath(containers);
				if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(container, { visualizePathStyle: { stroke: '#ffaa00' } });
				}
			}
			else {
				var sources = creep.room.find(FIND_SOURCES);
				var source = creep.pos.findClosestByPath(sources);

				if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
					creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
				}
			}
		}
	}
};

module.exports = roleRepairer;