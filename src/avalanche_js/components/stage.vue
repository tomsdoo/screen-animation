<template>
  <div class="screen-animation">
    <vue-avalanche
      :proceeding="proceeding"
      :options="options"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import VueAvalanche from "../../index_js/components/avalanche.vue";

export default Vue.extend({
  components: {
    VueAvalanche
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
