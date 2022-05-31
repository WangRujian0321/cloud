<template>
  <div class="musicListDetail">
    111
  </div>
</template>

<script>
import {getMusicListComment, getMusicListDetail} from "@/api/request";
import {handleMusicTime, handleNum} from "@/plugins/utils";
import {formatDate} from "element-ui";

export default {
  name: "musicListDetail",
  data() {
    return {
      musicListDetail: null,
      comments: {},
      // 当前评论页数
      currentCommentPage: 1,
      // 是否还有更多音乐
      isMore: false,
      // 用户是否收藏了当前歌单
      isSub: false,
      // 是否是用户创建的歌单
      isCreated: false,
      // 评论是否在加载
      isCommentLoading: false,
      // 是否禁止滚动加载
      scrollLoadDisabled: false,
      // 收藏者列表的变量
      followedsListData: {
        // 当前页数
        currentPage: 1,
        // 列表
        followedsList: [],
        // 是否还有更多
        isMore: false,
        // 是否已经加载过列表数据 （用于点击收藏者tab后第一次加载数据）
        isLoaded: false,
      }
    }
  },
  methods: {
    getMusicListDetail () {
      let timestamp = Date.parse(new Date())
      return getMusicListDetail({
        id: this.$route.params.id,
        timestamp,
      }).then(res=>{
        this.musicListDetail = res.data.playlist
        if (this.musicListDetail.tracks.length !== this.musicListDetail.trackIds.length) this.isMore = true;
        // 处理播放时间
        this.musicListDetail.tracks.forEach((item, index) => {
          this.musicListDetail.tracks[index].dt = handleMusicTime(item.dt);
        });
      })
    },
    getMusicListComment(type) {
      const timestamp = Date.parse(new Date());
      this.isCommentLoading = true;

      if (type === "changePage") {
        this.scrollToComment();
      }
      return getMusicListComment({
        id: this.$route.params.id,
        offset: (this.currentCommentPage - 1) * 50,
        limit: 50,
        timestamp,
      }).then(res=>{
        console.log(res);
        if (res.data.code !== 200) {
          this.$message.error("获取评论失败,请稍后重试!");
        }
        this.comments = res.data;
        this.isCommentLoading = false;
        console.log("重新歌单获取评论");
      })
    },
    scrollToComment () {
      let musicListDetail = document.querySelector(".musicListDetail");
      let listInfo = document.querySelector(".listInfo");
      // console.log("执行了这里 滚动到精彩评论", [listInfo]);
      musicListDetail.scrollTo({
        behavior: "smooth",
        top: listInfo.clientHeight - 20,
      });
    },
    // 获取歌曲详情
    async getMusicDetail(ids) {
      if (this.isMore === false) return;
      this.scrollLoadDisabled = true;

      let res = await this.$request("/song/detail", { ids });
      // 处理时间
      console.log(res);
      res.data.songs.forEach((item, index) => {
        res.data.songs[index].dt = handleMusicTime(item.dt);
      });
      this.musicListDetail.tracks.push(...res.data.songs);
      // 判断是否还有更多音乐
      if (
          this.musicListDetail.tracks.length <
          this.musicListDetail.trackIds.length
      ) {
        this.isMore = true;
        this.scrollLoadDisabled = false;
      } else {
        this.isMore = false;
      }
    },

    // 请求用户歌单
    async getUserMusicList() {
      let timestamp = Date.parse(new Date());
      // 先从localStorage里面读取用户信息  如果登录成功是有存的
      this.userInfo =
          window.localStorage.getItem("userInfo") &&
          JSON.parse(window.localStorage.getItem("userInfo"));
      let res = await this.$request("/user/playlist", {
        uid: this.userInfo.userId,
        timestamp,
      });
      res = res.data.playlist;
      let index = res.findIndex((item) => item.subscribed === true);
      this.collectedMusicList = res.slice(index);
      // 将收藏的歌单上传至vuex
      this.$store.commit("updateCollectMusicList", this.collectedMusicList);
    },

    // 获取歌单收藏者
    async getMusicListFolloweds() {
      let res = await this.$request("/playlist/subscribers", {
        id: this.$route.params.id,
        offset: (this.followedsListData.currentPage - 1) * 20,
      });
      console.log(res);
      this.followedsListData.isMore = res.data.more;
      this.followedsListData.followedsList.push(...res.data.subscribers);
    },

    // 事件函数
    handleIndex(index) {
      // console.log(index);
      index += 1;
      if (index < 10) {
        return "0" + index;
      } else {
        return index;
      }
    },
    // 双击table的row的回调
    async clickRow(row) {
      console.log(row);
      // 将musicId提交到vuex中 供bottomControl查询歌曲url和其它操作
      this.$store.commit("updateMusicId", row.id);
      // 如果歌单发生变化,则提交歌单到vuex
      if (this.musicListDetail.id !== this.$store.state.musicListId) {
        // 将歌单传到vuex
        this.$store.commit("updateMusicList", {
          musicList: this.musicListDetail.tracks,
          musicListId: this.musicListDetail.id,
        });
      }

      // let result = await this.$request("/song/url", { id: row.id, br: 320000 });
      // console.log(result.data.data[0].url);
      // this.$store.commit("updateMusicUrl", result.data.data[0].url);
    },
    // 点击播放全部按钮的回调
    playAll() {
      this.$store.commit("updateMusicId", this.musicListDetail.tracks[0].id);
      this.$store.commit("updateMusicList", {
        musicList: this.musicListDetail.tracks,
        musicListId: this.musicListDetail.id,
      });
    },
    // 评论点击翻页的回调
    commentPageChange(page) {
      this.currentCommentPage = page;
      this.getMusicListComment("changePage");
    },

    handleDOM(current, last) {
      if (document.querySelector(".musicListDetail")) {
        let tableRows = document
            .querySelector(".musicListDetail")
            .querySelectorAll(".el-table__row");
        // 遍历当前musicList 找到当前播放的index的行进行渲染
        // console.log(tableRows);
        let index = this.musicListDetail.tracks.findIndex(
            (item) => item.id == current
        );
        // console.log(index);
        if (index != -1) {
          // 直接修改dom样式的颜色无效  可能是因为第三方组件的原故
          // 通过引入全局样式解决
          // 将正在播放的音乐前面的索引换成小喇叭
          tableRows[index].children[0].querySelector(
              ".cell"
          ).innerHTML = `<div><i class="iconfont icon-yinliang"></i></div>`;
          tableRows[index].children[0]
              .querySelector(".iconfont")
              .classList.add("currentRow");
          tableRows[index].children[2]
              .querySelector(".cell")
              .classList.add("currentRow");
        }
        // 清除上一首的样式
        if (last != -1) {
          let lastIndex = this.musicListDetail.tracks.findIndex(
              (item) => item.id == last
          );
          if (lastIndex != -1) {
            // 将上一个播放的dom的小喇叭换回索引
            tableRows[lastIndex].children[0].querySelector(
                ".cell"
            ).innerHTML = `<div>${
                lastIndex + 1 < 10 ? "0" + (lastIndex + 1) : lastIndex + 1
            }</div>`;

            // 将上一首的类名删掉  小喇叭的html已经被替换了，不需要再还原
            tableRows[lastIndex].children[2]
                .querySelector(".cell")
                .classList.remove("currentRow");
          }
        }
      }
    },
    // 点击el-tab-pane的回调
    clickTab(e) {
      console.log(e.index);
      if (e.index == 1 && !this.comments.comments) {
        this.getMusicListComment();
      } else if (e.index == 2 && !this.followedsListData.isLoaded) {
        this.getMusicListFolloweds();
        this.followedsListData.isLoaded = true;
      }
    },
    // 点击加载所有音乐的回调
    loadMore() {
      if (!this.$store.state.isLogin) {
        this.$message.error("请先进行登录操作!");
        return;
      }
      // console.log("加载所有音乐");
      // this.isMore = false;

      let arr = this.musicListDetail.trackIds.slice(
          this.musicListDetail.tracks.length
      );
      if (arr.length > 100) {
        arr = arr.slice(0, 100);
      }
      // console.log(arr.length);
      let ids = "";
      arr.forEach((item) => {
        ids += item.id + ",";
      });
      ids = ids.substr(0, ids.length - 1);
      // console.log(ids);
      this.getMusicDetail(ids);
    },
    // 判断用户是否收藏了该歌单
    getIsSub() {
      this.isSub = this.$store.state.collectMusicList.find(
          (item) => item.id == this.$route.params.id
      );
    },
    // 判断是否是用户创建的歌单
    getIsCreated() {
      this.isCreated = this.$store.state.createdMusicList.find(
          (item) => item.id == this.$route.params.id
      );
    },
    // 点击收藏按钮的回调
    async collectList() {
      if (!this.$store.state.isLogin) {
        // this.$message.error("请先进行登录操作!");
        return;
      }
      this.isSub = !this.isSub;
      // 请求
      let timestamp = Date.parse(new Date());
      await this.$request("/playlist/subscribe", {
        id: this.$route.params.id,
        t: this.isSub ? 1 : 2,
        timestamp,
      });
      // 请求收藏歌单列表并保存至vuex
      this.getUserMusicList();
    },

    async clickCell(row, column, cell) {
      // 判断点击的是下载按钮
      if (cell.querySelector(".icon-download")) {
        // 请求该歌曲的url
        console.log(row);
        let res = await this.$request("/song/url", { id: row.id });
        console.log(res.data.data[0].url);
        console.log(res);
        if (res.data.data[0].url == null) {
          this.$message.warning("暂时无法获取该资源哦!");
          return;
        }

        // 匹配资源的域名
        let url = res.data.data[0].url.match(/\http.*?\.net/);
        // 匹配域名名称，并匹配对应的代理
        let serve = url[0].match(/http:\/(\S*).music/)[1];
        if (
            serve != "/m7" &&
            serve != "/m701" &&
            serve != "/m8" &&
            serve != "/m801"
        ) {
          // 没有对应的代理
          this.$message.error("匹配不到对应的代理,下载失败!");
          return;
        }
        // 截取后面的参数
        let params = res.data.data[0].url.slice(url[0].length);
        // console.log(url[0], serve, params);

        let downloadMusicInfo = {
          url: serve + params,
          name:
              row.name +
              " - " +
              row.ar[0].name +
              "." +
              res.data.data[0].type.toLowerCase(),
        };
        console.log(downloadMusicInfo);
        this.$store.commit("updateDownloadMusicInfo", downloadMusicInfo);
      }
    },

    // 收藏者列表触底的回调
    bottomLoad() {
      this.followedsListData.currentPage += 1;
      this.getMusicListFolloweds();
    },
  },
  computed: {},
  watch: {
    // "$store.state.currentIndex"(currentIndex, lastIndex) {
    //   // 目前没什么好思路 直接操作原生DOM
    //   console.log(currentIndex, lastIndex);
    //   // this.handleTableDOM(currentIndex, lastIndex);
    // },
    "$store.state.musicId"(current, last) {
      this.handleDOM(current, last);
    },
    // 监听createdMusicList的变化
    "$store.state.createdMusicList"(current, last) {
      // 如果在收藏页面刷新，收藏歌单还没获取到，但是收藏按钮已经渲染了，所以在第一次获取到数据时，再渲染一次
      // 如果是刚刷新，last则为空
      if (last.length === 0) {
        this.getIsSub();
      }
    },
  },
  filters: {
    showDate(value) {
      // 1、先将时间戳转成Date对象
      const date = new Date(value);

      // 2、将date进行格式化
      return formatDate(date, "yyyy-MM-dd");
    },
    handleNum,
  },
  created() {},
  async mounted() {
    if (this.$store.state.isLogin) {
      // 先判断是否是用户创建的歌单
      this.getIsCreated();
      // 如果不是 再判断是否是收藏的歌单
      if (!this.isCreated) {
        this.getIsSub();
      }
    }
    await this.getMusicListDetail();
    this.$nextTick(() => {
      // 判断是否和上一次打开的歌单相同
      if (this.$route.params.id === this.$store.state.musicListId) {
        this.handleDOM(this.$store.state.musicId);
      }
    });
  },
}
</script>

<style scoped>
.musicListDetail {
  overflow-y: scroll;
}

.listInfo {
  display: flex;
  padding: 25px 15px;
  align-items: center;
}

.listAvatar {
  width: 150px;
  height: 150px;
  overflow: hidden;
  border-radius: 10px;
  margin-right: 15px;
  position: relative;
}

.listAvatar::after {
  content: "";
  position: absolute;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  background: url("~assets/img/imgLoading.png") no-repeat;
  background-size: contain;
  z-index: -1;
}

.listAvatar img {
  width: 100%;
}

.right {
  width: calc(100% - 200px);
}

.title {
  display: flex;
  align-items: center;
}

.titleTag {
  font-size: 12px;
  color: #ec4141;
  border: 1px solid #ec4141;
  padding: 1px 2px;
  border-radius: 2px;
  margin-right: 5px;
  transform: scale(0.8);
}

.titleContent {
  font-size: 20px;
  font-weight: 600;
  color: #373737;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 90%;
}

.user {
  display: flex;
  align-items: center;
  margin-top: 8px;
  font-size: 12px;
}

.userAvatar {
  height: 25px;
  width: 25px;
  margin-right: 8px;
}

.userAvatar img {
  width: 100%;
  border-radius: 50%;
}

.userName {
  color: #6191c2;
  margin-right: 8px;
  cursor: pointer;
}

.createTime {
  transform: scale(0.9);
}

.buttons {
  margin: 8px 0 0 -5px;
  display: flex;
}

.buttonItem {
  font-size: 12px;
  padding: 8px 15px;
  border: 1px solid #ddd;
  border-radius: 20px;
  transform: scale(0.9);
}

.buttonItem i {
  font-size: 12px;
  margin-right: 3px;
  transform: scale(0.9);
}

.playAll {
  background-color: #ec4141;
  color: white;
}

.tags {
  margin: 8px 0 0 -30px;
  display: flex;
  font-size: 12px;
  transform: scale(0.9);
}

.tagItem {
  color: #6191c2;
  margin-right: 5px;
}

.otherInfo {
  margin: 5px 0 0 -30px;
  display: flex;
  font-size: 12px;
  transform: scale(0.9);
}

.musicNum {
  margin-right: 13px;
}

.desc {
  margin: 5px 0 0 -30px;
  font-size: 12px;
  transform: scale(0.9);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.musicList {
  margin: -15px 15px 0;
}

.page {
  width: 100%;
  text-align: center;
  padding-bottom: 20px;
}

.placeholder {
  width: 100%;
  height: 50px;
}

.loadMore {
  width: 100%;
  height: 50px;
  font-size: 12px;
  color: #aaa;
  text-align: center;
  line-height: 50px;
  transform: scale(0.9);
}

.red {
  color: #ec4141;
}

.commentList /deep/ .el-loading-spinner {
  top: 40px;
}

.tips {
  font-size: 14px;
  margin: 30px 0;
  text-align: center;
}
</style>
