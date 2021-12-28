const saveFeedback =  function(feedbackObj) {
    return new Promise(async (resolve, reject) => {
        let checkin = await accessDb.collection('feedback').insertOne(feedbackObj);
        resolve();
    });
}

module.exports = {
    saveFeedback
}