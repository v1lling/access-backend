const createRoom = function(roomId) {
    return new Promise(async (resolve, reject) => {
        let isAlreadyExisting = await getIsRoomExisting(roomId);
        if (!isAlreadyExisting) {
            await accessDb.collection('rooms').insertOne({roomId: roomId});
        }
        resolve();
    });
}

const getIsRoomExisting = function(roomId) {
    return new Promise(async (resolve, reject) => {
        let isExisting = await accessDb.collection('rooms').find({roomId}).count() > 0;
        resolve(isExisting);
    });
}

const getCurrentPeopleCount =  function(roomId, checkin) {
    return new Promise(async (resolve, reject) => { 
        let peoplecount = await accessDb.collection('checkins').find({roomId: roomId, checkin: {$lte: checkin}, checkout: {$gte: checkin}}).toArray();
        resolve(peoplecount.length);
    });
}

module.exports = {
    createRoom,
    getIsRoomExisting,
    getCurrentPeopleCount
}