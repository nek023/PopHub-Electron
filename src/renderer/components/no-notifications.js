import React, { Component } from 'react';

export default class NoNotifications extends Component {
  render() {
    return (
      <div className="center-block no-notifications">
        <span className="mega-octicon octicon-bell"></span>
        <h2>No new notifications.</h2>
      </div>
    );
  }
}
