const router = require('koa-router')()
const { query } = require('../mysql/index')
async function selectAll(index){
  let sql = `select * from fuqi where type=${index}`
  let select = await query(sql)
  return select
}

async function selectArticleDetail(id){
  let sql = `select * from article where article_id=${id}`
  let article = await query(sql)
  return article
}


router.get('/', async (ctx, next) => {
  let p = await selectAll(1)
  await ctx.render('index', {
    title: '99999',
    array:p
  })
})

router.get('/detail',async (ctx,next)=>{
  // console.log(ctx.request.body)
  // let id = ctx.request.body
  let id = ctx.query
  let url = ctx.url
  let ddd = await selectArticleDetail(id.id)
  console.log(ddd)
  if(ddd.length>0){
    await ctx.render('detail',{
     title:ddd[0].title,
     content:ddd[0].content
    })
  }else{
    await ctx.render('public/404',{
      title:'404'
    })
  }
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router
