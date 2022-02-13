import {
  Avalanche,
  Life,
  Line,
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
      },
      Line?: {
        start: Function;
      }
    }
  }
}

window.ScreenAnimation = {
  Avalanche,
  Life,
  Line,
  start
};
