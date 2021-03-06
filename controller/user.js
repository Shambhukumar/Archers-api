const User = require("../model/user");
const Utility = require("../services/utility");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  //checking if password and confirm password same
  if (req.body.password !== req.body.conformPassowrd) {
    return res.status(401).json({
      status: "Error",
      message: "Password and Confirm Password Should be the Same",
    });
  }
  const check = {
    email: req.body.email.toLowerCase(),
  };

  console.log(req.body.email);
  try {
    //checking if email already existed in database
    User.findOne(check,(err, responce) => {
      if (err) {
        console.log("Error", err);
        return res.status(400).json({
          status: "fail",
          message: "Sorre Something Went Wrong",
          err,
        });
      } else if (responce) {
        //sending error if email already there
        console.log("Response", responce);
        return res.status(403).json({
          status: "Success",
          message: "Email id already Registerd Please use new one",
        });
      } else {
        //using bcrypt to transform password to hash password
        Utility.hash(req.body.password, async (err, hash) => {
          req.body.password = hash;
          const newUser = new User({
            name: req.body.name,
            email: req.body.email.toLowerCase(),
            password: req.body.password,
          });
          //creating new user and saving it in the database
          const newuser = await User.create(newUser, (err, newres) => {
            if (err) {
              console.log(err);
              return res.status(400).json({
                status: "fail",
                message: "Sorre Something Went Wrong",
              });
            }
            if (newres) {
              const accesstoken = jwt.sign(
                { name: newres.name, email: newres.email },
                process.env.ACCESS_TOKEN_SECRET
              );
              //Sending the newres if user is created
              console.log(newres);
              res.status(201).json({
                status: "success",
                data: {
                  user: {
                    name: newres.name,
                    email: newres.email,
                  },
                  accesstoken,
                },
              });
            }
          });
        });
      }
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      status: "fail",
      message: "Sorre Something Went Wrong",
      e,
    });
  }
};

exports.loginUser = (req, res) => {
  try {
    const check = {
      email: req.body.email.toLowerCase(),
    };

    User.findOne(check, (err, responce) => {
      if (err) {
        return res.status(400).json({
          status: "fail",
          message: "error",
          err,
        });
      } else if (responce) {
        Utility.check(req.body.password, responce.password, (error, check) => {
          if (check) {
            //if user logged in send the token to the front end

            const accesstoken = jwt.sign(
              { name: responce.name, email: responce.email },
              process.env.ACCESS_TOKEN_SECRET
            );

            return res.status(200).json({
              status: "Success",
              data: {
                user: {
                  name: responce.name,
                  email: responce.email,
                },
                accesstoken,
              },
            });
          } else if (error) {
            return res.status(400).json({
              status: "error",
              message: "We Are Having a Error",
            });
          } else {
            return res.status(401).json({
              status: "failed",
              message: "Password is Incorrect",
            });
          }
        });
      } else {
        return res.status(404).json({
          status: "fail",
          message: "Email Invalid Please Try Again",
        });
      }
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      status: "fail",
      message: "Sorry, Something Went Wrong",
      e,
    });
  }
};

exports.authenticateUserToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
