import Vue from "./components/stage.vue";

export function start(
  name: string
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

  vue.name = name;
  div.addEventListener("click", () => {
    div.innerHTML = "";
    div.style.display = "none";
  });
}
