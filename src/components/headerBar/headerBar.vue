<template>
  <div class="headerBar">
    <div class="left">
      <img src="~assets/img/logo.png" alt=""/>
    </div>
    <div class="center">
      <div class="buttons">
        <i class="iconfont icon-arrow-left-bold back" @click="$router.go(-1)"></i>
        <i class="iconfont icon-arrow-right-bold forward" @click="$router.go(1)"></i>
      </div>
      <div class="search">
        <el-popover placement="bottom" width="300" v-model="isSearchPopShow" popper-class="searchPop" trigger="focus">
          <el-input placeholder="请输入内容" @input="inputSearch"
                    prefix-icon="el-icon-search"
                    size="mini" slot="reference"
                    v-model="searchInput"></el-input>
          <!--        可以使用localStorage制作搜索历史-->
          <!--      热搜-->
          <div class="hotSearch" v-if="!searchSuggestList.songs">
            <div class="hotSearchTitle">热搜榜</div>
            <div class="hotSearchItem" v-for="(item, index) in hotSearchList" :key="index" @click="clickHotSearch(item.searchWord)">
              <div class="hotSearchIndex" :class="index < 3 ? 'topTree' : ''">
                {{index + 1}}
              </div>
              <div class="hotSearchInfo">
                <div class="hotSearchWord" :class="index < 3 ? 'hotSearchWordTopThree' : ''">
                  {{ item.searchWord }}
                </div>
                <div class="hotSearchContent">{{item.content}}</div>
              </div>
            </div>
          </div>
<!--          搜索建议-->
          <div class="searchSuggest">
            <div class="hotSearchTitle" v-if="searchSuggestList.songs">搜索建议</div>
            <div class="searchSuggestItem" v-if="searchSuggestList.songs && searchSuggestList.songs.length !== 0">
              <div class="searchSuggestItemTitle">
                <i class="iconfont icon-yinle"></i>
                单曲
              </div>
              <div class="suggestItemDetail" v-for="(item, index) in searchSuggestList.songs" :key="index" @click="clickSuggestSong(item.id)">
                {{ item.name + '-' + item.artists[0].name }}
              </div>
            </div>
            <div class="searchSuggestItem" v-if="searchSuggestList.artists && searchSuggestList.artists.length !== 0">
              <div class="searchSuggestItemTitle">
                <i class="iconfont icon-mic"></i>
                歌手
              </div>
              <div class="suggestItemDetail" v-for="(item, index) in searchSuggestList.songs" :key="index" @click="clickSuggestOption(item.id, 'singerDetail')">
                {{ item.name + '-' + item.artists[0].name }}
              </div>
            </div>
            <div class="searchSuggestItem" v-if="searchSuggestList.albums && searchSuggestList.albums.length !== 0">
              <div class="searchSuggestItemTitle">
                <i class="iconfont icon-more"></i>
                专辑
              </div>
              <div class="suggestItemDetail" v-for="(item, index) in searchSuggestList.albums" :key="index" @click="clickSuggestOption(item.id, 'album')">
                {{ item.name + '-' + item.artists[0].name }}
              </div>
            </div>
            <div class="searchSuggestItem" v-if="searchSuggestList.playlists && searchSuggestList.playlists.length !== 0">
              <div class="searchSuggestItemTitle">
                <i class="iconfont icon-genda"></i>
                歌单
              </div>
              <div class="suggestItemDetail" v-for="(item, index) in searchSuggestList.playlists" :key="index" @click="clickSuggestOption(item.id, 'musicListDetail')">
                {{ item.name }}
              </div>
            </div>
          </div>
        </el-popover>
      </div>
    </div>
    <div class="right">
      <div class="user">
        <div class="avatar">
<!--          登陆框-->
          <el-popover placement="bottom" width="330" trigger="click" v-if="!userInfo.avatarUrl">
            <LoginItem @getUserInfo="getUserInfo"></LoginItem>
            <img src="~assets/img/test.jpg" alt="" slot="reference" @click="isPopoverShow = !isPopoverShow"/>
          </el-popover>
          <img :src="userInfo.avatarUrl" alt="" slot="reference" v-else @click="goToPerson"/>
        </div>
        <div class="userName" v-if="userInfo.nickname">
          {{ userInfo.nickname }}
        </div>
        <div class="userName" v-else>点击头像登录</div>
      </div>
    </div>
  </div>
</template>

<script>
import {handleMusicTime} from "@/plugins/utils";
import {getCurrentUserInfo, getHotSearch, getMusicInfos, getSuggestList} from "@/api/request";
import LoginItem from "@/components/login/loginItem";

// 节流计时器声明
let timer;

export default {
  name: "headerBar",
  components: {LoginItem},
  data() {
    return {
      userInfo: {},
      isPopoverShow: false,
      isSearchPopShow: false,
      hotSearchList: [],
      searchInput: "",
      searchSuggestList: {},
      isRegisteredShow: false,
    }
  },
  methods: {
    getUserInfo(info) {
      this.userInfo = info
      this.isPopoverShow = false;
    },
    getHotSearch() {
      return getHotSearch().then(res=>{
        this.hotSearchList = res.data.data;
      })
    },
    getSuggestList(keywords) {
      getSuggestList({keywords}).then(res=>{
        this.searchSuggestList = res.data.result
      })
    },
    getMusicInfo(ids) {
      return new Promise(resolve => {
        getMusicInfos(ids).then(res=>{
          console.log(res)
          res.data.songs[0].dt = handleMusicTime(res.data.songs[0].dt)
          resolve(res.data.songs[0]);
        })
      })
    },
    getCurrentUserInfo() {
      let timestamp = Date.parse(new Date());
      return getCurrentUserInfo({timestamp}).then(res=>{
        if(res.data.profile !== null) {
          this.userInfo = res.data.profile;
          this.$store.commit("updateLoginState", true);
          window.localStorage.setItem("userId", res.data.profile.userId);
        }else {
          this.$store.commit("updateLoginState", false);
          if(window.localStorage.getItem("userId")) {
            window.localStorage.removeItem("userId");
          }
        }
      })
    },
    // 输入信息的回调
    inputSearch(e) {
      clearTimeout(timer);
      if (e !== "") {
        timer = setTimeout(()=>{
          this.getSuggestList();
        }, 500)
      }else {
        this.searchSuggestList = {}
      }
    },
    // 输入框内按下回车的回调
    onsubmit(e) {
      if(e.keyCode === 13 && this.searchInput !== "") {
        this.goSe
      }
    },
    // 跳转到详情界面
    goSearch() {
      this.isSearchPopShow = false;
      this.$router.push({name:"search", params:{id:this.searchInput}})
    },
    // 点击热搜榜回调
    clickHotSearch(searchWord) {
      this.searchInput = searchWord;
      this.goSearch();
    },
    // 点击非单曲的内容回调
    clickSuggestOption(id, name) {
      this.isSearchPopShow = false;
      this.$router.push({name, params:{id}})
    },
    clickSuggestSong(id) {
      this.getMusicInfo(id).then(row=>{
        this.isSearchPopShow = false;
        let musicList = this.$store.state.musicList;
        let currentIndex = this.$store.state.currentIndex;
        let isExist = musicList.find(item=> item.id === row.id);
        if (isExist) {
          this.$store.commit("updateMusicId");
        }else{
          this.$store.commit("changePlayState", false);
          // 将请求的歌单详情插入到歌单对应的位置并且提交至Vuex
          musicList.splice(currentIndex + 1, 0, row);
          this.$store.commit('updateMusicId', row.id);
          this.$store.commit('updateMusicList', {
            musicList,
            musicListId: this.$store.state.musicListId,
          })
        }
      })
    },
    // 关闭注册框
    closeRegistered(){
      this.isRegisteredShow = false;
    },
    // 跳转到个人界面
    goToPerson() {
      if (this.$route.path !== `/personal/${this.userInfo.userId}`) {
        this.$router.push({
          name: "personal",
          params: {
            uid: this.userInfo.userId,
          }
        })
      }
    },
  },
  created() {
    Promise.all([this.getHotSearch(), this.getCurrentUserInfo()]).then(() => {
      if (document.cookie.search("MUSIC_U") !== -1) {
        this.$store.commit("updateLoginState", true);
      }
    })
  },
  watch: {
    "$store.state.isLogin"(current) {
      if (!current && this.userInfo.nickname) {
        this.userInfo = {};
      }
    }
  }
}
</script>

<style scoped>
@import "./headerBarStyle.css";
.headerBar {
  display: flex;
  align-items: center;
  width: 100%;
  height: 50px;
  position: relative;
  z-index: 30000;
}

.left {
  width: 110px;
  margin: 0 50px 0 10px;
}

.left img {
  width: 100%;
}

.center {
  display: flex;
  align-items: center;
}

.buttons {
  color: rgb(235, 235, 235);
  /* display: flex; */
  height: 22px;
}

.buttons i {
  background-color: #e13e3e;
  font-size: 12px;
  transform: scale(0.8);
  padding: 5px;
  height: 22px;
  width: 22px;
  border-radius: 50%;
  margin: 0 3px;
}

.right {
  display: flex;
  position: absolute;
  right: 50px;
  top: 0;
  line-height: 50px;
}

.user {
  display: flex;
  align-items: center;
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 7px;
  cursor: pointer;
}

.avatar img {
  width: 100%;
}

.userName {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.85);
  width: 100px;
}

.loginButton {
  width: 100%;
  text-align: center;
}

.loginButton .el-button {
  width: 200px;
}

.el-form /deep/ .el-form-item__label {
  font-size: 13px !important;
}

.hotSearchTitle {
  font-size: 13px;
  margin: 10px 0 5px 20px;
}

.hotSearchItem {
  display: flex;
  align-items: center;
  padding: 6.5px 15px;
  cursor: pointer;
}

.hotSearchItem:hover {
  background-color: #f2f2f2;
}

.hotSearchIndex {
  margin-right: 15px;
  color: #aaa;
}

.topThree {
  color: #e13e3e;
}

.hotSearchWord {
  font-size: 12px;
  color: rgb(51, 51, 51);
}

.hotSearchWordTopThree {
  font-weight: 600;
  color: black;
}

.hotSearchContent {
  font-size: 12px;
  transform: scale(0.9) translateX(-5%);
}

.searchSuggest {
  font-size: 12px;
}

.searchSuggestItemTitle {
  background-color: #f5f5f7;
  padding: 4px 8px;
}

.searchSuggestItemTitle i {
  font-size: 15px;
}

.searchSuggestItem {
  cursor: pointer;
}

.suggestItemDetail {
  padding: 4px 27px;
  font-size: 12px;
}

.suggestItemDetail:hover {
  background-color: #f2f2f2;
}
</style>
