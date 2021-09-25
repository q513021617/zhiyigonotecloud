<template>
  <v-app id="inspire">
      

    <v-app-bar
      app
      clipped-right
      flat
      height="72"
    >
     

 <v-responsive max-width="260">
    <div class="row">
       
        <v-text-field v-model="searchtext" @keydown="getArticleListByname">
    
        <v-icon
      slot="append"
      color="black"
    >
     mdi-magnify
    </v-icon>
 </v-text-field>
<v-btn @click="reload">刷新</v-btn>
    </div>
   </v-responsive>
    <v-responsive max-width="500" class="left-space">
    <v-text-field v-model="selectedArticle.title" >
    
    </v-text-field>
 
   </v-responsive>
    </v-app-bar>

    <v-navigation-drawer

      app
      width="250"
    >
       <v-card
    class="mx-auto"
    width="256"
    tile
  >
    <v-navigation-drawer permanent>
     
      
      <v-list>
         <v-alert
  type="success"
  color="lighten-2"
  v-if="showMessage"
>
{{message}}
</v-alert>
        <v-list-item>
          <v-list-item-avatar>
            <v-img src="https://cdn.vuetifyjs.com/images/john.png"></v-img>
          </v-list-item-avatar>
        </v-list-item>

        <v-list-item link>
          <v-list-item-content>
            <v-list-item-title class="text-h6">
              {{userinfo.username}}
            </v-list-item-title>
            <v-list-item-subtitle>{{userinfo.email}}</v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action>
            <v-icon>mdi-menu-down</v-icon>
          </v-list-item-action>
        </v-list-item>
         <v-list-item>
          
          <v-btn @click="reload">刷新</v-btn>
          <v-btn @click="addArticle">发文章</v-btn>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list
        nav
        dense
      >
        <v-list-item-group
          v-model="selectedItem"
          color="primary"
        >
          <v-list-item
            v-for="(item, i) in menus"
            :key="i"
          >
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </v-card>

     
    </v-navigation-drawer>

    

    <v-main >
      <div class="main-content">
          <v-list
        class="pl-14"
        shaped
      >
        <v-list-item
          v-for="article,index in articleList"
          :key="index"
          link
          @click="selectArticle(article)"
          @mouseover="mouseOverOn(index)"
        >
          <v-list-item-content>
            <v-list-item-title>{{ article.title }}</v-list-item-title>
            <v-list-item-content  v-if="index==currentindex"><v-btn @click="delOneArticle(article.id)">删除</v-btn></v-list-item-content>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
             <v-btn @click="loadmore">加载更多</v-btn>
        </v-list-item>
      </v-list>
    
      <div class="article-content">
        <mavon-editor ref="md" v-model="selectedArticle.articleContent" @save="saveArticleinfo" @imgAdd="$imgUpload"/>
      </div>
      </div>
     
    </v-main>

    
  </v-app>
</template>

<script>
import {uploadQinuImage,queryAriclelist,queryAricleDetail,saveArticle,queryAriclelistByName,delArticle} from "@/api/aricle";
export default {
  name: 'App',
  data: () => ({
     selectedItem: 0,
     searchtext:'',
     inputtext:'',
     inputTitle:'',
     articleList:[],
     currentindex:0,
     selectedArticle:{
         title:'',
         articleContent:''
     },
     size:20,
     page:0,
     showMessage:false,
      message:'',
     userinfo:{},
      menus: [
        { text: '我的笔记', icon: 'mdi-folder' }
      ]
  }),
  mounted(){
      let datastr=localStorage.getItem('userdata')
      this.userinfo=JSON.parse(datastr)      
  },
  created(){
      this.getAllArticleList(this.page);
  },
  methods:{
      mouseOverOn(index){
          console.log(index)
        this.currentindex=index;
      },
     async delOneArticle(id){
           await delArticle(id)
            this.showToast("删除成功");
              this.reload();
      },
       $imgUpload(pos, $file){
        let that = this;
                let files = $file;
        uploadQinuImage(files).then((res)=>{
              console.log(res)
              that.$refs.md.$img2Url(pos, res.path);
        })
    },
      async saveArticleinfo(){
          this.showToast("保存文档中");
           await saveArticle(this.selectedArticle)
           this.reload();
      },
      async getArticleListByname(e){
          this.showToast("搜索中");
           if(e.key==='Enter'){
                let {data}=await queryAriclelistByName(this.searchtext)
                this.articleList=data.slice(0,data.length)
           }
      },
      addArticle(){
          let newArr=[];
          this.selectedArticle={ title:'',
         articleContent:''};
          if(!this.selectedArticle.title){
                this.selectedArticle.title="无标题文档"
          }
          newArr.push(this.selectedArticle)
          newArr=newArr.concat(this.articleList)
          console.log(newArr)
         this.articleList=newArr.slice(0,newArr.length)
      },
      showToast(message){
          this.showMessage=true;
          this.message=message;
           setTimeout(()=>{
            this.showMessage=false;
          },2000)
      },
     async loadmore(){
          let {data}=await queryAriclelist(this.page+1,this.size)
          this.showToast("加载成功");          
        if(!data){
            return;
        }
          this.page=this.page+1;
          let tempList=data.content.slice(0,data.content.length)
          this.articleList=this.articleList.concat(tempList)

      },
      reload(){
          this.getAllArticleList(0);
      },
      selectArticle(article){
          this.selectedArticle=article
      },
     async getAllArticleList(page){
        let {data}=await queryAriclelist(page,this.size)
         this.showToast("刷新成功");
        this.articleList=data.content.slice(0,data.content.length)
      },
    update(e) {
      console.log(e)
        this.$forceUpdate(e); 
    }
  }
}
</script>
<style scoped>
body{
  -webkit-app-region: drag;
}
.row{
    width: 100%;
    display: flex;
    justify-content: space-evenly;
}
.main-content{
  display: flex;
  justify-content: space-between;
  height: 100%;
}
.main-content .article-content{
  width: 80%;
  border-style:inset;
  border-width: 1px;
  display: flex;
  justify-content: space-between;
}
.article-content .v-textarea{
  width: 50%;
}
.searchinput{
  z-index: 999999;
}
.left-space{
  margin-left: 8%;
}
</style>