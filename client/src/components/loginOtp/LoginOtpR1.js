import React, { Component } from 'react';
import { Form, Button } from 'semantic-ui-react';
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import * as actions from '../../actions'
// import { withRouter } from "react-router-dom";


class LoginOtpR1 extends Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.onQRCodeSubmit = this.onQRCodeSubmit.bind(this);
  }
np
  // to see value as we type
  handleChange(data) {
    this.setState({value: data.target.value});
    console.log('data ', data) 
    console.log('handleChange: event.target.value', data.target.value)
  }

  onQRCodeSubmit(data) {
      console.log('hello')
      console.log('handleSubmit this.state.value', this.state.value)
    this.setState({ value: this.state.value })
    // const { number } = this.state.value;
    // alert('Number submitted: ' + this.state.value);
    // console.log('event.target.value', event.target.value)
    
    this.props.fetchOtp();
  }
  componentDidMount() {
    
    this.props.auth;
  }
  
  
  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;
    return (
      <Form onSubmit={this.props.handleSubmit(this.onQRCodeSubmit)}>
        <label>
          QR Code:
          <input type="number" value={this.state.value} onChange={this.handleChange} />
        </label>
        <div>
          <Button type="button" size="large" onClick={reset}>
            Clear Values
          </Button>
          <Button type="submit" size="large" >
            Submit
          </Button>
        </div>
      </Form>
    );
  }
}

LoginOtpR1 = reduxForm({
  // a unique name for the form
  form: "qrCode"
})(LoginOtpR1);

const mapStateToProps = state => ({
  auth: state.auth
});


export default connect(mapStateToProps, actions)(LoginOtpR1);




// *****************************


/*
class LoginOtpR1 extends Component {
  state = { number: '', submittedNumber: '' }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  handleSubmit = () => {
    const { number } = this.state

    this.setState({ submittedNumber: number })
  }

  render() {
    const { number, submittedNumber } = this.state

    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <h3>Enter 6-digit Code</h3>
          
          <Form.Group>
            <Form.Input placeholder='000000' name='number' value={number} onChange={this.handleChange} />
            <Form.Button content='Submit' />
          </Form.Group>
          
        </Form>
      </div>
    )
  }
}

// const mapStateToProps = state => ({
//   auth: state.auth
// });

// export default connect(mapStateToProps, actions)(LoginOtpR1);


export default LoginOtpR1
*/
