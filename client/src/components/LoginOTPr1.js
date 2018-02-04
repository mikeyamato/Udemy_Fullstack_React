work in progress

import React, { Component } from 'react'
import { Form, Button } from 'semantic-ui-react';
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import * as actions from '../../actions';
import {
  required,
  email,
  maxLength,
  maxLength25,
  minLength,
  minLength2,
  alphaNumeric,
  renderField
} from '../utils/formValidations.js';
import FormField from '../../constants/recruiterFields';
import Payments from '../common/Payments';

class RecruiterForm extends Component {
constructor() {
  super();
  
  this.onRecruiterSubmit = this.onRecruiterSubmit.bind(this);
}

  renderForm() {
    const validationType =
      FormField.name === "Email" ? email : [required, maxLength25, minLength2];
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

  onRecruiterSubmit(data) {
    const { name, industry, website, jobsOpen, primaryContact, imgLogoURL } = data;
    const employees = this.props.auth._id;
    const activeEvents = this.props.event._id;
    const RecruiterInfo = {
      name,
      industry,
      website,
      jobsOpen,
      primaryContact,
      imgLogoURL,
      employees,
      activeEvents
    };

    this.props.fetchRecruiter(RecruiterInfo);
  }

  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;
    return (
      <Form onSubmit={this.props.handleSubmit(this.onRecruiterSubmit)}>
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

RecruiterForm = reduxForm({
  // a unique name for the form
  form: "recruiter"
})(RecruiterForm);

export default connect(mapStateToProps, actions)(RecruiterForm);
