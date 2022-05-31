<template>
  <div class="rankingContainer">
    <div class="ranking" v-if="officialListDetail.length !== 0">
      <div class="offcial">
        <div class="title">官方榜</div>
        <list-table v-for="(item, index) in officialListDetail"
                    :official-list-detail-item="item" :key="index"
                    @handleRowClick="handleRowClick"
                    @handleRowDbClick="handleRowDbClick"
                    @clickCheckAll="clickListCardItem"></list-table>
      </div>
      <div class="global">
        <div class="title">全球榜</div>
        <list-card class="listCard" :list-card-data="globalList" @clickListCardItem="clickListCardItem"></list-card>
      </div>
    </div>
  </div>
</template>

<script>
import {getAllRankings, getMusicListDetail} from "@/api/request";
import {handleMusicTime} from "@/plugins/utils";
import ListTable from "@/components/listTable/listTable";
import ListCard from "@/components/listCard/listcard";

export default {
  name: "ranking",
  components: {ListCard, ListTable},
  data() {
    return {
      officialList: [],
      officialListDetail: [],
      globalList: [],
    }
  },
  methods: {
    getAllRankings(){
      return getAllRankings().then(res => {
        console.log(res);
        this.officialList = res.data.list.slice(0, 4);
        this.globalList = res.data.list.slice(4);
      })
    },
    getMusicListDetail(id) {
      return getMusicListDetail({id}).then(res=>{
        let result = res.data.playlist;
        result.tracks.forEach((item, index) =>{
          result.tracks[index].dt = handleMusicTime(item.dt);
        });
        this.officialListDetail.push(result);
      })
    },
    // 行点击事件回调
    handleRowClick(event) {
      console.log(event);
      if (document.querySelector(".selectRow")) {
        document.querySelector(".selectRow").classList.remove("selectRow");
      }
      event.classList.add("selectRow")
    },
    // id 歌单id index 双击歌曲在歌单中的索引
    handleRowDbClick({id, index}) {
      let musicListIndex = this.officialListDetail.findIndex((item) => item.id === id);
      console.log(musicListIndex)
      this.$store.commit("updateMusicId", this.officialListDetail[musicListIndex].tracks[index].id)
      if(id !== this.$store.state.musicListId) {
        this.$store.commit("updateMusicList", {
          musicList: this.officialListDetail[musicListIndex].tracks,
          musicListId: id,
        });
      }
    },
    // 点击榜单进入歌单详情
    clickListCardItem(id) {
      if (!this.$store.state.isLogin) {
        this.$message.error("登录后才能查看全部歌曲哦!");
        return;
      }
      if (id.id) {
        id = id.id;
      }
      this.$router.push({ name: "musicListDetail", params: { id } });
    },
  },
  created() {
    this.getAllRankings().then(()=>{
      this.officialList.forEach(item=>{
        this.getMusicListDetail(item.id);
      })
    })
  },
}
</script>

<style scoped>
.rankingContainer {
  display: flex;
  justify-content: center;
  width: 100%;
}

.ranking {
  max-width: 1000px;
  padding: 0 10px;
}

.listCard {
  margin-top: 15px;
}
</style>
