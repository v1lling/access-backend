var express = require('express');
var checkinService = require('../services/checkinService');
var roomInfoService = require('../services/roomInfoService');

var router = express.Router();

router.post('/checkin', async (req, res) => {
  console.log(req.body);
  var checkInObjIsoDate = req.body;
  checkInObjIsoDate["checkin"] = new Date(checkInObjIsoDate["checkin"]);
  checkInObjIsoDate["checkout"] = new Date(checkInObjIsoDate["checkout"]);
  var checkin = await checkinService.checkin(checkInObjIsoDate);
  var currentUsers = await roomInfoService.getCurrentPeopleCount(req.body.roomId);
  console.log("current : " + currentUsers);
  res.send({usercount: currentUsers});
})

module.exports = router;