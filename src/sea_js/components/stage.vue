<template>
  <div class="screen-animation">
    <vue-sea
      :proceeding="proceeding"
      :options="options"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import VueSea from "../../index_js/components/sea.vue";

export default Vue.extend({
  components: {
    VueSea
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
