<template>
  <div class="follows">
    <div class="title">{{ userName + "的关注" }}</div>
    <user-list-card :user-list="userList" :is-load="isMore" @bottomLoad="bottomLoad"></user-list-card>
    <go-top scroll-obj=".follows"></go-top>
  </div>
</template>

<script>
import {getFollows, getUserInfo} from "@/api/request";
import UserListCard from "@/components/userListCard/userListCard";
import GoTop from "@/components/goTop/goTop";

export default {
  name: "follows",
  components: {GoTop, UserListCard},
  data () {
    return {
      currentPage: 1,
      userList: [],
      userName: "",
      isMore: false,
    }
  },
  methods: {
    getFolloweds() {
      getFollows({
        uid: this.$route.params.uid,
        offset: (this.currentPage - 1) * 30
      }).then(res=>{
        console.log(res);
        this.isMore = res.data.more;
        this.userList.push(...res.data.follow);
      })
    },
    getUserInfo() {
      getUserInfo(this.$route.params.uid).then(res=>{
        console.log(res);
        this.userName = res.data.profile.nickname;
      })
    },
    // 用户列表触底的回调
    bottomLoad() {
      // console.log("触底了");
      this.currentPage += 1;
      this.getFolloweds();
    },
  }
}
</script>

<style scoped>
.Follows {
  overflow-y: scroll;
}

.title {
  color: #373737;
  font-weight: bold;
  margin: 20px 30px;
}
</style>
