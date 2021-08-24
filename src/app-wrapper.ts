import { App } from "./app";
import { controller } from "./controller";
import { uiController } from "./ui";
const waitPromise: (time: number) => Promise<void> = (time) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });

const glPromise: () => Promise<WebGLRenderingContext> = () =>
  new Promise((resolve, reject) => {
    const canvas = document.getElementById("main-scene") as HTMLCanvasElement;
    const gl = canvas.getContext("webgl");
    if (gl) {
      resolve(gl);
    } else {
      reject();
    }
  });

const factoryList = [(): App => new App()];
abstract class AppWrapper {
  app: App;
  state = 0;
  type = 0;
  constructor(type: number) {
    this.type = type;
  }
  setInstall(installCall: () => void): void {
    uiController.installClick = installCall;
  }
  abstract windowResize(): { width: number; height: number };
  abstract bindEvent(): void;
  async launchApp(): Promise<void> {
    this.windowResize();
    let webGlInit = false;
    for (let i = 0; i < 6; i++) {
      try {
        await glPromise();
        webGlInit = true;
        break;
      } catch (err) {
        console.error(err);
        await waitPromise(500);
        console.log(`wait ${i}`);
      }
    }
    try {
      if (!webGlInit) {
        throw Error("webgl failed");
      }
      this.app = factoryList[this.type]();
      await this.app.init();

      this.bindEvent();

      this.app.run();
      setTimeout(() => {
        const { width, height } = this.windowResize();
        this.app.size.height = height;
        this.app.size.width = width;
        this.app.needResize = true;
      }, 100);
      setTimeout(() => {
        uiController.hideLoading();
      }, 250);
    } catch (error) {
      console.error(error);
      uiController.init();
      controller.init();
      uiController.hideLoading();
      this.windowResize();
      uiController.setState(4);
    }
  }
  start(): void {
    if (this.state === 0) {
      this.state = 2;
      this.launchApp();
    }
    if (this.state === 1) {
      this.state = 2;
    }
  }
  pause(): void {
    if (this.state === 2) {
      this.state = 1;
    }
  }
}

export class AppNormal extends AppWrapper {
  constructor(type: number) {
    super(type);
  }
  windowResize(): { width: number; height: number } {
    let width = 0;
    let height = 0;
    width = document.getElementById("canvas-frame").clientWidth;
    height = document.getElementById("canvas-frame").clientHeight;
    uiController.setSize(height, width);
    return { width, height };
  }
  bindEvent(): void {
    window.addEventListener(
      "resize",
      () => {
        const width = document.getElementById("canvas-frame").clientWidth;
        const height = document.getElementById("canvas-frame").clientHeight;
        this.app.resizeRequest(width, height);
      },
      false
    );
  }
}

export class AppDapi extends AppWrapper {
  constructor(type: number) {
    super(type);
  }
  windowResize(): { width: number; height: number } {
    let width = 0;
    let height = 0;
    const size = dapi.getScreenSize();
    dapi.getAudioVolume();
    width = size.width;
    height = size.height;
    uiController.setSize(height, width);
    return { width, height };
  }
  bindEvent(): void {
    dapi.addEventListener("adResized", () => {
      const { width, height } = dapi.getScreenSize();
      this.app.resizeRequest(width, height);
    });
  }
  //use arrow function keep documents.getElementId() working
  adVisibleCallback = (event: dapi.DapiEvent): void => {
    if (event.isViewable) {
      this.start();
      //START or RESUME the ad
    } else {
      this.pause();
      //PAUSE the ad and MUTE sounds
    }
  };
  audioVolumeChangeCallback = (volume: number): void => {
    const isAudioEnabled = !!volume;
    if (isAudioEnabled) {
      //START or turn on the sound
    } else {
      //PAUSE the turn off the sound
    }
  };
  onReadyCallback = (): void => {
    //No need to listen to this event anymore
    dapi.removeEventListener("ready", this.onReadyCallback);
    if (dapi.isViewable()) {
      this.adVisibleCallback({ isViewable: true });
    }
    //If the ad is visible start the game
    dapi.addEventListener("viewableChange", this.adVisibleCallback);
    dapi.addEventListener("audioVolumeChange", this.audioVolumeChangeCallback);
  };
}
