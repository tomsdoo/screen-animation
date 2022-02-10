<template>
  <div class="stage">
    <div
      v-for="circle in circles"
      class="onoff bubble"
      :style='{
        width:circle.r+"em",
        height:circle.r+"em",
        left:circle.x+"px",
        top:circle.y+"px"
      }'
    ></div>
    <div
      v-for="afish in fish"
      class="fish"
      :class='[afish.direction === "left" && "turn180"]'
      :style='{
        width:afish.r+"em",
        height:afish.r+"em",
        fontSize:afish.r+"em",
        left:afish.x+"px",
        top:afish.y+"px"
      }'
    >
      <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          viewBox="0 0 576 512"
      >
        <!--! Font Awesome Pro 6.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
        <path d="M180.5 141.5C219.7 108.5 272.6 80 336 80C399.4 80 452.3 108.5 491.5 141.5C530.5 174.5 558.3 213.1 572.4 241.3C577.2 250.5 577.2 261.5 572.4 270.7C558.3 298 530.5 337.5 491.5 370.5C452.3 403.5 399.4 432 336 432C272.6 432 219.7 403.5 180.5 370.5C164.3 356.7 150 341.9 137.8 327.3L48.12 379.6C35.61 386.9 19.76 384.9 9.474 374.7C-.8133 364.5-2.97 348.7 4.216 336.1L50 256L4.216 175.9C-2.97 163.3-.8133 147.5 9.474 137.3C19.76 127.1 35.61 125.1 48.12 132.4L137.8 184.7C150 170.1 164.3 155.3 180.5 141.5L180.5 141.5zM416 224C398.3 224 384 238.3 384 256C384 273.7 398.3 288 416 288C433.7 288 448 273.7 448 256C448 238.3 433.7 224 416 224z"/>
      </svg>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Rand } from "../../modules/";

class MortalBase {
  public x: number;
  public y: number;
  public r: number;
  public direction: string;
  constructor(x: number, y: number, r: number, direction: string){
    this.x = x;
    this.y = y;
    this.r = r;
    this.direction = direction;
  }
  protected addX(x: number){
    this.x += x;
  }
}

class Bubble extends MortalBase {
  constructor(x: number, y: number, r: number, direction: string){
    super(x, y, r, direction);
  }
  public getAge(){
    this.y -= 1;
    if(Rand.number(3) === 0){
      this.direction === "left" && this.addX(-1);
      this.direction === "right" && this.addX(1);
    }
    if(Rand.number(100) === 0){
      this.direction = Rand.choose<string>([ "left", "right", "none" ]);
    }
    return this;
  }
  public static createRandom(){
    return new Bubble(
      Rand.number(window.innerWidth),
      Rand.number(window.innerHeight),
      Rand.number(10) / 10,
      Rand.choose<string>([ "left", "right", "none" ])
    );
  }
}

class Fish extends MortalBase {
  public life: number;
  constructor(x: number, y: number, r: number, direction: string){
    super(x, y, r, direction);
    this.life = 100;
  }
  public toggleDirection(){
    this.direction = [ "left", "right" ].find(d => d !== this.direction);
    return this;
  }
  public getAge(){
    this.direction === "left" && this.addX(-1);
    this.direction === "right" && this.addX(1);
    Rand.number(100) === 0 && this.toggleDirection();
    this.life--;
    return this;
  }
  public static createRandom(){
    return new Fish(
      Rand.number(window.innerWidth),
      Rand.number(window.innerHeight),
      Rand.number(20) / 10,
      Rand.choose<string>([ "left", "right" ])
    );
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
  data:function(){return {
    circles:[],
    fish:[]
  };},
  methods:{},
  created(){
    const that = this;
    that.circles = [...Array(3).keys()].map(i => Bubble.createRandom());
    (function tempf(){
      if(Rand.number(10) === 0){
        that.circles = that.circles.concat([...Array(2).keys()].map(i => Bubble.createRandom()));
      }
      if(Rand.number(10) === 0){
        that.fish = that.fish.concat([...Array(2).keys()].map(i => Fish.createRandom()));
      }
      that.circles = that.circles.map(circle => circle.getAge());
      that.fish = that.fish.map(afish => afish.getAge());

      that.circles = that.circles.filter(function(circle){
        return circle.y > 0 || Math.floor(Math.random() * 5) === 0;
      });
      that.fish = that.fish.filter(function(afish){
        return afish.life > 0;
        return afish.x < 0 || afish.x >= window.innerWidth || Math.floor(Math.random() * 5) === 0;
      });
      if(that.proceeding){
        setTimeout(function(){tempf();}, 10);
      }
    })();
  }
});
</script>

<style scoped>
.stage {
  width: 100%;
  height: 100%;
  background:
    linear-gradient(
      #014347 0%,
      #79BD9A 90%,
      #79BD9A 100%
    );
}

.bubble {
  position:fixed;
  border-radius: 50%;
  background: transparent;
  border: 1px solid #ffffff;
}
.fish {
  position:fixed;
  color: velvetocean;
}
.turn180 {
  transform:rotateY(180deg);
}

.onoff {
  animation-name:onoff;
  animation-duration:4000ms;
  animation-iteration-count:1;
  animation-fill-mode:both;
}
@keyframes onoff {
  0% {opacity:0; transform:scale(0,0);}
  50% {opacity:1; transform:scale(1,1);}
  100% {opacity:0; transform:scale(1.2,1.2);}
}
</style>
