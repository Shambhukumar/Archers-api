const mongoose = require('mongoose');
const topStoriesSchema = new mongoose.Schema({
  date: {type: String, default: Date.now},
  wsj: {type: Object},
  toi: {type: Object},
  bbc: {type: Object},
})


module.exports = mongoose.model("topStories",topStoriesSchema)
