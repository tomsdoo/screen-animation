<template>
  <div class="stage">

    <div class="layer-skater">
      <div ref="planemove" class="plane">
        <div ref="planescale" class="plane">
          <div ref="planeturnx" class="plane">
            <div ref="planeturny" class="plane">
              <div ref="plane" class="plane">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M511.6 36.86l-64 415.1c-1.5 9.734-7.375 18.22-15.97 23.05c-4.844 2.719-10.27 4.097-15.68 4.097c-4.188 0-8.319-.8154-12.29-2.472l-122.6-51.1l-50.86 76.29C226.3 508.5 219.8 512 212.8 512C201.3 512 192 502.7 192 491.2v-96.18c0-7.115 2.372-14.03 6.742-19.64L416 96l-293.7 264.3L19.69 317.5C8.438 312.8 .8125 302.2 .0625 289.1s5.469-23.72 16.06-29.77l448-255.1c10.69-6.109 23.88-5.547 34 1.406S513.5 24.72 511.6 36.86z" fill="#446644" /></svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


    <div class="layer-ground">
      <transition name="scape">
        <div v-if='time === "day"' class="scene">
          <div
            ref="sky"
            class="bg-sky"
            :style='{ height:skyheight+"px" }'
          >
            <div
              v-for="cloud in clouds"
              class="cloud"
              :style='{
                left:cloud.left+"px",
                bottom:cloud.bottom+"px",
                fontSize:cloud.fontsize+"em",
                width: cloud.fontsize+"rem",
                height: cloud.fontsize+"rem"
              }'
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 512"
              >
                <!--! Font Awesome Pro 6.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
                <path d="M96.2 200.1C96.07 197.4 96 194.7 96 192C96 103.6 167.6 32 256 32C315.3 32 367 64.25 394.7 112.2C409.9 101.1 428.3 96 448 96C501 96 544 138.1 544 192C544 204.2 541.7 215.8 537.6 226.6C596 238.4 640 290.1 640 352C640 422.7 582.7 480 512 480H144C64.47 480 0 415.5 0 336C0 273.2 40.17 219.8 96.2 200.1z" fill="#ffffff" />
              </svg>
            </div>
          </div>
          <div
            class="ground"
            :style='{ height:"calc(100% - "+skyheight+"px)" }'
          >
          </div>
        </div>
      </transition>
      <transition name="scape">
        <div v-if='time === "night"' class="scene">
          <div class="bg-night" ref="nightsky">
            <div
              v-for="star in stars"
              class="star"
              :style='{
                position: "absolute",
                left: star.left+"px",
                bottom: star.bottom+"px",
                fontSize: star.fontsize+"em",
                width: star.fontsize+"rem",
                height: star.fontsize+"rem",
                opacity: 0
              }'
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <!--! Font Awesome Pro 6.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
                <path d="M512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256z" fill="#ffffff" />
              </svg>
            </div>
          </div>
        </div>
      </transition>
      <transition name="scape">
        <div v-if='time === "evening"' class="scene">
          <div class="bg-evening" ref="eveningsky">
          </div>
        </div>
      </transition>
    </div>


  </div>
</template>

<script lang="ts">
import { Rand, Serial } from "../../modules/";
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
  data: () => ({
    skyheight:25,
    clouds:[],
    stars:[],
    time:"day"
  }),
  methods:{
    async appearClouds(){
      const rect = this.$refs.sky.getBoundingClientRect();
      this.clouds = Serial.number(10).map(() => ({
        left: Rand.number(rect.width),
        bottom: Rand.number(rect.height),
        fontsize: Rand.number(30) / 10
      }));
      await this.wait(100);
      Array.from(document.querySelectorAll(".cloud"))
        .forEach(element => this.wait(Rand.number(300) + 200)
            .then(element.classList.add("cloudin"))
        );
    },
    wait: (milliseconds: number) => new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    }),
    sunset(){
      this.time = "evening";
    },
    nightComes(){
      this.time = "night";
      this.wait(1100)
        .then(() => this.appearStars());
    },
    appearStars(){
      const rect = this.$refs.nightsky
        .getBoundingClientRect();
      this.stars = this.stars.concat(
        Serial.number(40).map(() => ({
          left: Rand.number(rect.width),
          bottom: Rand.number(rect.height),
          fontsize: Rand.number(10) / 10
        }))
      );

      this.wait(100)
        .then(() => {
          Array.from(document.querySelectorAll(".star"))
            .forEach(element => {
              setTimeout(() => element.classList.add("starinout"), Rand.number(2000) + 200)
            });
        });

      if(this.proceeding){
        setTimeout(() => this.appearStars(), 2000);
      }
    }
  },
  mounted(){
    const that = this;
    this.skyheight = window.innerHeight * 0.25;

    let speed = 1;
    setTimeout(() => {speed = 2;}, 1500);
    setTimeout(() => {speed = 3;}, 2000);
    setTimeout(() => {speed = 4;}, 2500);
    this.wait(1000)
      .then(() => new Promise((resolve) => {
        (function tempf(){
          if(this.skyheight >= window.innerHeight){
            resolve();
          }else{
            this.skyheight += speed;
            setTimeout(() => tempf.call(this), 10);
          }
        }).call(that);
      }))
      .then(() => this.appearClouds())
      .then(() => this.wait(1500))
      .then(() => this.sunset())
      .then(() => this.wait(1500))
      .then(() => this.nightComes());

    that.$refs.planemove.classList.add("planemove");
    that.$refs.planescale.classList.add("planescale");
    that.$refs.planeturnx.classList.add("planeturnx");
    that.$refs.planeturny.classList.add("planeturny");
  }
};
</script>

<style scoped>
.stage {
  width: 100%;
  height: 100%;
  background: #ffffff;
}

.layer-ground {
  width: 100%;
  height: 100%;
  z-index:1;
  position:absolute;
  display: grid;
  justify-content: center;
  align-items: center;
}
.layer-skater {
  width: 100%;
  height: 100%;
  z-index:2;
  position:absolute;
  display: grid;
  justify-content: center;
  align-items: center;
}

.scene {
  width: 100%;
  height: 100%;
  position:absolute;
}

.cloud {
  color: #ffffff;
  /* width: 1rem;
  height: 1rem; */
  position: absolute;
  opacity: 0;
}

.planemove {animation-name:planemove; animation-duration:4s; animation-iteration-count:1; animation-timing-function:linear; animation-fill-mode:both;}
@keyframes planemove {
  0% {transform:translateX(-1000%) translateY(800%);}
  100% {transform:translateX(0%) translateY(0%);}
}

.planescale {animation-name:planescale; animation-duration:4s; animation-iteration-count:1; animation-timing-function:linear; animation-fill-mode:both;}
@keyframes planescale {
  0% {transform:scale(30,30);}
  100% {transform:scale(0,0);}
}

.planeturnx {animation-name:planeturnx; animation-duration:4s; animation-iteration-count:1; animation-timing-function:linear; animation-fill-mode:both;}
@keyframes planeturnx {
  0% {transform:rotateX(-30deg);}
  100% {transform:rotateX(90deg);}
}

.planeturny {animation-name:planeturny; animation-duration:4s; animation-iteration-count:1; animation-timing-function:linear; animation-fill-mode:both;}
@keyframes planeturny {
  0% {transform:rotateY(-45deg);}
  100% {transform:rotateY(90deg);}
}
.plane {
  width:1em;
  height:1em;
  font-size:1em;
}

.cloudin {
  animation-name:cloudin;
  animation-duration:1s;
  animation-iteration-count:1;
  animation-timing-function:linear;
  animation-fill-mode:both;
}
@keyframes cloudin {
  0% {
    transform:scale(0,0) translateY(50%);
    opacity:0;
  }
  100% {
    transform:scale(2,2) translateY(0%);
    opacity:1;
  }
}

.starinout {
  animation-name:starin;
  animation-duration:1s;
  animation-iteration-count:1;
  animation-timing-function:linear;
  animation-fill-mode:both;
}
@keyframes starin {
  0% {transform: scale(0,0); opacity:0;}
  50% {transform:scale(0.4,0.4); opacity:1;}
  100% {transform:scale(0,0); opacity:0;}
}

.scape-enter-active, .scape-leave-active {
  transition: all 1500ms linear;
}
.scape-enter, .scape-leave-to {
  opacity:0;
  position:absolute;
}
.scape-leave, .scape-enter-to {
  opacity:1;
}

.bg-night {
  width: 100%;
  height: 100%;
  position: relative;
  background:
    linear-gradient(#000 0%, #4c4c5c 97%, #4c4c5c 100%);
}
.bg-evening {
  width: 100%;
  height: 100%;
  background:
    linear-gradient(#F8584A 0%, #FF9A2E 20%, #FFCC33 100%);
}
.bg-sky {
  width: 100%;
  position: relative;
  background:
    linear-gradient(#A5D3EE 0%, #CEECEF 99%, #fff 100%);
}
.ground {
  width: 100%;
  background:
    linear-gradient(#BA9E66 0%, #E3DACC 97%, #E3DACC 100%);
}

</style>
