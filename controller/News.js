const News = require("../model/News");

const UploadDate = () => {
  let t = new Date;
  function format(m) {
    let f = new Intl.DateTimeFormat('en', m);
    return f.format(t);
  }
  let a = [{ day: 'numeric' }, { month: 'short' }, { year: 'numeric' }];
  return a.map(format).join("-");
}



exports.saveNews = async (req, res) => {
// data format comming from the request
  // data: {
  //   category: [e],
  //   brodcaster: "NYT",
  //   data: news
  // }

  const {Category, brodcaster, news} = req.body.data

  const date = UploadDate();
  const obj = {
    date,
    Category: Category,
    [brodcaster]: news,

  }
  

  const findObj = {
    Category,
    date
  }

  const UpdateObj = {
    [brodcaster]: news
  }
 
  try {
    News.findOne(findObj, async (err, responce) => {
      if (err) {
        console.log(err);
      }
      if (responce) {
        // console.log(responce)
        const id = responce._id;
        await News.findByIdAndUpdate(
          { _id: id },
          UpdateObj,
          async (err, resp) => {
            if (err) {
              console.log(err);
              return res.status(400).json({
                status: "fail",
                message: "Sorre Something Went Wrong",
              });
            }
            if (resp) {
              // console.log(resp);
              return res.status(200).json({
                status: "Succsecc",
                data: resp,
              });
            }

          }
        );

      } else {
        await News.create(obj, (err, responce) => {
          if (err) {
            console.log(err);
            return res.status(400).json({
              status: "fail",
              message: "Sorre Something Went Wrong",
              err: err.message
            });
          }
          if (responce) {
            console.log(responce);
            res.status(200).json({
              status: "success",
              data: {
                user: responce,
              },
            });
          }
        });
        console.log(obj)
      }
    });
  } catch (e) {
    console.log(e);
  }
};


exports.getNewsWithFilters = (req,res)=>{
  console.log(req.user);
  // Query Format {Category:{$in:["world","politics"]}, date: "22-Jul-2021"}
  // Projection {NYT: 1,BBC:1}

  // ------------------------------- Endpoints geting news result ---------------------------------
  //Sample URL http://localhost:3000/todayNews?Category=["world","politics"]&date=22-Jul-2021&brodcaster={"NYT":1,"BBC":1}
 
  // Result for custom both catagorie and brodcasters
  // /todayNews?Category=["world","politics"]&date=22-Jul-2021&brodcaster={"BBC":1,"NYT":1} 
  // ------
  // Result by brodcasterss with all catagrories
  // /todayNews?&date=22-Jul-2021&brodcaster={"BBC":1,"NYT":1} 
  // -----------------------------------
  // Result by Category with all brodcasters
  // /todayNews?Category=["world","politics"]&date=22-Jul-2021
  // -----------------------------------
  // Result by date with all brodcasters and categories this is default
  // /todayNews?date=22-Jul-2021 
  // -----------------------------------------------------------------


  const query = req.query;
  console.log(query)
  let brodcaster = {}
  const TodayDate = UploadDate();
  if(query.brodcaster){
    brodcaster = JSON.parse(query.brodcaster);
    brodcaster.date = 1;
    brodcaster.Category = 1;
  }

  let Category = {}
  Category.date = query.date ? query.date : TodayDate;
  query.Category && (Category.Category =  {$in: [...JSON.parse(query.Category)]})

  console.log(Category);

  //finding new by categories and by projection's
  News.find({...Category},{...brodcaster}, (err,resp)=>{
    if(err){
      return res.status(400).json({
        status: "fail",
        message: "Something went Wrong",
        error: err.message
      })
    }else{
      return res.status(200).json({
        status: "Succsess",
        data: resp
      })
    }
  })
}