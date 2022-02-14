<template>
  <div class="screen-animation">
    <vue-puzzle
      :proceeding="proceeding"
      :options="options"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import VuePuzzle from "../../index_js/components/puzzle.vue";

export default Vue.extend({
  components: {
    VuePuzzle
  },
  props: {
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
