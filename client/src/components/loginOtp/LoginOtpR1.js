import React, { Component } from 'react';
import { Form, Button } from 'semantic-ui-react';
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import * as actions from '../../actions';
// import { withRouter } from "react-router-dom";

const renderField = ({
  input,
  label,
  type,
  meta: { touched, error, warning }
}) => (
  <div>
    <label>{label}</label>
    <div>
      <input {...input} placeholder={label} type={type} />
      {touched &&
        ((error && <span>{error}</span>) ||
          (warning && <span>{warning}</span>))}
    </div>
  </div>
);

class LoginOtpR1 extends Component {
  constructor(props) {
    super(props);
    this.state = { value: "" };

    this.renderCodeInput = this.renderCodeInput.bind(this);
    this.onQrSubmit = this.onQrSubmit.bind(this);
  }

  onQrSubmit(data) {
    console.log(data);
    const { qrCode } = data;

    this.props.fetchOtp(qrCode);
  }
  componentDidMount() {
    this.props.auth;
  }
  
  renderCodeInput() {
    return( 
      <Field
        name="qrCode"
        type="number"
        label="QR Code"
        component={renderField}
      />
    )
  }
  
  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;

    return (
      <Form onSubmit={this.props.handleSubmit(this.onQrSubmit)}>
        {this.renderCodeInput()}
        <div>
          <Button
            type="button"
            size="large"
            onClick={reset}
          >
            Clear Values
          </Button>
          <Button type="submit" size="large">
            Submit
          </Button>
        </div>
      </Form>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

LoginOtpR1 = reduxForm({
  form: "qrInfo"
})(LoginOtpR1);

export default connect(mapStateToProps, actions)(LoginOtpR1);
