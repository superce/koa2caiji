const { query } = require('../mysql/index')
const config = require('../config/picture')
const charset = require('superagent-charset')
const superagent = charset(require('superagent'))
const moment = require('moment')
const wait = require('../wait/index')
const $html = require('../cheerio/index')


let imgUrl = ''
function getPictrueUrl(url){
    
    superagent.get(url).charset('utf-8').buffer(true).end(async (err,res)=>{
        if(err){
            console.log(err)
        }else{
            let html = res.text
            let $ = $html.$html(html)  
            // $('.index_only .box').each(async (index,item)=>{
            //     let a = $(item).find('a').attr('href')
            //     let img = $(item).find('img')
            //     console.log(a)
            //     console.log(img)
            //     imgUrl.push(img)
            // })
            let img = $('.down_img .imga img').attr('src')
            imgUrl = img
            console.log(imgUrl)
            console.log(1)
            return img
        }
    })
}

exports.pictureUrl = async function(){
    let ds = getPictrueUrl('http://sc.chinaz.com/tupian/200525054604.htm')
    console.log(ds)
}