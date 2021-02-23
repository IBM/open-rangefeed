/* eslint no-alert:off */
import React from 'react';
import PropTypes from 'prop-types';
import 'core-js/es/array';

export default class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      id: '',
      pwd: '',
      showThrobber: false,
      loginSuccess: false,
    };
    this.tryLogin = this.tryLogin.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.submitLoginRequest = this.submitLoginRequest.bind(this);
    this.lastLoginAttempt = 0;
  }

  componentDidMount() {
    this._isMounted = true;
    this.tryLogin();
  }

  componentWillUnmount() {
    this.setState({ loginSuccess: false });
    this._isMounted = false;
  }

  onSubmit(e) {
    e.preventDefault();
    const { id, pwd } = this.state;
    this.submitLoginRequest(id, pwd);
  }

  submitLoginRequest(id, pwd) {
    const { onLoginAttempt } = this.props;

    onLoginAttempt(id, pwd)
      .on('complete', () => {
        this.hideThrobber();
        this.setState({ loginSuccess: true });
      })
      .on('error', () => {
        this.setState({ loginSuccess: false });
        this.lastLoginAttempt = (new Date()).getTime() / 1000;
        this.hideThrobber();
        alert('Login failed');
      });
  }

  tryLogin() {
    let id = '';
    let pwd = '';
    const code = window.location.search.split('?')[1];
    if (code) {
      const split = atob(code).split(':');
      [id, pwd] = split;
    }

    const timeout = 10; // Timeout in seconds
    const now = (new Date()).getTime() / 1000;

    // Make brute force a little more difficult
    if (now - timeout > this.lastLoginAttempt) {
      if (id && pwd) {
        this.setState({
          id,
          pwd,
        });
        this.showThrobber();
        this.submitLoginRequest(id, pwd);
      } else {
        this.hideThrobber();
      }
    } else {
      this.hideThrobber();
      alert('Your last login failed. Please wait a few seconds for your next try.');
    }
  }

  showThrobber() {
    if (this._isMounted === true) {
      this.setState({
        showThrobber: true,
      });
    }
  }

  hideThrobber() {
    if (this._isMounted === true) {
      this.setState({
        showThrobber: false,
      });
    }
  }

  render() {
    const {
      showThrobber, id, pwd, loginSuccess,
    } = this.state;
    const throbberVisibility = showThrobber === true ? { display: 'inline-block' } : { display: 'none' };
    const showForm = !id || !pwd || !loginSuccess;

    return (
      <>
        {showForm && (
        <form id="login" onSubmit={this.onSubmit}>
          User
          <br />
          <input
            value={id}
            onChange={(e) => { this.setState({ id: e.target.value }); }}
          />
          <br />
          <br />
          Password
          <br />
          <input
            type="password"
            value={pwd}
            onChange={(e) => { this.setState({ pwd: e.target.value }); }}
          />
          <br />
          <br />
          <input type="submit" />
          <img style={{ marginLeft: '10px', width: '45px', ...throbberVisibility }} alt="" src="img/throbber.svg" />
        </form>
        )}
        <img style={{ marginLeft: '10px', width: '45px', ...throbberVisibility }} alt="" src="img/throbber.svg" />
      </>
    );
  }
}

Login.propTypes = {
  onLoginAttempt: PropTypes.func,
};

Login.defaultProps = {
  onLoginAttempt: () => {},
};
