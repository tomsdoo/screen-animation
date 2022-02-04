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

  const vue = new Vue({
  }).$mount(div.appendChild(document.createElement("div")));

  const innerOptions = {
    closeOnClick: true,
    ...(options ? options : {})
  };

  vue.name = name;
  vue.options = innerOptions;

  if(innerOptions.closeOnClick){
    div.addEventListener("click", () => {
      vue.end();
      div.innerHTML = "";
      div.style.display = "none";
    });
  }
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
