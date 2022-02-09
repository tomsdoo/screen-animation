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
import VueRails from "./rails.vue";
import VueSpace from "./space.vue";
import VueSparkler from "./sparkler.vue";
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
    VueSparkler,
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
        space: "vue-space",
        sparkler: "vue-sparkler",
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
