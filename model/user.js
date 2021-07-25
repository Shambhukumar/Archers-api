const mongoose = require("mongoose");


const userschema = new mongoose.Schema({
        name: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        Category: {type: Array, required: [true, "Please Provide your email address"], default: undefined},
        brodcaster:{type: Object, required: false},
        password:{type: String, required: true}

})

module.exports = mongoose.model("user", userschema)