var express = require('express');
var checkinService = require('../services/checkinService');

var router = express.Router();

router.post('/checkin', async (req, res) => {
  console.log(req.body);
// playlist = await checkinService.checkin(req.body.userinfo);
  res.sendStatus(200);
})

module.exports = router;