const express = require("express")
const session = require("express-session");
const app = express();
const port = 4000;
const cors = require("cors");
require("dotenv").config();
const NewsRouter = require("./router/newsRoute");
const UserRouter = require("./router/userRoute");
const NewsScraper = require("./NewsScraper");


// const user = require("./controller/user");
// const webscraping = require("./webscraping")
// const News = require("./controller/News");
// app.options("*",cors())
app.use(session({
  name: "random_session",
  secret: "yryGGeugidx34otGDuSF5sD9R8g0Gü3r8",
  resave: false,
  saveUninitialized: true,
  cookie: {
      path: "/",
      secure: true,
      //domain: ".herokuapp.com", REMOVE THIS HELPED ME (I dont use a domain anymore)
      httpOnly: true
  }
}))

app.use(express.json({limit: "10MB"}));
app.use(cors({
  origin: true,
  methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
  credentials: true
}));


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
NewsScraper.init();
setInterval(NewsScraper.init, 30 * 60 * 1000);
app.use("/news",NewsRouter);
app.use("/user",UserRouter)




app.listen(process.env.PORT || port,()=>{
  // News.pushNews();
  console.log(`Server is Running on PORT: ${port}`)
})