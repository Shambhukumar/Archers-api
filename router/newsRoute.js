const express = require("express");
const jwt = require("express-jwt");
const News = require("../controller/News");
const cookieparser = require("cookie-parser");
const router = express.Router();


router.post('/saveNews', News.saveNews);
router.use(cookieparser());
// router.use(jwt({secret: process.env.ACCESS_TOKEN_SECRET, getToken:req => req.cookies.token,algorithms: ['HS256']}))
router.get('/getNews', News.getNewsWithFilters);
router.get("/category", News.getAllCategories);

module.exports = router;