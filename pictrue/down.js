const fs = require('fs')
const request = require('request')
const path = require('path')
const {guid} = require('../guid/index')

/*
* url 网络文件地址
* filename 文件名
* callback 回调函数
*/
function downFile(url,i) {
    //创建文件夹目录
    let namepath = `../filepictrue${i}`
    var dirPath = path.join(__dirname, namepath);
    console.log(__dirname)
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
        console.log("文件夹创建成功");
    } else {
        console.log("文件夹已存在");
    }
    let filename = guid()+'.jpg'
    console.log(filename)
    return new Promise(function (resolve, reject) {
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                let stream = fs.createWriteStream(path.join(dirPath, filename));
                request(url).pipe(stream).on("close", function (err) {
                    resolve(`下载成功,图片名称`);
                    console.log(dirPath)
                });
            } else {
                if (error) {
                    reject(error);
                } else {
                    reject(new Error("下载失败，返回状态码不是200，状态码：" + response.statusCode));
                }
            }
        });
    });

}

exports.down = async function(url,i){
    console.log(url)
   await downFile(url,i)
}