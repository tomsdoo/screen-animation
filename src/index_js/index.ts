import Vue from "./components/stage.vue";

export function start(
  name: string,
  options?: any
){
  const div = document.body
    .appendChild(document.createElement("div"));
  Object.entries({
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    "z-index": 99999
  }).forEach(([ key, value ]) => {
    // @ts-ignore
    div.style[key] = value;
  });

  const vue = new Vue({});

  const innerOptions = {
    closeOnClick: true,
    ...(options ? options : {})
  };

  vue.options = innerOptions;
  vue.name = name;

  if(innerOptions.closeOnClick){
    div.addEventListener("click", () => {
      vue.end();
      div.innerHTML = "";
      div.style.display = "none";
    });
  }

  vue.$mount(div.appendChild(document.createElement("div")));

  return {
    addEventListener(eventName: string, handler: Function){
      // @ts-ignore
      div.addEventListener(eventName, handler);
    },
    end(){
      vue.end();
      div.innerHTML = "";
      div.style.display = "none";
    }
  };
}

export const Avalanche = {
  start: (options?: any) => start("avalanche", options)
};

export const Circle = {
  start: (options?: any) => start("circle", options)
};

export const Life = {
  start: (options?: any) => start("life", options)
};

export const Line = {
  start: (options?: any) => start("line", options)
};

export const Message = {
  start: (options?: any) => start("message", options)
};

export const Puzzle = {
  start: (options?: any) => start("puzzle", options)
};

export const Rails = {
  start: (options?: any) => start("rails", options)
};

export const Sea = {
  start: (options?: any) => start("sea", options)
};

export const Sky = {
  start: (options?: any) => start("sky", options)
};

export const Space = {
  start: (options?: any) => start("space", options)
};

export const Sparkler = {
  start: (options?: any) => start("sparkler", options)
};

export const Star = {
  start: (options?: any) => start("star", options)
};

export const Tetris = {
  start: (options?: any) => start("tetris", options)
};
