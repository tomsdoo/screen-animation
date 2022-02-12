import Vue from "vue";
import { Tags } from "../modules/";

export function generateStart(ProvidedVue: Vue){
  return (options?: any) => {
    const div = document.body.appendChild(Tags.div({}, {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      "z-index": 99999
    }));

    // @ts-ignore
    const vue = new ProvidedVue()
      .$mount(div.appendChild(Tags.div()));
    const innerOptions = {
      closeOnClick: true,
      ...(options ? options : {})
    };

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

  };
}
