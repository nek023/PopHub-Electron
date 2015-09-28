import BrowserWindow from 'browser-window';
import WindowController from './window_controller';
import GitHubClient from '../../lib/github-client';

export default class AuthenticationWindowController extends WindowController {
  constructor({ clientId, clientSecret }) {
    const window = new BrowserWindow({
      width: 800,
      height: 600,
      title: 'Authorize',
      'node-integration': false
    });

    super(window);

    const handleCallback = (event, url) => {
      let matches;
      if (matches = url.match(/\?code=([^&]*)/)) {
        const code = matches[1];

        event.preventDefault();

        this.requestAccessToken({
          clientId: clientId,
          clientSecret: clientSecret,
          code: code
        });
      }
    };

    window.webContents.on('will-navigate', (event, url) => {
      handleCallback(event, url);
    });

    window.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl, isMainFrame) => {
      handleCallback(event, newUrl);
    });

    const scopes = ['notifications'];
    const query = `client_id=${clientId}&scope=${scopes.join()}`;
    const url = `https://github.com/login/oauth/authorize?${query}`;
    window.loadUrl(url);
  }

  requestAccessToken({ clientId, clientSecret, code }) {
    const client = new GitHubClient();

    client.post('https://github.com/login/oauth/access_token', {
      client_id: clientId,
      client_secret: clientSecret,
      code: code
    })
      .then(data => {
        const accessToken = data.access_token;
        this.emit('authentication-succeeded', accessToken);
      })
      .catch(error => {
        this.emit('authentication-failed', error);
      });
  }
}
