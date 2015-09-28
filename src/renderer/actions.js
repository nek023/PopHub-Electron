import ipc from 'ipc';
import shell from 'shell';
import remote from 'remote';
import { titleForEvent } from '../lib/event-utils';
import { notificationHtmlUrl } from '../lib/notification-utils';
import GitHubClient from '../lib/github-client';
const dialog = remote.require('dialog');

export const SET_ACCESS_TOKEN = 'SET_ACCESS_TOKEN';
export const SET_USER = 'SET_USER';
export const SET_ACTIVE_PAGE = 'SET_ACTIVE_PAGE';
export const SET_EVENTS_UPDATE_INTERVAL = 'SET_EVENTS_UPDATE_INTERVAL';
export const SET_NOTIFICATIONS_UPDATE_INTERVAL = 'SET_NOTIFICATIONS_UPDATE_INTERVAL';
export const SET_GITHUB_STATUS_UPDATE_INTERVAL = 'SET_GITHUB_STATUS_UPDATE_INTERVAL';
export const REQUEST_EVENTS = 'REQUEST_EVENTS';
export const RECEIVE_EVENTS = 'RECEIVE_EVENTS';
export const CLEAR_EVENTS = 'CLEAR_EVENTS';
export const REQUEST_NOTIFICATIONS = 'REQUEST_NOTIFICATIONS';
export const RECEIVE_NOTIFICATIONS = 'RECEIVE_NOTIFICATIONS';
export const CLEAR_NOTIFICATIONS = 'CLEAR_NOTIFICATIONS';
export const MARK_NOTIFICATION_AS_READ = 'MARK_NOTIFICATION_AS_READ';
export const MARK_NOTIFICATIONS_AS_READ_IN_REPOSITORY = 'MARK_NOTIFICATIONS_AS_READ_IN_REPOSITORY';
export const FETCH_GITHUB_STATUS = 'FETCH_GITHUB_STATUS';
export const CLEAR_GITHUB_STATUS = 'CLEAR_GITHUB_STATUS';

export const ActivePage = {
  EVENTS: 0,
  NOTIFICATIONS: 1
};

export function setAccessToken(accessToken) {
  return {
    type: SET_ACCESS_TOKEN,
    accessToken: accessToken
  };
}

export function setUser(user) {
  return {
    type: SET_USER,
    user: user
  };
}

export function setActivePage(activePage) {
  return {
    type: SET_ACTIVE_PAGE,
    activePage: activePage
  };
}

export function setEventsUpdateInterval(eventsUpdateInterval) {
  return {
    type: SET_EVENTS_UPDATE_INTERVAL,
    eventsUpdateInterval: eventsUpdateInterval
  };
}

export function setNotificationsUpdateInterval(notificationsUpdateInterval) {
  return {
    type: SET_NOTIFICATIONS_UPDATE_INTERVAL,
    notificationsUpdateInterval: notificationsUpdateInterval
  };
}

export function setGitHubStatusUpdateInterval(gitHubStatusUpdateInterval) {
  return {
    type: SET_GITHUB_STATUS_UPDATE_INTERVAL,
    gitHubStatusUpdateInterval: gitHubStatusUpdateInterval
  };
}

function requestEvents() {
  return {
    type: REQUEST_EVENTS
  };
}

function receiveEvents(events) {
  return {
    type: RECEIVE_EVENTS,
    events: events,
    receivedAt: Date.now()
  };
}

export function clearEvents() {
  return {
    type: CLEAR_EVENTS
  };
}

function shouldFetchEvents(state) {
  if (!state.events) {
    return true;
  } else {
    return !state.fetchingEvents;
  }
}

function getEventsDiff(oldEvents, newEvents) {
  if (oldEvents.length === 0) return newEvents;

  const newIds = newEvents.map((event) => {
    return event.id;
  });
  const index = newIds.indexOf(oldEvents[0].id);

  if (index !== -1) {
    return newEvents.slice(0, index);
  } else {
    return newEvents;
  }
}

function fetchEvents() {
  return (dispatch, getState) => {
    const { accessToken, user, events } = getState();
    if (accessToken === '') return;

    const client = new GitHubClient();
    client.accessToken = accessToken;

    dispatch(requestEvents());

    client.get(`https://api.github.com/users/${user.login}/received_events?per_page=100`)
      .then(newEvents => {
        const diff = getEventsDiff(events, newEvents);

        // Send desktop notification if necessary
        if (!remote.getCurrentWindow().isVisible()) {
          if (diff.length === 1) {
            const event = diff[0];
            const notification = new Notification(event.repo.name, {
              body: titleForEvent(event)
            });
            notification.onclick = () => {
              ipc.send('show-popup-window');
            };
          } else if (diff.length > 0) {
            const notification = new Notification('PopHub', {
              body: `You have ${diff.length} new events.`
            });
            notification.onclick = () => {
              ipc.send('show-popup-window');
            };
          }
        }

        dispatch(receiveEvents(diff));
      })
      .catch(error => {
        dialog.showErrorBox('Error', error.message);
      });
  };
}

export function fetchEventsIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchEvents(getState())) {
      return dispatch(fetchEvents());
    }
  };
}

function requestNotifications() {
  return {
    type: REQUEST_NOTIFICATIONS
  };
}

function receiveNotifications(notifications) {
  return {
    type: RECEIVE_NOTIFICATIONS,
    notifications: notifications,
    receivedAt: Date.now()
  };
}

export function clearNotifications() {
  return {
    type: CLEAR_NOTIFICATIONS
  };
}

function parseNotifications(notifications) {
  const sections = {};

  for (const notification of notifications) {
    const key = notification['repository']['full_name'];

    if (key in sections) {
      sections[key].push(notification);
    } else {
      sections[key] = [notification];
    }
  }

  return sections;
}

function getNotificationsDiff(oldNotifications, newNotifications) {
  const oldIds = [];
  Object.keys(oldNotifications).forEach(key => {
    for (const notification of oldNotifications[key]) {
      oldIds.push(notification.id);
    }
  });

  const diff = [];
  Object.keys(newNotifications).forEach(key => {
    for (const notification of newNotifications[key]) {
      if (oldIds.indexOf(notification.id) === -1) {
        diff.push(notification);
      }
    }
  });

  return diff;
}

export function fetchNotifications() {
  return (dispatch, getState) => {
    const { accessToken, notifications } = getState();
    if (accessToken === '') return;

    const client = new GitHubClient();
    client.accessToken = accessToken;

    dispatch(requestNotifications());

    client.get('https://api.github.com/notifications')
      .then(data => {
        const newNotifications = parseNotifications(data);
        const diff = getNotificationsDiff(notifications, newNotifications);

        // Send desktop notification if necessary
        if (!remote.getCurrentWindow().isVisible()) {
          if (diff.length === 1) {
            const item = diff[0];
            const notification = new Notification(item.repository.name, {
              body: item.subject.title
            });
            notification.onclick = () => {
              dispatch(markNotificationAsRead(item));
              shell.openExternal(notificationHtmlUrl(item));
            };
          } else if (diff.length > 0) {
            const notification = new Notification('PopHub', {
              body: `You have ${diff.length} unread notifications.`
            });
            notification.onclick = () => {
              ipc.send('show-popup-window');
            };
          }
        }

        dispatch(receiveNotifications(newNotifications));
      })
      .catch(error => {
        dialog.showErrorBox('Error', error.message);
      });
  };
}

function shouldFetchNotifications(state) {
  if (!state.notifications) {
    return true;
  } else {
    return !state.fetchingNotifications;
  }
}

export function fetchNotificationsIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchNotifications(getState())) {
      return dispatch(fetchNotifications());
    }
  };
}

export function markNotificationAsRead(notification) {
  return {
    type: MARK_NOTIFICATION_AS_READ,
    notification: notification
  };
}

export function markNotificationsAsReadInRepository(repository) {
  return {
    type: MARK_NOTIFICATIONS_AS_READ_IN_REPOSITORY,
    repository: repository
  };
}

export function fetchGitHubStatus() {
  return (dispatch, getState) => {
    const { accessToken } = getState();
    if (accessToken === '') return;

    const client = new GitHubClient();

    client.get('https://status.github.com/api/status.json')
      .then(data => {
        dispatch({
          type: FETCH_GITHUB_STATUS,
          gitHubStatus: data
        });
      })
      .catch(error => {
        dialog.showErrorBox('Error', error.message);
      });
  };
}

export function clearGitHubStatus() {
  return {
    type: CLEAR_GITHUB_STATUS
  };
}
