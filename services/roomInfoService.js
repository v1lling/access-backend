const getCurrentPeopleCount =  function(roomId) {
    return new Promise(async (resolve, reject) => {
       
        var peoplecount = await accessDb.collection('checkins').find({checkin: {$lt: new Date()},checkout: { $gte: new Date()}}).toArray();
        console.log(peoplecount);
        // > db.checkins.findOne({checkin: {$lt: new Date()},checkout: { $gte: new Date()}})
        resolve(peoplecount.length);
    });
}


module.exports = {
    getCurrentPeopleCount
}