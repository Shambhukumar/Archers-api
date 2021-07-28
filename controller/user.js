const User = require("../model/user");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");

exports.createUser = async(req,res)=>{
    const data = req.body.data;
// converting plain password into hash using bcrypt
// console.log(data)
const {email, name, password} = data
     const user = new User({name,email,password});
     console.log(user)
     const salt = await bcrypt.genSalt(10);
     user.password = await bcrypt.hash(user.password, salt);
     if(data.password !== data.conformPassowrd){
        return res.status(401).json({
            status: "fail",
            message: "password and confirm password should be same",
          });
     }

     User.create(user,(err,resp)=>{
        if (err) {
            console.log(err);
            if(err.code && (err.code = 11000)){
                return res.status(403).json({
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
            resp.password = undefined;
            const token = jsonwebtoken.sign({data: [resp]}, process.env.ACCESS_TOKEN_SECRET)
            res.cookie('token', token, { httpOnly: true });
            return res.status(200).json({
                status: "success",
                data:{
                    user: resp,
                    Authenticated: true 
                },
                message: "User Signed Up in Succesfully" 
            })
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
                    data:{
                        user: resp,
                        Authenticated: true 
                    },
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
    res.clearCookie("token",{ httpOnly: true })
    return res.status(202).json({
        status: "success",
        message: "user logged out"
    })
}

exports.getUser = async(req,res)=>{
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