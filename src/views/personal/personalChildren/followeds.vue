<template>
  <div class="followeds">
    <div class="title">{{ userName + "的粉丝" }}</div>
    <user-list-card :user-list="userList" :is-load="isMore" @bottomLoad="bottomLoad"></user-list-card>
    <go-top scroll-obj=".followeds"></go-top>
  </div>
</template>

<script>
import {getFolloweds, getUserInfo} from "@/api/request";
import UserListCard from "@/components/userListCard/userListCard";
import GoTop from "@/components/goTop/goTop";

export default {
  name: "followeds",
  components: {GoTop, UserListCard},
  data() {
    return {
      // 当前页数
      currentPage: 1,
      // 用户列表
      userList: [],
      userName: "",
      // 是否有更多数据
      isMore: false,
    }
  },
  methods: {
    getFolloweds() {
      getFolloweds({
        uid: this.$route.params.uid,
        offset: (this.currentPage - 1) * 30
      }).then(res => {
        this.isMore = res.data.more;
        this.userList.push(...res.data.followeds)
      })
    },
    getUserInfo() {
      getUserInfo(this.$route.params.uid).then(res=>{
        console.log(res);
        this.userName = res.data.profile.nickname;
      })
    },
    bottomLoad() {
      this.currentPage += 1
      this.getFolloweds()
    },
    created() {
      this.getFolloweds();
      this.getUserInfo();
    }
  }
}
</script>

<style scoped>

</style>
