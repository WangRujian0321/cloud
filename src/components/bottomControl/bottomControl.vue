<template>
  <div class="bottomControl">
    <audio :src="musicUrl" ref="audioPlayer" autoplay
           @play="changeState(true)"
           @pause="changeState(false)"
           @ended="changeSong('next')" @timeupdate="timeUpdate"></audio>
    <div class="left">
      <div class="avatar" @click="$store.commit('changeMusicDetailCardState')">
        <img :src="musicDetail.al.picUrl" alt="" v-if="musicDetail.al" :draggable="false"/>
        <img src="'~assets/img/test.jpg" alt="" v-else :draggable="false"/>
<!--        显示专辑封面-->
      </div>
      <div class="musicInfo">
        <div class="musicName" v-if="musicDetail && musicDetail.name">
          {{ musicDetail.name }}
        </div>
        <div class="singer" v-if="musicDetail && musicDetail.name" @click="goToSingerDetail">
          {{ musicDetail.ar[0].name }}
        </div>
      </div>
      <div class="downloadContainer" v-if="musicDetail.name">
        <i class="iconfont icon-download" @click="downloadCurrentMusic"></i>
      </div>
    </div>
    <div class="center">
      <div class="buttons">
        <span @click="playType = playType === 'order' ? 'random' : 'order'">
          <i class="iconfont icon-xunhuan" v-if="playType === 'order'"></i>
          <i class="iconfont icon-suiji" v-else></i>
        </span>
        <span @click="musicList.length !== 0 ? changeSong('pre') : ''">
          <i class="iconfont icon-shangyishou"></i>
        </span>
        <span @click="musicList.length !== 0 ? changePlayState() : ''">
          <i class="iconfont icon-bofang" v-if="!this.$store.state.isPlay"></i>
          <i class="iconfont icon-zantingtingzhi" v-else></i>
        </span>
        <span>
          <i class="iconfont icon-xihuan" :class="isUserLikeCurrentMusic ? 'like' : ''"
             @click="musicList.length !== 0 ? likeIt() : ''"></i>
        </span>
      </div>
<!--      进度条-->
      <div class="progressBar">
        <span class="currentTime">{{ currentTime | handleMusicTime }}</span>
        <el-slider class="progressSlider" v-model="timeProgress" :show-tooltip="false"
                   @change="changeProgress" :disabled="musicList.length === 0"></el-slider>
        <span class="totalTime">{{ duration }}</span>
      </div>
    </div>
    <div class="right">
      <div class="volumeControl">
        <i class="iconfont icon-yinliang" @click="changeMuteState"></i>
        <el-slider class="volumeSlider" v-model="volume" @input="changeVolume" :show-tooltip="false"></el-slider>
      </div>
      <div class="playList" @click="changeDrawer">
        <i class="iconfont icon-bofangliebiao"></i>
      </div>
<!--      其他信息-->
      <el-tooltip class="item" effect="dark" placement="left" :enterable="false">
        <div v-html="recondInfo" slot="content"></div>
        <el-link type="info" href="https://www.axia.run/" target="_blank" class="recondInfo">博客地址</el-link>
      </el-tooltip>
    </div>
    <el-drawer :visible.sync="drawer" :with-heade="false" width="300">
      <div class="drawerHeader">总{{ musicList.length }}首</div>
      <el-table :data="musicList" stripe style="width: 100%" :show-header="false" @row-dbclick="clickRow" highlight-current-row lazy>
        <el-table-column prop="name" width="150px"></el-table-column>
        <el-table-column prop="ar[0].name" width="80px"></el-table-column>
        <el-table-column prop="dt" width="70px"></el-table-column>
      </el-table>
    </el-drawer>
  </div>
</template>

<script>
import {getLikeList, likeMusic, loadMusic} from "@/api/request";
import {handleMusicTime, returnSecond} from "@/plugins/utils";

let lastSecond = 0;
// 总时长的秒数
let durationNum = 0;
// 保存当前音量
let volumeSave = 0;
// 当前音乐类型，用于下载
let musicType = "";

export default {
  name: "bottomControl",
  data () {
    return {
      musicDetail: {},
      musicUrl: "",
      musicList: [],
      currentMusicIndex: 0,
      drawer: false,
      duration: "00:00",
      currentTime: 0,
      timeProgress: 0,
      volume: 30,
      isMuted: false,
      // 抽屉是否被打开过（如果没打开过，里面的数据是不会渲染的）
      hasDrawerOpend: false,
      // 用户的喜欢音乐列表
      likeMuiscList: [],
      // 用户是否喜欢当前音乐
      isUserLikeCurrentMusic: false,
      recondInfo: `<div style='text-align:center;font-size:12px;'>本站为仿网易云音乐展示项目, 仅供学习使用, 侵权必删!</div>`,
      // 播放模式（顺序播放，随机播放）
      // order random
      playType: "order",
    }
  },
  methods: {
    getMusicDetail(id) {
      this.$store.commit("updateMusicLoadState", true);
      loadMusic(id).then(res=>{
        if(res.data.data[0].url === null) {
          this.$message.error("该歌曲无版权，将为您播放下一首歌曲")
          this.changeSong("next")
        } else {
          this.musicUrl = res.data.data[0].url;
          musicType = res.data.data[0].type.toLowerCase()
          this.$store.commit("updateMusicLoadState", false)
        }
      })
    },
    likeMusic(id, like) {
      return likeMusic(id, like).then(res=>{
        if (res.data.code === 200) {
          this.$message.success("喜欢操作成功！")
        } else {
          this.$message.error("喜欢操作失败！请稍后重试")
        }
      })
    },
    getLikeMusicList() {
      let timestamp = Date.parse(new Date())
      getLikeList({
        uid: window.localStorage.getItem("userId"),
        timestamp,
      }).then(res => {
        this.likeMuiscList = res.data.ids;
        this.$store.commit('updateLikeMusicList', this.likeMuiscList)
      })
    },
    // 点击播放键
    changePlayState() {
      !this.$store.state.isPlay ? this.playMusic() : this.pauseMusic()
    },
    playMusic() {
      this.$refs.audioPlayer.play()
    },
    pauseMusic() {
      this.$refs.audioPlayer.pause()
    },
    changeState(state) {
      this.$store.commit("changePlayState", state)
    },
    // 根据id找到 musicList中对应的musicDetail
    getMusicDetailFromMusicList() {
      let index = this.musicList.findIndex(item => item.id === this.$store.state.musicID)
      console.log(index)
      if(index !== -1) {
        this.currentMusicIndex = index;
        this.$store.commit("updateCurrentIndex", index);
        this.musicDetail = this.musicList[index];
        // 直接从audio标签中的duration属性拿时长会有请求时差问题，所以直接在musicInfo中拿
        this.duration = this.musicList[index].dt;
      }
    },
    changeSong(type, id=-1) {
      if(type === "click") {
        this.$store.commit("updateMusicId", id);
      }else if(type === "pre") {
        let currentMusicIndex = this.currentMusicIndex;
        let preIndex;
        if(this.playType === "order") {
          preIndex = currentMusicIndex - 1 < 0 ? this.musicList.length - 1 : currentMusicIndex - 1
        } else if(this.playType === "random") {
          if (this.musicList.length === 1){
            preIndex = currentMusicIndex;
          }else {
            preIndex = currentMusicIndex
            while (preIndex === currentMusicIndex) {
              preIndex = Math.floor(Math.random() * this.musicList.length)
            }
          }
        }
        console.log(this.musicList[preIndex].id)
        this.$store.commit("updateMusicId", this.musicList[preIndex].id)
      }else if(type === "next") {
        let currentMusicIndex = this.currentMusicIndex
        let nextIndex;
        if(this.playType === "order") {
          nextIndex = currentMusicIndex + 1 === this.musicList.length ? 0 : currentMusicIndex + 1
        } else if (this.playType === "random") {
          if(this.musicList.length === 1) {
            nextIndex = currentMusicIndex
          }else{
            nextIndex = currentMusicIndex
            while(nextIndex === currentMusicIndex) {
              nextIndex = Math.floor(Math.random() * this.musicList.length)
            }
          }
        }
        console.log(this.musicList[nextIndex].id)
        this.$store.commit("updateMusicId", this.musicList[nextIndex].id)
      }
    },
    clickRow(row) {
      this.changeSong("click", row.id)
    },
    timeUpdate() {
      let time = this.$refs.audioPlayer.currentTime;
      this.$store.commit("updateCurrentTime", time);
      time = Math.floor(time)
      if (time !== lastSecond) {
        lastSecond = time;
        this.currentTime = time;
        this.timeProgress = Math.floor((time / durationNum) * 100)
      }
    },
    changeProgress(e) {
      // 修改当前播放时间
      this.currentTime = Math.floor((e / 100) * durationNum);
      // 改变audio的实际当前播放时间
      this.$refs.audioPlayer.currentTime = this.currentTime;
    },
    changeVolume(e) {
      // 改变audio音量
      // input事件 实时触发
      this.$refs.audioPlayer.volume = e / 100
      if (this.isMuted && e > 0) {
        this.isMuted = false
      } else if (e === 0 && this.isMuted === false) {
        this.isMuted = true
      }
    },
    changeMuteState() {
      if (this.isMuted) {
        this.volume = volumeSave
      } else {
        volumeSave = this.volume;
        this.volume = 0;
      }
      console.log(volumeSave, this.isMuted)
      this.isMuted = !this.isMuted
    },
    // 操作drawerList中DOM的函数
    handleDrawerListDOM(currentIndex, lastIndex) {
      this.$nextTick(()=>{
        let tableRows = document.querySelector(".bottomControl").querySelectorAll(".el-table__row");
        if(tableRows[currentIndex]) {
          tableRows[currentIndex].children[0].querySelector(".cell").classList.add("currentRow");
          tableRows[currentIndex].children[1].querySelector(".cell").classList.add("currentRow");
        }
        if((lastIndex && lastIndex !== -1) && tableRows[lastIndex] || lastIndex === 0) {
          tableRows[lastIndex].children[0].querySelector(".cell").classList.remove("currentRow");
          tableRows[lastIndex].children[1].querySelector(".cell").classList.remove("currentRow");
        }
      });
    },
    // 点击打开抽屉的回调
    changeDrawer() {
      this.drawer = !this.drawer;
      this.hasDrawerOpend = true;
      this.handleDrawerListDOM(this.currentMusicIndex);
    },
    getIsUserLikeCurrentMusic() {
      this.isUserLikeCurrentMusic = this.likeMuiscList.find(item => item === this.$store.state.musicID)
    },
    likeIt() {
      if (!window.localStorage.getItem("userInfo")) {
        this.$message.error("请先登录!");
        return;
      }
      this.isUserLikeCurrentMusic = !this.isUserLikeCurrentMusic;
      this.likeMusic(
          this.$store.state.musicID,
          this.isUserLikeCurrentMusic
      ).then(()=>{
        this.getLikeMusicList();
      })
    },
    downloadCurrentMusic() {
      console.log("start DownLoad");
      let url = this.musicUrl.match(/\http.*?\.net/);
      let serve = url[0].match(/http:\/(\S*).music/)[1];
      if (
          serve !== "/m7" &&
          serve !== "/m701" &&
          serve !== "/m8" &&
          serve !== "/m801"
      ) {
        // 没有对应的代理
        this.$message.error("匹配不到对应的代理,下载失败!");
        return;
      }
      // 截取后面的参数
      let params = this.musicUrl.slice(url[0].length);

      let downloadMusicInfo = {
        url: serve + params,
        name:
            this.musicDetail.name +
            " - " +
            this.musicDetail.ar[0].name +
            "." +
            musicType,
      };

      console.log(downloadMusicInfo);
      this.$store.commit("updateDownloadMusicInfo", downloadMusicInfo);
    },
    // 点击歌手名跳转至歌手页面的回调
    goToSingerDetail() {
      if (this.$route.path == `/singerDetail/${this.musicDetail.ar[0].id}`)
        this.$router.push({
          name: "singerDetail",
          params: { id: this.musicDetail.ar[0].id },
        });
      if (this.$store.state.isMusicDetailCardShow === true) {
        this.$store.state.commit("changeMusicDetailCardState", false);
      }
    },
  },
  watch: {
    // 监听vuex中musicId的变化
    "$store.state.musicID"(id) {
      console.log("vuex中的id发生了变化");
      // 先暂停当前播放的音乐
      this.pauseMusic();
      this.musicList = this.$store.state.musicList;
      this.getMusicDetailFromMusicList();
      this.getMusicDetail(id);
      durationNum = returnSecond(this.duration);
      // 判断用户是否喜欢当前音乐
      this.getIsUserLikeCurrentMusic();
      // console.log(this.$refs.audioPlayer);
    },
    // 监听currentIndex的变化
    "$store.state.currentIndex"(currentIndex, lastIndex) {
      if (this.hasDrawerOpend) {
        this.handleDrawerListDOM(currentIndex, lastIndex);
      }
    },
    // 监听播放状态
    "$store.state.isPlay"(isPlay) {
      if (isPlay) {
        this.playMusic();
      } else {
        this.pauseMusic();
      }
    },
    "$store.state.isLogin"(current) {
      if (current) {
        this.getLikeMusicList();
      } else {
        // 清空喜欢列表
        this.likeMuiscList = [];
      }
    },
  },
  filters: {
    handleMusicTime,
  }
}
</script>

<style scoped>
.bottomControl {
  /* background-color: pink; */
  border-top: 1px solid #ddd;
  width: 100%;
  height: 55px;
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  padding: 6px 10px;
  z-index: 10000;
  background-color: #fff;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 5px;
  overflow: hidden;
  margin-right: 10px;
  cursor: pointer;
}

.avatar img {
  width: 100%;
}

.left {
  display: flex;
  align-items: center;
  width: 123px;
}

.musicInfo {
  color: rgb(37, 37, 37);
  font-size: 12px;
  width: 70px;
}

.musicName {
  margin-bottom: 4px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.singer {
  transform: scale(0.9);
  margin-left: -3px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}

.center {
  margin-top: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.buttons {
  display: flex;
  align-items: center;
  height: 13px;
}

.buttons i {
  font-size: 20px;
  color: #313131;
}

.buttons span:nth-child(3) i {
  font-size: 25px;
}

.center .icon-xunhuan {
  font-size: 17px;
}
.center .icon-xihuan {
  font-size: 15px;
}

.right {
  display: flex;
  align-items: center;
  position: relative;
}

.volumeControl {
  display: flex;
  align-items: center;
  margin-right: 15px;
}

.icon-yinliang {
  font-size: 18px;
  margin-right: 7px;
}

.volumeSlider {
  width: 55px;
}

.icon-bofangliebiao {
  font-size: 18px;
  margin-right: 10px;
}

.progressSlider {
  width: 300px;
}

.buttons span {
  display: inline-block;
  width: 50px;
  box-sizing: border-box;
  text-align: center;
}

.icon-zantingtingzhi {
  font-size: 35px !important;
}

.drawerHeader {
  font-size: 12px;
  transform: scale(0.9);
  color: #aaa;
  padding: 15px 0;
}

.progressBar {
  display: flex;
  align-items: center;
}

.currentTime,
.totalTime {
  font-size: 12px;
  transform: scale(0.85);
  color: #aaa;
  margin: 0 5px;
  width: 30px;
  text-align: center;
}

.progressBar {
  height: 10px;
  margin-top: 12px;
  overflow: hidden;
}

.like {
  color: #ec4141 !important;
}

.downloadContainer {
  height: 100%;
  position: relative;
}

.downloadContainer i {
  position: absolute;
  bottom: 5px;
}

.recondInfo {
  position: absolute;
  font-size: 12px;
  transform: scale(0.8);
  width: 140px;
  right: -5px;
  bottom: -5px;
}

.center .icon-suiji1 {
  font-size: 15px;
}
</style>
