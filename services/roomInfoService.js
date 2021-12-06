const getCurrentPeopleCount =  function(roomId, checkin) {
    return new Promise(async (resolve, reject) => { 
        var peoplecount = await accessDb.collection('checkins').find({roomId: roomId, checkin: {$lte: checkin}, checkout: {$gte: checkin}}).toArray();
        resolve(peoplecount.length);
    });
}


module.exports = {
    getCurrentPeopleCount
}