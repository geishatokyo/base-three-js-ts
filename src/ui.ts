import nextImage from "./assets/png/button_next.png";
import installImage from "./assets/png/button_now.png";
import completeText from "./assets/png/complete.png";
import iconImage from "./assets/png/icon.png";

interface ImageInfo {
  src: string;
}
class UiController {
  private _ready = false;
  get isReady(): boolean {
    return this._ready;
  }
  failGroup: HTMLElement;
  nextGroup: HTMLElement;
  tutorial: HTMLElement[] = [];
  svgImageMap: Map<string, ImageInfo> = new Map([
    ["next-button", { src: nextImage }],
    ["install", { src: installImage }],
    ["icon", { src: iconImage }],
    ["complete-text", { src: completeText }],
  ]);
  init(): void {
    if (this._ready) return;
    this.failGroup = document.getElementById("fail-group");
    this.nextGroup = document.getElementById("next-group");
    for (let i = 1; i <= 1; i++)
      this.tutorial.push(document.getElementById(`tutorial${i}`));
    this.svgImageMap.forEach((value, key) => {
      const element = document.getElementById(key);
      const { src } = value;
      element.setAttributeNS("http://www.w3.org/1999/xlink", "href", src);
    });

    const eventName = "ontouchstart" in window ? "touchstart" : "click";
    document
      .getElementById("install")
      .addEventListener(eventName, this.installClick, false);

    this._ready = true;
  }

  bindClickEvent(id: string, handler: () => void): void {
    const eventName = "ontouchstart" in window ? "touchstart" : "click";
    document.getElementById(id).addEventListener(eventName, handler, false);
  }

  setSize(height: number, width: number): void {
    if (height / width < 1.5) {
      document.getElementById("ui-svg").style.height = height + "px";
      document.getElementById("ui-svg").style.width = height / 1.5 + "px";
      const frameWidth = document.getElementById("ui-frame").clientWidth;
      document.getElementById("ui-svg").style.left =
        (frameWidth - height / 1.5) / 2 + "px";
    } else {
      document.getElementById("ui-svg").style.width = width + "px";
      document.getElementById("ui-svg").style.height = height + "px";
      document.getElementById("ui-svg").style.left = "0px";
    }
  }

  setState(state: number): void {
    switch (state) {
      case 0:
        this._setVisibility(this.failGroup, false);
        this._setVisibility(this.nextGroup, false);
        break;
      case 1:
        this._setVisibility(this.failGroup, false);
        this._setVisibility(this.nextGroup, true);
        break;
      case 2:
        this._setVisibility(this.failGroup, true);
        this._setVisibility(this.nextGroup, false);
        break;
      default:
        break;
    }
  }
  setTutorial(index: number): void {
    for (let i = 0; i < 1; i++) {
      const visibility = i == index;
      this._setVisibility(this.tutorial[i], visibility);
    }
  }
  private _setVisibility(element: HTMLElement, visible: boolean): void {
    element.setAttribute("visibility", visible ? "visible" : "hidden");
  }
  showInstallButton(): void {
    document
      .getElementById("next-button")
      .setAttribute("visibility", "visible");
  }
  hideLoading(): void {
    document.getElementById("loading").setAttribute("visibility", "hidden");
  }
  installClick(): void {
    alert("not in facebook or google-ads or applovin");
  }
}

export const uiController = new UiController();
