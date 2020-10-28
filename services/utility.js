const bcrypt = require("bcrypt");

module.exports.hash = async(password,callback)=>{
  bcrypt.hash(password, 10, function(err, hash) {
    callback(err,hash);
  })
}

module.exports.check = async (password, hash, callback)=>{
  bcrypt.compare(password,hash,(error,check)=>{
    callback(error,check)
  })
}