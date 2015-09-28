import React, { Component, PropTypes } from 'react';
import Event from './event';

export default class Events extends Component {
  render() {
    const {
      events,
      onLinkClick
    } = this.props;

    return (
      <div className="events">
        {events.map(event => {
          return <Event key={event.id} event={event} onLinkClick={onLinkClick} />;
        })}
      </div>
    );
  }
}

Events.propTypes = {
  events: PropTypes.array.isRequired,
  onLinkClick: PropTypes.func.isRequired
};
