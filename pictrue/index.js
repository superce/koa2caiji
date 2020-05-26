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

function pictrue_list() {
    let url = 'https://www.tupianzj.com/meinv/yishu/list_178_1.html'
    return new Promise(resolve => {
        let urlarray = []
        superagent.get(url).charset('utf-8').buffer(true).end((err, res) => {
            if (err) {
                console.log(err)
                console.log(33)
            } else {
                let html = res.text
                let $ = $html.$html(html)
                $('.list_con_box ul.list_con_box_ul li').each(async (ind, item) => {
                    let href = $(item).children('a').attr('href')
                    let _href = `https://www.tupianzj.com${href}`
                    urlarray.push(_href)
                })
                resolve(urlarray)
            }
        })
    })
}
function pageNum(url) { 
    return new Promise(resolve => {
        superagent.get(url).charset('utf-8').buffer(true).end((err, res) => {
            if (err) {
                console.log(err)
                console.log(33)
            } else {
                let html = res.text
                let $ = $html.$html(html)
                let page = $('.pages ul li').eq(0).children('a').text()
                let num = page.match(/\d+/g)[0]
                // let img = $('.pic_tupian a>img').attr('src')
                resolve(num)
            }
        })
    })
}
function getPictrueUrl(url){
    return new Promise(resolve =>{
        superagent.get(url).charset('utf-8').buffer(true).end((err,res)=>{
            if(err){
                console.log(err)
                console.log(33)
            }else{
                let html = res.text
                let $ = $html.$html(html)  
                let page = $('.pages ul li').eq(0).children('a').text()
                num = page.match(/\d+/g)[0]
                let img = $('.pic_tupian a>img').attr('src')
                resolve(img)
            }
        })
    })
}

exports.pictureUrl = async function(){
    let arrayurl = await pictrue_list()
    console.log(arrayurl)
    for (let i=0;i<arrayurl.length;i++){
        console.log('循环')
        console.log(i)
        let index = await pageNum(arrayurl[i])
        console.log('----------------------------------------------')
        console.log(index)
        for (let i = 0; i < index+1; i++) {
            console.log(i)
            let _url = arrayurl[i]
            if (i > 0) {
                let j = i
                if(i===1){
                    j++
                }
                console.log('i大于零')
                let _split = _url.split('')
                let num = `_${j}`
                _split.splice(-5, 0, num)
                _url = _split.join('')
            }
            console.log(_url)
            let res = await getPictrueUrl(_url)
            down.down(res, i)
        }
    }
}