import ipc from 'ipc';
import remote from 'remote';
import React, { Component } from 'react';

const app = remote.require('app');

export default class SignInPage extends Component {
  signIn() {
    ipc.send('authenticate');
  }

  quit() {
    app.quit();
  }

  render() {
    return (
      <div className="sign-in-page">
        <h1>Welcome to PopHub!</h1>

        <p>
          You need to authorize PopHub to use your GitHub account.<br />
          Authorization page will be opened.
        </p>

        <div className="button-container">
          <a
            href="#"
            className="btn btn-primary-outline"
            onClick={this.signIn}>
            Continue
          </a>
          <a
            href="#"
            className="btn btn-danger-outline"
            onClick={this.quit}>
            Quit
          </a>
        </div>
      </div>
    );
  }
}
