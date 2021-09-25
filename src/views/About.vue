<template>
  <validation-observer ref="observer" v-slot="{ invalid }">
    <v-alert
  type="success"
  color="red lighten-2"
  v-if="showMessage"
>
{{message}}
</v-alert>
    <form @submit.prevent="submit">
     <div class="avatar-icon">
        <v-avatar size="62">
        <img
          alt="Avatar"
          src="https://avatars0.githubusercontent.com/u/9064066?v=4&s=460"
        />
      </v-avatar>
     </div>
      <validation-provider
        v-slot="{ errors }"
        name="email"
        rules="required|email"
      >
        <v-text-field
          v-model="email"
          :error-messages="errors"
          label="请输入邮箱"
          required
        ></v-text-field>
      </validation-provider>
      <validation-provider
        v-slot="{ errors }"
        name="password"
        rules="required|max:35"
      >
        <v-text-field
          v-model="password"
          :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
          :error-messages="errors"
          :type="show1 ? 'text' : 'password'"
          name="password"
          label="请输入密码"
          hint="至少8位字符"
          counter
          @click:append="show1 = !show1"
        ></v-text-field>
      </validation-provider>

      <validation-provider v-slot="{ errors }" rules="required" name="checkbox">
        <v-checkbox
          v-model="isremmeber"
          :error-messages="errors"
          value="1"
          label="记住密码"
          type="checkbox"
          required
        ></v-checkbox>
      </validation-provider>

      <div class="btn-group-footer">
        <v-btn class="mr-6"  @click="login"> 提交 </v-btn>
        <v-btn @click="clear"> 清除 </v-btn>
      </div>
    </form>
    <v-footer
      app
      color="transparent"
      height="72"
      inset
    >
    <div style="align:text-center;">
       zhiyigo技术团队版权
    </div>
    </v-footer>
  </validation-observer>
</template>
<script>
import {login} from "@/api/user";
import { required, digits, email, max, regex } from "vee-validate/dist/rules";
import {
  extend,
  ValidationObserver,
  ValidationProvider,
  setInteractionMode,
} from "vee-validate";

setInteractionMode("eager");

extend("digits", {
  ...digits,
  message: "{_field_} 需要为 {length}长度的 数字 ({_value_})",
});

extend("required", {
  ...required,
  message: "{_field_} 不能为空",
});

extend("max", {
  ...max,
  message: "{_field_} 长度不能超过 {length} 位字符",
});

extend("regex", {
  ...regex,
  message: "{_field_} {_value_} 不能匹配 {regex}",
});

extend("email", {
  ...email,
  message: "邮箱必须是有效的",
});

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data: () => ({
    password: "",
showMessage:false,
    isremmeber: false,
    email: "",
    show1: false,
    checkbox: null,
    message:''
  }),

  methods: {
    async login() {
      this.$refs.observer.validate();
      console.log(this.email,this.password)
      let {data}=await login(this.email,this.password)
      console.log(data)
      if(data.status!=200){
          this.showMessage=true;
          this.message=data.message;
          setTimeout(()=>{
            this.showMessage=false;
          },2000)
          return;
      }
      if(data.status===200){
          localStorage.setItem('userdata',JSON.stringify(data.data))
          localStorage.setItem('token',data.data.token)
          location.href="app://./index.html/#/"
      }
    },
    clear() {
      this.email = "";
      this.isremmeber = null;
      this.password = null;
      this.$refs.observer.reset();
    },
  },
};
</script>
<style scoped>
.avatar-icon{
  width: 100%;
  display: flex;
  justify-content: center;
}
.btn-group-footer{
  width: 30%;
  display: flex;
  justify-content: space-between;
  align-self: center;
}
.btn-group-footer .v-btn{
  width: 50px;
}
form{
  display: flex;
  flex-direction: column;
}
</style>