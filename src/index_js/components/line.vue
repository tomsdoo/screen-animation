<template>
  <div
    class="stage"
    :style="{ backgroundColor: stageColor }"
  >
    <div class="myarea" ref="myarea"></div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {Ticker} from "@createjs/core";
import {Shape, Stage } from "@createjs/easeljs";
import {Tween} from "@createjs/tweenjs";
import { Tags } from "../../modules/";
const createjs = {
  Shape:Shape,
  Stage:Stage,
  Tween:Tween,
  Ticker:Ticker
};

const LINE_DIRECTIONS = {
  UP: "up",
  RIGHT: "right",
  DOWN: "down",
  LEFT: "left"
};

class Rand {
  public static choose<T>(parr: T[]){
    return parr[Math.floor(Math.random() * parr.length)];
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
        createjs.Ticker.removeEventListener("tick", this.updateStage);
      }
    }
  },
  computed: {
    lineColor(){
      return this.options.color || "#014347";
    },
    stageColor(){
      return this.options.backgroundColor || "transparent";
    }
  },
  data:() => ({}),
  mounted:function(){
    const that = this;
    const canv = that.$refs.myarea
      .appendChild(
        Tags.canvas({
          width:window.innerWidth,
          height:window.innerHeight
        })
      );
    const stage = new createjs.Stage(canv);
    const line = stage.addChild(new createjs.Shape());
    line.x = 0;
    line.y = 0;
    line.point = {
      x: canv.width / 2,
      y: canv.height / 2
    };
    line.direction = LINE_DIRECTIONS.UP;
    line.graphics.beginStroke(this.lineColor);
    line.graphics.moveTo(line.point, line.point);

    (function tempf(){
      if(Math.floor(Math.random() * 20) === 0){
        line.direction = Rand.choose<string>(
          Object.values(LINE_DIRECTIONS)
            .filter(d => d !== line.direction)
        );

        const circle = stage.addChild(new createjs.Shape());
        circle.graphics.beginFill(that.lineColor);
        circle.graphics.drawCircle(0, 0, 1);
        circle.x = line.point.x;
        circle.y = line.point.y;
        createjs.Tween.get(circle)
          .wait(10)
          .to({scaleX:3, scaleY:3},400)
          .to({scaleX:0, scaleY:0},600)
          .call(() => {stage.removeChild(circle);});
      }
      switch(line.direction){
        case LINE_DIRECTIONS.UP:{
          line.point.y -= 2;
          break;
        }
        case LINE_DIRECTIONS.RIGHT:{
          line.point.x += 2;
          break;
        }
        case LINE_DIRECTIONS.DOWN:{
          line.point.y += 2;
          break;
        }
        case LINE_DIRECTIONS.LEFT:{
          line.point.x -= 2;
          break;
        }
        default:{break;}
      }

      line.graphics.lineTo(line.point.x, line.point.y);
      if(that.proceeding){
        setTimeout(function(){tempf();},10);
      }
    })();
    this.updateStage = () => {
      stage.update();
    };
    createjs.Ticker.addEventListener("tick", this.updateStage);
  }
});
</script>

<style scoped>
.stage {
  width: 100%;
  height: 100%;
}
</style>
