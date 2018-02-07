import React, { Component } from 'react';
import { Form, Button } from 'semantic-ui-react';
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import * as actions from '../../actions';
import {
  required,
  maxLength6,
  minLength6,
  numeric,
  renderField
} from '../utils/formValidations.js';
import FormField from '../../constants/totpFields';

class LoginOtpForm extends Component {
constructor() {
  super();
  
  this.onOtpSubmit = this.onOtpSubmit.bind(this);
}

  renderForm() {
    const validationType =
      FormField.name === "OTP" ? numeric : [required, maxLength6, minLength6];
    const fieldForm = FormField.map(FormField => (
      <Field
        key={FormField.name}
        name={FormField.name}
        type={FormField.type}
        component={renderField}
        label={FormField.label}
        validate={validationType}
      />
    ));
    return fieldForm;
  }

  onOtpSubmit(data) {
    const { otp } = data;
    const OtpNumber = {
      otp
    };

    this.props.fetchOtp(OtpNumber);
  }

  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;
    return (
      <Form onSubmit={this.props.handleSubmit(this.onOtpSubmit)}>
        {this.renderForm()}
        <br />
        <div>
          <Button
            type="button"
            size="large"
            disabled={pristine || submitting}
            onClick={reset}
          >
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

const mapStateToProps = ( state ) => ({ 
  auth: state.auth,
  event: state.event
});

LoginOtpForm = reduxForm({
  // a unique name for the form
  form: "loginOtp"
})(LoginOtpForm);

export default connect(mapStateToProps, actions)(LoginOtpForm);
