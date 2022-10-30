var roleBuilder = {

	/** @param {Creep} creep **/
	run: function (creep) {
		if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
			creep.memory.building = false;
			creep.say('🔄 harvest');
		}

		if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
			creep.memory.building = true;
			creep.say('🚧 build');
		}

		if (creep.memory.building) {
			var targetId = creep.memory.targetId,
				target = Game.getObjectById(targetId);

			// *** TODO: Builders find construction sites in adjacent rooms
			// var remoteSiteId = '635b2f08347a7b57048b8360';
			// creep.memory.targetId = remoteSiteId;
			// target = Game.getObjectById(remoteSiteId);

			// check if the construction site still exists
			if (Game.constructionSites[targetId]) {
				this.build(creep, target);
			}
			else {
				var newTarget = this.findTarget(creep);
				
				// TODO: update structure data 
				
				if (newTarget) {
					this.build(creep, newTarget);
				}
			}
		}
		else {
			this.refill(creep);
		}

	},

	findTarget: (creep) => {
		var target = '',
			targets = creep.room.find(FIND_CONSTRUCTION_SITES),
			targetCount = targets.length;

		if (targetCount > 1) {
			target = creep.pos.findClosestByRange(targets);
			creep.memory.targetId = target.id;
		}
		else if (targetCount === 1) {
			target = targets[0];
			creep.memory.targetId = target.id;
		}

		return target;
	},

	build: (creep, target) => {
		if (creep.build(target) == ERR_NOT_IN_RANGE) {
			creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
		}

	},

	refill: (creep) => {
		var tombstones = creep.room.find(FIND_TOMBSTONES, {
			filter: (ts) => ts.store.getUsedCapacity(RESOURCE_ENERGY) > 0
		});

		if (tombstones.length > 0) {
			var tombstone = creep.pos.findClosestByPath(tombstones);
			if (creep.withdraw(tombstone, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				creep.moveTo(tombstone, { visualizePathStyle: { stroke: '#ffaa00' } });
			}
		}
		else {
			var containers = creep.room.find(FIND_STRUCTURES, {
				filter: (structure) => {
					return structure.structureType == STRUCTURE_CONTAINER &&
						structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
				}
			});

			if (creep.room.storage) {
				containers.push(creep.room.storage)
			}

			if (containers.length > 0) {
				var container = creep.pos.findClosestByPath(containers);
				if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(container, { visualizePathStyle: { stroke: '#ffaa00' } });
				}
			}
			else {
				var sources = creep.room.find(FIND_SOURCES_ACTIVE);
				var source = creep.pos.findClosestByPath(sources);

				if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
					creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
				}
			}
		}

	}
};

module.exports = roleBuilder;