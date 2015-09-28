import app from 'app';
import BrowserWindow from 'browser-window';
import dialog from 'dialog';
import fileUrl from 'file-url';
import ipc from 'ipc';
import Menubar from 'menubar';
import path from 'path';
import AuthenticationWindowController from './controllers/authentication_window_controller';
import PopupWindowController from './controllers/popup_window_controller';

let pwc = null;
let awc = null;
let timerIds = {};

const menubar = Menubar({
  icon_path: path.join(__dirname, 'assets/img/status_icon.png')
});

menubar.on('ready', () => {
  pwc = new PopupWindowController();
  menubar.setWindow(pwc.window);

  ipc.on('authenticate', () => {
    awc = new AuthenticationWindowController({
      clientId: '',
      clientSecret: ''
    });

    awc.on('authentication-succeeded', (accessToken) => {
      awc.hideWindow();
      awc = null;

      pwc.window.webContents.send('authentication-succeeded', accessToken);
    });

    awc.on('authentication-failed', (error) => {
      awc.hideWindow();
      awc = null;

      dialog.showErrorBox('Error', error.message);
    });
  });

  ipc.on('show-popup-window', () => {
    pwc.showWindow();
  });

  ipc.on('start-auto-update-timer', (e, key, interval) => {
    startAutoUpdateTimer(key, interval);
  });

  ipc.on('stop-auto-update-timer', (e, key) => {
    stopAutoUpdateTimer(key);
  });

  function startAutoUpdateTimer(key, interval) {
    stopAutoUpdateTimer(key);

    if (interval > 0) {
      timerIds[key] = setInterval(() => {
        pwc.window.webContents.send('auto-update-timer-fired', key);
      }, interval);
    }
  }

  function stopAutoUpdateTimer(key) {
    if (timerIds[key]) {
      clearInterval(timerIds[key]);
      delete timerIds[key];
    }
  }
});
