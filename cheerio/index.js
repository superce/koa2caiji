const cheerio = require('cheerio')
exports.$html = function (html){
    let $ = cheerio.load(html,{
        decodeEntities:false,
        ignoreWhitespace: false,
        xmlMode: false,
        lowerCaseTags: false
    })
    return $
}