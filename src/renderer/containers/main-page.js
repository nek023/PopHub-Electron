import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { ActivePage } from '../actions';
import Header from '../containers/header';
import Footer from '../containers/footer';
import EventsPage from './events-page';
import NotificationsPage from './notifications-page';

const { EVENTS, NOTIFICATIONS } = ActivePage;

class MainPage extends Component {
  render() {
    const { activePage } = this.props;

    let content;
    if (activePage === EVENTS) {
      content = <EventsPage />;
    } else {
      content = <NotificationsPage />;
    }

    return (
      <div className="main-page">
        <Header />
        {content}
        <Footer />
      </div>
    );
  }
}

MainPage.propTypes = {
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

export default connect(mapStateToProps)(MainPage);
