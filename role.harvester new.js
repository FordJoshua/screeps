module.exports = {

    /** @param {Creep} creep **/
    run: function (creep) {
        // Harvest if not full
        if (creep.store.getFreeCapacity() > 0) {
            var source = Game.getObjectById(creep.memory.sourceId);

            // forget last target
            creep.memory.targetId = '';

            // find source with energy
            if (!source || source.energy == 0) {
                const
                    sources = creep.room.find(FIND_SOURCES_ACTIVE),
                    sourceCount = sources.length;

                if (sourceCount > 1) {
                    source = creep.pos.findClosestByPath(sources);
                }
                else if (sourceCount === 1) {
                    source = sources[0];
                }
                else {
                    // do closest work
                }

                // save source.id to memory
                if (source) {
                    creep.memory.sourceId = source.id;
                }
            }

            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
            else {
                var sourceContainer = source.pos.findInRange
            }
        }
        else {
            // what to do when full

        }


    },

    putAwayEnergy: function () {
        var target = Game.getObjectById(creep.memory.targetId);

        // forget last source
        creep.memory.sourceId = '';

        // find target with 
        if (!target || target.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_CONTAINER ||
                        structure.structureType == STRUCTURE_TOWER) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if (targets.length > 0) {
                target = creep.pos.findClosestByPath(targets);
            }
            else {
                var containers = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_CONTAINER &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                });

                if (containers.length > 0) {
                    target = creep.pos.findClosestByPath(containers);
                }
                else if (creep.room.storage) {
                    target = creep.room.storage;
                }
            }
        }
        
        // save target to memory
        if (target) {
            creep.memory.targetId = target.id;
        }

        if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
        }
    }
}