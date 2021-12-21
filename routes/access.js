var express = require('express');
var checkinService = require('../services/checkinService');
var roomService = require('../services/roomService');
var router = express.Router();

router.post('/checkin', async (req, res) => {
  let checkInObjIsoDate = req.body;
  checkInObjIsoDate["checkin"] = new Date(checkInObjIsoDate["checkin"]);
  checkInObjIsoDate["checkout"] = new Date(checkInObjIsoDate["checkout"]);
  await checkinService.checkin(checkInObjIsoDate);
  let currentUsers = await roomService.getCurrentPeopleCount(req.body.roomId, checkInObjIsoDate["checkin"]);
  res.send({usercount: currentUsers});
});

router.post('/createroom', async (req, res) => {
  let roomId = req.body['roomId'];
  await roomService.createRoom(roomId);
  res.send(200);
});

router.get('/checkroom', async (req, res) => {
  let roomId = req.query.roomId;
  let isExisting = await roomService.getIsRoomExisting(roomId);
  res.send(isExisting);
})

router.get('/checkincount', async (req, res) => {
  let roomId = req.query.roomId;
  let date = new Date();
  let currentUsers = await roomService.getCurrentPeopleCount(roomId, date);
  res.send({usercount: currentUsers});
}),

module.exports = router;