const { query } = require('../mysql/index')
const {guid} = require('../guid/index')
const config = require('../config')
const charset = require('superagent-charset')
const superagent = charset(require('superagent'))
const moment = require('moment')
const wait = require('../wait/index')
const $$ = require('../cheerio/index')


function whereId(params){
    let gid = params.gid
    let sql = `SELECT * FROM article_detail WHERE article_id = "${gid}"`
    return new Promise(async (resovle)=>{
        let ishaveId = await query(sql)
        if(ishaveId.length===0){
            resovle()
        }
    })
}
function getArticleList(){
    let sql = 'select * from article_list';
    return new Promise(async (resovle,reject)=>{
        let article = await query(sql);
        resovle(article)
    })
}
async function addInsert(params){
    let title = params.title
    let content = params.content
    let gid = params.gid;
    let type = params.type
    let addInsert = ''
    let date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    whereId(params).then(async res=>{
        console.log('存储')
        let sql = `insert into article_detail (id,article_id,title,content,type,create_date) values ("${guid()}","${gid}","${title}","${content}","${type}","${date}")`
        addInsert = await query(sql)  
    })
    return addInsert 
  }
async function saveDetail(){
    // let url = []
    // await getArticleList().then(res =>{
    //     url = res
    // })
    let url = await getArticleList()
    url.forEach(async (item) =>{
        console.log(url.length)
        await wait()
        let link = config.url+item.href
        superagent.get(link).charset('gb2312').buffer(true).end(async (err,res)=>{
            if(err){
                console.log(err)
            }else{
                let html = res.text
                let $ = $$.$html(html)  
                let d = $('.article .article-text').html().trim() 
                let p = {
                    title:item.title,
                    content:d,
                    gid:item.group_id
                }
                await addInsert(p)
            }
        })

    })
}

exports.detail = function(){
    saveDetail()
}

