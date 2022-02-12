import {
  Avalanche,
  start
} from "./index";

declare global {
  interface Window {
    ScreenAnimation: {
      start: Function;
      Avalanche?: {
        start: Function;
      }
    }
  }
}

window.ScreenAnimation = {
  Avalanche,
  start
};
