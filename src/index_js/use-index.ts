import { start } from "./index";

declare global {
  interface Window {
    ScreenAnimation: {
      start: Function;
    }
  }
}

window.ScreenAnimation = {
  start
};
