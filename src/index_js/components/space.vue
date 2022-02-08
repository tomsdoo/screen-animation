<template>
  <div class="stage">
    <div class="space">
      <div class="circle" ref="circle"></div>
    </div>
    <div v-for="star in stars" class="star" :style='{width:star.r+"em", height:star.r+"em",top:star.y+"px",left:star.x+"px"}'></div>
  </div>
</template>

<script lang="ts">
import { Rand } from "../../modules/";
function plus(a: number, b: number){return a + b;}
function minus(a: number, b: number){return a - b;}
type StarSeed = {
  x: number;
  y: number;
  r: number;
  life: number;
  sin: number;
  cos: number;
};
class Star {
  public x: number;
  public y: number;
  public r: number;
  public life: number;
  public sin: number;
  public cos: number;
  constructor(seed: StarSeed){
    this.x = seed.x;
    this.y = seed.y;
    this.r = seed.r;
    this.life = seed.life;
    this.sin = seed.sin;
    this.cos = seed.cos;
  }
  public isAlive(){
    return this.life > 0;
  }
  public isInWindow(){
    return this.x >= 0 &&
      this.x <= window.innerWidth &&
      this.y >= 0 &&
      this.y <= window.innerHeight;
  }
  public getAge(){
    this.ageX();
    this.ageY();
    this.ageR();
    this.life -= 1;
  }
  protected ageX(){
    this.x = (
      this.x >= window.innerWidth / 2 ?
      plus :
      minus
    )(this.x, this.cos);
  }
  protected ageY(){
    this.y = (
      this.y >= window.innerHeight / 2 ?
      plus :
      minus
    )(this.y, this.sin);
  }
  protected ageR(){
    this.r = this.r * 1.001;
  }
}
export default {
  props:{
    proceeding: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    slashLine(){
      return Math.sqrt(
        Math.pow(window.innerWidth, 2) +
        Math.pow(window.innerHeight, 2)
      );
    },
    cos(){
      return window.innerWidth / this.slashLine;
    },
    sin(){
      return window.innerHeight / this.slashLine;
    }
  },
  data:function(){return {
    stars:[],
    speed: 1
  };},
  methods:{
    addStars(n: number){
      this.stars = this.stars.concat(
        [...Array(n).keys()]
          .map(() => new Star({
            x: Rand.number(window.innerWidth),
            y: Rand.number(window.innerHeight),
            r: Rand.number(5) / 10,
            life: Rand.number(100),
            sin: this.sin,
            cos: this.cos
          }))
      );
    },
    speedUp(){
      const that = this;
      if(that.speed < 4){
        setTimeout(() =>  {
          that.speed += 1;
          that.speedUp();
        }, 1000);
      }
    },
    proceed(){
      const that = this;
      if(Rand.number(10) === 0){
        this.addStars(Rand.number(10));
      }
      this.stars.forEach(star => {
        star.getAge();
      });
      this.stars = this.stars
        .filter(star => star.isAlive() && star.isInWindow());
      if(!this.proceeding){return;}
      setTimeout(() => {
        that.proceed();
      }, 10);
    }
  },
  created:function(){
    const that = this;
  },
  mounted:function(){
    this.speedUp();
    this.addStars(10);
    this.proceed();
  }
};
</script>

<style scoped>
.stage {
  width: 100%;
  height: 100%;
}

.space {
  width: 100%;
  height: 100%;
  background:linear-gradient(#000 0%, #202020 90%, #202020 100%);
  display: grid;
  justify-content: center;
  align-items: center;
}

.star {
  position:fixed;
  border-radius: 50%;
  background: #ffffff;
}

.circle {
  border-radius: 50%;
  background: #ffffff;
}

.circle-animated {
  animation-name:circle-scale;
  animation-duration:500ms;
  animation-iteration-count:1;
  animation-fill-mode:both;
}
@keyframes circle-scale {
  0% {opacity:0; width:1vmin; height:1vmin;}
  100% {opacity:1;width:500vmin; height:500vmin;}
}
</style>
