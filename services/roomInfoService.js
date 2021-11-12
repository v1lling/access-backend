const getCurrentPeopleCount =  function(roomId) {
    return new Promise(async (resolve, reject) => {
        peoplecount = await accessDb.collection('checkins').find({genres: { "$in" : genres}}).toArray();
        resolve();
    });
}


module.exports = {
    getCurrentPeopleCount
}