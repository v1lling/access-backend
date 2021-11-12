const getCurrentPeopleCount =  function(roomId) {
    return new Promise(async (resolve, reject) => {
       
        var peoplecount = await accessDb.collection('checkins').find({roomId: roomId, checkin: {$lt: new Date()},checkout: { $gte: new Date()}}).toArray();
        resolve(peoplecount.length);
    });
}


module.exports = {
    getCurrentPeopleCount
}