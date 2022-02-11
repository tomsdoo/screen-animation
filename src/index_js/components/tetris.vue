<template>
  <div
    class="stage"
    :style="{ backgroundColor: stageColor }"
  >
    <div class="board" :style='{width:boardwidth,height:boardheight}'>
      <div
        v-for="cell in cells"
        class="cell"
        :class="{painted: cell.color != 'transparent'}"
        :style='{width:cellwidth,height:cellheight,backgroundColor:cell.color}'
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Rand } from "../../modules/";

class Occupied {
  protected cells: { x: number, y: number }[];
  constructor(cells: {x: number, y: number}[]){
    this.cells = cells;
  }
  public includes(activeCells: {x: number, y: number}[]){
    return activeCells.some(
      activeCell => this.cells.some(
        cell => cell.x === activeCell.x && cell.y === activeCell.y
      )
    );
  }
}

class Tetrimino {
  public x: number;
  public y: number;
  public char: string;
  public active: boolean;
  public degree: number;
  public color: string;
  constructor(char: string, x: number, y: number, color: string, degree: number){
    this.x = x;
    this.y = y;
    this.char = char;
    this.color = color;
    this.active = true;
    this.degree = degree;
  }
  public changeDegree(){
    this.degree = (this.degree + 90) % 360;
  }
  abstract getCells(): { x: number; y: number; }[]
}

class Tetrimino_I extends Tetrimino {
  constructor(x: number, y: number, color: string){
    super("I", x, y, color, 0);
  }
  public getCells(){
    return {
      0: [
        { x: this.x - 1, y: this.y },
        { x: this.x, y: this.y },
        { x: this.x + 1, y: this.y },
        { x: this.x + 2, y: this.y }
      ],
      90: [
        { x: this.x + 1, y: this.y - 1 },
        { x: this.x + 1, y: this.y },
        { x: this.x + 1, y: this.y + 1 },
        { x: this.x + 1, y: this.y + 2 }
      ]
    }[this.degree % 180];
  }
}

class Tetrimino_O extends Tetrimino {
  constructor(x: number, y: number, color: string){
    super("O", x, y, color, 0);
  }
  public getCells(){
    return [
      { x: this.x, y: this.y },
      { x: this.x + 1, y: this.y },
      { x: this.x, y: this.y + 1 },
      { x: this.x + 1, y: this.y + 1 }
    ];
  }
}

class Tetrimino_S extends Tetrimino {
  constructor(x: number, y: number, color: string){
    super("S", x, y, color, 0);
  }
  public getCells(){
    return {
      0: [
        { x: this.x, y: this.y },
        { x: this.x + 1, y: this.y },
        { x: this.x, y: this.y + 1 },
        { x: this.x - 1, y: this.y + 1 }
      ],
      90: [
        { x: this.x - 1, y: this.y },
        { x: this.x - 1, y: this.y + 1 },
        { x: this.x, y: this.y + 1 },
        { x: this.x, y: this.y + 2 }
      ]
    }[this.degree % 180];
  }
}

class Tetrimino_Z extends Tetrimino {
  constructor(x: number, y: number, color: string){
    super("Z", x, y, color, 0);
  }
  public getCells(){
    return {
      0: [
        { x: this.x - 1, y: this.y },
        { x: this.x, y: this.y },
        { x: this.x, y: this.y + 1 },
        { x: this.x + 1, y: this.y + 1 }
      ],
      90: [
        { x: this.x, y: this.y },
        { x: this.x, y: this.y + 1 },
        { x: this.x - 1, y: this.y + 1 },
        { x: this.x - 1, y: this.y + 2 }
      ]
    }[this.degree % 180];
  }
}

class Tetrimino_J extends Tetrimino {
  constructor(x: number, y: number, color: string){
    super("J", x, y, color, 0);
  }
  public getCells(){
    return {
      0: [
        { x: this.x - 1, y: this.y },
        { x: this.x - 1, y: this.y + 1 },
        { x: this.x, y: this.y + 1 },
        { x: this.x + 1, y: this.y + 1 }
      ],
      90: [
        { x: this.x, y: this.y },
        { x: this.x, y: this.y + 1 },
        { x: this.x, y: this.y + 2 },
        { x: this.x + 1, y: this.y }
      ],
      180: [
        { x: this.x - 1, y: this.y },
        { x: this.x, y: this.y },
        { x: this.x + 1, y: this.y },
        { x: this.x + 1, y: this.y + 1 }
      ],
      270: [
        { x: this.x, y: this.y },
        { x: this.x, y: this.y + 1 },
        { x: this.x, y: this.y + 2 },
        { x: this.x - 1, y: this.y + 2 }
      ]
    }[this.degree];
  }
}

class Tetrimino_L extends Tetrimino {
  constructor(x: number, y: number, color: string){
    super("L", x, y, color, 0);
  }
  public getCells(){
    return {
      0: [
        { x: this.x + 1, y: this.y },
        { x: this.x + 1, y: this.y + 1 },
        { x: this.x, y: this.y + 1 },
        { x: this.x - 1, y: this.y + 1 }
      ],
      90: [
        { x: this.x, y: this.y },
        { x: this.x, y: this.y + 1 },
        { x: this.x, y: this.y + 2 },
        { x: this.x + 1,y: this.y + 2 }
      ],
      180: [
        { x: this.x - 1, y: this.y },
        { x: this.x, y: this.y },
        { x: this.x + 1, y: this.y },
        { x: this.x - 1, y: this.y + 1 }
      ],
      270: [
        { x: this.x, y: this.y },
        { x: this.x, y: this.y + 1 },
        { x: this.x, y: this.y + 2 },
        { x: this.x - 1, y: this.y }
      ]
    }[this.degree];
  }
}

class Tetrimino_T extends Tetrimino {
  constructor(x: number, y: number, color: string){
    super("T", x, y, color, 0);
  }
  public getCells(){
    return {
      0: [
        { x: this.x, y: this.y },
        { x: this.x - 1, y: this.y + 1 },
        { x: this.x, y: this.y + 1 },
        { x: this.x + 1, y: this.y + 1 }
      ],
      90: [
        { x: this.x, y: this.y },
        { x: this.x, y: this.y + 1 },
        { x: this.x, y: this.y + 2 },
        { x: this.x + 1, y: this.y + 1 }
      ],
      180: [
        { x: this.x + 1, y: this.y },
        { x: this.x, y: this.y },
        { x: this.x + 1, y: this.y },
        { x: this.x, y: this.y + 1 }
      ],
      270: [
        { x: this.x, y: this.y },
        { x: this.x, y: this.y + 1 },
        { x: this.x, y: this.y + 2 },
        { x: this.x - 1, y: this.y + 1 }
      ]
    }[this.degree];
  }
}

export default Vue.extend({
  props: {
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
    boardw:20,
    boardh:30,
    wh:2,
    cells:[],
    tetriminos:[]
  };},
  computed:{
    boardwidth(){return this.wh * this.boardw + "vmin";},
    boardheight(){return this.wh * this.boardh + "vmin";},
    cellwidth(){return this.wh+"vmin";},
    cellheight(){return this.wh+"vmin";},
    colors(){
      return {
        i: "lightblue",
        o: "yellow",
        s: "green",
        z: "red",
        j: "blue",
        l: "orange",
        t: "purple",
        ...this.options.colors
      };
    },
    stageColor(){
      return this.options.backgroundColor || "transparent";
    }
  },
  methods:{
    addTetrimino(){
      const tetriminoClasses = [
        {
          classConstructor: Tetrimino_I,
          color: this.colors.i
        },
        {
          classConstructor: Tetrimino_O,
          color: this.colors.o
        },
        {
          classConstructor: Tetrimino_S,
          color: this.colors.s
        },
        {
          classConstructor: Tetrimino_Z,
          color: this.colors.z
        },
        {
          classConstructor: Tetrimino_J,
          color: this.colors.j
        },
        {
          classConstructor: Tetrimino_L,
          color: this.colors.l
        },
        {
          classConstructor: Tetrimino_T,
          color: this.colors.t
        }
      ];
      const myClass = tetriminoClasses[
        Rand.number(tetriminoClasses.length)
      ];
      this.tetriminos.push(
        new myClass.classConstructor(
          Rand.number(this.boardw - 2)+1, 0, myClass.color
        )
      );
    },
    playGame(){
      const that = this;
      this.cells = [...Array(this.boardw * this.boardh).keys()]
        .map(() => {color:"transparent"});

      this.tetriminos = [];

      (function tempf(){
        if(!that.proceeding){return;}
        const currentcells = that.tetriminos
          .filter(tetrimino => !tetrimino.active)
          .map(tetrimino => tetrimino.getCells())
          .flat();

        const occupied = new Occupied(currentcells);
        let isGameOver = false;
        that.tetriminos.filter(function(tetrimino){return tetrimino.active;}).map(function(tetrimino){
          Rand.number(10) === 0 && tetrimino.changeDegree();

          if(Rand.number(10) === 0 && tetrimino.x + 2 < that.boardw){
            tetrimino.x += 1;
            if(occupied.includes(tetrimino.getCells())){
              tetrimino.x -= 1;
            }
          }else if(Rand.number(10) === 0 && tetrimino.x > 2){
            tetrimino.x -= 1;
            if(occupied.includes(tetrimino.getCells())){
              tetrimino.x += 1;
            }
          }

          tetrimino.y += 1;
          if(occupied.includes(tetrimino.getCells())){
            tetrimino.active = false;
            tetrimino.y -= 1;
          }
          const maxy = tetrimino.getCells().sort(function(a,b){return b.y - a.y;})[0].y;
          if(maxy >= that.boardh - 1){
            tetrimino.active = false;
          }
          if(!tetrimino.active && maxy <= 1){
            isGameOver = true;
          }
        });
        if(that.tetriminos.filter(tetrimino => tetrimino.active).length === 0){
          that.addTetrimino();
        }
        const ncells = [...Array(that.boardw * that.boardh).keys()].map(() => ({
          color: "transparent"
        }));
        that.tetriminos.forEach(tetrimino => {
          tetrimino.getCells().forEach(cell => {
            const idx = cell.y * that.boardw + cell.x;
            if(idx in ncells){
              ncells[idx].color = tetrimino.color;
            }
          });
        });
        that.cells = ncells;
        if(that.proceeding && !isGameOver){
          setTimeout(function(){tempf();},3);
        }else{
          let interval = 25;
          setTimeout(() => {interval = 10;}, 300);
          setTimeout(() => {interval = 5;}, 800);
          setTimeout(() => {interval = 2;}, 1200);
          (function tempf(){
            const cells = Array.from(document.querySelectorAll(".stage .board .cell"))
              .filter(cell => cell.classList.contains("painted") && !cell.classList.contains("collapse"));
            if(cells.length === 0){
              setTimeout(() => that.playGame(), 1000);
              return;
            }
            [...Array(Rand.number(10)).keys()].forEach(i => {
              cells[Rand.number(cells.length)].classList.add("collapse");
            });
            setTimeout(() => tempf(), interval);
          })();
          that.$emit("fin");
        }
      })();

    }
  },
  created:function(){
  },
  mounted:function(){
    this.playGame();
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
.board {
  display: grid;
  grid-template-columns: repeat(20, max-content);
  overflow: hidden;
}

.cell.collapse {
  animation: collapse 2s ease 0s 1 normal both running;
}
.cell.rotate {
  animation: rotate 1s linear 0s infinite normal both running;
}

@keyframes rotate {
  0% {}
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes collapse {
  0% {}
  100% {
    transform: translate(0, 70vh);
  }
}
</style>
