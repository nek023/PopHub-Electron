import { EventEmitter } from 'events';

export default class WindowController extends EventEmitter {
  constructor(window) {
    super();

    this.window = window;
  }

  showWindow() {
    this.window.show();
  }

  hideWindow() {
    this.window.hide();
  }
}
