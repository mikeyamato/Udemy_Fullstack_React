import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { Grid, Button } from 'semantic-ui-react';
// import Login from '../common/header/Login';
import LoginOtpForm from './LoginOtpForm';

class LoginOtp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      LoginOtp: null
    };
  }

  componentDidMount() {
    this.props.auth
  }

  componentDidUpdate (oldProps,oldState) {
    if (this.state.show){
      return null;
    }
    else {
      return <Button/>
    }
  }

  render() {
  //   if (!this.props.auth) {
  //     return <Login quizInit />;
  //   }

    return (
      <Grid>
        <Grid.Column width={3}>
          <div />
        </Grid.Column>
        <Grid.Column width={10}>
          <h1>One Time Passcode</h1>
          <LoginOtpForm />
        </Grid.Column>
        <Grid.Column width={3}>
          <div />
        </Grid.Column>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, actions)(LoginOtp);


