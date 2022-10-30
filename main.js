var roles = {
    carrier: require('./role.carrier'),
    harvester: require('./role.harvester'),
    upgrader: require('./role.upgrader'),
    builder: require('./role.builder'),
    repairer: require('./role.repairer')
}

// TODO: memHack
// TODO: Room Manager
// TODO: Structure Manager

module.exports.loop = function () {
    const ALL_CREEPS = Game.creeps;

    // TODO: move to spawn.spawnNextCreep() also add spawnHarvester(), spawnWorker() 
    //      and spawnCreepByRole(role) methods that will build bigger creeps automatically.
    // **************   AutoSpawn   *******************
    for (const key in Game.spawns) {

        const
            CREEP_ID = Game.time,
            SPAWN = Game.spawns[key],
            ROOM = SPAWN.room,
            ROOM_CREEPS = _.filter(ALL_CREEPS, (creep) => creep.room.name === ROOM.name),
            BODY = {
                'harvesterSmallBody': [MOVE, MOVE, CARRY, WORK],
                'harvesterBigBody': [MOVE, MOVE, CARRY, WORK],
                'workerBody': [WORK, CARRY, MOVE, MOVE]
            },
            CREEPS_NEEDED = {
                'harvester': 4,
                'upgrader': 3,
                'repairer': 2,
                'builder': 6

            };

        var
            harvesters = _.filter(ROOM_CREEPS, (creep) => creep.memory.role == 'harvester'),
            harvesterCount = harvesters.length,
            newCreep = "",
            newName = '',
            role = "",
            body = [];

        // console.log(SPAWN.name)
        // spawn harvesters first then rest of worker creeps
        // console.log('Harvesters: ' + harvesters.length);


        if (!SPAWN.spawning) {
            role = 'harvester';
            if (harvesterCount < CREEPS_NEEDED[role]) {


                // cold restart colony
                const ROOM_ENERGY_NOT_FULL = ROOM.energyAvailable < ROOM.energyCapacityAvailable;
                if (harvesterCount < 2 && (ROOM_ENERGY_NOT_FULL || ROOM.energyAvailable <= 300)) {
                    newName = 'h' + CREEP_ID;
                    body = BODY['harvesterSmallBody'];
                }
                else {
                    newName = 'H' + CREEP_ID;
                    body = BODY['harvesterBigBody'];
                }

            }
            else {
                body = BODY['workerBody'];

                var upgraders = _.filter(ROOM_CREEPS, (creep) => creep.memory.role == 'upgrader');
                role = 'upgrader';

                if (upgraders.length < CREEPS_NEEDED[role]) {
                    newName = 'U' + CREEP_ID;
                }
                else {
                    const
                        REPAIRERS = _.filter(ROOM_CREEPS, (creep) => creep.memory.role == 'repairer'),
                        REPAIR_SITES = ROOM.find(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return ((structure.structureType != STRUCTURE_WALL &&
                                    structure.structureType != STRUCTURE_RAMPART) && structure.hits < structure.hitsMax);
                            }
                        });

                    role = 'repairer';
                    if (REPAIR_SITES.length > 0 && REPAIRERS.length < CREEPS_NEEDED[role]) {
                        newName = 'R' + CREEP_ID;
                    }
                    else {

                        const
                            BUILDERS = _.filter(ROOM_CREEPS, (creep) => creep.memory.role == 'builder'),
                            SITES = ROOM.find(FIND_CONSTRUCTION_SITES)

                        role = 'builder'
                        if (SITES.length > 0 && BUILDERS.length < CREEPS_NEEDED[role]) {
                            newName = 'B' + CREEP_ID;
                        }
                    }
                }
            }

            // console.log(JSON.stringify(newName));

            if (newName) {
                newCreep = SPAWN.spawnCreep(body, "testCreep", { dryRun: true }) == 0;
            }
            if (newCreep) {
                if (!SPAWN.spawning) {
                    console.log(`${SPAWN.name} is spawning new ${role}: ${newName}`);
                }
                SPAWN.spawnCreep(body, newName,
                    { memory: { role: role } });
            }

        } else {
            var spawningCreep = ALL_CREEPS[SPAWN.spawning.name];
            SPAWN.room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                SPAWN.pos.x + 1,
                SPAWN.pos.y,
                { align: 'left', opacity: 0.8 });

        }
    }

// TODO: move to Creep Manager
    // Manage creeps
    for (const name in Memory.creeps) {
        const creep = Game.creeps[name]

        // console.log(JSON.stringify(name))


        // Memory Cleanup
        if (!creep) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);

            continue;
        }

        // skip spawning creeps
        if (creep.spawning) continue;

        // TODO: create claimer role that auto-claims rooms
        if (creep.name === 'claimer') {
            const
                roomToClaim = 'W9S12',
                targetRoom = new RoomPosition(25, 25, roomToClaim);

            if (creep.room.name !== roomToClaim) {
                creep.moveTo(targetRoom, { reusePath: 50 })
            }
            else {
                let target = creep.room.controller;

                if (creep.claimController(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }

            }

            continue;
        }

        // run creep role
        roles[creep.memory.role].run(creep);
    }

    // generate pixels
    if(Game.cpu.bucket == 10000) {
        Game.cpu.generatePixel();
        console.log("Pixel Generated")
    }
}