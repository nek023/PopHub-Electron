import React, { Component, PropTypes } from 'react';

export default class NoEvents extends Component {
  render() {
    const { fetching } = this.props;

    const text = fetching ? 'Loading...' : 'No activities.';

    return (
      <div className="center-block no-events">
        <span className="mega-octicon octicon-octoface"></span>
        <h2>{text}</h2>
      </div>
    );
  }
}

PropTypes.propTypes = {
  fetching: PropTypes.bool.isRequired
};
