const express = require("express")
const app = express();
const port = 4000;
const cors = require("cors");
require("dotenv").config();
const user = require("./controller/user");
const webscraping = require("./controller/webscraping")
const topStories = require("./controller/topStories");
app.use(cors())
app.use(express.json());


const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE, {useNewUrlParser: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
 console.log("Connected To the DataBase")
});

setInterval(webscraping.dataFatch, 25 * 60 * 1000);

app.post("/",user.createUser)
app.post("/login",user.loginUser)
app.get("/data",webscraping.dataFatch)
app.post("/topstories",topStories.pushtopStories);
app.post("/getdata",user.authenticateUserToken,topStories.getallStories);



app.listen(process.env.PORT || port,()=>{
  console.log(`Server is Running on PORT: ${port}`)
})