import shell from 'shell';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  markNotificationAsRead,
  markNotificationsAsReadInRepository
} from '../actions';
import { notificationHtmlUrl } from '../../lib/notification-utils';
import NotificationSection from '../components/notification-section';
import NoNotifications from '../components/no-notifications';

class NotificationsPage extends Component {
  handleNotificationClick(notification) {
    const { dispatch } = this.props;

    dispatch(markNotificationAsRead(notification));

    // Open notification page in the default browser
    const url = notificationHtmlUrl(notification);
    shell.openExternal(url);
  }

  render() {
    const {
      dispatch,
      notifications
    } = this.props;

    const boundMarkNotificationsAsReadInRepository = (repository) => {
      dispatch(markNotificationsAsReadInRepository(repository));
    };

    let content;
    if (Object.keys(notifications).length > 0) {
      content = Object.keys(notifications).map(key => {
        return <NotificationSection
                key={key}
                name={key}
                notifications={notifications[key]}
                markNotificationsAsReadInRepository={boundMarkNotificationsAsReadInRepository}
                onNotificationClick={this.handleNotificationClick.bind(this)} />;
      });
    } else {
      content = <NoNotifications />;
    }

    return (
      <div className="notifications-page">
        {content}
      </div>
    );
  }
}

NotificationsPage.propTypes = {
  notifications: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    notifications: state.notifications
  };
}

export default connect(mapStateToProps)(NotificationsPage);
