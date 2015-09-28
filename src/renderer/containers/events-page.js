import shell from 'shell';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Events from '../components/events';
import NoEvents from '../components/no-events';

class EventsPage extends Component {
  onLinkClick(url) {
    shell.openExternal(url);
  }

  render() {
    const {
      events,
      fetchingEvents
    } = this.props;

    let content;
    if (events.length > 0) {
      content = <Events events={events} onLinkClick={this.onLinkClick.bind(this)} />;
    } else {
      content = <NoEvents fetching={fetchingEvents} />;
    }

    return (
      <div className="events-page">
        {content}
      </div>
    );
  }
}

EventsPage.propTypes = {
  events: PropTypes.array.isRequired,
  fetchingEvents: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  return {
    events: state.events,
    fetchingEvents: state.fetchingEvents
  };
}

export default connect(mapStateToProps)(EventsPage);
