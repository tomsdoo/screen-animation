<template>
  <div
    class="stage"
    :style="{ backgroundColor: stageColor }"
  >
    <div ref="myarea" class="myarea"></div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {Ticker} from "@createjs/core";
import {Shape, Stage } from "@createjs/easeljs";
import {Tween} from "@createjs/tweenjs";
const createjs = {
  Shape:Shape,
  Stage:Stage,
  Tween:Tween,
  Ticker:Ticker
};
class Tags {
  public static create(tagName: string, attr?: any, style?: any){
    const ret = document.createElement(tagName);
    Object.entries(attr || {})
      .forEach(([key,value]) => {
        ret.setAttribute(key, value);
      });
    Object.entries(style || {})
      .forEach(([key,value]) => {
        ret.style[key] = value;
      });
    return ret;
  }
}

export default Vue.extend({
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
    color(){
      return this.options.color || "#014347";
    },
    fontFamily(){
      return this.options.fontFamily || "sans-serif";
    },
    fontSize(){
      return this.options.fontSize || "3rem";
    },
    message(){
      return this.options.text || "LOADING..";
    },
    stageColor(){
      return this.options.backgroundColor || "transparent";
    }
  },
  data: () => ({}),
  methods:{},
  created(){},
  mounted(){
    const that = this;
    const canv = this.$refs.myarea
      .appendChild(
        Tags.create(
          "canvas",
          {
            width:window.innerWidth,
            height:window.innerHeight
          }
        )
      );
    const stage = new createjs.Stage(canv);
    const altcanv = document.body
      .appendChild(
        Tags.create(
          "div",
          {},
          {
            display:"none"
          }
        )
      )
      .appendChild(
        Tags.create(
          "canvas",
          {
            width:window.innerWidth,
            height:window.innerHeight
          },
          {
            background:"blue"
          }
        )
      );
    const altcx = altcanv.getContext("2d");
    altcx.fillStyle = "#fff";
    altcx.font = `${this.fontSize} ${this.fontFamily}`;
    altcx.textAlign = "center";
    altcx.textBaseline = "middle";
    altcx.fillText(this.message, altcanv.width / 2, altcanv.height / 2);
    const altidata = altcx.getImageData(0,0,altcanv.width, altcanv.height);
    function getColor(x,y){
      const index = y * altcanv.width * 4 + x * 4;
      const [ r, g, b ] = [ 0, 1, 2 ].map(i => altidata.data[index + i]);
      return { r, g, b };
    }


    const radius = 1;
    const particles = [...Array(altcanv.width).keys()]
      .filter(x => x % radius === 0)
      .map(
        x => [...Array(altcanv.height).keys()]
          .filter(
            y =>  y % radius === 0 &&
              (color => color.r === 255 &&
                color.g === 255 &&
                color.b === 255)
              (getColor(x,y))
          )
          .map(y => ({x,y}))
      )
      .flat()
      .map(({ x, y }) => {
        const particle = stage.addChild(new createjs.Shape());
        particle.graphics.beginFill(this.color);
        particle.graphics.drawCircle(0,0,radius);
        particle.x = x;
        particle.y = y;
        particle.moving = false;
        return particle;
      });

    altcanv.parentNode.removeChild(altcanv);

    function addrand(p){
      const delta = Math.floor(Math.random() * 3);
      switch(Math.floor(Math.random() * 3)){
        case 0:{return p + delta;}
        case 1:{return p - delta;}
        case 2:{return p;}
        default:{return p;}
      }
    }

    (function tempf(){
      particles.filter(function(particle){return !particle.moving;}).map(function(particle){
        particle.moving = true;
        const movingtime = Math.floor(Math.random() * 500) + 300;
        createjs.Tween.get(particle).to({x:addrand(particle.x), y:addrand(particle.y)},movingtime).call(function(){particle.moving = false;});
      });
      if(that.proceeding){
        setTimeout(function(){tempf();},10);
      }
    })();

    function myupdate(){stage.update();}
    this.updateStage = myupdate;
    createjs.Ticker.addEventListener("tick", myupdate);
  }
});
</script>

<style scoped>
.stage {
  width: 100%;
  height: 100%;
}
/*
.myarea {background:linear-gradient(#000 0%, #3f3f3f 100%);}
*/
</style>
