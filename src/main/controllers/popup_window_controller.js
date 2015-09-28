import BrowserWindow from 'browser-window';
import fileUrl from 'file-url';
import path from 'path';
import WindowController from './window_controller';

export default class PopupWindowController extends WindowController {
  constructor() {
    const window = new BrowserWindow({
      width: 340,
      height: 480,
      frame: false,
      resizable: false,
      transparent: true,
      show: false
    });
    window.setVisibleOnAllWorkspaces(true);

    super(window);

    window.loadUrl(fileUrl(path.join(__dirname, '../../renderer/index.html')));
  }
}
