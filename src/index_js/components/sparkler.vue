<template>
  <div class="stage night">
    <div ref="myarea" class="myarea"></div>
  </div>
</template>

<script>
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
        createjs.Ticker.removeEventListener("tick", this.updateStage);
      }
    }
  },
  mounted(){
    const that = this;
    const canv = that.$refs.myarea
      .appendChild(
        Tags.canvas({
          width:window.innerWidth,
          height:window.innerHeight
        })
      );
    const stage = new createjs.Stage(canv);
    const bowcircle = stage.addChild(new createjs.Shape());
    bowcircle.graphics.beginFill("#3C3D36");
    bowcircle.graphics.drawCircle(0,0,1);
    bowcircle.x = canv.width / 2;
    bowcircle.y = canv.height / 2;
    createjs.Tween.get(bowcircle)
      .wait(300)
      .to({scaleX:7,scaleY:7},900)
      .call(() => {});
    const circle = stage.addChild(new createjs.Shape());
    circle.graphics.beginFill("#F75A0D");
    circle.graphics.drawCircle(0,0,1);
    circle.x = canv.width / 2;
    circle.y = canv.height / 2;
    createjs.Tween.get(circle)
      .wait(100)
      .to({scaleX:5,scaleY:5},1000)
      .call(() => {});

    let lines = [];
    (function tempf(){
      if(Rand.number(10) === 0){
        lines = lines.concat([0,1,2,3,4].map(() => {
          const myradian = Rand.number(360) * Math.PI / 180;
          const myyd = Math.sin(myradian) * 8;
          const myxd = Math.cos(myradian) * 8;
          const myx = Rand.number(2) === 0 ? (canv.width / 2 - myxd) : (canv.width / 2 + myxd);
          const myy = Rand.number(2) === 0 ? (canv.height / 2 - myyd) : (canv.height / 2 + myyd);

          const templine = stage.addChild(new createjs.Shape());
          templine.x = 0;
          templine.y = 0;
          templine.pos = {x:myx,y:myy};
          templine.life = 30;
          templine.radian = myradian;
          templine.graphics.beginStroke("#F75A0D");
          templine.graphics.setStrokeStyle(1);
          templine.graphics.moveTo(myx,myy);
          return templine;
        }));
      }
      lines = lines.map(line => {
        const myyd = Math.sin(line.radian) * 1;
        const myxd = Math.cos(line.radian) * 1;
        const nextx = line.pos.x > canv.width / 2 ? (line.pos.x + Rand.number(2)*myxd) : (line.pos.x - Rand.number(2)*myxd);
        const nexty = line.pos.y > canv.height / 2 ? (line.pos.y + Rand.number(2)*myyd) : (line.pos.y - Rand.number(2)*myyd);

        line.pos.x = nextx;
        line.pos.y = nexty;

        line.graphics.lineTo(nextx,nexty);
        line.life = line.life - 1;
        if(Rand.number(5) === 0 || line.life < 0){
          stage.removeChild(line); return null;
        }else{
          return line;
        }
      }).filter(Boolean);
      if(that.proceeding){
        setTimeout(tempf, 10);
      }
    })();
    this.updateStage = () => {
      stage.update();
    };
    createjs.Ticker.addEventListener("tick", this.updateStage);
  }
};
</script>


<style scoped>
.stage {
  width:100%;
  height:100%;
}

.night {
  background:
    linear-gradient(#000 0%, #2f2f2f 99%, #3f3f3f 100%);
}
</style>
