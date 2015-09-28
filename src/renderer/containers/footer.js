import ipc from 'ipc';
import remote from 'remote';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  setAccessToken,
  setEventsUpdateInterval,
  setNotificationsUpdateInterval,
  setGitHubStatusUpdateInterval,
  fetchEventsIfNeeded,
  fetchNotificationsIfNeeded,
  fetchGitHubStatus,
  clearEvents,
  clearNotifications,
  clearGitHubStatus
} from '../actions';

const app = remote.require('app');
const Menu = remote.require('menu');
const MenuItem = remote.require('menu-item');

class Footer extends Component {
  componentDidMount() {
    const { dispatch } = this.props;

    dispatch(fetchGitHubStatus());
  }

  setUpdateInterval(type, interval) {
    const { dispatch } = this.props;

    switch (type) {
    case 'events':
      dispatch(setEventsUpdateInterval(interval));
      break;

    case 'notifications':
      dispatch(setNotificationsUpdateInterval(interval));
      break;

    case 'github-status':
      dispatch(setGitHubStatusUpdateInterval(interval));
      break;

    default:
      break;
    }
  }

  reload() {
    const { dispatch } = this.props;

    dispatch(fetchEventsIfNeeded());
    dispatch(fetchNotificationsIfNeeded());
    dispatch(fetchGitHubStatus());
  }

  signOut() {
    const { dispatch } = this.props;

    dispatch(setAccessToken(''));
    dispatch(clearEvents());
    dispatch(clearNotifications());
    dispatch(clearGitHubStatus());

    ipc.send('stop-auto-update-timer', 'events');
    ipc.send('stop-auto-update-timer', 'notifications');
    ipc.send('stop-auto-update-timer', 'github-status');
  }

  quit() {
    app.quit();
  }

  updateIntervalMenuTemplate(type, currentInterval) {
    const template = [];

    const intervals = {
      'Off': 0,
      '1 minute': 1000 * 60,
      '3 minutes': 1000 * 60 * 3,
      '5 minutes': 1000 * 60 * 5,
      '10 minutes': 1000 * 60 * 10,
      '30 minutes': 1000 * 60 * 30,
      '60 minutes': 1000 * 60 * 60,
    };

    Object.keys(intervals).forEach(key => {
      const interval = intervals[key];

      template.push({
        label: key,
        type: 'radio',
        checked: (currentInterval === interval),
        click: this.setUpdateInterval.bind(this, type, interval)
      });
    });

    template.splice(1, 0, { type: 'separator' });

    return template;
  }

  showSettingsMenu() {
    const {
      eventsUpdateInterval,
      notificationsUpdateInterval,
      gitHubStatusUpdateInterval
    } = this.props;

    const menu = Menu.buildFromTemplate([
      {
        label: 'Reload',
        click: this.reload.bind(this)
      },
      {
        type: 'separator'
      },
      {
        label: 'Events Update Interval',
        type: 'submenu',
        submenu: this.updateIntervalMenuTemplate('events', eventsUpdateInterval)
      },
      {
        label: 'Notifications Update Interval',
        type: 'submenu',
        submenu: this.updateIntervalMenuTemplate('notifications', notificationsUpdateInterval)
      },
      {
        label: 'GitHub Status Update Interval',
        type: 'submenu',
        submenu: this.updateIntervalMenuTemplate('github-status', gitHubStatusUpdateInterval)
      },
      {
        type: 'separator'
      },
      {
        label: 'Sign Out',
        click: this.signOut.bind(this)
      },
      {
        type: 'separator'
      },
      {
        label: 'Quit',
        click: this.quit.bind(this)
      }
    ]);

    const rect = event.target.getBoundingClientRect();
    menu.popup(
      remote.getCurrentWindow(),
      Math.round(rect.left + rect.width),
      Math.round(rect.top + rect.height)
    );
  }

  render() {
    const { gitHubStatus } = this.props;

    const statusTextClass = () => {
      switch (gitHubStatus.status) {
      case 'good': return 'text-success';
      case 'minor': return 'text-warning';
      case 'major': return 'text-danger';
      default: return 'text-muted';
      }
    }();

    return (
      <div className="footer">
        <div className="pull-right settings-icon-container">
          <a href="#" onClick={this.showSettingsMenu.bind(this)}>
            <span className="octicon octicon-gear settings-icon-gear"></span>
            <span className="octicon octicon-triangle-down settings-icon-arrow"></span>
          </a>
        </div>
        <p>
          {'GitHub Status: '}
          <span className={`${statusTextClass} text-capitalize`}>{gitHubStatus.status}</span>
        </p>
      </div>
    );
  }
}

Footer.propTypes = {
  eventsUpdateInterval: PropTypes.number.isRequired,
  notificationsUpdateInterval: PropTypes.number.isRequired,
  gitHubStatusUpdateInterval: PropTypes.number.isRequired,
  gitHubStatus: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    eventsUpdateInterval: state.eventsUpdateInterval,
    notificationsUpdateInterval: state.notificationsUpdateInterval,
    gitHubStatusUpdateInterval: state.gitHubStatusUpdateInterval,
    gitHubStatus: state.gitHubStatus
  };
}

export default connect(mapStateToProps)(Footer);
