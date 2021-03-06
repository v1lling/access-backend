var express = require('express');
var checkinService = require('../services/checkinService');
var roomService = require('../services/roomService');
var feedbackService = require('../services/feedbackService');
var router = express.Router();

router.put('/checkin', async (req, res) => {
  let checkInObjIsoDate = req.body;
  checkInObjIsoDate["checkin"] = new Date(checkInObjIsoDate["checkin"]);
  checkInObjIsoDate["checkout"] = new Date(checkInObjIsoDate["checkout"]);
  await checkinService.checkin(checkInObjIsoDate);
  let currentUsers = await roomService.getCurrentPeopleCount(req.body.roomId, checkInObjIsoDate["checkin"]);
  res.send({usercount: currentUsers});
});

router.put('/createroom', async (req, res) => {
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

router.put('/feedback', async (req, res) => {
  let feedback = req.body;
  feedback["date"] = new Date();
  await feedbackService.saveFeedback(feedback);
  res.send(200);
});

module.exports = router;