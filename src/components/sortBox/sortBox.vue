<template>
  <div class="SortBoxContainer">
    <el-popover placement="bottom-start" width="350" popper-class="sortPop" trigger="click" :visible-arrow="false" v-model="isSortPopShow" @show="showSortPop">
      <div class="SortBox" slot="reference">
        {{ currentTag.name }} <i class="iconfont icon-arrow-right-bold"></i>
        <div class="tips" v-if="sortList.length === 0" >正在加载分类数据...</div>
        <div class="sortList" v-else>
          <div class="sortItem" :class="currentTag.name === item.name ? 'currentItem': ''"
               v-for="(item, index) in sortList" :key="index" @click="clickItem(item)">
            {{item.name}}
          </div>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: "sortBox",
  props: {
    currentTag: {
      type: Object,
      default() {
        return {};
      },
    },
    sortList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      // 是否显示分类选择框
      isSortPopShow: false,
    };
  },
  methods: {
    showSortPop() {
      if(this.sortList.length === 0) {
        this.$emit("getSortList");
      }
    },
    // 点击分类回调
    clickItem(item) {
      this.$emit("clickSortBoxItem", item);
      this.isSortPopShow = false;
    }
  }
}
</script>

<style scoped>
.SortBox {
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 20px;
  cursor: pointer;
  transform: scale(0.9);
}

.SortBox i {
  font-size: 12px;
}

.tips {
  width: 100%;
  text-align: center;
  font-size: 12px;
  padding: 20px 0;
  color: rgb(145, 145, 145);
}

.sortList {
  display: flex;
  flex-wrap: wrap;
}

.sortItem {
  font-size: 12px;
  width: 25%;
  text-align: center;
  color: rgb(85, 85, 85);
  padding: 5px 0;
  margin: 5px 0;
  cursor: pointer;
  border-radius: 30px;
  transform: scale(0.9);
}

.currentItem {
  color: #eb4f4f;
  background-color: #fcebeb;
}
</style>
