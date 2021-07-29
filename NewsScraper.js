const puppeteer = require("puppeteer");
const chalk = require("chalk");
const axios = require("axios");
const error = chalk.bold.red;
const fs = require("fs")
const headlessStatus = true;
const Categories = ["home","world","politics","coronavirus","business","sports","health","travel","technology","food","asia", "uk"];
// const Categories = ["travel"];
exports.init = async()=>{
    for(let i=0; i<Categories.length;i++){
        await BBC(Categories[i])
        await Gurdian(Categories[i])
        await NYT(Categories[i])
        await CNN(Categories[i])
        console.log("Process fineshed")
    }
}

const BBC = async(e) => {
    console.log("Inside BBC")
    try {
    let url = `https://www.bbc.com/${e}`;
    if(e === "home"){
        url = `https://www.bbc.com/news`
    }
    else if(e== "uk"){
        url =`https://www.bbc.com/news/uk`
    }
        var browser = await puppeteer.launch({ headless: headlessStatus, args: ['--no-sandbox','--disable-setuid-sandbox',  "--incognito",
        "--no-sandbox",
        "--single-process",
        "--no-zygote"]  })
        var page = await browser.newPage();
        // await page.setDefaultNavigationTimeout(0); 
        await page.goto(url)
        // await page.waitForSelector("img")
        const CurrentCategory = e;
        const news = await page.evaluate((CurrentCategory) => {
            const middlebbc = document.querySelectorAll('.gs-c-promo');
            const list = Array.from(middlebbc);
            const filterddata = [];
            list.map((e, el) => {

                const anchor_text = e.querySelector("a").querySelector("h3").textContent;
                const anchor = e.querySelector("a").href;
                console.log(e.querySelector("a").querySelector("h3").textContent)
                const currDivItem = {}
                // console.log(e.querySelector("img").getAttribute("data-src"))
                if (e.querySelector("img")) {
                    if (e.querySelector("p")) {
                        currDivItem.pragraphText = e.querySelector("p").textContent;

                    }
                    if(e.querySelector("img").getAttribute("data-src")){
                        currDivItem.Image = e.querySelector("img").getAttribute("data-src");
                        anchor ? currDivItem.anchorLink = anchor : null;
                        e.querySelector("time") ? currDivItem.uploadTime = e.querySelector("time").dateTime : null;
                        anchor_text ? currDivItem.anchorText = anchor_text : null;
                        currDivItem.category = CurrentCategory;
                        currDivItem.brodcaster = "BBC"
    
                        let duplicate = false;
    
                        if(filterddata.length == 0){
                            filterddata.push(currDivItem)
                        }
                        filterddata.forEach((element,el)=>{
                           if(element.anchorLink === anchor){
                            duplicate = true
                           }
                        })
                        if(!duplicate){
                            filterddata.push(currDivItem);
                        }
                    }
    
                    }
                   

            })
            console.log(filterddata);
            return filterddata;

        },CurrentCategory)

        console.log("browser Closed");
        await browser.close()
        // console.log(news);
        if(news.length > 1){
           await axios.post(process.env.APP_BASE_URL+`saveNews`, {
                data: {
                    Category: e,
                    brodcaster: "BBC",
                    news
                }
                

            })
        }else{
            return null;
        }
        
        // await browser.close()

    } catch (e) {
        console.log(error(e));
        await browser.close();
        console.log(error("Browser Closed"))
    }
 }

const Gurdian = async(e)=>{
    console.log("Inside Guardian")
    let url = `https://www.theguardian.com/${e}`;
    if(e === "sports"){
        url = "https://www.theguardian.com/sport"
    }
    else if(e === "home"){
        url = `https://www.theguardian.com/`
    }
    else if(e === "asia"){
        url = `https://www.theguardian.com/world/asia`
    }
    try {
        var browser = await puppeteer.launch({ headless: headlessStatus, args: ['--no-sandbox','--disable-setuid-sandbox',  "--incognito",
        "--no-sandbox",
        "--single-process",
        "--no-zygote"] })
        var page = await browser.newPage();
        // await page.setDefaultNavigationTimeout(0); 
        await page.goto(url)
        // await page.waitForSelector("img")
        const CurrentCategory = e;
        const news = await page.evaluate((CurrentCategory) => {


            const list = document.querySelectorAll('li');
            //conveting node list into array
            const arrayList = Array.from(list);
            const FilterdNews = [];

            arrayList.map((element, el) => {
                const img = element.querySelector("img");
                const anchor = element.querySelector("a")
                const AllNews = {};
                if (img && anchor) {
                    const anchorText = element.querySelector("a").innerText;
                    const anchorLink = element.querySelector("a").href;
                    const paragraph = element.querySelector(".fc-item__standfirst");
                    AllNews.Image = img.attributes.src.value;
                    AllNews.anchorText = anchorText;
                    AllNews.anchorLink = anchorLink;
                    AllNews.brodcaster = "Gurdian";
                    AllNews.category = CurrentCategory;
                    //for removing the duplicates topic
                    if (el > 0 && (element.querySelector("a") !== arrayList[el - 1].querySelector("a")) && anchorText) {
                        paragraph && (AllNews.pragraphText = paragraph.textContent)
                        FilterdNews.push(AllNews)
                    }
                }


            })
            // console.log(FilterdNews);
            return FilterdNews;


        }, CurrentCategory)

        console.log("browser Closed");
        await browser.close()
        // console.log(news)
        if(news.length > 1){
            // NewsArchived.push({Brodcaster: "Guardian",news})
            await axios.post(process.env.APP_BASE_URL+`saveNews`, {
                data: {
                    Category: e,
                    brodcaster: "Guardian",
                    news
                }
                

            })
        }else{
            return null;
        }
        // await browser.close()

    } catch (e) {
        console.log(error(e));
        await browser.close();
        console.log(error("Browser Closed"))
    }finally {
        await browser.close();
      }
}

const NYT = async (e) =>{
    console.log("Inside NYT")
    try {
        let url = `https://www.nytimes.com/${e}`;
        if(e === "home"){
            url = `https://www.nytimes.com/nyregion`
        }
        else if(e === "uk"){
            url = 'https://www.nytimes.com/topic/destination/great-britain'
        }
        var browser = await puppeteer.launch({ headless: headlessStatus, args: ['--no-sandbox','--disable-setuid-sandbox',  "--incognito",
        "--no-sandbox",
        "--single-process",
        "--no-zygote"] })
        var page = await browser.newPage();
        // await page.setDefaultNavigationTimeout(0); 
        await page.goto(url)
        // await page.waitForSelector("img")
        const CurrentCategory = e;
        const news = await page.evaluate((CurrentCategory) => {
            // window.scrollBy(0, window.document.body.scrollHeight)
            const list = document.querySelectorAll('article');
            const FilterdNews = [];
            //latest news NYT
            const section = document.querySelector("#stream-panel")
            const ol = section.querySelector("ol")
            const ollist = ol.querySelectorAll("li")
            const arrolList = Array.from(ollist);
            arrolList.map((element, el) => {
                const img = element.querySelector("img");
                const anchor = element.querySelector("a")
                const AllNews = {};
                if (img && anchor) {
                    const anchorText = anchor.querySelector("h2").innerText;
                    const anchorLink = anchor.href;
                    const paragraph = element.querySelector("p");
                    AllNews.Image = img.src;
                    AllNews.anchorText = anchorText;
                    AllNews.anchorLink = anchorLink;
                    AllNews.brodcaster = "NewYorkTimes";
                    paragraph && (AllNews.pragraphText = paragraph.textContent);
                    FilterdNews.push(AllNews)
                    console.log(AllNews)
                }
            })

            //conveting node list into array
            const arrayList = Array.from(list);
            arrayList.map((element, el) => {
                const img = element.querySelector("img");
                const anchor = element.querySelector("h2")
                const AllNews = {};
                if (img && anchor) {
                    const anchorText = anchor.querySelector("a").innerText;
                    const anchorLink = anchor.querySelector("a").href;
                    const paragraph = element.querySelector("p");
                    AllNews.Image = img.src;
                    AllNews.anchorText = anchorText;
                    AllNews.anchorLink = anchorLink;
                    AllNews.brodcaster = "NewYorkTimes";
                    paragraph && (AllNews.pragraphText = paragraph.textContent);
                    

                         let duplicate = false;
    
                        if(FilterdNews.length == 0){
                            FilterdNews.push(AllNews)
                        }
                        FilterdNews.forEach((element,el)=>{
                           if(element.anchorLink === anchorLink){
                            duplicate = true
                           }
                        })
                        if(!duplicate){
                            FilterdNews.push(AllNews);
                        }
                }
            })
            console.log(FilterdNews);
            return FilterdNews;


        }, CurrentCategory)

        console.log("browser Closed");
        await browser.close()
        // console.log(news)
        if(news.length > 1){
            await axios.post(process.env.APP_BASE_URL+`saveNews`, {
                data: {
                    Category: e,
                    brodcaster: "NYT",
                    news
                }
                

            })
        }else{
            return null;
        }
        // await browser.close()

    } catch (e) {
        console.log(error(e));
        await browser.close();
        console.log(error("Browser Closed"))
    }finally {
        await browser.close();
      }
}

const CNN = async(e)=>{
    console.log("Inside CNN")
    try {
        let url = `https://edition.cnn.com/${e}`;
        if(e === "home"){
            url = `https://edition.cnn.com/`
        }
        var browser = await puppeteer.launch({ headless: headlessStatus, args: ['--no-sandbox','--disable-setuid-sandbox',  "--incognito",
        "--no-sandbox",
        "--single-process",
        "--no-zygote"] })
        var page = await browser.newPage();
        // await page.setDefaultNavigationTimeout(0); 
        await page.goto(url)
        // await page.waitForNavigation();
        // await page.waitForSelector("img")
        const CurrentCategory = e;
        const news = await page.evaluate((CurrentCategory) => {
            const list = document.querySelectorAll('.zn__containers  ul');
            //conveting node list into array
            const arrayList = Array.from(list);
            // console.log(arrayList)
            const FilterdNews = [];
            arrayList.map((element, el) => {
                const AllNews = {};
                const img = element.querySelector("img");
                if(img){
                    // console.log(img.getAttribute("data-src"))
                    const li = Array.from(element.querySelectorAll("li"))
                    console.log(li)
                    const Linklist =  [];
                        li.map((e,el)=>{
                        const anchor = e.querySelector("a");
                        // const anchorText = anchor.innerText;
                        if(anchor){
                            let anchorLink = anchor.href;
                            const anchorText = e.innerText;
                            Linklist.push({anchorLink, anchorText});
                        }
                        
                        
                        
                    })

                    if(img.getAttribute("data-src")){
                        AllNews.Image= img.getAttribute("data-src");
                        AllNews.Linklist = Linklist;
                        AllNews.brodcaster = "CNN";
                        AllNews.category= CurrentCategory;
                        FilterdNews.push(AllNews)
                    }
                   
                    console.log(AllNews)
                }
            })
            console.log(FilterdNews);
            // console.log(NewsArchived);
            // console.log(FilterdNews)
            return FilterdNews;


        }, CurrentCategory)

        console.log("browser Closed");
        await browser.close()
        // console.log(news)
        if(news.length > 9){
            // NewsArchived.push({Brodcaster: "CNN",news})
            await axios.post(process.env.APP_BASE_URL+`saveNews`, {
                data: {
                    Category: e,
                    brodcaster: "CNN",
                    news
                }
                

            })
        }else{
            return null;
        }
        // await browser.close()

    } catch (e) {
        console.log(error(e));
        await browser.close();
        console.log(error("Browser Closed"))
    }finally {
        await browser.close();
      }
}

