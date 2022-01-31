<template>
  <div class="stage">
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

class Rand {
  public static number(underOf: number){
    return Math.floor(Math.random() * underOf);
  }
}

class YLimits {
  protected cells: {x: number, y: number}[];
  public yo: object;
  constructor(cells: {x: number, y: number}){
    this.cells = cells;
    this.yo = Object.fromEntries(
      this.cells.map(cell => [
        cell.x,
        this.cells.filter(c => c.x == cell.x)
      ])
    );
  }
  public getY(x: number){
    return x in this.yo ?
      this.yo[x].sort((a,b) => a.y - b.y)[0].y :
      undefined;
  }
}

class Tetrimino {
  public x: number;
  public y: number;
  public char: string;
  public active: boolean;
  public degree: number;
  public color: string;
  constructor(char: string, x: number, y: number, color: string){
    this.x = x;
    this.y = y;
    this.char = char;
    this.color = color;
    this.active = true;
    this.degree = 0;
  }
  public changeDegree(){
    this.degree = (this.degree + 90) % 360;
  }
  abstract getCells(): { x: number; y: number; }[]
}

class Tetrimino_I extends Tetrimino {
  constructor(x: number, y: number){
    super("I", x, y, "lightblue");
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
  constructor(x: number, y: number){
    super("O", x, y, "yellow");
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
  constructor(x: number, y: number){
    super("S", x, y, "green");
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
  constructor(x: number, y: number){
    super("Z", x, y, "red");
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
  constructor(x: number, y: number){
    super("J", x, y, "blue");
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
  constructor(x: number, y: number){
    super("L", x, y, "orange");
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
  constructor(x: number, y: number){
    super("T", x, y, "purple");
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
  data:function(){return {
    boardw:20,
    boardh:30,
    wh:2,
    cells:[],
    tetriminos:[],
    bcontinue:true
  };},
  computed:{
    boardwidth(){return this.wh * this.boardw + "vmin";},
    boardheight(){return this.wh * this.boardh + "vmin";},
    cellwidth(){return this.wh+"vmin";},
    cellheight(){return this.wh+"vmin";}
  },
  methods:{
    addTetrimino(){
      const tetriminoClasses = [
        Tetrimino_I,
        Tetrimino_O,
        Tetrimino_S,
        Tetrimino_Z,
        Tetrimino_J,
        Tetrimino_L,
        Tetrimino_T
      ];
      this.tetriminos.push(
        new tetriminoClasses[Rand.number(tetriminoClasses.length)](Rand.number(this.boardw - 2)+1, 0)
      );
    },
    playGame(){
      const that = this;
      this.cells = [...Array(this.boardw * this.boardh).keys()]
        .map(() => {color:"transparent"});

      this.tetriminos = [];

      (function tempf(){
        const currentcells = that.tetriminos
          .filter(tetrimino => !tetrimino.active)
          .map(tetrimino => tetrimino.getCells())
          .flat();

        const yLimits = new YLimits(currentcells);
        let isGameOver = false;
        that.tetriminos.filter(function(tetrimino){return tetrimino.active;}).map(function(tetrimino){
          Rand.number(10) === 0 && tetrimino.changeDegree();

          if(Rand.number(10) === 0 && tetrimino.x + 2 < that.boardw){
            tetrimino.x += 1;
          }else if(Rand.number(10) === 0 && tetrimino.x > 2){
            tetrimino.x -= 1;
          }
          tetrimino.y += 1;
          const tempcells = tetrimino.getCells();
          const maxy = tempcells.sort(function(a,b){return b.y - a.y;})[0].y;
          let overY = false;
          const itsok = tempcells.filter(function(tempcell){
            const topY = yLimits.getY(tempcell.x);
            if(!topY){return false;}
            overY = overY || tempcell.y + 1 > topY;
            return tempcell.y + 1 >= topY;
          }).length > 0;
          if(overY){tetrimino.y -= 1;}
          if(maxy >= that.boardh - 1 || itsok){
            tetrimino.active = false;
            if(maxy <= 1){
              isGameOver = true;
            }
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
        if(that.bcontinue && !isGameOver){
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
