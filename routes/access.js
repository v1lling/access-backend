var express = require('express');
var checkinService = require('../services/checkinService');
var roomInfoService = require('../services/roomInfoService');

var router = express.Router();

router.post('/checkin', async (req, res) => {
  var checkInObjIsoDate = req.body;
  checkInObjIsoDate["checkin"] = new Date(checkInObjIsoDate["checkin"]);
  checkInObjIsoDate["checkout"] = new Date(checkInObjIsoDate["checkout"]);
  await checkinService.checkin(checkInObjIsoDate);
  var currentUsers = await roomInfoService.getCurrentPeopleCount(req.body.roomId, checkInObjIsoDate["checkin"]);
  res.send({usercount: currentUsers});
})

router.get('/checkincount', async (req, res) => {
  var checkInObjIsoDate = req.query.roomId;
  checkInObjIsoDate["checkin"] = new Date(checkInObjIsoDate["checkin"]);
  checkInObjIsoDate["checkout"] = new Date(checkInObjIsoDate["checkout"]);
  var currentUsers = await roomInfoService.getCurrentPeopleCount(req.body.roomId, checkInObjIsoDate["checkin"]);
  res.send({usercount: currentUsers});
})

module.exports = router;