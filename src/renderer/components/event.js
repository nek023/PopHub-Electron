import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import {
  octiconClassNameForEvent,
  titleElementForEvent
} from '../../lib/event-utils';

export default class Event extends Component {
  render() {
    const {
      event,
      onLinkClick
    } = this.props;

    const octiconClassName = octiconClassNameForEvent(event);
    let eventIconElement;
    if (octiconClassName === '') {
      eventIconElement = (
        <span className={'pull-left event-icon'}></span>
      );
    } else {
      eventIconElement = (
        <span className={`octicon ${octiconClassName} pull-left event-icon`}></span>
      );
    }

    return (
      <div className="event">
        {eventIconElement}
        <div className="event-body">
          <p className="event-title">
            {titleElementForEvent(event, onLinkClick).props.children}
          </p>
          <p className="event-date">
            {moment(event.created_at).fromNow()}
          </p>
        </div>
      </div>
    );
  }
}

Event.propTypes = {
  event: PropTypes.object.isRequired,
  onLinkClick: PropTypes.func.isRequired
};
