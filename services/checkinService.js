const checkin =  function(checkinObj) {
    return new Promise(async (resolve, reject) => {
        let checkin = await accessDb.collection('checkins').insertOne(checkinObj);
        resolve();
    });
}


module.exports = {
    checkin
}