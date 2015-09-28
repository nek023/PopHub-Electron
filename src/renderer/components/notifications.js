import React, { Component, PropTypes } from 'react';
import Notification from './notification';

export default class Notifications extends Component {
  render() {
    const {
      notifications,
      onNotificationClick
    } = this.props;

    if (notifications.length > 0) {
      const repository = notifications[0].repository;

      return (
        <div className="notifications">
          {notifications.map(notification => {
            return <Notification
                    key={notification.id}
                    notification={notification}
                    onClick={onNotificationClick} />;
          })}
        </div>
      );
    } else {
      return (
        <div className="notifications"></div>
      );
    }
  }
}

Notifications.propTypes = {
  notifications: PropTypes.array.isRequired,
  onNotificationClick: PropTypes.func.isRequired
};
