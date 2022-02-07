<template>
  <div
    class="stage"
    :style="{ backgroundColor: stageColor }"
  >
    <transition-group
      name="square"
      class="board"
      :style='{
        width:boardwidth,
        height:boardheight,
        minWidth:boardwidth,
        maxWidth:boardwidth,
        minHeight:boardheight,
        maxHeight:boardheight
      }'
      tag="div"
    >
      <div
        v-for="square in squares"
        class="cell"
        :style='{
          width:squarewidth,
          height:squareheight
        }'
        :key="square.id"
      >
        <div
          :style='{
            width:squarewidth,
            height:squareheight,
            backgroundColor: square.vacant ? "transparent" : (cellColor  ||  square.color)
          }'
        ></div>
      </div>
    </transition-group>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Rand } from "../../modules/";
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
    squarewh:15,
    rootnumber:4,
    vacantsquarecount:1,
    squares:[]
  };},
  computed:{
    stageColor(){
      return this.options.backgroundColor || "transparent";
    },
    cellColor(){
      return typeof this.options.color === "string" ?
        this.options.color :
        undefined;
    },
    squarewidth:function(){return this.squarewh+"vmin";},
    squareheight:function(){return this.squarewh+"vmin";},
    boardwidth:function(){return this.squarewh*this.rootnumber+"vmin";},
    boardheight:function(){return this.squarewh*this.rootnumber+"vmin";}
  },
  methods:{
    shuffle(){
      const that = this;
      let tempsquares = this.squares.slice();
      let nextsquares = [];
      while(tempsquares.length > 0){
        nextsquares.push(
          tempsquares.splice(
            Math.floor(Math.random() * tempsquares.length),
            1
          )
        );
        // nextsquares = nextsquares.concat(tempsquares.splice(Math.floor(Math.random() * tempsquares.length),1));
      }
      this.squares = nextsquares;
    },
    gosolve(){
      const that = this;
      const {
        rootnumber
      } = this;
      let tempsquares = this.squares.slice();
      let nextsquares = this.squares.slice();
      function getindex(x,y){
        return x + y * rootnumber;
      }
      let changes = [];
      tempsquares.forEach((square, tempi) => {
        const tempx = tempi % rootnumber;
        const tempy = Math.floor(tempi / rootnumber);
        if(!square.vacant){return;}

        const { x: nextx, y: nexty } = Rand.choose([
          tempy > 0 ? ({ x, y }) => ({ x, y: y - 1 }) : null, // up
          tempx > 0 ? ({ x, y }) => ({ x: x - 1, y }) : null, // left
          tempx < rootnumber - 1 ? ({ x, y }) => ({ x: x + 1, y }) : null, // right
          tempy < rootnumber - 1 ? ({ x, y }) => ({ x, y: y + 1 }) : null // down
        ].filter(Boolean))({ x: tempx, y: tempy });

        let testi = getindex(nextx,nexty);
        let isok = changes.filter(changeo => changeo.b === testi).length === 0 && !tempsquares[testi].vacant;
        if(isok){
          changes.push({a:tempi, b:testi, aobj:tempsquares[tempi], bobj:tempsquares[testi]});
        }
      });

      changes.map(function(changeo){
        nextsquares[changeo.a] = tempsquares[changeo.b];
        nextsquares[changeo.b] = tempsquares[changeo.a];
      });
      this.squares = nextsquares;
    }
  },
  created:function(){
    const that = this;
    that.squares = [...Array(Math.pow(that.rootnumber,2)).keys()].map(function(i){
      return {id:i, color:Rand.color({ saturation: 0.3, lightness: 0.6 }), vacant:false};
    });
    [...Array(that.vacantsquarecount).keys()].map(function(){
      const vacantid = Math.floor(Math.random() * that.squares.length);
      that.squares[vacantid].color = "transparent";
      that.squares[vacantid].vacant = true;
    });
  },
  mounted:function(){
    const that = this;
    (function tempf(){
      that.gosolve();
      if(that.proceeding){
        setTimeout(tempf, 300);
      }else{
        that.$emit("fin");
      }
    })();
  }
});
</script>

<style scoped>
.stage {
  width: 100%;
  height: 100%;
  display: grid;
  justify-content: center;
  align-items: center;
}

.cell {
  padding: 1px;
}

.board {
  display: grid;
  grid-template-columns: repeat(4, max-content);
}

.square-move {
  transition: transform 200ms;
}
</style>
