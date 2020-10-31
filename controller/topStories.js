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

exports.pushtopStories = async (req, res) => {
  const bbc = req.body.bbc;
  const toi = req.body.toi;
  const wsj = req.body.wsj;
  // console.log(req.body.data);
  const d = new Date();
  const date = d.toLocaleDateString();

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
            { wsj: wsj },
            async (err, resp) => {
              err && console.log(err);
              resp && console.log(resp);
            }
          );
        }
        else if (bbc) {
          await topStories.findByIdAndUpdate(
            { _id: id },
            { bbc: bbc },
            async (err, resp) => {
              err && console.log(err);
              resp && console.log(resp);
            }
          );
        }
        else if (toi) {
          await topStories.findByIdAndUpdate(
            { _id: id },
            { toi: toi },
            async (err, resp) => {
              err && console.log(err);
              resp && console.log(resp);
            }
          );
        }
        

        console.log("responce");
      } else {
        await topStories.create({ date: date, bbc,toi,wsj }, (err, responce) => {
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