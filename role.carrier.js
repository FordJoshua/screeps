module.exports = {

    /** @param {Creep} creep **/
    run: function (creep) {
        var
            err = 0,
            state = creep.memory.state,
            source = Game.getObjectById(creep.memory.sourceId),
            target = Game.getObjectById(creep.memory.targetId);

        switch (state) {
            case 'pickup':
                err = this.pickup(creep, source);
                break;
            case 'withdraw':
                err = this.withdraw(creep, source);
                break;
            case 'transfer':
                err = this.transfer(creep, target);
                break;
            default:
                break;
        }

        switch (err) {
            case OK:
                break;
            case ERR_NOT_IN_RANGE:
                creep.moveTo(target);
                break;

            default:
                console.log(`Creep ${creep.name} had error ${err} when ${state}ing.`)
                break;
        }

    },
    findSource: function () {
        // find source with energy
        if (!source || source.energy == 0) {
            var sources = creep.room.find(FIND_SOURCES_ACTIVE);
            var source = creep.pos.findClosestByPath(sources);

            // save source.id to memory
            if (source) {
                creep.memory.sourceId = source.id;
            }
        }
    },
    pickup: function (creep, source) {
        creep.say('🔄 refill');
        return creep.withdraw(source, RESOURCE_ENERGY);
    },
    withdraw: function (creep, source) {
        creep.say('🔄 refill');
        return creep.withdraw(source, RESOURCE_ENERGY);

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
        creep.say('⚡ transfer');
    }
}