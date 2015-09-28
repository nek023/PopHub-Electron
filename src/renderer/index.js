import ipc from 'ipc';
import remote from 'remote';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from './store';
import GitHubClient from '../lib/github-client';
import Root from './containers/root';
import {
  ActivePage,
  setAccessToken,
  setUser,
  fetchEventsIfNeeded,
  fetchNotificationsIfNeeded,
  fetchGitHubStatus
} from './actions';
const dialog = remote.require('dialog');
const { EVENTS, NOTIFICATIONS } = ActivePage;

// Create store
const store = configureStore();

// Subscribe store to get the change of state
let currentState;
function handleChange() {
  const previousState = currentState;
  currentState = Object.assign({}, store.getState());

  if (previousState) {
    const previousEventsUpdateInterval = previousState.eventsUpdateInterval;
    const previousNotificationsUpdateInterval = previousState.notificationsUpdateInterval;
    const previousGitHubStatusUpdateInterval = previousState.gitHubStatusUpdateInterval;

    const currentEventsUpdateInterval = currentState.eventsUpdateInterval;
    const currentNotificationsUpdateInterval = currentState.notificationsUpdateInterval;
    const currentGitHubStatusUpdateInterval = currentState.gitHubStatusUpdateInterval;

    if (previousEventsUpdateInterval !== currentEventsUpdateInterval) {
      ipc.send('stop-auto-update-timer', 'events');
      ipc.send('start-auto-update-timer', 'events', currentEventsUpdateInterval);
    }

    if (previousNotificationsUpdateInterval !== currentNotificationsUpdateInterval) {
      ipc.send('stop-auto-update-timer', 'notifications');
      ipc.send('start-auto-update-timer', 'notifications', currentNotificationsUpdateInterval);
    }

    if (previousGitHubStatusUpdateInterval !== currentGitHubStatusUpdateInterval) {
      ipc.send('stop-auto-update-timer', 'github-status');
      ipc.send('start-auto-update-timer', 'github-status', currentGitHubStatusUpdateInterval);
    }
  }
}

store.subscribe(handleChange);
handleChange();

// Register ipc events
ipc.on('authentication-succeeded', (accessToken) => {
  const {
    eventsUpdateInterval,
    notificationsUpdateInterval,
    gitHubStatusUpdateInterval
  } = store.getState();

  store.dispatch(setAccessToken(accessToken));

  // Get authenticated user
  const client = new GitHubClient();
  client.accessToken = accessToken;

  client.get('https://api.github.com/user')
    .then(user => {
      store.dispatch(setUser(user));

      store.dispatch(fetchEventsIfNeeded());
      store.dispatch(fetchNotificationsIfNeeded());

      ipc.send('start-auto-update-timer', 'events', eventsUpdateInterval);
      ipc.send('start-auto-update-timer', 'notifications', notificationsUpdateInterval);
      ipc.send('start-auto-update-timer', 'github-status', gitHubStatusUpdateInterval);

      ipc.send('show-popup-window');
    })
    .catch(error => {
      dialog.showErrorBox('Error', error.message);
    });
});

ipc.on('auto-update-timer-fired', (key) => {
  switch (key) {
  case 'events':
    store.dispatch(fetchEventsIfNeeded());
    break;

  case 'notifications':
    store.dispatch(fetchNotificationsIfNeeded());
    break;

  case 'github-status':
    store.dispatch(fetchGitHubStatus());
    break;

  default:
    break;
  }
});

// Fetch data if accessToken is manually set
const {
  accessToken,
  eventsUpdateInterval,
  notificationsUpdateInterval,
  gitHubStatusUpdateInterval
} = store.getState();

if (accessToken) {
  store.dispatch(fetchEventsIfNeeded());
  store.dispatch(fetchNotificationsIfNeeded());

  ipc.send('start-auto-update-timer', 'events', eventsUpdateInterval);
  ipc.send('start-auto-update-timer', 'notifications', eventsUpdateInterval);
  ipc.send('start-auto-update-timer', 'github-status', eventsUpdateInterval);
}

// Render view
React.render(
  <Provider store={store}>
    {() => <Root />}
  </Provider>,
  document.getElementById('root')
);
