<template>
  <div class="screen-animation">
    <vue-space v-if="name === 'space'" :options="options" />
    <vue-tetris v-if="name === 'tetris'" :options="options" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import VueSpace from "./space.vue";
import VueTetris from "./tetris.vue";

export default Vue.extend({
  components: {
    VueSpace,
    VueTetris
  },
  props: {
    name: {
      type: String,
      default: ""
    },
    options: {
      type: Object,
      default: () => ({})
    }
  }
});
</script>

<style scoped>
.screen-animation {
  width: 100%;
  height: 100%;
}
</style>
