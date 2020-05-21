const { query } = require('../mysql/index')

function selectAll() {
  let sql = 'SELECT * FROM article_list'
  return new Promise(async (resovle) => {
    let data = await query(sql)
    resovle(data)
  })
}

function selectPostsName(param) { 
  let id = param.article_id
  let sql = `select * from wp_posts where post_name = ${id}`
  return new Promise(async (resovle)=>{
    let data = await query(sql)
    resovle(data)
  })
}

function selectWhereId(param){
  let id = param.id
  let sql = `select * from wp_term_relationships where object_id = ${id}`
  return new Promise(async (resovle)=>{
    let data = await query(sql)
    if(data.length === 0){
      resovle()
    }
  }) 
}

function setCategroyType(param) { 
  let id = param.id
  let type = param.type
  let sql = `insert into wp_term_relationships (object_id,term_taxonomy_id,term_order) 
            values(${id},${type},0)`
  let data = ''
  selectWhereId(param).then(async res =>{
      data = await query(sql)
  }).catch(err =>{
      console.log(err)
  })
  return data
}

async function setCategroy() { 
  let data = await selectAll()
  for(let d of data){
    let obj = {
      article_id: d.article_id,
      type:d.type
    }
    console.log(obj)
    let type = await selectPostsName(obj)
    console.log(type)
    if(type.length>0){
      let t = type[0]
      let param = {
        id:t.ID,
        type:d.type
      }
      console.log(param)
      await setCategroyType(param)
    }
  }
}
exports.categroyType = async function() {
  setCategroy()
}