<template>
  <div class="screen-animation">
    <vue-tetris
      :proceeding="proceeding"
      :options="options"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import VueTetris from "../../index_js/components/tetris.vue";

export default Vue.extend({
  components: {
    VueTetris
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
