import React, { Component, PropTypes } from 'react';
import Notifications from './notifications';

export default class NotificationSection extends Component {
  render() {
    const {
      name,
      notifications,
      markNotificationsAsReadInRepository,
      onNotificationClick
    } = this.props;

    const repository = notifications[0].repository;

    return (
      <div className="notification-section">
        <div className="notification-section-title">
          <strong>{name}</strong>
          <a href="#" onClick={markNotificationsAsReadInRepository.bind(this, repository)}>
            <span className="octicon octicon-check pull-right checkmark"></span>
          </a>
        </div>
        <Notifications
          notifications={notifications}
          onNotificationClick={onNotificationClick} />
      </div>
    );
  }
}

NotificationSection.propTypes = {
  name: PropTypes.string.isRequired,
  notifications: PropTypes.array.isRequired,
  markNotificationsAsReadInRepository: PropTypes.func.isRequired,
  onNotificationClick: PropTypes.func.isRequired
};
