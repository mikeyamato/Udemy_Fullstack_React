import React, { Component } from 'react';
import { Form, Button } from 'semantic-ui-react';
import { Field, reduxForm } from "redux-form";
// import { connect } from "react-redux";
// import { withRouter } from "react-router-dom";


class OtpNumber extends Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
np
  // to see value as we type
  handleChange(data) {
    // console.log('handleChange data', data)
    this.setState({value: data.target.value});
    console.log('handleChange: event.target.value', data.target.value)
  }

  handleSubmit(data) {
    console.log('handleSubmit data', data)
    this.setState({ value: data.target.value })
    console.log('handleSubmit: event.target.value', data.target.value)
    // const { number } = this.state.value;
    // alert('Number submitted: ' + this.state.value);
    data.preventDefault();
    // console.log('event.target.value', event.target.value)
    debugger

  }

  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;
    return (
      <Form onSubmit={this.props.handleSubmit}>
        <label>
          QR Code:
          <input type="number" value={this.state.value} onChange={this.handleChange} />
        </label>
        <div>
          <Button type="button" size="large" disabled={pristine || submitting} onClick={reset}>
            Clear Values
          </Button>
          <Button type="submit" size="large" disabled={pristine || submitting}>
            Submit
          </Button>
        </div>
      </Form>
    );
  }
}



// export default connect(mapStateToProps, actions)(OtpNumber);

export default OtpNumber



// *****************************


/*
class OtpNumber extends Component {
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

// export default connect(mapStateToProps, actions)(OtpNumber);


export default OtpNumber
*/
