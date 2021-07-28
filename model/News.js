const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
        Category: {type: String, unique:false},
        date: {type: String},
        CNN: {type: Array, unique:false, default: undefined},
        NYT: {type: Array, unique:false, default: undefined},
        BBC: {type: Array, unique:false, default: undefined},
        Guardian: {type: Array, unique:false, default: undefined},
        time: {type: String}
    
})

module.exports = mongoose.model('News', newsSchema);
