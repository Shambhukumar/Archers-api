const express = require("express")
const User = require("../controller/user");
const router = express.Router();

router.post("/saveUser",User.createUser);
router.get("/getUser", User.getUser);
router.post("/login", User.login);
router.get("/logout",User.logout)


module.exports = router;