<template>
  <div
    class="stage"
    :style="{ backgroundColor: stageColor }"
  >
    <div
      class="loading-wrapper"
      :class="[Boolean(message) ? 'with-message' : '']"
    >
      <div class="circle-wrapper">
        <div
          class="border-circle"
          :style="{
            width: radius,
            height: radius,
            backgroundImage: backgroundImage
          }"
        ></div>
        <div
          class="inner-circle"
          :style="{
            width: `calc(${radius} - ${lineWidth})`,
            height: `calc(${radius} - ${lineWidth})`,
            backgroundColor: stageColor
          }"
        ></div>
      </div>
      <div
        class="message"
        :style="{
          color: messageColor,
          fontSize: messageFontSize,
          fontFamily: messageFontFamily
        }"
      >
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    options: {
      type: Object,
      default: () => ({})
    },
    proceeding: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    stageColor(){
      return this.options.backgroundColor || "transparent";
    },
    message(){
      return this.options.message && this.options.message.text || "";
    },
    messageColor(){
      return this.options.message && this.options.message.color || this.lastColor;
    },
    messageFontSize(){
      return this.options.message && this.options.message.fontSize || "1rem";
    },
    messageFontFamily(){
      return this.options.message && this.options.message.fontFamily || "inherit";
    },
    innerColors(){
      return this.options.colors && [
        ...(
          Array.isArray(this.options.colors) ?
          this.options.colors :
          [ this.options.colors ]
        )
      ] || [ "#0088bb" ];
    },
    lastColor(){
      return this.innerColors[this.innerColors.length - 1];
    },
    radius(){
      return this.options.radius || "10rem";
    },
    lineWidth(){
      return this.options.lineWidth || "1rem";
    },
    backgroundImage(){
      return "linear-gradient(" + [
        "to left",
        ...[
          ...(this.innerColors.length === 1 ? [
            "#ffffff"
          ] : []).concat(this.innerColors)
        ]
      ].join(", ") + ")";
    }
  }
});

</script>

<style scoped>
.stage {
  width: 100%;
  height: 100%;
  display: grid;
  justify-content:center;
  align-items:center;
}
.loading-wrapper {
  display: grid;
  grid-template:
    "circle" max-content / 1fr;
  grid-gap: 1rem;
}
.loading-wrapper.with-message {
  grid-template:
    "circle " max-content
    "message" max-content / 1fr;
}
.circle-wrapper {
  grid-area: circle;
  position: relative;
  display: grid;
  justify-content: center;
  align-items: center;
}
.border-circle {
  border-radius: 50%;
  animation: 3s linear 0s infinite normal both running rotate;
}
.inner-circle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
}
.message {
  grid-area: message;
  display: none;
  text-align: center;
}
.loading-wrapper.with-message .message {
  display: grid;
}
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
