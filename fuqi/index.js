const { query } = require('../mysql/index')
const {guid} = require('../guid/index')
const config = require('../config')
const charset = require('superagent-charset')
const superagent = charset(require('superagent'))
const moment = require('moment')
const wait = require('../wait/index')
const $html = require('../cheerio/index')
const detail = require('./detail')

function whereId(params){
    let gid = params.gid
    let sql = `SELECT * FROM article_list WHERE article_id = ${gid}`
    return new Promise(async (resovle)=>{
        let ishaveId = await query(sql)
        if(ishaveId.length===0){
            resovle()
        }
    })
}

async function addInsert(params,type){
    let title = params.title
    let href = params.href
    let gid = params.gid
    let decri = params.decri
    let add = ''
    whereId(params).then(async res=>{
        let date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        let sql = `insert into article_list (id,title,article_id,href,content,type,create_date) values ("${guid()}","${title}","${gid}","${href}","${decri}","${type}","${date}")`
        add = await query(sql)  
    }).catch(err =>{
        console.log(err)
    })
    return add 
  }

async function saveArticle(url,type){
    superagent.get(url).charset('gb2312').buffer(true).end(async (err,res)=>{
        if(err){
            console.log(err)
        }else{
            let html = res.text
            let $ = $html.$html(html)  
            $('ul.article-list li').each(async (index,item)=>{
                let title = $(item).find('.article-title').text()
                let href = $(item).find('.article-title a').attr('href')
                let gid = $(item).find('.article-commentbar').attr('data-id')
                // let decri = $(item).find()
                let content = $(item).find('.summary-text').text()
                let $content = content.includes("'")
                let $title = title.includes("'")
                let c = {
                    title:title,
                    href:href,
                    gid:gid,
                    decri:content
                }
                await addInsert(c,type)
            })
        }
    })
}

exports.fuqi = async function(){
    let categroy = config.categroy
    for(let c = 0;c<categroy.length;c++){
        let url = config.url+categroy[c].cate
        console.log(url)   
        for(let i=1;i<22;i++){
            await wait()  
            let link = url
            if(i>1){
                link = `${url}${i}.html`
            }
            saveArticle(link,categroy[c].type)
        }
    }
    // 开始采集详情页
    detail.detail()
}