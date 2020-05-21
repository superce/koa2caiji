function wait(){
    console.log('等待10s')
    return new Promise(resovle =>{
        setTimeout(()=>{
            console.log('结束等待')
            resovle()
        },2000)
    })
}
module.exports = wait