<template>
  <div class="musicListIndex">
    <!--  精选歌单入口展示-->
    <div class="highqualityEntry">
      <img :src="theFirstOfHighQuality.coverImgUrl" alt="" class="backgroundImg"/>
      <div class="cover">
        <img :src="theFirstOfHighQuality.coverImgUrl" alt=""/>
      </div>
      <div class="EntryInfo">
        <div class="tag">
          <i class="iconfont icon-good"></i>精品歌单
        </div>
        <div class="name">{{ theFirstOfHighQuality.name }}</div>
        <div class="desc">{{ theFirstOfHighQuality.copywriter }}</div>
      </div>
    </div>
    <div class="musicListNavBar">
      <div class="left">
        <sort-box :current-tag="currentTag" :sort-list="sortList" @getSortList="getSortList" @clickSortBoxItem="clickSortBoxItem">
        </sort-box>
      </div>
      <div class="right">
        <second-nav-bar :second-nav-bar-data="hotTags" :item-width="0" :current-tag="currentTag" @clickSecondBarItem="clickSecondBarItem"></second-nav-bar>
      </div>
    </div>
<!--    显示歌单列表-->
    <list-card :list-card-data="musicList.playlists" @clickListCardItem="clickListCardItem"></list-card>
<!--    分页-->
    <div class="page" v-if="musicList.playlists">
      <el-pagination background layout="prev, pager, next" :total="musicList.total" :page-size="50" small :current-page="currentPage" @current-change="pageChange"></el-pagination>
    </div>
  </div>
</template>

<script>
import {getCatList, getHotTag, getTopHighQuality, getTopPlayList} from "@/api/request";
import SortBox from "@/components/sortBox/sortBox";
import SecondNavBar from "@/components/secondNavBar/secondNavBar";
import ListCard from "@/components/listCard/listcard";

export default {
  name: "musicListIndex",
  components: {ListCard, SecondNavBar, SortBox},
  data () {
    return {
      theFirstOfHighQuality: {},
      hotTags: [],
      musicList: {},
      currentTag: {},
      currentPage: 1,
      // 分类依据
      sortList: [],
    }
  },
  methods: {
    // 请求处理事件
    getTheFirstOfHighQuality() {
      getTopHighQuality({limit:1}).then(res=>{
        this.theFirstOfHighQuality = res.data.playlists[0]
      })
    },
    // 获取歌单热门标签
    getHotTag() {
      return getHotTag().then(res=>{
        this.currentTag = res.data.tags[0];
        this.hotTags = res.data.tags;
      })
    },
    // 根据歌名请求歌单列表
    getMusicList() {
      this.musicList = {};
      getTopPlayList({cat: this.currentTag.name, offset: 50 * (this.currentPage - 1)}).then(res=>{
        this.musicList = res.data;
      })
    },
    // 获得歌单分类数据
    getSortList() {
      getCatList().then(res=>{
        this.sortList = res.data.sub;
      })
    },
    // 处理点击事件
    // 接收点击二级navbar的回调
    clickSecondBarItem(index) {
      // console.log(this.hotTags[index].name);
      this.currentTag = this.hotTags[index];
      this.currentPage = 1;
      // 先清空musicList
      this.getMusicList();
    },
    //当页数发生改变时
    pageChange(page) {
      // page是当前页数
      // console.log(e);
      this.currentPage = page;
      this.getMusicList();
    },
    // 点击歌单的回调
    clickListCardItem(id) {
      console.log(id);
      this.$router.push({ name: "musicListDetail", params: { id } });
    },
    // 点击sortBoxItem中的回调
    clickSortBoxItem(item) {
      this.currentTag = item;
      this.currentPage = 1;
      this.getMusicList();
    },
  },
  created() {
    this.getTheFirstOfHighQuality();
    this.getHotTag().then(()=>{
      this.getMusicList()
    })
  },
}
</script>

<style scoped>
.highqualityEntry {
  position: relative;
  width: 100%;
  height: 140px;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
}
.backgroundImg {
  position: absolute;
  left: 0;
  top: 0;
  z-index: -1;
  width: 100%;
  transform: translateY(-80px);
  filter: blur(30px) brightness(70%);
}

.cover {
  width: 120px;
  height: 120px;
  margin: 10px;
}

.cover img {
  border-radius: 10px;
  width: 100%;
}

.tag {
  color: #d59e54;
  border: 1px solid #d59e54;
  padding: 5px 10px;
  width: 88px;
  font-size: 12px;
  margin: 20px 10px 15px;
  border-radius: 15px;
}

.tag i {
  font-size: 14px;
}

.name {
  color: white;
  font-size: 14px;
  margin: 10px 0;
}

.desc {
  color: rgba(255, 255, 255, 0.5);
  /* 字体直接写小于12没有效果 */
  font-size: 12px;
  transform: scale(0.9, 0.9);
}

.musicListNavBar {
  padding: 10px 0;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.page {
  width: 100%;
  text-align: center;
  padding-bottom: 20px;
}
</style>
