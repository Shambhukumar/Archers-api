const express = require("express");
const News = require("../controller/News");
const router = express.Router();


router.post('/saveNews', News.saveNews);
router.get('/getNews', News.getNewsWithFilters);

module.exports = router;