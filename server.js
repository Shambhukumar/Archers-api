const express = require("express")
const app = express();
const port = 4000;
const cors = require("cors");
require("dotenv").config();
const user = require("./controller/user");
const webscraping = require("./webscraping")
const topStories = require("./controller/topStories");
app.options("*",cors())
app.use(express.json());
app.use((req,res,next)=>{
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Headers", "Origin, x-Requested-With, Content-Type, Accept")
  next();
});

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE, {useNewUrlParser: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
 console.log("Connected To the DataBase")
});
webscraping.dataFatch();
setInterval(webscraping.dataFatch, 5 * 60 * 1000);

app.post("/signup",user.createUser)
app.post("/login",user.loginUser)
app.get("/data",webscraping.dataFatch)
app.post("/topstories",topStories.pushtopStories);
app.post("/getdata",user.authenticateUserToken,topStories.getallStories);
app.get("/getalldates",topStories.getalldates);



app.listen(process.env.PORT || port,()=>{
  console.log(`Server is Running on PORT: ${port}`)
})