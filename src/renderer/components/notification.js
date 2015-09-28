import React, { Component, PropTypes } from 'react';
import moment from 'moment';

export default class Notification extends Component {
  render() {
    const {
      notification,
      onClick
    } = this.props;

    const octiconClassName = () => {
      switch (notification.subject.type) {
      case 'Commit': return 'octicon-git-commit';
      case 'Issue': return 'octicon-issue-opened';
      case 'PullRequest': return 'octicon-git-pull-request';
      case 'Release': return 'octicon-tag';
      default: return '';
      }
    }();

    const iconClassName = `octicon ${octiconClassName} pull-left notification-icon`;

    return (
      <div className="notification" onClick={onClick.bind(this, notification)}>
        <span className={iconClassName}></span>
        <div className="notification-body">
          <p className="notification-title">
            {notification.subject.title}
          </p>
          <p className="notification-date">
            {moment(notification.updated_at).fromNow()}
          </p>
        </div>
      </div>
    );
  }
}

Notification.propTypes = {
  notification: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired
};
