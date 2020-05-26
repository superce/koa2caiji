const { query } = require('../mysql/index')
const config = require('../config/picture')
const charset = require('superagent-charset')
const superagent = charset(require('superagent'))
const moment = require('moment')
const {guid} = require('../guid/index')
const wait = require('../wait/index')
const $html = require('../cheerio/index')
const down = require('./down')

async function addPictrueUrl(href){
    // let href = param.href
    console.log(href)
    let date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    let sql = `insert into picture_url (id,href,create_date) values ('${guid()}','${href}','${date}')`
    let add = await query(sql) 
    return add
}

function getPictrueUrl(url){
    return new Promise(resolve =>{
        superagent.get(url).charset('utf-8').buffer(true).end(async (err,res)=>{
            console.log(987)
            if(err){
                console.log(err)
                console.log(33)
            }else{
                let html = res.text
                let $ = $html.$html(html)  
                let img = $('.floatItem .wrap img').attr('src')
                resolve(img)
            }
        })
    })
}

exports.pictureUrl = async function(){
    let url = config.url
    let res = await getPictrueUrl(url)
    down.down(res)
}