<template>
  <keep-alive :include="keep">
    <router-view :key="key"></router-view>
  </keep-alive>
</template>
<script>
export default {
  name: "App",
  components: {},
  setup() {},
  data() {
    return {
      keep: ["main", "home"],
    };
  },
  computed: {
    key() {
      return this.$route.fullPath;
    },
  },
};
</script>
<style >
#app {
  height: 100%;
  width: 100%;
  padding: 0px;
  margin: 0px;
}
</style>
