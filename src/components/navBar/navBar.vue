<template>
  <div class="navBarContainer">
    <div class="navBar">
      <p>{{navBarItem}}</p>
      <div
          class="barItem"
          v-for="(item, index) in navBarItem"
          :key="index"
          :class="index === activeNum"
          @click="clickBarItem(item.path, index)">
        {{item.name}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "navBar",
  data () {
    return {
      activeNum: 0,
    }
  },
  props:{
    navBarItem: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  created() {
    this.navBarItem.forEach((item, index) => {
      if (this.$route.path.search(item.path) !== -1) {
        this.activeNum = index;
      }
    })
  },
  methods: {
    clickBarItem(path, index) {
      this.activeNum = index;
      this.$emit('clickBarItem', path)
    }
  }
}
</script>

<style scoped>

</style>
