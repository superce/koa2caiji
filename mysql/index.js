const mysql = require('mysql')
const pool = mysql.createPool({
  host: '188.131.247.107',
  user: 'zhaoce',
  password: '123456',
  database: 'zhaoce',
  port: '3306'
})

let query = function (sql,value) {
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) {
        reject(err)
      } else {
        connection.query(sql, (err, rows) => {
          if (err) {
            reject(err)
          } else {
            console.log('成功')
            let string = JSON.stringify(rows)
            let parse = JSON.parse(string)
            resolve(parse)
          }
          connection.release()
        })
      }
    })
  })
}

module.exports = { query }