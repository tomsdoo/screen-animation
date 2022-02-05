<template>
  <div
    class="stage"
    :style="{ backgroundColor: stageColor }"
  >
    <div ref="myarea" class="myarea"></div>
  </div>
</template>

<script>
import Vue from "vue";
import { Tags } from "../../modules/";
import {Ticker} from "@createjs/core";
import {Shape, Stage } from "@createjs/easeljs";
import {Tween} from "@createjs/tweenjs";
const createjs = {
  Shape:Shape,
  Stage:Stage,
  Tween:Tween,
  Ticker:Ticker
};
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
    railColor(){
      return this.options.color || "#014347";
    },
    stageColor(){
      return this.options.backgroundColor || "transparent";
    }
  },
  data:() => ({}),
  mounted(){
    const that = this;
    const canv = this.$refs.myarea.appendChild(Tags.canvas({
      width: window.innerWidth,
      height: window.innerHeight
    }));
    const stage = new createjs.Stage(canv);

    // arc ( x y radius startAngle endAngle anticlockwise )
    function makerail(currentpoints){
      return Math.floor(Math.random() * 40) === 0 ?
        makecurve(currentpoints) :
        makestraight(currentpoints);
    }
    function makecurve(currentpoints){
      let tempdegree = currentpoints.degree >= 0 ?
        (currentpoints.degree % 360) :
        (360 - (Math.abs(currentpoints.degree) % 360));
      const nextdegree = tempdegree + (Math.floor(Math.random() * 2 === 0) ? 90 : -90);
      const myradian_start = (tempdegree + 90) * Math.PI / 180;
      const myradian_end = (nextdegree + 90) * Math.PI / 180;

      const anticlockwise = nextdegree - tempdegree < 0;
      const radius1 = anticlockwise ? 20 : 30;
      const radius2 = anticlockwise ? 30 : 20;

      const center1 = getcenter(currentpoints.point1, radius1).center;
      const center2 = getcenter(currentpoints.point2, radius2).center;
      function getcenter(ppoint, pradius){
        let nx = ppoint.x;
        let ny = ppoint.y;
        let npx = ppoint.x;
        let npy = ppoint.y;
        let tempdegree = currentpoints.degree >= 0 ? (currentpoints.degree % 360) : (360 - (Math.abs(currentpoints.degree) % 360));
        switch(tempdegree){
          case 0:{
            // right
            ny = anticlockwise ? (ppoint.y - pradius) : (ppoint.y + pradius);
            npx = ppoint.x + pradius;
            npy = ny;
            break;
          }
          case 90:{
            // bottom
            nx = anticlockwise ? (ppoint.x + pradius) : (ppoint.x - pradius);
            npx = nx;
            npy = ppoint.y + pradius;
            break;
          }
          case 180:{
            // left
            ny = anticlockwise ? (ppoint.y + pradius) : (ppoint.y - pradius);
            npx = ppoint.x - pradius;
            npy = ny;
            break;
          }
          case 270:{
            //top
            nx = anticlockwise ? (ppoint.x - pradius) : (ppoint.x + pradius);
            npx = nx;
            npy = ppoint.y - pradius;
            break;
          }
          default:{break;}
        }
        return {
          center:{x:nx,y:ny},
          nextp:{x:npx,y:npy}
        };
      }

      [
        {
          centerPoint: center1,
          radius: radius1
        },
        {
          centerPoint: center2,
          radius: radius2
        }
      ].forEach(({ centerPoint, radius }) => {
        const arc = stage.addChild(new createjs.Shape());
        arc.graphics.beginStroke(that.railColor);
        arc.graphics.setStrokeStyle(1);
        arc.graphics.arc(centerPoint.x, centerPoint.y, radius, myradian_start, myradian_end, anticlockwise);
      });

      const nextpoints = {
        point1:getcenter(currentpoints.point1,radius1).nextp,
        point2:getcenter(currentpoints.point2,radius2).nextp,
        degree:nextdegree
      };

      return nextpoints;
    }
    function makestraight(currentpoints){
      const myradian = currentpoints.degree * Math.PI / 180;
      const UNIT_DISTANCE = 2;
      const myyd = Math.sin(myradian) * UNIT_DISTANCE;
      const myxd = Math.cos(myradian) * UNIT_DISTANCE;
      const nextpoints = {
        point1:{
          x:currentpoints.point1.x + myxd,
          y:currentpoints.point1.y + myyd
        },
        point2:{
          x:currentpoints.point2.x + myxd,
          y:currentpoints.point2.y + myyd
        },
        degree:currentpoints.degree
      };
      [
        {
          fromPoint: currentpoints.point1,
          toPoint: nextpoints.point1
        },
        {
          fromPoint: currentpoints.point2,
          toPoint: nextpoints.point2
        }
      ].forEach(({ fromPoint, toPoint }) => {
        const line = stage.addChild(new createjs.Shape());
        line.graphics.beginStroke(that.railColor);
        line.graphics.setStrokeStyle(1);
        line.graphics.moveTo(fromPoint.x, fromPoint.y);
        line.graphics.lineTo(toPoint.x, toPoint.y);
      });
      return nextpoints;
    }
    let currentpoints1 = {
      point1:{
        x:Math.floor(canv.width / 2),
        y:Math.floor(canv.height / 2)
      },
      point2:{
        x:Math.floor(canv.width / 2) + 10,
        y:Math.floor(canv.height / 2)
      },
      degree:-90
    };
    let currentpoints2 = {
      point1: {
        ...currentpoints1.point2
      },
      point2: {
        ...currentpoints1.point1
      },
      degree:90
    };

    (function tempf(){
      currentpoints1 = makerail(currentpoints1);
      currentpoints2 = makerail(currentpoints2);
      if(that.proceeding){
        setTimeout(tempf,10);
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
