<template>
  <div class="album"></div>
</template>

<script>
import {getAlbumComment, getAlbumDetail, getAlbumSub, getAlbumSublist, loadMusic} from "@/api/request";
import {handleMusicTime, handleNum} from "@/plugins/utils";
import {formatDate} from "element-ui";

export default {
  name: "album",
  data() {
    return {
      albumInfo: {},
      comments: {},
      // 当前评论页数
      currentCommentPage: 1,
      isSub: false,
      // 评论是否在加载中
      isCommentLoading: false,
    }
  },
  methods:{
    getAlbumDetail() {
      return getAlbumDetail({id: this.$route.params.id}).then(res=>{
        let data = res.data
        data.songs.forEach((item, index) => {
          data.songs[index].dt = handleMusicTime(item.dt)
        })
        console.log(data)
        this.albumInfo = data;
      })
    },
    getAlbumComment(type) {
      let timestamp = Date.parse(new Date());
      this.isCommentLoading = true;
      if (type === "changePage") {
        let album = document.querySelector(".album");
        let listInfo = document.querySelector(".listInfo")
        console.log([listInfo])
        album.scrollTo({
          behavior: "smooth",
          top: listInfo.clientHeight - 25
        })
      }
      getAlbumComment({
        id: this.$route.params.id,
        offset: (this.currentCommentPage - 1) * 50,
        limit: 50,
        timestamp
      }).then(res => {
        this.isCommentLoading = false;
        if(res.data.code !== 200) {
          this.$message.error("获取评论失败，请稍后重试！");
        } else {
          this.comments = res.data;
        }
      })
    },
    // 获取已收藏专辑列表并判断用户是否收藏当前专辑  因为喜欢和收藏具有较高实时性，所以每次请求都添加时间戳，避免缓存304
    getAlbumSublist() {
      let timestamp = Date.parse(new Date())
      getAlbumSublist({
        limit: 1000,
        timestamp
      }).then(res => {
        console.log(res);
        this.$store.commit("updateSubAlbumList", res.data.data)''
      })
    },
    // 事件函数
    handleIndex(index) {
      index += 1;
      if (index < 10) {
        return "0" + String(index);
      }else {
        return index;
      }
    },
    clickRow(row) {
      this.$store.commit("updateMusicId", row.id)
      if (this.albumInfo.album.id !== this.$store.state.musicListId) {
        this.$store.commit("updateMusicList", {
          musicList: this.albumInfo.songs,
          musicListId: this.albumInfo.album.id
        })
      }
    },
    // 点击全部播放按钮的回调
    playAll() {
      this.$store.commit("updateMusicId", this.albumInfo.songs[0].id);
      this.$store.commit("updateMusicList", {
        musicList: this.albumInfo.songs,
        musicListId: this.albumInfo.id,
      })
    },
    // 评论点击翻页的回调
    commentPageChange(page) {
      this.currentCommentPage = page;
      this.getAlbumComment("changePage")
    },
    // 通过DOM操作样式
    handleDOM(current, last) {
      if (document.querySelector(".album")) {
        let tableRows = document.querySelector(".album").querySelectorAll(".el-table__row");
        let index = this.albumInfo.songs.findIndex(item=>item.id === current)
        if(index !== -1) {
          tableRows[index].children[0].querySelector(".cell").innerHTML = `<div><i class="iconfont icon-yinliang"></i></div>`;
          tableRows[index].children[0].querySelector(".iconfont").classList.add("currentRow");
          tableRows[index].children[2].querySelector(".cell").classList.add("currentRow");
        }
        // 清楚上一首样式
        if(last !== -1) {
          let lastIndex = this.albumInfo.songs.findIndex(item=>item.id === last)
          if(lastIndex !== -1) {
            tableRows[lastIndex].children[0].querySelector(".cell").innerHTML = `<div>${lastIndex + 1 < 10 ? "0" + (lastIndex + 1) : lastIndex + 1}</div>`;
            tableRows[lastIndex].children[2].querySelector(".cell").classList.remove("currentRow");
          }
        }
      }
    },
    subAlbum() {
      this.isSub = !this.isSub;
      getAlbumSub({
        id: this.$route.params.id,
        t: this.isSub ? 1 : 0
      }).then(()=>{
        this.getAlbumSublist()
      })
    },
    // 判断用户是否收藏了该专辑
    getIsSub() {
      this.isSub = this.$store.state.subAlbumList.find(
          (item) => item.id === this.$route.params.id
      );
    },
    clickCellckCell(row, column, cell) {
      if(cell.querySelector(".icon-download")) {
        console.log(row);
        loadMusic({id: row.id}).then(res => {
          console.log(res);
          if(res.data.data[0].url == null) {
            this.$message.warning("暂时无法获取该资源");
          }else{
            let url = res.data.data[0].url.match(/\http.*?\.net/)
            // 匹配域名名称，并匹配对应的代理
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
        })
      }
    }
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
  watch: {

  },
  created() {
    this.getAlbumComment();
  },
  async mounted() {
    await this.getAlbumDetail();
    this.$nextTick(()=>{
      // 判断是否和上一次打开的歌单相同
      if (this.$route.params.id === this.$store.state.musicListId) {
        this.handleDOM(this.$store.state.musicId);
      }
    });
    if (this.$store.state.subAlbumList == null) {
      await this.getAlbumSublist();
    }
    this.getIsSub();
  }
}
</script>

<style scoped>
.album {
  height: calc(80vh - 105px);
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

.otherInfo {
  margin: 5px 0 0 -30px;
  display: flex;
  font-size: 12px;
  transform: scale(0.9);
}

.musicNum {
  margin-right: 13px;
}

.musicList {
  margin: -15px 15px 0;
}

.page {
  width: 100%;
  text-align: center;
  padding-bottom: 20px;
}

.albumDesc {
  font-size: 12px;
  color: #373737;
  line-height: 25px;
  letter-spacing: 0.5px;
  text-indent: 2em;
}

.red {
  color: #ec4141;
}

.album /deep/ .el-loading-spinner {
  top: 40px;
}

.playCount span {
  cursor: pointer;
}
</style>
