const bbc = "https://www.bbc.com";
const TimesOfIndia = "https://timesofindia.indiatimes.com";
const WallStreetJurnal = "https://www.wsj.com/";
const axios = require("axios");
const cheerio = require("cheerio");
const request = require("request");

exports.dataFatch = async (req, res) => {
  try{
    
  let bbccom = [];
  request(bbc, (error, response, html) => {
    if (!error && response.statusCode === 200) {
      const $ = cheerio.load(html);
      const bbcHeadline = $(".module__content > ul > li");
      bbcHeadline.each((e, el) => {
        const jsonparsurl = $(el).find(".delayed-image-load").attr("data-src");
        // if(jsonparsurl.split(":")[0]==="data"){
        //   console.log("base:64")
        // }else{
        //   console.log("working",jsonparsurl)
        // }
        const bbch3 = $(el).find("h3").text();
        const bbctext = $(el).find("h3 a").attr("href");
        const bbcdes = $(el).find("p").text();

        if (jsonparsurl) {
          bbccom.push({
            title: bbch3.replace(/\s+/g, " "),
            link: bbctext
              ? bbctext.startsWith("/")
                ? bbc + bbctext
                : bbctext
              : null,
            description: bbcdes ? bbcdes.replace(/\s+/g, " ") : null,
            image: jsonparsurl,
          });
          // console.log("Heading"+ " "+ bbch3.replace(/\s+/g, " "))
          // console.log("link"+" "+ bbc+bbctext);
          // console.log("description+" "+ bbcdes);
          // console.log("Image ",jsonparsurl.replace("{width}",624));
        }

        // console.log("img", bbcimg)
      });
    }

    axios.post(process.env.APP_BASE_URL+"topstories", {
      bbc: {
        bbcData: {
          TotalCount: bbccom.length,
          bbccom,
        },
      },
    });

    // res.status(200).json({
    //   status: "200",
    //   Data: {
    //       TotalCount: bbccom.length,
    //       data: bbccom

    //   }
    // })
  });

  let WSJTopStories = [];
  request(WallStreetJurnal, (error, response, html) => {
    if (!error && response.statusCode === 200) {
      const $ = cheerio.load(html);
      const WallStreetTopStories = $("article");

      WallStreetTopStories.each((e, el) => {
        const wsdtext = $(el).find("h3").text();
        const wsdlink = $(el).find("h3 a").attr("href");
        
        const wsddes = $(el).find("p").text();

        if (wsddes) {
          // console.log("Text" + " " + wsdtext);
          // console.log("THIS IS THE P TAG =: " + wsddes);
          WSJTopStories.push({ title: wsdtext, link: wsdlink, description: wsddes });
        }
      });
    }

    axios.post(process.env.APP_BASE_URL+"topstories", {
      wsj: {
        WallStreetJurnal: {
          TotalCount: WSJTopStories.length,
          WSJTopStories,
        },
      },
    });

    // console.log(WSJTopStories);
    // res.status(200).json({
    //   status: "200",
    //   Data:  {
    //     TotalCount: WSJTopStories.length,
    //    Heading: WSJTopStories
    //   }
    // })
  });

  let toiTopStories = [{ "Top-Stories": [], "Latest-Stoies": [] }];
  request({url: TimesOfIndia}, (error, response, html) => {
    // if (!error && response.statusCode === 200) {
    //   const $ = cheerio.load(html);
      
    //   const TimesofIndiaTopSotories = $(".contentwrapper");
    //   const k = TimesofIndiaTopSotories.find("figure");
    //   // console.log(k.html())
    //   k.each((e,el)=>{
    //     const link = $(el).find("img");
    //     console.log(link.attr("src"))
    //   })


    //   TimesofIndiaTopSotories.each((e, el) => {
    //     const linkText = $(el).text();
    //     const link = $(el).attr("href");
    //     if (linkText) {
    //       toiTopStories[0]["Latest-Stoies"].push({
    //         title: linkText,
    //         link: TimesOfIndia +link,
    //       });
    //     }
    //   });
    //   const topStories = $(".top-story ul li a");
    //   topStories.each((e, el) => {
    //     const linkText = $(el).text();
    //     const link = $(el).attr("href");
    //     if(linkText){
    //       toiTopStories[0]["Top-Stories"].push({ title: linkText, link: TimesOfIndia +link });
    //     }
        
    //   });
    // }

    // axios.post(process.env.APP_BASE_URL+"topstories", {
    //   toi: {
    //     TheTimesOfIndia: {
    //       TotalCount: toiTopStories[0]["Top-Stories"].length + toiTopStories[0]["Latest-Stoies"].length ,
    //       toiTopStories
    //     },
    //   },
    // });



    // console.log(toiTopStories)
    // res.status(200).json({
    //   status: "200",
    //   Data: {
    //       TotalCount: toiTopStories[0]["Top-Stories"].length + toiTopStories[0]["Latest-Stoies"].length ,
    //       toiTopStories

      // }
    })
  // });
  // axios.get("https://the-archer.herokuapp.com/");
}catch(e){
  console.log(e)
  return res.status(400).json({
    status: "Error",
    message: "There are some Error",
    error: e
  });
}

return res.status(200).json({
  status: "Success",
  message: "Current News Stored Successfully"
});
};
