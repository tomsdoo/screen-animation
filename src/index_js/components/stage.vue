<template>
  <div class="screen-animation">
    <vue-avalanche v-if="name === 'avalanche'" :proceeding="proceeding" :options="options" />
    <vue-life v-if="name === 'life'" :proceeding="proceeding" :options="options" />
    <vue-line v-if="name === 'line'" :proceeding="proceeding" :options="options" />
    <vue-message v-if="name === 'message'" :proceeding="proceeding" :options="options" />
    <vue-puzzle v-if="name === 'puzzle'" :proceeding="proceeding" :options="options" />
    <vue-rails v-if="name === 'rails'" :proceeding="proceeding" :options="options" />
    <vue-space v-if="name === 'space'" :proceeding="proceeding" :options="options" />
    <vue-star v-if="name === 'star'" :proceeding="proceeding" :options="options" />
    <vue-tetris v-if="name === 'tetris'" :proceeding="proceeding" :options="options" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import VueAvalanche from "./avalanche.vue";
import VueLife from "./life.vue";
import VueLine from "./line.vue";
import VueMessage from "./message.vue";
import VuePuzzle from "./puzzle.vue";
import VueRails from "./rails.vue";
import VueSpace from "./space.vue";
import VueStar from "./star.vue";
import VueTetris from "./tetris.vue";

export default Vue.extend({
  components: {
    VueAvalanche,
    VueLife,
    VueLine,
    VueMessage,
    VuePuzzle,
    VueRails,
    VueSpace,
    VueStar,
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
  },
  data: () => ({
    proceeding: true
  }),
  methods: {
    end(){
      this.proceeding = false;
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
