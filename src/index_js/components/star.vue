<template>
  <div
    class="stage"
    :style="{ backgroundColor: stageColor }"
  >
    <div ref="star" class="star star-appear">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 250 250"
      >
        <polygon
          points="
            119,0
            148,86
            238,86
            166,140
            192,226
            119,175
            46,226
            72,140
            0,86
            90,86
          "
          fill="yellow"
        />
      </svg>
    </div>
    <div class="myarea" ref="myarea"></div>
  </div>
</template>

<script lang="ts">
import {Ticker} from "@createjs/core";
import {Shape, Stage } from "@createjs/easeljs";
import {Tween} from "@createjs/tweenjs";
import { Rand, Tags } from "../../modules/";
const createjs = {
  Shape:Shape,
  Stage:Stage,
  Tween:Tween,
  Ticker:Ticker
};
export default {
  props:{
    options: {
      type: Object,
      default: () => ({})
    },
    proceeding: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    proceeding(to){
      if(to === false){
        createjs.Ticker.removeEventListener("tick",this.updateStage);
      }
    }
  },
  computed: {
    stageColor(){
      return this.options.backgroundColor || "transparent";
    }
  },
  data: () => ({}),
  methods: {
    setStarClass(className: string){
      [ 1, 2, 3 ]
        .map(i => `star-rotate-${i}`)
        .forEach(cn => {
          cn === className ?
            this.$refs.star.classList.add(cn) :
            this.$refs.star.classList.remove(cn);
        });
    }
  },
  mounted(){
    const that = this;
    setTimeout(() => that.setStarClass("star-rotate-1"), 500);
    setTimeout(() => that.setStarClass("star-rotate-2"), 1000);
    setTimeout(() => that.setStarClass("star-rotate-3"), 1500);

    const canv = that.$refs.myarea
      .appendChild(
        Tags.canvas({
          width:window.innerWidth,
          height:window.innerHeight
        })
      );
    const stage = new createjs.Stage(canv);
    let blowmax = 0;
    let particles = [];
    setTimeout(blowout, 500);
    setTimeout(function(){blowmax = 2;},700);
    setTimeout(function(){blowmax = 8;},1000);
    setTimeout(function(){blowmax = 10;},1500);

    function blowout(){
      [...Array(Math.floor(Math.random() * blowmax)).keys()].forEach(() => {
        if(Math.floor(Math.random() * 20) > 0){return;}
        const particle = stage.addChild(new createjs.Shape());
        particle.graphics.beginFill(Rand.color());
        particle.graphics.drawCircle(0,0,Math.floor(Math.random() * 5)+1);
        particle.x = window.innerWidth / 2;
        particle.y = window.innerHeight / 2;
        particle.vx = Math.floor(Math.random() * 20) - 10;
        particle.vy = 0 - Math.floor(Math.random() * 40) - 5;
        particles.push(particle);
      });
      particles = particles
        .filter(particle => particle.y <= canv.height)
        .map(particle => {
          particle.x = particle.x + particle.vx;
          particle.y = particle.y + particle.vy;
          particle.vy = particle.vy + 0.1 + Math.abs(particle.vy) * 0.07;
          return particle;
        });
      if(that.proceeding){
        setTimeout(function(){blowout();},5);
      }
    }

    this.updateStage = () => {
      stage.update();
    };
    createjs.Ticker.addEventListener("tick", this.updateStage);
  }
};
</script>

<style scoped>
.stage {
  width: 100%;
  height: 100%;
  display: grid;
  justify-content: center;
  align-items: center;
  position: relative;
}
.myarea {position:absolute; top:0;left:0;}
.star {
  position:absolute; z-index:1;
  top:calc(50vh - 0.5em);
  left:calc(50vw - 0.5em);
  width:1em;
  height:1em;
  font-size:3em;
  color:#FFE500;
}
.star-appear {
  animation-name:star-appear;
  animation-duration:500ms;
  animation-iteration-count:1;
  animation-timing-function:linear;
  animation-fill-mode:both;
}
@keyframes star-appear {
  0% {opacity:0; transform:scale(0,0);}
  100% {opacity:1; transform:scale(1,1);}
}
.star-rotate-1 {
  animation-name:star-rotate-1;
  animation-duration:500ms;
  animation-iteration-count:infinite;
  animation-timing-function:ease-in;
  animation-fill-mode:both;
}
@keyframes star-rotate-1 {
  0% {transform:rotateY(0deg);}
  100% {transform:rotateY(90deg);}
}
.star-rotate-2 {
  animation-name:star-rotate-2;
  animation-duration:500ms;
  animation-interation-count:infinite;
  animation-timing-function:linear;
  animation-fill-mode:both;
}
@keyframes star-rotate-2 {
  0% {transform:rotateY(90deg);}
  50% {transform:rotateY(135deg);}
  100% {transform:rotateY(180deg);}
}
.star-rotate-3 {
  animation-name:star-rotate-3;
  animation-duration:500ms;
  animation-iteration-count:infinite;
  animation-timing-function:linear;
  animation-fill-mode:both;
}
@keyframes star-rotate-3 {
  0% {transform:rotateY(180deg);}
  50% {transform:rotateY(360deg);}
  51% {transform:rotateY(0deg);}
  100% {transform:rotateY(180deg);}
}
</style>
