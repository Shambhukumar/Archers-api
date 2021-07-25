const User = require("../model/user");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
// const jwt = require("express-jwt");



exports.createUser = async(req,res)=>{

    const data = req.body.data;

// converting plain password into hash using bcrypt
     const user = new User(data);
     const salt = await bcrypt.genSalt(10);
     user.password = await bcrypt.hash(user.password, salt);


    User.create(user,(err,resp)=>{
        if (err) {
            console.log(err);
            if(err.code && (err.code = 11000)){
                return res.status(409).json({
                    status: "fail",
                    message: "Account already Created with this email Address",
                  });
            }else{
                return res.status(400).json({
                    status: "fail",
                    message: "Sorre Something Went Wrong",
                    error: err.message
                  });
            }
            
          }
          if (resp) {
            console.log(resp);
            res.status(200).json({
              status: "success",
              data: {
                user: resp,
              },
            });
          }

    })
}

exports.login = (req,res)=>{
    const {email, password} = req.body.data;
    // console.log(req.body.data.email)
    if(!email || !password){
        return res.status(401).json({
            status: "fails",
            message: "Please provide your email and password"
        })
    }
    User.find({email},async(err,resp)=>{
        if(err){
            console.log(err)
            return res.status(400).json({
                status: "fails",
                message: err.message
            })
        }
        if(resp){
            if(resp.length === 0){
                return res.status(403).json({
                    status: "success",
                    message: "Sorry eather your email or password is wrong"
                })
            }

            // validating the password by comparing with bcrypt
             ;
            
            const PasswordValidator = await bcrypt.compare(password, resp[0].password)
            if(PasswordValidator){

                resp[0].password = undefined;
                const token = jsonwebtoken.sign({data: resp}, process.env.ACCESS_TOKEN_SECRET)
                console.log(token)
                res.cookie('token', token, { httpOnly: true });
                return res.status(200).json({
                    status: "success",
                    message: "User logged in succesfully" 
                })

            }else{
                return res.status(403).json({
                    status: "success",
                    message: "Sorry eather your email or password is wrong"
                })
            }
           
        }
    })

}

exports.logout = (req,res) =>{
    console.log("working")
    res.clearCookie("token","check",{ httpOnly: true })
    return res.status(202).json({
        status: "success",
        message: "user logged out"
    })
}

exports.getUser = async(req,res)=>{

    const {name, Category, password,email} = req.body.data;

    await User.find({}, (err,resp)=>{
        if (err) {
            console.log(err);
            return res.status(400).json({
              status: "fail",
              message: "Sorre Something Went Wrong",
              err: err.message
            });
          }
          if (resp) {
            console.log(resp);
            res.status(200).json({
              status: "success",
              data: {
                user: resp,
              },
            });
          }

    })

}