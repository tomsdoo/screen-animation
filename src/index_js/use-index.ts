import {
  Avalanche,
  Life,
  Line,
  Message,
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
      },
      Message?: {
        start: Function;
      }
    }
  }
}

window.ScreenAnimation = {
  Avalanche,
  Life,
  Line,
  Message,
  start
};
