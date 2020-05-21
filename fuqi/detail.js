const { query } = require('../mysql/index')
const {guid} = require('../guid/index')
const config = require('../config')
const charset = require('superagent-charset')
const superagent = charset(require('superagent'))
const moment = require('moment')
const wait = require('../wait/index')
const $$ = require('../cheerio/index')
const categroy = require('../categroy/index')

function whereId(params){
    let gid = params.gid
    let sql = `SELECT * FROM wp_posts WHERE post_name = '${gid}'`
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
    // let type = params.type
    let addInsert = ''
    let date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    whereId(params).then(async res=>{
        console.log('存储')
        let sql = `insert into wp_posts (post_author,post_date,post_content,post_title,post_status,comment_status,ping_status,post_name,post_modified,post_modified_gmt,post_type) 
        values(1, '${date}', '${content}', '${title}', 'publish', 'closed', 'closed', '${gid}', '${date}', '${date}', 'post')
        `
        addInsert = await query(sql)  
    })
    return addInsert 
  }
async function saveDetail(){
    // let url = []
    // await getArticleList().then(res =>{
    //     url = res
    // })
    let list = await getArticleList()
    for(let item of list){
        await wait()
        let link = config.url+item.href
        console.log(link)
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
                    gid:item.article_id
                }
                console.log(p)
                await addInsert(p)
            }
        })
    }
    categroy.categroyType()
}

exports.detail = function(){
    saveDetail()
}

