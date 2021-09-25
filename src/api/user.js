import httpmethods from '@/tools/http'

export function queryUserDetail (id){
    
    return httpmethods.axios.get("/blogapi/api/user/"+id,{})
}

export function login(username,password) {
  
   

    return httpmethods.axios
      .post("/blogapi/webLogin", {
        password: password,
        email:username,
      });


  }