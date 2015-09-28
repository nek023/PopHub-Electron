import { combineReducers } from 'redux';
import {
  SET_ACCESS_TOKEN,
  SET_USER,
  SET_ACTIVE_PAGE,
  SET_EVENTS_UPDATE_INTERVAL,
  SET_NOTIFICATIONS_UPDATE_INTERVAL,
  SET_GITHUB_STATUS_UPDATE_INTERVAL,
  REQUEST_EVENTS,
  RECEIVE_EVENTS,
  CLEAR_EVENTS,
  REQUEST_NOTIFICATIONS,
  RECEIVE_NOTIFICATIONS,
  CLEAR_NOTIFICATIONS,
  MARK_NOTIFICATION_AS_READ,
  MARK_NOTIFICATIONS_AS_READ_IN_REPOSITORY,
  FETCH_GITHUB_STATUS,
  CLEAR_GITHUB_STATUS,
  ActivePage
} from './actions';
const { EVENTS, NOTIFICATIONS } = ActivePage;

const MAXIMUM_NUMBER_OF_EVENTS = 200;

function accessToken(state = '', action) {
  switch (action.type) {
  case SET_ACCESS_TOKEN:
    return action.accessToken;

  default:
    return state;
  }
}

function user(state = {}, action) {
  switch (action.type) {
  case SET_USER:
    return action.user;

  default:
    return state;
  }
}

function activePage(state = EVENTS, action) {
  switch (action.type) {
  case SET_ACTIVE_PAGE:
    return action.activePage;

  default:
    return state;
  }
}

function eventsUpdateInterval(state = 1000 * 60 * 10, action) {
  switch (action.type) {
  case SET_EVENTS_UPDATE_INTERVAL:
    return action.eventsUpdateInterval;

  default:
    return state;
  }
}

function notificationsUpdateInterval(state = 1000 * 60 * 10, action) {
  switch (action.type) {
  case SET_NOTIFICATIONS_UPDATE_INTERVAL:
    return action.notificationsUpdateInterval;

  default:
    return state;
  }
}

function gitHubStatusUpdateInterval(state = 1000 * 60 * 30, action) {
  switch (action.type) {
  case SET_GITHUB_STATUS_UPDATE_INTERVAL:
    return action.gitHubStatusUpdateInterval;

  default:
    return state;
  }
}

function fetchingEvents(state = false, action) {
  switch (action.type) {
  case REQUEST_EVENTS:
    return true;

  case RECEIVE_EVENTS:
    return false;

  default:
    return state;
  }
}

function events(state = [], action) {
  switch (action.type) {
  case RECEIVE_EVENTS:
    const events = [].concat(state);
    let newEvents = action.events.concat(events);

    if (newEvents.length > MAXIMUM_NUMBER_OF_EVENTS) {
      newEvents = newEvents.slice(0, MAXIMUM_NUMBER_OF_EVENTS);
    }

    return newEvents;

  case CLEAR_EVENTS:
    return [];

  default:
    return state;
  }
}

function fetchingNotifications(state = false, action) {
  switch (action.type) {
  case REQUEST_NOTIFICATIONS:
    return true;

  case RECEIVE_NOTIFICATIONS:
    return false;

  default:
    return state;
  }
}

function notifications(state = {}, action) {
  switch (action.type) {
  case RECEIVE_NOTIFICATIONS:
    return action.notifications;

  case CLEAR_NOTIFICATIONS:
    return {};

  case MARK_NOTIFICATION_AS_READ: {
    const notifications = Object.assign({}, state);

    const notification = action.notification;
    const key = notification.repository.full_name;

    if (notifications[key].length === 1) {
      delete notifications[key];
    } else {
      const index = notifications[key].indexOf(notification);

      if (index !== -1) {
        notifications[key].splice(index, 1);
      }
    }

    return notifications;
  }

  case MARK_NOTIFICATIONS_AS_READ_IN_REPOSITORY: {
    const notifications = Object.assign({}, state);
    delete notifications[action.repository.full_name];
    return notifications;
  }

  default:
    return state;
  }
}

const defaultGitHubStatus = {
  status: 'unknown',
  last_updated: ''
};

function gitHubStatus(state = defaultGitHubStatus, action) {
  switch (action.type) {
  case FETCH_GITHUB_STATUS:
    return action.gitHubStatus;

  case CLEAR_GITHUB_STATUS:
    return defaultGitHubStatus;

  default:
    return state;
  }
}

const rootReducer = combineReducers({
  accessToken,
  user,
  activePage,
  eventsUpdateInterval,
  notificationsUpdateInterval,
  gitHubStatusUpdateInterval,
  fetchingEvents,
  events,
  fetchingNotifications,
  notifications,
  gitHubStatus
});

export default rootReducer;
