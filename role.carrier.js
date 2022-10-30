module.exports = {

    /** @param {Creep} creep **/
    run: function (creep) {
        var err = 0;
        
        switch (creep.memory.state) {
            case 'pickup':
                err = this.pickup();
                break;
            case 'withdraw':
                err = this.withdraw();
                break;
            case 'transfer':
                err = this.transfer();
                break;
            default:
                break;
        }

        switch (err) {
            case value:
                
                break;
        
            default:
                break;
        }




        // when empty stop REFILL
        if (creep.memory.transfering && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.transfering = false;
            creep.say('🔄 refill');
        }



        // when full go back to transfering
        if (!creep.memory.transfering && creep.store.getFreeCapacity() == 0) {
            creep.memory.transfering = true;
            creep.say('⚡ transfer');
        }

        if (!creep.memory.transfering) {
            var source = Game.getObjectById(creep.memory.sourceId);

            // forget last target
            creep.memory.targetId = '';

            // find source with energy
            if (!source || source.energy == 0) {
                var sources = creep.room.find(FIND_SOURCES_ACTIVE);
                var source = creep.pos.findClosestByPath(sources);

                // save source.id to memory
                if (source) {
                    creep.memory.sourceId = source.id;
                }
            }
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
        else {


        }
    },
    findSource: function () {

    },
    refill: function () {

    },
    findTarget: function () {
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













        var target = Game.getObjectById(creep.memory.targetId);

        // forget last source
        creep.memory.sourceId = '';


        // save target to memory
        if (target) {
            creep.memory.targetId = target.id;
        }

    },
    transfer: function () {
        var target = Game.getObjectById(creep.memory.targetId);

        // find target with 
        if (!target || target.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
            this.findTarget();
        } else {
            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
    }
}