<template>
  <div class="screen-animation">
    <component
      :is="vueName"
      :proceeding="proceeding"
      :options="options"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import VueAvalanche from "./avalanche.vue";
import VueLife from "./life.vue";
import VueLine from "./line.vue";
import VueMessage from "./message.vue";
import VuePuzzle from "./puzzle.vue";
import VueSea from "./sea.vue";
import VueRails from "./rails.vue";
import VueSky from "./sky.vue";
import VueSpace from "./space.vue";
import VueSparkler from "./sparkler.vue";
import VueSpinner from "./spinner.vue";
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
    VueSea,
    VueSky,
    VueSpace,
    VueSparkler,
    VueSpinner,
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
  computed: {
    vueName(){
      return {
        avalanche: "vue-avalanche",
        life: "vue-life",
        line: "vue-line",
        message: "vue-message",
        puzzle: "vue-puzzle",
        rails: "vue-rails",
        sea: "vue-sea",
        sky: "vue-sky",
        space: "vue-space",
        sparkler: "vue-sparkler",
        spinner: "vue-spinner",
        star: "vue-star",
        tetris: "vue-tetris"
      }[this.name];
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
