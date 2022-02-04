<template>
  <div
    class="stage"
    :style="{ backgroundColor: stageColor }"
  >
    <div class="myboard">
      <div
        v-for="cell in cells"
        class="card cell"
        :class='[cell.alive ? "alive" : ""]'
        :style="{ backgroundColor: cell.alive ? cellColor : 'transparent' }"
      >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

class Cell {
  public x: number;
  public y: number;
  public alive: boolean;
  protected nextState: boolean;
  public changed: boolean;
  constructor(x: number, y: number, alive: boolean){
    this.x = x;
    this.y = y;
    this.alive = alive;
    this.changed = false;
  }
  public die(){
    this.alive = false;
  }
  public bear(){
    this.alive = true;
  }
  public setNext(alive: boolean){
    this.nextState = alive;
  }
  public goNext(){
    const changed = this.alive !== this.nextState;
    this.alive = this.nextState;
    this.nextState = undefined;
    this.changed = changed;
  }
  public getSurroundedPoints(){
    return [ -1, 0, 1 ].map(
      x => [ -1, 0, 1].map(
        y => ({
          x: this.x + x,
          y: this.y + y
        })
      )
    ).flat().filter(point => point.x !== 0 || point.y !== 0);
  }
}

class Board {
  public cells: Cell[];
  constructor(cells: Cell[]){
    this.cells = cells;
  }
  public getCell(x: number, y: number){
    return this.cells.find(cell => cell.x === x && cell.y === y);
  }
  public getCellState(x: number, y: number){
    return ((cell) => cell && cell.alive || false)(this.getCell(x, y));
  }
  public getCellScore(cell: Cell){
    return cell
      .getSurroundedPoints()
      .map(point => this.getCell(point.x, point.y))
      .filter(Boolean).map(cell => cell.alive ? 1 : 0)
      .reduce((a,b) => a + b, 0);
  }
  public goForward(){
    this.cells.map(cell => {
      const score = this.getCellScore(cell);
      if(cell.alive && (score <= 1 || score >= 4)){
        cell.setNext(false);
      }else if(score === 3){
        cell.setNext(true);
      }else{
        cell.setNext(cell.alive);
      }
      return cell;
    }).forEach(cell => cell.goNext());
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
  computed: {
    cellColor(){
      return this.options.color || "#014347";
    },
    stageColor(){
      return this.options.backgroundColor || "transparent";
    }
  },
  data:function(){return {
    cells:[],
    cellxy:{},
    table:{x:0,y:0},
    celldef:{wh:2},
    histories: []
  };},
  methods:{
    refresh:function(){
      const that = this;
      that.table.x = 30;
      that.table.y = 30;
      that.cells = [...Array(that.table.x * that.table.y).keys()].map(function(i){
        const myy = Math.floor(i / that.table.x);
        const myx = i % that.table.x;
        const mycell = {i:i,x:myx,y:myy,alive:Math.floor(Math.random() * 4) === 0};
        if(!(myx in that.cellxy)){that.cellxy[myx] = {};}
        that.cellxy[myx][myy] = mycell;
        return mycell;
      });
    },
    goforward:function(){
      const that = this;
      let bchanged = false;
      that.cells = that.cells.map(function(cell){
        const noleft = cell.x <= 0,
          noup = cell.y <= 0,
          noright = cell.x >= that.table.x -1,
          nodown = cell.y >= that.table.y -1;
        const left_up = noleft || noup ? false : that.cellxy[cell.x-1][cell.y-1].alive;
        const up = noup ? false : that.cellxy[cell.x][cell.y-1].alive;
        const right_up = noright || noup ? false : that.cellxy[cell.x+1][cell.y-1].alive;
        const left = noleft ? false : that.cellxy[cell.x-1][cell.y].alive;
        const right = noright ? false : that.cellxy[cell.x+1][cell.y].alive;
        const left_down = noleft || nodown ? false : that.cellxy[cell.x-1][cell.y+1].alive;
        const down = nodown ? false : that.cellxy[cell.x][cell.y+1].alive;
        const right_down = noright || nodown ? false : that.cellxy[cell.x+1][cell.y+1].alive;
        const score = [left_up,up,right_up,left,right,left_down,down,right_down].filter(Boolean).length;
        const ncell = {i:cell.i, x:cell.x, y:cell.y,alive:cell.alive,changed:false};
        if(cell.alive){
          if(score <= 1){
            ncell.alive = false;
            ncell.changed = true;
          }else if(score >= 4){
            ncell.alive = false;
            ncell.changed = true;
          }
        }else if(score === 3){
          ncell.alive = true;
          ncell.changed = true;
        }
        if(cell.alive !== ncell.alive){
          bchanged = true;
        }
        return ncell;
      });
      that.cells.filter(function(cell){return cell.changed;}).map(function(cell){
        that.cellxy[cell.x][cell.y] = cell;
      });
      return bchanged;
    }
  },
  mounted:function(){
    const that = this;
    that.refresh();
    (function tempf(){
      const bchanged = that.goforward();
      if(that.proceeding){
        const mydat = JSON.stringify(that.cells.map(({alive}) => alive));
        const dat = that.histories.length > 1 ? that.histories.shift() : "";
        that.histories.push(mydat);
        if(!bchanged || mydat == dat){
          that.refresh();
        }
        setTimeout(function(){tempf();},10);
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
  width:2vmin;
  height:2vmin;
  border-width:0px;
  border-color:gray;
  border-radius: 0.2em;
}
.alive {
  abackground-color:#014347;
  color:#fff;
}
.myboard {
  min-width:60vmin;
  max-width:60vmin;
  min-height:60vmin;
  max-height:60vmin;
  display: grid;
  grid-template-columns: repeat(30, max-content);
}

.cell-enter-active, .cell-leave-active {transition: all 50ms linear;}
.cell-enter, .cell-leave-to {opacity:0; position:absolute;}
.cell-leave, .cell-enter-to {opacity:1;}
</style>
