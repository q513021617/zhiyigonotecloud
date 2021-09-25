import httpmethods from '@/tools/http'
var qiniu = require('qiniu-js') 
export function queryAricleDetail (id){
    
    httpmethods.axios.get("/blogapi/admin/aricle/"+id,{}).then((res)=>{
        console.log(res)
    })
}
export function queryAriclelist (page,size){
    
    return httpmethods.axios.get("/blogapi/admin/aricle/"+ page + "/" + size,{})
}
export function queryAriclelistByName (name){
    
    return httpmethods.axios.get("/blogapi/api/aricle/search/" + name,{})
}
export function saveArticle (data){
    
    return httpmethods.axios.post("/blogapi/admin/aricle/",data)
}
export function delArticle (id){
    
    return httpmethods.axios.delete("/blogapi/admin/aricle/",{data:{id:id}})
}
async function getQiniuToken() {

    let {data}=await httpmethods.axios.get("/blogapi/getQiniuToken",{})
    console.log(data)
    return data;
}
export async function uploadQinuImage(file) {
    let {token,key}=await getQiniuToken()
    key = key + file.name
    // debugger
    var config = {
        useCdnDomain: true,
        region: qiniu.region.z2,
        uptoken: token,
        domain: 'https://cdn.zhiyigo.cn/',     //配置好的七牛云域名  如   https://cdn.qniyun.com/
        unique_names: true,
    };
    var putExtra = {
        // fname: file.name,
        // params: {},
        // mimeType: [] || null
        ...config,
    }
    var observable = qiniu.upload(file, key, token, putExtra, config)
    return new Promise((resolve, reject) => {
        var subscription = observable.subscribe({
            error(err) {
                reject(err)
            },
            complete(data) {
                data.path = `http://cdn.zhiyigo.cn/${data.key}`  //拼上七牛云域名  如   https://cdn.qniyun.com/ ${data.key}
                resolve(data)
            }
        }) // 上传开始
    })

}