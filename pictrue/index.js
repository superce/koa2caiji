const { query } = require('../mysql/index')
const config = require('../config/picture')
const charset = require('superagent-charset')
const superagent = charset(require('superagent'))
const moment = require('moment')
const wait = require('../wait/index')
const $html = require('../cheerio/index')



function getPictrueUrl(url){
    let imgUrl = []
    superagent.get(url).charset('gb2312').buffer(true).end(async (err,res)=>{
        if(err){
            console.log(err)
        }else{
            let html = res.text
            console.log(html)
            let $ = $html.$html(html)  
            // $('._2eec ._2eea').each(async (index,item)=>{
            //     let img = $(item) //.find('._3x2f img').attr('src') 
            //     console.log(img)
            //     imgUrl.push(img)
            // })
        }
    })
    return imgUrl
}

exports.pictureUrl = async function(){
    getPictrueUrl('https://www.facebook.com/pg/beauty.or.monster/photos/?ref=page_internal')
}