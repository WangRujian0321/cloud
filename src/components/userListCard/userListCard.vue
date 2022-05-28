<template>
  <div class="UserListCard" v-infinite-scroll="loadData" :infinite-scroll-disable="disabled" :infinite-scroll-distance="300"
       :infinite-scroll-immediate="false">
    <div class="userItemContainer" v-for="(item, index) in userList" :key="index" @click="clickUser(item.userId)">
      <div class="userItem">
        <div class="left">
          <img :src="item.avatarUrl + '?param=200y200'" alt="" class="avatar"/>
        </div>
        <div class="right">
          <div class="nickName">{{ item.nickname }}</div>
          <div class="signature">{{ item.signature }}</div>
          <div class="nums" v-if="userType === 'personalPage'">
            <div class="musicListNum">{{ "歌单" + item.playlistCount }}</div>
            <div class="fenge">|</div>
            <div class="followedsNum">{{ "粉丝：" + item.followeds }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "userListCard",
  props: {
    userList:{
      type: Array,
      default() {
        return [];
      }
    },
    isLoad: {
      type: Boolean,
      default() {
        return false;
      }
    },
    userType: {
      type: String,
      default() {
        return "personalPage"
      }
    }
  },
  data() {
    return {
      disabled: true,
    }
  },
  methods: {
    clickUser(id) {
      this.$router.push({name:"personal", params:{uid: id}})
    },
    loadData() {
      console.log('滑动到底部')
      this.$emit("bottomLoad")
      this.disabled = true;
    }
  },
  watch: {
    userList: {
      handler: ()=> {
        if(this.isLoad) {
          this.disabled = !this.userList.length;
        }
      }
    }
  }
}
</script>

<style scoped>
.UserListCard {
  display: flex;
  flex-wrap: wrap;
}

.userItemContainer {
  margin: 0 auto;
}

.userItem {
  display: flex;
  width: 350px;
  padding: 10px 10px;
  border-radius: 10px;
  cursor: pointer;
}

.userItem:hover {
  background-color: #f9f9f9;
}

.avatar {
  height: 70px;
  width: 70px;
  object-fit: cover;
  border-radius: 50%;
  border: 1px solid #eee;
  margin-right: 10px;
}

.nickName {
  margin: 10px 0 5px;
  font-size: 13px;
  color: #373737;
}

.signature {
  font-weight: lighter;
  font-size: 12px;
  transform: scale(0.9) translateX(-5%);
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 250px;
  height: 13px;
  margin: 5px 0;
}

.nums {
  display: flex;
  font-size: 12px;
  transform: scale(0.9) translateX(-5%);
  color: #888;
}

.fenge {
  color: #ddd;
  margin: 0 10px;
}
</style>
