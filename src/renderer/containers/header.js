import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  ActivePage,
  setActivePage
} from '../actions';

const { EVENTS, NOTIFICATIONS } = ActivePage;

class Header extends Component {
  render() {
    const {
      dispatch,
      activePage
    } = this.props;

    const baseClassName = 'btn btn-primary-outline';
    let eventsClassName = baseClassName;
    let notificationsClassName = baseClassName;

    if (activePage === EVENTS) {
      eventsClassName += ' active';
    } else {
      notificationsClassName += ' active';
    }

    return (
      <div className="header">
        <div className="btn-group btn-group-sm header-button-container">
          <a href="#"
            className={eventsClassName}
            onClick={() => { dispatch(setActivePage(EVENTS)); }}>
            Activities
          </a>
          <a href="#"
            className={notificationsClassName}
            onClick={() => { dispatch(setActivePage(NOTIFICATIONS)); }}>
            Notifications
          </a>
        </div>
      </div>
    );
  }
}

Header.propTypes = {
  activePage: PropTypes.oneOf([
    EVENTS,
    NOTIFICATIONS
  ]).isRequired
};

function mapStateToProps(state) {
  return {
    activePage: state.activePage
  };
}

export default connect(mapStateToProps)(Header);
