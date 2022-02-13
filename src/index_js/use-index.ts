import {
  Avalanche,
  Life,
  start
} from "./index";

declare global {
  interface Window {
    ScreenAnimation: {
      start: Function;
      Avalanche?: {
        start: Function;
      },
      Life?: {
        start: Function;
      }
    }
  }
}

window.ScreenAnimation = {
  Avalanche,
  start
};
