<template>
  <div
    class="stage"
    :style="{ backgroundColor: stageColor }"
  >
    <div class="myboard">
      <div
        v-for="cell in cells"
        class="cell"
        :style="{ backgroundColor: cell.color }"
      >
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { Tags } from "../../modules/";
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
  computed: {
    cellColor(){
      return this.options.color || "rgb(1, 67, 71)";
    },
    stageColor(){
      return this.options.backgroundColor || "transparent";
    }
  },
  data:() => ({
    cells:[],
    cellxy:{},
    colors: [...Array(5).keys()].map(i => "transparent"),
    table:{x:0,y:0},
    snowfalls:{}
  }),
  methods:{
    refresh(){
      const that = this;

      const tempDiv = document.body
        .appendChild(
          Tags.div({},{ background: this.cellColor, display: "none" })
        );
      const bgcolor = window.getComputedStyle(tempDiv).backgroundColor;
      tempDiv.remove();
      const rgbaBase = bgcolor.replace(/^rgb/i, "rgba");
      this.colors = [
        "transparent",
        rgbaBase.replace(/\)$/, ",0.2)"),
        rgbaBase.replace(/\)$/, ",0.4)"),
        rgbaBase.replace(/\)$/, ",0.6)"),
        rgbaBase.replace(/\)$/, ",1)")
      ]

      that.table.x = 30;
      that.table.y = 30;
      that.cells = [...Array(that.table.x * that.table.y).keys()].map((i) => {
        const mycell = {
          i,
          x: i % that.table.x,
          y: Math.floor(i / that.table.x),
          point: Math.floor(Math.random() * 4)
        };
        if(!(mycell.x in that.cellxy)){that.cellxy[mycell.x] = {};}
        that.cellxy[mycell.x][mycell.y] = mycell;
        return mycell;
      });
    },
    goforward(){
      const that = this;
      const nextsnowfalls = {};
      that.cells = that.cells.map((cell) => {
        let npoint = cell.x in that.snowfalls &&
          cell.y in that.snowfalls[cell.x] ?
            (cell.point + 1) : cell.point;

        if(cell.point >= 4){
          if(!(cell.x in nextsnowfalls)){nextsnowfalls[cell.x] = {};}
          if(!((cell.x-1) in nextsnowfalls)){nextsnowfalls[cell.x-1] = {};}
          if(!((cell.x+1) in nextsnowfalls)){nextsnowfalls[cell.x+1] = {};}
          nextsnowfalls[cell.x][cell.y-1] = 1;
          nextsnowfalls[cell.x-1][cell.y] = 1;
          nextsnowfalls[cell.x+1][cell.y] = 1;
          nextsnowfalls[cell.x][cell.y+1] = 1;
          npoint = 0;
        }
        const ncell = {
          i: cell.i,
          x: cell.x,
          y: cell.y,
          point: npoint,
          changed: false,
          color: that.colors[npoint]
        };
        return ncell;
      });
      [...Array(10).keys()].forEach(() => {
        const tempx = Math.floor(Math.random() * that.table.x);
        const tempy = Math.floor(Math.random() * that.table.y);
        if(!(tempx in nextsnowfalls)){nextsnowfalls[tempx] = {};}
        nextsnowfalls[tempx][tempy] = 1;
      });
      that.snowfalls = nextsnowfalls;
    }
  },
  mounted(){
    const that = this;
    that.refresh();
    (function tempf(){
      const bchanged = that.goforward();
      if(that.proceeding){
        setTimeout(tempf,10);
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

.myboard {
  width: 60vmin;
  height: 60vmin;
  display: grid;
  grid-template-columns: repeat(30, max-content);
}

.cell {
  width:2vmin;
  height:2vmin;
  border: none;
}
</style>
