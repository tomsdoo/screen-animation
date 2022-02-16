import {
  Avalanche,
  Life,
  Line,
  Message,
  Puzzle,
  Rails,
  Sea,
  Sky,
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
      },
      Puzzle?: {
        start: Function;
      },
      Rails?: {
        start: Function;
      },
      Sea?: {
        start: Function;
      },
      Sky?: {
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
  Puzzle,
  Rails,
  Sea,
  Sky,
  start
};
