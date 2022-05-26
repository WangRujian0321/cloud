<template>
  <div class="Login">
    <el-form
        ref="form"
        v-model="loginForm"
        label-width="80px"
        label-position="right"
        size="mini"
    >
      <el-form-item label="手机号码" size="mini" label-width="100px" required>
        <input type="text" class="loginInput" v-model="loginForm.phone"></input>
      </el-form-item>
      <el-form-item label="密码" size="mini" label-width="100px" required>
        <input type="password" class="loginInput" v-model="loginForm.password"></input>
      </el-form-item>
      <div class="loginButton">
        <el-button type="danger" @click="loginByPhoneNumber" size="mini">登录</el-button>
      </div>
      <div class="loginButton">
        <div class="regEnter" @click="isRegisteredShow = true">注册</div>
      </div>
    </el-form>
  </div>
</template>

<script>
import {LoginByCellPhone} from "@/api/request";
import store from "@/store";

export default {
  name: "loginItem",
  store: store,
  data(){
    return {
      loginForm: {
        phone: "",
        password: "",
      }
    }
  },
  methods: {
    loginByPhoneNumber() {
      let timestamp = Date.parse(new Date());
      let params = Object.assign(
          {
            withCredentials: true,
            timestamp
          },
          this.loginForm
      );
      LoginByCellPhone(params).then(res =>{
        if(res.data.code === 200) {
          window.localStorage.setItem("userId", res.data.profile.userId)
          this.$emit("getUserInfo", res.data.profile)
          this.$message.success("登录成功!");
          // 修改vuex中的登录状态
          // 清空输入框的内容
          this.loginForm.password = "";
          this.loginForm.phone = "";
          this.$store.commit("updateLoginState", true);
        } else if(res.data.code === 400) {
          this.$message({message:'手机号错误!', type:"error"})
        } else if(res.data.code === 502) {
          this.$message({message:'密码错误!', type:"error"})
        } else {
          this.$message({message:'登陆失败，请稍后重试!', type:"error"})
        }
      })
    }
  }
}
</script>

<style scoped>
.regEnter {
  width: 100%;
  text-align: center;
  font-size: 12px;
  cursor: pointer;
  margin: 15px auto 0;
}

.regEnter:hover {
  text-decoration: underline;
}

.loginInput {
  height: 25px;
  border-radius: 5px;
  outline: none;
  border: 1px solid #999;
  padding-left: 5px;
  width: 175px;
}

.el-form {
  padding-top: 10px;
}

.loginButton {
  width: 100%;
  text-align: center;
}

.loginButton .el-button {
  width: 200px;
}
</style>
