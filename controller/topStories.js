const topStories = require("../model/topStories");




exports.getallStories = async (req,res) =>{

const date = req.body.date;
console.log(date)
topStories.findOne({ date: date }, async (err, responce)=>{
  if(err){
    res.status(400).json({
      status: "fail",
      message: "something went wrong"
    })
  }

  if(responce){
    res.status(200).json({
      status: "Success",
      data: responce
    })
  }
})

}

exports.getalldates = async (req,res) =>{

  // const date = req.body.date;
  // console.log(date)
  // db.topstories.find({},{date:1})
  try{
  topStories.find({},{date:1}, async (err, responce)=>{
    if(err){
      res.status(400).json({
        status: "fail",
        message: "something went wrong"
      })
    }
  
    if(responce){
      res.status(200).json({
        status: "Success",
        data: responce
      })
    }
  })
}catch(e){
  console.log(e)
}
  
  }



exports.pushtopStories = async (req, res) => {
  const bbc = req.body.bbc;
  const toi = req.body.toi;
  const wsj = req.body.wsj;
  const d = new Date();

  const currentTime = new Date();
  const currentOffset = currentTime.getTimezoneOffset();
  const ISTOffset = 330; 
  const ISTTime = new Date(currentTime.getTime() + (ISTOffset + currentOffset)*60000);
  const date = d.toLocaleDateString();
        const dates = date.split("/");
        const s = dates.map((e,el)=>{
          if(e.length < 2) {
           return "0"+e
            }else{
             return e
            } 
        })
       
   


  try {
    topStories.findOne({ date: date }, async (err, responce) => {
      if (err) {
        console.log(err);
      }
      if (responce) {
        const id = responce._id;
       
        if (wsj) {
          await topStories.findByIdAndUpdate(
            { _id: id },
            { wsj: wsj, Updated_At: ISTTime},
            
            async (err, resp) => {
              err && console.log(err);
              resp && console.log(resp);
            }
          );
        }
        else if (bbc) {
          await topStories.findByIdAndUpdate(
            { _id: id },
            { bbc: bbc, Updated_At: ISTTime },
            async (err, resp) => {
              err && console.log(err);
              resp && console.log(resp);
            }
          );
        }
        else if (toi) {
          await topStories.findByIdAndUpdate(
            { _id: id },
            { toi: toi, Updated_At: ISTTime },
            async (err, resp) => {
              err && console.log(err);
              resp && console.log(resp);
            }
          );
        }
        

        console.log("responce");
      } else {
        await topStories.create({ Updated_At: ISTTime,date: date, bbc,toi,wsj }, (err, responce) => {
          if (err) {
            console.log(err);
            return res.status(400).json({
              status: "fail",
              message: "Sorre Something Went Wrong",
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
      }
    });
  } catch (e) {
    console.log(e);
  }

  //
};
