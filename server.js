const express = require("express")
const app = express();
const port = 4000;
const cors = require("cors");
require("dotenv").config();
const NewsRouter = require("./router/newsRoute");
const UserRouter = require("./router/userRoute");


// const user = require("./controller/user");
// const webscraping = require("./webscraping")
// const News = require("./controller/News");
// app.options("*",cors())
app.use(express.json({limit: "10MB"}));
app.use(cors({
  origin: true,
  methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
  credentials: true
}));
// app.use((req,res,next)=>{
//   res.header("Access-Control-Allow-Origin","*");
//   res.header("Access-Control-Allow-Headers", "Origin, x-Requested-With, Content-Type, Accept")
//   next();
// });

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE, 
  {useNewUrlParser: true,
   useUnifiedTopology: true,
   useCreateIndex: true,
   useFindAndModify: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
 console.log("Connected To the DataBase")
});
// webscraping.dataFatch();
// setInterval(webscraping.dataFatch, 5 * 60 * 1000);

// app.post("/signup",user.createUser)
// app.post("/login",user.loginUser)
// app.get("/data",webscraping.dataFatch)
app.use("/news",NewsRouter);
app.use("/user",UserRouter)
// app.post("/getdata",News.getallStories);
// app.get("/getalldates",News.getalldates);



app.listen(process.env.PORT || port,()=>{
  // News.pushNews();
  console.log(`Server is Running on PORT: ${port}`)
})