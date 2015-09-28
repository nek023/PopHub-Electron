import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import SignInPage from './sign-in-page';
import MainPage from '../containers/main-page';

class Root extends Component {
  render() {
    const {
      accessToken,
      user
    } = this.props;

    let content;
    if (accessToken === '' || Object.keys(user).length === 0) {
      content = <SignInPage />;
    } else {
      content = <MainPage />;
    }

    return (
      <div className="root">
        {content}
      </div>
    );
  }
}

Root.propTypes = {
  accessToken: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    accessToken: state.accessToken,
    user: state.user
  };
}

export default connect(mapStateToProps)(Root);
