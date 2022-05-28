<template>
  <div class="personal">
    <div class="userInfo" v-if="userInfo.avatarUrl">
      <div class="left">
        <img :src="userInfo.avatarUrl + '?param=400y400'" alt="" class="avatar"/>
      </div>
      <div class="right">
        <div class="rightTop">
          <div class="username">
            <div> {{userInfo.nickname}} </div>
            <div class="logout" @click="logout" v-if="isCurrentUser && this.$route.params.uid">
              <i class="iconfont icon-zhuxiao1"></i>
              <span>退出登录</span>
            </div>
          </div>
          <div class="tags">
            <div class="level">{{ "lv" + userInfo.level }}</div>
            <div class="gender">
              <!-- 0 保密 1男 2女 -->
            </div>
          </div>
        </div>
        <div class="rightBottom">
          <div class="dataNums">
            <div class="numItem">
              <div class="numItemTop">{{ userInfo.eventCount }}</div>
              <div class="numItemBottom">动态</div>
            </div>
            <div class="numItem" @click="$router.push({name:'follows', params:{uid: $route.params.uid}})">
              <div class="numItemTop">{{ userInfo.newFollows }}</div>
              <div class="numItemBottom">关注</div>
            </div>
            <div class="numItem" @click="$router.push({name:'followeds', params:{uid: $route.params.uid}})">
              <div class="numItemTop">{{ userInfo.followeds }}</div>
              <div class="numItemBottom">粉丝</div>
            </div>
          </div>
<!--          其他信息-->
          <div class="otherInfo">
            <div class="otherInfoItem">
              <div class="otherInfoKey">用户id: </div>
              <div class="otherInfoValue">{{ userInfo.userId }}</div>
            </div>
            <div class="otherInfoItem">
              <div class="otherInfoKey">所在地区：</div>
              <div class="otherInfoValue">
                {{ userInfo.province + " " + userInfo.city }}
              </div>
            </div>
            <div class="otherInfoItem">
              <div class="otherInfoKey">个人介绍：</div>
              <div class="ptherInfoValue">
                {{ userInfo.signature === "" ? "暂无介绍" : userInfo.signature }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="musicList">
      <div class="musicListTitle" v-if="createdMusicList.length !== 0">
        {{userInfo.nickname}} 创建的歌单({{createdMusicList.length}})
      </div>
      <list-card :list-card-data="createdMusicList" @clickListCardItem="clickListCardItem"></list-card>
      <div class="musicListTitle" v-if="collectedMusicList.length !== 0">
        {{ userInfo.nickname }} 收藏的歌单 ({{ collectedMusicList.length }})
      </div>
      <list-card :list-card-data="collectedMusicList" @clickListCardItem="clickListCardItem"></list-card>
    </div>
  </div>
</template>

<script>
import {getPlayList, getUserInfo, logOut} from "@/api/request";
import ListCard from "@/components/listCard/listcard";

export default {
  name: "personal",
  components: {ListCard},
  data() {
    return {
      // 用户信息
      userInfo: {},
      // 创建的歌单
      createdMusicList: [],
      // 收藏的歌单
      collectedMusicList: [],
      // 该用户是否为当前用户
      isCurrentUser: false,
    }
  },
  methods: {
    getUserInfo() {
      return getUserInfo(this.$route.params.uid).then(res=>{
        if(!res) {
          this.$message.error("获取用户信息失败！");
        }else{
          res.data.profile["level"] = res.data.level;
          this.userInfo= res.data.profile;
        }
      })
    },
    getUserMusicList() {
      let timestamp = Date.parse(new Date());
      getPlayList({
        uid: this.$route.params.uid,
        timestamp
      }).then(res=>{
        console.log(res);
        let playList = res.data.playlist
        let index = playList.findIndex((item) => item.subscribed === true)
        playList[0].name = `${this.userInfo.nickname}喜欢的音乐`;
        this.createdMusicList = playList.slice(0, index)
        this.collectedMusicList = playList.slice(index)
      })
    },
    // 点击事件的回调
    clickListCardItem(id) {
      this.$router.push({ name: "musicListDetail", params: { id } });
    },
    logout() {
      logOut().then(res=>{
        if(res.data.code !== 200) {
          this.$message("退出失败，请稍后重试!")
        }
        else {
          window.localStorage.removeItem("userId");
          // 更新vuex中登陆状态
          this.$store.commit("updateLoginState", false);
          this.$message.success("退出成功！！");
          this.isCurrentUser = false
        }
      })
    }
  },
  watch: {
    "$store.state.isLogin"(current) {
      if(window.localStorage.getItem("userId") && current) {
        this.isCurrentUser = window.localStorage.getItem("userId") === this.$route.params.uid;
      }
    }
  },
  created() {
    this.getUserInfo().then(()=>{
      this.getUserMusicList()
      if(window.localStorage.getItem("userId")) {
        this.isCurrentUser = window.localStorage.getItem("userId") === this.$route.params.uid;
      }
    })
  },
}
</script>

<style scoped>
.personal {
  height: calc(100vh - 105px);
  overflow-y: scroll;
}

.userInfo {
  margin: 30px 10px;
  display: flex;
}

.avatar {
  margin-top: 5px;
  height: 150px;
  width: 150px;
  object-fit: cover;
  border-radius: 50%;
}

.right {
  margin-left: 20px;
  flex: 1;
}

.username {
  color: #373737;
  font-size: 22px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
}

.logout {
  margin-right: 10px;
  color: #373737;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  cursor: pointer;
  font-weight: lighter;
  padding: 0 15px;
  border: 1px solid #ddd;
  transform: scale(0.9);
}

.logout:hover {
  background-color: #f2f2f2;
}

.logout i {
  font-size: 12px;
  margin-right: 3px;
}

.logout span {
  font-size: 12px;
}

.tags {
  display: flex;
  margin: 10px 0;
}

.level {
  font-size: 12px;
  transform: scale(0.8) translateX(-10%);
  background-color: #f0f0f0;
  padding: 2px 8px;
  border-radius: 10px;
  color: #373737;
}

.rightTop {
  width: 100%;
  border-bottom: 1px solid #ddd;
}

.dataNums {
  display: flex;
  margin: 10px 0 5px;
}

.numItem {
  border-left: 1px solid #eee;
  padding: 0 25px;
  text-align: center;
  cursor: pointer;
}

.numItem:nth-child(1) {
  border-left: none;
  padding-left: 3px;
}

.numItemTop {
  color: #373737;
  font-size: 18px;
}

.numItemBottom {
  font-size: 12px;
  transform: scale(0.8);
}

.otherInfo {
  font-size: 12px;
  transform: scale(0.9) translateX(-5%);
  user-select: text !important;
}

.otherInfoItem {
  display: flex;
  margin: 5px 0;
}

.otherInfoKey {
  color: #2e2e2e;
}

.otherInfoValue {
  width: 80%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.musicListTitle {
  color: #373737;
  font-weight: bold;
  font-size: 14px;
}

.musicList {
  max-width: 1100px;
  margin: 0 auto;
  padding-bottom: 30px;
}
</style>
