var express = require('express');
var checkinService = require('../services/checkinService');
var roomInfoService = require('../services/roomInfoService');

var router = express.Router();

router.post('/checkin', async (req, res) => {
  console.log(req.body);
  var checkInObjIsoDate = req.body;
  checkInObjIsoDate["checkin"] = IsoDate(checkInObjIsoDate["checkin"]);
  checkInObjIsoDate["checkout"] = IsoDate(checkInObjIsoDate["checkout"]);
  playlist = await checkinService.checkin(checkInObjIsoDate);
  currentUsers = await roomInfoService.getCurrentPeopleCount(req.body.roomId);
  res.sendStatus(200);
})

module.exports = router;