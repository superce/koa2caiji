const fs = require('fs')
const request = require('request')
const path = require('path')
const pictrueUrl = require('./index')
const {guid} = require('../guid/index')


//创建文件夹目录
var dirPath = path.join(__dirname, "../filepictrue");
console.log(__dirname)
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
    console.log("文件夹创建成功");
} else {
    console.log("文件夹已存在");
}

/*
* url 网络文件地址
* filename 文件名
* callback 回调函数
*/

function downFile(url) {
    let guid = guid()+'.jpg'
    return new Promise(function (resolve, reject) {
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                let stream = fs.createWriteStream(path.join(dirPath, guid));
                request(url).pipe(stream).on("close", function (err) {
                    resolve(`下载成功,图片名称：${guid}`);
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

exports.down = async function(){
    // console.log(pictrueUrl.pictureUrl())
    pictrueUrl.pictureUrl().then(res =>{
        console.log(res)
    })
    // arrayUrl.forEach(item => {
    //     downFile(item).then(res => {
    //         console.log(res)
    //     })
    // });
}