<template>
  <div class="screen-animation">
    <vue-space v-if="name === 'space'" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import VueSpace from "./space.vue";

export default Vue.extend({
  components: {
    VueSpace
  },
  props: {
    name: {
      type: String,
      default: ""
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
